/* eslint-disable */

import * as anchor from '@project-serum/anchor';
import { encode } from '@project-serum/anchor/dist/cjs/utils/bytes/utf8';
import { ComputeBudgetProgram, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';
import {
    fetchAccountDataById,
    findMintEditionId,
    findMintMetadataId,
    findTokenRecordId,
    METADATA_PROGRAM_ID,
    TOKEN_AUTH_RULES_ID
} from '@cardinal/common';
import {
    STAKING_CONFIG_ID,
    STAKING_OWNER_ADDR,
    STAKING_PROGRAM_ID,
    STAKING_REWARD_MINT,
    TOKEN_ADDR,
    YAKU_SPL_TOKEN_PROGRAM_ID
} from '@/config/config';
import { AnchorWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { parseRewardMap } from '../utils/merkle/parse-merkle-tree';
import nfts from '@/assets/data/nfts.json';
import { find, get, toLower } from 'lodash';
import { YAKU_NFT } from '@/types/staking';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { getOrCreateAssociatedTokenAccount } from './project';

export const { mints } = parseRewardMap(nfts);

export const loadYakuProgram = (connection: anchor.web3.Connection, wallet?: WalletContextState): anchor.Program<Staking> => {
    let cloneWindow: any = window;
    const provider = new anchor.AnchorProvider(connection, wallet || cloneWindow['solana'], anchor.AnchorProvider.defaultOptions());

    const program: any = new anchor.Program(YAKU_IDL as anchor.Idl, STAKING_PROGRAM_ID, provider);
    return program;
};

const config = new anchor.web3.PublicKey(STAKING_CONFIG_ID);
const reward = new anchor.web3.PublicKey(STAKING_REWARD_MINT);

const TOKEN_PUBKEY = new anchor.web3.PublicKey(TOKEN_ADDR);
export const getStakingState = async (program: anchor.Program<Staking>) => {
    const stakingState = await program.account.stakingConfig.fetch(config);
    return {
        count: stakingState.count.toNumber(),
        interval: stakingState.interval.toNumber()
    };
};

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey(YAKU_SPL_TOKEN_PROGRAM_ID);

export const getTokenWallet = async function (wallet: anchor.web3.PublicKey, mint: anchor.web3.PublicKey) {
    return (
        await anchor.web3.PublicKey.findProgramAddress(
            [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
        )
    )[0];
};

export const fetchMetadata = async (uri: any, mint: any, extraKey: string | undefined = undefined, shouldfetchJson = true) => {
    if (!mint || !uri) {
        return undefined;
    }
    const { index, reward, proof } = mints[new PublicKey(mint).toBase58()];
    let result: any = {
        mint,
        mintAddress: mint,
        uri,
        index,
        reward,
        proof
    };
    if (!shouldfetchJson) {
        return result;
    }
    const res = await axios.get(uri);
    result = {
        mint,
        mintAddress: mint,
        name: res.data.name,
        image: res.data.image,
        traits: res.data.attributes,
        index,
        reward,
        proof
    };
    if (extraKey) {
        result[toLower(extraKey)] = get(
            find(res.data.attributes, (o: any) => o.trait_type === extraKey),
            'value'
        );
    }
    return result;
};

export const getStakedNFTMintList = async (
    connection: Connection,
    program: anchor.Program<Staking>,
    wallet: WalletContextState,
    otherWallet?: string
) => {
    if (wallet?.publicKey === null) {
        return [];
    }
    const pdaList = await program.account.stakingAccount.all([
        {
            memcmp: {
                offset: 41, //need to prepend 8 bytes for anchor's disc
                bytes: otherWallet || wallet.publicKey.toBase58()
            }
        }
    ]);

    let mintList: Array<YAKU_NFT> = [];

    const { interval } = await getStakingState(program);

    for (const pda of pdaList) {
        const mint = pda.account.nft;

        let result: YAKU_NFT = {
            mint: mint.toBase58(),
            mintAddress: mint.toBase58(),
            stakeDays: 1,
            lastClaim: pda.account.lastClaim.toNumber(),
            interval,
            amount: pda.account.amount.toNumber()
        };
        mintList.push(result);
    }

    return mintList;
};

export const getUserStakingAuthority = async (
    config: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    prog: anchor.Program<Staking>
) => {
    return await anchor.web3.PublicKey.findProgramAddress([config.toBuffer(), encode('auth'), owner.toBuffer()], prog.programId);
};

export const getTokenAccount = async (mint: anchor.web3.PublicKey, prog: anchor.Program<Staking>) => {
    return await anchor.web3.PublicKey.findProgramAddress([mint.toBuffer(), encode('token')], prog.programId);
};

export const getStakingAccount = async (
    owner: anchor.web3.PublicKey,
    mint: anchor.web3.PublicKey,
    prog: anchor.Program<Staking>
): Promise<[anchor.web3.PublicKey, number]> => {
    return await anchor.web3.PublicKey.findProgramAddress([owner.toBuffer(), encode('stake'), mint.toBuffer()], prog.programId);
};

export const getRewardAccount = async (
    config: anchor.web3.PublicKey,
    reward: anchor.web3.PublicKey,
    prog: { programId: anchor.web3.PublicKey }
) => {
    return await anchor.web3.PublicKey.findProgramAddress([config.toBuffer(), encode('reward'), reward.toBuffer()], prog.programId);
};

export const getStakingAuthority = async (config: anchor.web3.PublicKey, prog: { programId: anchor.web3.PublicKey }) => {
    return await anchor.web3.PublicKey.findProgramAddress([config.toBuffer(), encode('auth')], prog.programId);
};

export const getAllPDAs = async (
    program: anchor.Program<Staking>,
    owner: anchor.web3.PublicKey = new PublicKey(STAKING_OWNER_ADDR),
    nft: anchor.web3.PublicKey = new PublicKey(STAKING_OWNER_ADDR)
) => {
    const [authority, authBump] = await getUserStakingAuthority(config, owner, program);
    let tokenAccount;
    let tokenBump;
    let tokenAccountExisted = false;
    try {
        [tokenAccount, tokenBump] = await getTokenAccount(nft, program);
        tokenAccountExisted = true;
    } catch (ex) {
        console.error(ex);
    }
    const [stakeAccount, stakeBump] = await getStakingAccount(owner, nft, program);
    const [rewardAccount, rewardBump] = await getRewardAccount(config, reward, program);
    const [stakingAuthority, stakingAuthorityBump] = await getStakingAuthority(config, program);

    return {
        authority,
        authBump,
        tokenAccount,
        tokenBump,
        stakeAccount,
        stakeBump,
        rewardAccount,
        rewardBump,
        stakingAuthority,
        stakingAuthorityBump,
        tokenAccountExisted
    };
};

export const getNFTTokenAccount = async (connection: anchor.web3.Connection, address: string) => {
    try {
        let filter = {
            memcmp: {
                offset: 0,
                bytes: address
            }
        };
        let filter2 = {
            dataSize: 165
        };
        let getFilter = [filter, filter2];
        let programAccountsConfig = {
            filters: getFilter,
            encoding: 'jsonParsed'
        };
        let _listOfTokens: any = await connection.getParsedProgramAccounts(TOKEN_PUBKEY, programAccountsConfig);

        let res = undefined;
        for (let i = 0; i < _listOfTokens.length; i++) {
            if (_listOfTokens[i]['account']['data']['parsed']['info']['tokenAmount']['amount'] === '1') {
                res = _listOfTokens[i]['pubkey'];
            }
        }
        if (res) return res;
    } catch (e: any) {
        const errorString = e.toString();
        console.log({ errorString });
    }
};

export const sendAndConfirmTransactionWithRetries = async (connection: Connection, transaction: Transaction) => {
    for (let i = 0; i <= 10; i++) {
        try {
            const txSign = await connection.sendRawTransaction(transaction.serialize(), {});
            console.log(`Transaction sent(${i}): ${txSign}`);
            const latestBlockHash = await connection.getLatestBlockhash();
            const result = await connection.confirmTransaction(
                {
                    blockhash: latestBlockHash.blockhash,
                    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                    signature: txSign
                },
                'finalized'
            );
            console.log({ result });
            break;
        } catch (error: any) {
            const errorMessage = error?.message;
            if (errorMessage) {
                if (errorMessage.includes('This transaction has already been processed')) {
                    break;
                }
                if (errorMessage.includes('Blockhash not found')) {
                    throw error;
                }
            }
            console.log({ error, errorMessage: error?.message });
            if (i === 10) {
                throw error;
            }
        }
    }
};

export const sendAndConfirmTransactionListCustom1 = async (
    wallet: WalletContextState,
    connection: anchor.web3.Connection,
    transactionList: Transaction[]
) => {
    if (!wallet || !wallet.publicKey || !wallet.signAllTransactions || !wallet.signTransaction) return;
    const latestBlockHash = (await connection.getLatestBlockhash()).blockhash;
    const transactionWithBlockhashList = transactionList.map((transaction) => {
        transaction.recentBlockhash = latestBlockHash;
        transaction.feePayer = wallet?.publicKey as PublicKey;
        return transaction;
    });
    if (wallet.signAllTransactions) {
        const signedTransactionList = await wallet.signAllTransactions(transactionWithBlockhashList);
        const sendPromises = signedTransactionList.map(
            async (transaction) => await sendAndConfirmTransactionWithRetries(connection, transaction)
        );
        await Promise.all(sendPromises);
    } else {
        for (const transaction of transactionWithBlockhashList) {
            const signedTransaction = await wallet.signTransaction(transaction);
            await sendAndConfirmTransactionWithRetries(connection, signedTransaction);
        }
    }
};

export const stakeYakuNft = async (program: anchor.Program<Staking>, wallet: WalletContextState, mint: anchor.web3.PublicKey) => {
    if (!wallet?.publicKey) return;
    const { authority, authBump, tokenAccount, tokenBump, stakeAccount, stakeBump } = await getAllPDAs(program, wallet.publicKey, mint);

    const { index, reward, proof } = mints[mint.toBase58()];

    const txn = new anchor.web3.Transaction();

    const ownerTokenAccountId = (
        await getOrCreateAssociatedTokenAccount(
            program.provider.connection,
            wallet.publicKey,
            mint,
            wallet.publicKey,
            wallet.signTransaction!
        )
    ).address;
    const fromAccount = ownerTokenAccountId;
    txn.add(
        program.instruction.stakeRarity(authBump, stakeBump, tokenBump!, new anchor.BN(index), new anchor.BN(reward), proof, {
            accounts: {
                config: config,
                authority: authority,
                stakeAccount: stakeAccount,
                tokenAccount: tokenAccount!,
                owner: wallet.publicKey,
                fromAccount,
                mint: mint,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY
            }
        })
    );
    await sendAndConfirmTransactionListCustom1(wallet, program.provider.connection, [txn]);
};

export const stakeYakuPNft = async (program: anchor.Program<Staking>, wallet: WalletContextState, mint: anchor.web3.PublicKey, priorityRate = 100) => {
    if (!wallet?.publicKey) return;
    const { authority, authBump, stakeAccount, stakeBump } = await getAllPDAs(program, wallet.publicKey, mint);

    const { index, reward, proof } = mints[mint.toBase58()];

    const mintMetadataId = findMintMetadataId(mint);
    const mintEdition = findMintEditionId(mint);
    const ownerTokenAccountId = (
        await getOrCreateAssociatedTokenAccount(
            program.provider.connection,
            wallet.publicKey,
            mint,
            wallet.publicKey,
            wallet.signTransaction!
        )
    ).address;
    const fromAccount = ownerTokenAccountId;
    const ownerTokenRecord = findTokenRecordId(mint, ownerTokenAccountId);
    const accountData = await fetchAccountDataById(program.provider.connection, [mintMetadataId, ownerTokenRecord]);
    const metadataAccountInfo = accountData[mintMetadataId.toString()];
    const mintMetadata = metadataAccountInfo ? Metadata.deserialize(metadataAccountInfo.data)[0] : null;
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1000000
    });
    const txn = new anchor.web3.Transaction();
    const priorityIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityRate });
    txn.add(modifyComputeUnits).add(priorityIx).add(
        program.instruction.stakeRarityPnft(authBump, stakeBump, new anchor.BN(index), new anchor.BN(reward), proof, {
            accounts: {
                config,
                authority,
                stakeAccount,
                owner: wallet.publicKey,
                fromAccount,
                mint: mint,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
                ownerTokenRecord,
                mintMetadata: mintMetadataId,
                mintEdition,
                authorizationRules: mintMetadata?.programmableConfig?.ruleSet ?? METADATA_PROGRAM_ID,
                sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
                authorizationRulesProgram: TOKEN_AUTH_RULES_ID,
                tokenMetadataProgram: METADATA_PROGRAM_ID
            }
        })
    );
    await sendAndConfirmTransactionListCustom1(wallet, program.provider.connection, [txn]);
};

export const unstakeYakuNft = async (program: anchor.Program<Staking>, wallet: WalletContextState, mint: anchor.web3.PublicKey) => {
    if (!wallet?.publicKey) return;
    const { authority, tokenAccount, stakeAccount, rewardAccount, stakingAuthority } = await getAllPDAs(program, wallet.publicKey, mint);

    const owner = wallet.publicKey;
    const txn = new anchor.web3.Transaction();

    // Claim reward

    // Check if reward exists
    const stakeAccountState = await program.account.stakingAccount.fetch(stakeAccount);
    const { interval } = await getStakingState(program);
    const computedReward =
        ((Math.floor(Date.now() / 1000) - stakeAccountState.lastClaim.toNumber()) / interval) * stakeAccountState.amount.toNumber();
    if (computedReward > 0) {
        txn.add(
            program.instruction.claim({
                accounts: {
                    config: config,
                    authority: stakingAuthority,
                    rewardAccount: rewardAccount,
                    userRewardAccount: await getTokenWallet(owner, reward),
                    stakeAccount: stakeAccount,
                    owner: owner,
                    mint: mint,
                    reward: reward,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                    systemProgram: anchor.web3.SystemProgram.programId
                }
            })
        );
    }

    // Unstake reward
    txn.add(
        program.instruction.unstakeNft({
            accounts: {
                config: config,
                authority: authority,
                stakeAccount: stakeAccount,
                tokenAccount: tokenAccount!,
                owner: wallet.publicKey,
                mint: mint,
                toAccount: await getTokenWallet(owner, mint),
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                systemProgram: anchor.web3.SystemProgram.programId
            }
        })
    );

    await sendAndConfirmTransactionListCustom1(wallet, program.provider.connection, [txn]);
};

export const unstakeYakuPNft = async (program: anchor.Program<Staking>, wallet: WalletContextState, mint: anchor.web3.PublicKey, priorityRate = 100) => {
    if (!wallet?.publicKey) return;
    const { authority, tokenAccount, stakeAccount, rewardAccount, stakingAuthority } = await getAllPDAs(program, wallet.publicKey, mint);

    const owner = wallet.publicKey;
    const txn = new anchor.web3.Transaction();

    // Claim reward

    // Check if reward exists
    const stakeAccountState = await program.account.stakingAccount.fetch(stakeAccount);
    const { interval } = await getStakingState(program);
    const mintMetadataId = findMintMetadataId(mint);
    const mintEdition = findMintEditionId(mint);
    const ownerTokenAccountId = (
        await getOrCreateAssociatedTokenAccount(program.provider.connection, owner, mint, owner, wallet.signTransaction!)
    ).address;
    const toAccount = await getTokenWallet(owner, mint);
    const ownerTokenRecord = findTokenRecordId(mint, ownerTokenAccountId);
    const stakeAccountTokenRecord = findTokenRecordId(mint, tokenAccount!);
    const accountData = await fetchAccountDataById(program.provider.connection, [mintMetadataId, ownerTokenRecord]);
    const metadataAccountInfo = accountData[mintMetadataId.toString()];
    const mintMetadata = metadataAccountInfo ? Metadata.deserialize(metadataAccountInfo.data)[0] : null;
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1000000
    });
    txn.add(modifyComputeUnits);
    const priorityIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityRate });
    txn.add(priorityIx);
    const computedReward =
        ((Math.floor(Date.now() / 1000) - stakeAccountState.lastClaim.toNumber()) / interval) * stakeAccountState.amount.toNumber();
    if (computedReward > 0) {
        txn.add(
            program.instruction.claim({
                accounts: {
                    config: config,
                    authority: stakingAuthority,
                    rewardAccount: rewardAccount,
                    userRewardAccount: await getTokenWallet(owner, reward),
                    stakeAccount: stakeAccount,
                    owner: owner,
                    mint: mint,
                    reward: reward,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                    systemProgram: anchor.web3.SystemProgram.programId
                }
            })
        );
    }

    // Unstake reward
    const ix = await program.instruction.unstakePnft({
        accounts: {
            config,
            authority,
            stakeAccount: stakeAccount,
            tokenAccount: tokenAccount!,
            owner,
            toAccount,
            mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            stakeAccountTokenRecord,
            ownerTokenRecord,
            mintMetadata: mintMetadataId,
            mintEdition,
            authorizationRules: mintMetadata?.programmableConfig?.ruleSet ?? METADATA_PROGRAM_ID,
            sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            authorizationRulesProgram: TOKEN_AUTH_RULES_ID,
            tokenMetadataProgram: METADATA_PROGRAM_ID
        }
    });
    txn.add(ix);

    await sendAndConfirmTransactionListCustom1(wallet, program.provider.connection, [txn]);
};

export const unstakeYakuNonCust = async (program: anchor.Program<Staking>, wallet: WalletContextState, mint: anchor.web3.PublicKey, priorityRate = 100) => {
    if (!wallet?.publicKey) return;
    const { authority, stakeAccount, rewardAccount, stakingAuthority } = await getAllPDAs(program, wallet.publicKey, mint);

    const owner = wallet.publicKey;
    const txn = new anchor.web3.Transaction();

    // Claim reward

    // Check if reward exists
    const stakeAccountState = await program.account.stakingAccount.fetch(stakeAccount);
    const { interval } = await getStakingState(program);
    const mintMetadataId = findMintMetadataId(mint);
    const mintEdition = findMintEditionId(mint);
    const ownerTokenAccountId = (
        await getOrCreateAssociatedTokenAccount(program.provider.connection, owner, mint, owner, wallet.signTransaction!)
    ).address;
    const toAccount = await getTokenWallet(owner, mint);
    const ownerTokenRecord = findTokenRecordId(mint, ownerTokenAccountId);
    const accountData = await fetchAccountDataById(program.provider.connection, [mintMetadataId, ownerTokenRecord]);
    const metadataAccountInfo = accountData[mintMetadataId.toString()];
    const mintMetadata = metadataAccountInfo ? Metadata.deserialize(metadataAccountInfo.data)[0] : null;
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1000000
    });
    txn.add(modifyComputeUnits);
    const priorityIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityRate });
    txn.add(priorityIx);
    const computedReward =
        ((Math.floor(Date.now() / 1000) - stakeAccountState.lastClaim.toNumber()) / interval) * stakeAccountState.amount.toNumber();
    if (computedReward > 0) {
        txn.add(
            program.instruction.claim({
                accounts: {
                    config: config,
                    authority: stakingAuthority,
                    rewardAccount: rewardAccount,
                    userRewardAccount: await getTokenWallet(owner, reward),
                    stakeAccount: stakeAccount,
                    owner: owner,
                    mint: mint,
                    reward: reward,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                    systemProgram: anchor.web3.SystemProgram.programId
                }
            })
        );
    }

    // Unstake reward
    const ix = await program.instruction.unstakePnftV2({
        accounts: {
            config,
            authority,
            stakeAccount: stakeAccount,
            owner,
            toAccount,
            mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            ownerTokenRecord,
            mintMetadata: mintMetadataId,
            mintEdition,
            authorizationRules: mintMetadata?.programmableConfig?.ruleSet ?? METADATA_PROGRAM_ID,
            sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            authorizationRulesProgram: TOKEN_AUTH_RULES_ID,
            tokenMetadataProgram: METADATA_PROGRAM_ID
        }
    });
    txn.add(ix);

    await sendAndConfirmTransactionListCustom1(wallet, program.provider.connection, [txn]);
};
export const claimYakuReward = async (program: anchor.Program<Staking>, wallet: WalletContextState, mint: anchor.web3.PublicKey, priorityRate = 100) => {
    if (!wallet?.publicKey) return;
    const { stakingAuthority, stakeAccount, rewardAccount } = await getAllPDAs(program, wallet.publicKey, mint);

    // Claim reward
    const owner = wallet.publicKey;

    const txn = new anchor.web3.Transaction();

    const priorityIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityRate });
    txn.add(priorityIx);
    txn.add(
        program.instruction.claim({
            accounts: {
                config: config,
                authority: stakingAuthority,
                rewardAccount: rewardAccount,
                userRewardAccount: await getTokenWallet(owner, reward),
                stakeAccount: stakeAccount,
                owner: owner,
                mint: mint,
                reward: reward,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                systemProgram: anchor.web3.SystemProgram.programId
            }
        })
    );

    await sendAndConfirmTransactionListCustom1(wallet, program.provider.connection, [txn]);
};

// Multiple operations
export const stakeNftV2Multiple = async (
    connection: anchor.web3.Connection,
    program: anchor.Program<Staking>,
    wallet: WalletContextState,
    mintList: anchor.web3.PublicKey[],
    priorityRate = 100
) => {
    if (!wallet?.publicKey) return;
    const transactionArr: Transaction[] = [];

    for (let i = 0; i < mintList.length; i++) {
        const mint = mintList[i];
        const { stakeAccount, stakeBump, authority, authBump } = await getAllPDAs(program, wallet.publicKey, mint);
        const { index, reward, proof } = mints[mint.toBase58()];

        const txnMulti = new anchor.web3.Transaction();

        const mintMetadataId = findMintMetadataId(mint);
        const mintEdition = findMintEditionId(mint);
        const ownerTokenAccountId = (
            await getOrCreateAssociatedTokenAccount(
                program.provider.connection,
                wallet.publicKey,
                mint,
                wallet.publicKey,
                wallet.signTransaction!
            )
        ).address;
        const fromAccount = ownerTokenAccountId;
        const ownerTokenRecord = findTokenRecordId(mint, ownerTokenAccountId);
        const accountData = await fetchAccountDataById(program.provider.connection, [mintMetadataId, ownerTokenRecord]);
        const metadataAccountInfo = accountData[mintMetadataId.toString()];
        const mintMetadata = metadataAccountInfo ? Metadata.deserialize(metadataAccountInfo.data)[0] : null;
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: 1000000
        });
        const priorityIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityRate });
        // Stake nft
        txnMulti.add(modifyComputeUnits).add(priorityIx).add(
            program.instruction.stakeRarityPnft(authBump, stakeBump, new anchor.BN(index), new anchor.BN(reward), proof, {
                accounts: {
                    config,
                    authority,
                    stakeAccount,
                    owner: wallet.publicKey,
                    fromAccount,
                    mint: mint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    ownerTokenRecord,
                    mintMetadata: mintMetadataId,
                    mintEdition,
                    authorizationRules: mintMetadata?.programmableConfig?.ruleSet ?? METADATA_PROGRAM_ID,
                    sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
                    authorizationRulesProgram: TOKEN_AUTH_RULES_ID,
                    tokenMetadataProgram: METADATA_PROGRAM_ID
                }
            })
        );

        transactionArr.push(txnMulti);
    }

    await sendAndConfirmTransactionListCustom1(wallet, connection, transactionArr);
};

export const unStakeNftV2Multiple = async (
    connection: anchor.web3.Connection,
    program: anchor.Program<Staking>,
    wallet: WalletContextState,
    mintList: any[],
    priorityRate = 100
) => {
    if (!wallet?.publicKey) return;
    const transactionArr: Transaction[] = [];

    const { interval } = await getStakingState(program);
    const owner = wallet.publicKey;
    const userRewardAccount = await getTokenWallet(owner, reward);
    for (let i = 0; i < mintList.length; i++) {
        const { mint, stakedType } = mintList[i];
        const { authority, tokenAccount, stakeAccount, rewardAccount, stakingAuthority, tokenAccountExisted } = await getAllPDAs(
            program,
            wallet.publicKey,
            mint
        );

        const txn = new anchor.web3.Transaction();

        const mintMetadataId = findMintMetadataId(mint);
        const mintEdition = findMintEditionId(mint);
        const ownerTokenAccountId = (
            await getOrCreateAssociatedTokenAccount(program.provider.connection, owner, mint, owner, wallet.signTransaction!)
        ).address;
        const toAccount = await getTokenWallet(owner, mint);
        const ownerTokenRecord = findTokenRecordId(mint, ownerTokenAccountId);
        const stakeAccountTokenRecord = findTokenRecordId(mint, tokenAccount!);
        const accountData = await fetchAccountDataById(program.provider.connection, [mintMetadataId, ownerTokenRecord]);
        const metadataAccountInfo = accountData[mintMetadataId.toString()];
        const mintMetadata = metadataAccountInfo ? Metadata.deserialize(metadataAccountInfo.data)[0] : null;
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: 1000000
        });
        txn.add(modifyComputeUnits);

        const priorityIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityRate });
        txn.add(priorityIx);
        // Claim reward

        // Check if reward exists
        const stakeAccountState = await program.account.stakingAccount.fetch(stakeAccount);
        const computedReward =
            ((Math.floor(Date.now() / 1000) - stakeAccountState.lastClaim.toNumber()) / interval) * stakeAccountState.amount.toNumber();
        if (computedReward > 0) {
            txn.add(
                program.instruction.claim({
                    accounts: {
                        config: config,
                        authority: stakingAuthority,
                        rewardAccount: rewardAccount,
                        userRewardAccount,
                        stakeAccount: stakeAccount,
                        owner: owner,
                        mint: mint,
                        reward: reward,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                        systemProgram: anchor.web3.SystemProgram.programId
                    }
                })
            );
        }
        if (stakedType !== 'non-custodial') {
            // Unstake reward
            txn.add(
                program.instruction.unstakePnft({
                    accounts: {
                        config,
                        authority,
                        stakeAccount: stakeAccount,
                        tokenAccount: tokenAccount!,
                        owner,
                        toAccount,
                        mint,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                        systemProgram: anchor.web3.SystemProgram.programId,
                        stakeAccountTokenRecord,
                        ownerTokenRecord,
                        mintMetadata: mintMetadataId,
                        mintEdition,
                        authorizationRules: mintMetadata?.programmableConfig?.ruleSet ?? METADATA_PROGRAM_ID,
                        sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
                        authorizationRulesProgram: TOKEN_AUTH_RULES_ID,
                        tokenMetadataProgram: METADATA_PROGRAM_ID
                    }
                })
            );
        } else {
            txn.add(
                program.instruction.unstakePnftV2({
                    accounts: {
                        config,
                        authority,
                        stakeAccount: stakeAccount,
                        owner,
                        toAccount,
                        mint,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        systemProgram: anchor.web3.SystemProgram.programId,
                        ownerTokenRecord,
                        mintMetadata: mintMetadataId,
                        mintEdition,
                        authorizationRules: mintMetadata?.programmableConfig?.ruleSet ?? METADATA_PROGRAM_ID,
                        sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
                        authorizationRulesProgram: TOKEN_AUTH_RULES_ID,
                        tokenMetadataProgram: METADATA_PROGRAM_ID
                    }
                })
            );
        }

        transactionArr.push(txn);
    }

    await sendAndConfirmTransactionListCustom1(wallet, connection, transactionArr);
};

export const claimRewardV2Multiple = async (
    connection: anchor.web3.Connection,
    program: anchor.Program<Staking>,
    wallet: WalletContextState,
    mintList: anchor.web3.PublicKey[],
    priorityRate = 100
) => {
    if (!wallet?.publicKey) return;
    const transactionArr: Transaction[] = [];

    const { interval } = await getStakingState(program);

    for (let i = 0; i < mintList.length; i++) {
        const mint = mintList[i];
        const { stakeAccount, rewardAccount, stakingAuthority } = await getAllPDAs(program, wallet.publicKey, mint);

        const owner = wallet.publicKey;

        // Claim reward

        // Check if reward exists
        const stakeAccountState = await program.account.stakingAccount.fetch(stakeAccount);
        const computedReward =
            ((Math.floor(Date.now() / 1000) - stakeAccountState.lastClaim.toNumber()) / interval) * stakeAccountState.amount.toNumber();
        if (computedReward > 0) {
            const txn = new anchor.web3.Transaction();
            const priorityIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityRate });
            txn.add(priorityIx);
            txn.add(
                program.instruction.claim({
                    accounts: {
                        config: config,
                        authority: stakingAuthority,
                        rewardAccount: rewardAccount,
                        userRewardAccount: await getTokenWallet(owner, reward),
                        stakeAccount: stakeAccount,
                        owner: owner,
                        mint: mint,
                        reward: reward,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                        systemProgram: anchor.web3.SystemProgram.programId
                    }
                })
            );

            transactionArr.push(txn);
        }
    }

    await sendAndConfirmTransactionListCustom1(wallet, connection, transactionArr);
};

// Yaku Collection

export type Staking = {
    version: '0.2.0';
    name: 'staking';
    instructions: [
        {
            name: 'initialize';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'authority';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'reward';
                    type: 'publicKey';
                },
                {
                    name: 'interval';
                    type: 'u64';
                },
                {
                    name: 'timelock';
                    type: 'u64';
                },
                {
                    name: 'rootAll';
                    type: {
                        array: ['u8', 32];
                    };
                },
                {
                    name: 'rootRarity';
                    type: {
                        array: ['u8', 32];
                    };
                }
            ];
        },
        {
            name: 'updateConfig';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'authority';
                    isMut: false;
                    isSigner: true;
                }
            ];
            args: [
                {
                    name: 'reward';
                    type: 'publicKey';
                },
                {
                    name: 'interval';
                    type: 'u64';
                },
                {
                    name: 'timelock';
                    type: 'u64';
                },
                {
                    name: 'rootAll';
                    type: {
                        array: ['u8', 32];
                    };
                },
                {
                    name: 'rootRarity';
                    type: {
                        array: ['u8', 32];
                    };
                }
            ];
        },
        {
            name: 'initDeposit';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'authority';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'reward';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'authBump';
                    type: 'u8';
                },
                {
                    name: 'rewardBump';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'deposit';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'authority';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'reward';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'mainAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'amount';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'stakeRarity';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'authority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'stakeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fromAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'authBump';
                    type: 'u8';
                },
                {
                    name: 'stakeBump';
                    type: 'u8';
                },
                {
                    name: 'tokenBump';
                    type: 'u8';
                },
                {
                    name: 'index';
                    type: 'u64';
                },
                {
                    name: 'rewardAmount';
                    type: 'u64';
                },
                {
                    name: 'proof';
                    type: {
                        vec: {
                            array: ['u8', 32];
                        };
                    };
                }
            ];
        },
        {
            name: 'stakeRarityPnft';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'authority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'stakeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fromAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'ownerTokenRecord';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mintMetadata';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mintEdition';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'authorizationRules';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'sysvarInstructions';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'authorizationRulesProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenMetadataProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'authBump';
                    type: 'u8';
                },
                {
                    name: 'stakeBump';
                    type: 'u8';
                },
                {
                    name: 'index';
                    type: 'u64';
                },
                {
                    name: 'rewardAmount';
                    type: 'u64';
                },
                {
                    name: 'proof';
                    type: {
                        vec: {
                            array: ['u8', 32];
                        };
                    };
                }
            ];
        },
        {
            name: 'unstakeNft';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'authority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'stakeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'toAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'associatedTokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'unstakePnft';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'authority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'stakeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'toAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'associatedTokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'stakeAccountTokenRecord';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'ownerTokenRecord';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mintMetadata';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mintEdition';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'authorizationRules';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'sysvarInstructions';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'authorizationRulesProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenMetadataProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'unstakePnftV2';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'authority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'stakeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'toAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'ownerTokenRecord';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mintMetadata';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mintEdition';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'authorizationRules';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'sysvarInstructions';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'authorizationRulesProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenMetadataProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'unstakeNftAdmin';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'authority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'stakeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'admin';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'toAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'associatedTokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'claim';
            accounts: [
                {
                    name: 'config';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'authority';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userRewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'stakeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'mint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'reward';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'associatedTokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        }
    ];
    accounts: [
        {
            name: 'stakingAccount';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'bump';
                        type: 'u8';
                    },
                    {
                        name: 'nft';
                        type: 'publicKey';
                    },
                    {
                        name: 'owner';
                        type: 'publicKey';
                    },
                    {
                        name: 'lock';
                        type: 'u64';
                    },
                    {
                        name: 'lastClaim';
                        type: 'u64';
                    },
                    {
                        name: 'amount';
                        type: 'u64';
                    },
                    {
                        name: 'timelock';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'stakingConfig';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'bump';
                        type: 'u8';
                    },
                    {
                        name: 'reward';
                        type: 'publicKey';
                    },
                    {
                        name: 'authority';
                        type: 'publicKey';
                    },
                    {
                        name: 'interval';
                        type: 'u64';
                    },
                    {
                        name: 'timelock';
                        type: 'u64';
                    },
                    {
                        name: 'count';
                        type: 'u64';
                    },
                    {
                        name: 'rootAll';
                        type: {
                            array: ['u8', 32];
                        };
                    },
                    {
                        name: 'rootRarity';
                        type: {
                            array: ['u8', 32];
                        };
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'IncorrectOwner';
            msg: 'Invalid owner account';
        },
        {
            code: 6001;
            name: 'NFTLocked';
            msg: 'NFT is locked';
        },
        {
            code: 6002;
            name: 'NFTNotStaked';
            msg: 'NFT not staked';
        },
        {
            code: 6003;
            name: 'NFTNotFound';
            msg: 'NFT not found';
        },
        {
            code: 6004;
            name: 'NoReward';
            msg: 'No reward';
        },
        {
            code: 6005;
            name: 'InvalidReward';
            msg: 'Invalid reward account';
        },
        {
            code: 6006;
            name: 'InvalidNFT';
            msg: 'Invalid Index';
        },
        {
            code: 6007;
            name: 'InvalidMetadata';
            msg: 'Invalid NFT';
        },
        {
            code: 6008;
            name: 'ClaimReward';
            msg: 'Claim Reward';
        },
        {
            code: 6009;
            name: 'InvalidProof';
            msg: 'Invalid Proof';
        },
        {
            code: 6010;
            name: 'InvalidLockup';
            msg: 'Invalid Lockup Period';
        },
        {
            code: 6011;
            name: 'SignerIsNotAnAdmin';
            msg: 'Signer is not an admin';
        }
    ];
};

export const YAKU_IDL: Staking = {
    version: '0.2.0',
    name: 'staking',
    instructions: [
        {
            name: 'initialize',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'authority',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'reward',
                    type: 'publicKey'
                },
                {
                    name: 'interval',
                    type: 'u64'
                },
                {
                    name: 'timelock',
                    type: 'u64'
                },
                {
                    name: 'rootAll',
                    type: {
                        array: ['u8', 32]
                    }
                },
                {
                    name: 'rootRarity',
                    type: {
                        array: ['u8', 32]
                    }
                }
            ]
        },
        {
            name: 'updateConfig',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'authority',
                    isMut: false,
                    isSigner: true
                }
            ],
            args: [
                {
                    name: 'reward',
                    type: 'publicKey'
                },
                {
                    name: 'interval',
                    type: 'u64'
                },
                {
                    name: 'timelock',
                    type: 'u64'
                },
                {
                    name: 'rootAll',
                    type: {
                        array: ['u8', 32]
                    }
                },
                {
                    name: 'rootRarity',
                    type: {
                        array: ['u8', 32]
                    }
                }
            ]
        },
        {
            name: 'initDeposit',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'authority',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'rewardAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'reward',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'authBump',
                    type: 'u8'
                },
                {
                    name: 'rewardBump',
                    type: 'u8'
                }
            ]
        },
        {
            name: 'deposit',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'authority',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'rewardAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'reward',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'mainAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'owner',
                    isMut: false,
                    isSigner: true
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'amount',
                    type: 'u64'
                }
            ]
        },
        {
            name: 'stakeRarity',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'authority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'stakeAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'tokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'fromAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mint',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'authBump',
                    type: 'u8'
                },
                {
                    name: 'stakeBump',
                    type: 'u8'
                },
                {
                    name: 'tokenBump',
                    type: 'u8'
                },
                {
                    name: 'index',
                    type: 'u64'
                },
                {
                    name: 'rewardAmount',
                    type: 'u64'
                },
                {
                    name: 'proof',
                    type: {
                        vec: {
                            array: ['u8', 32]
                        }
                    }
                }
            ]
        },
        {
            name: 'stakeRarityPnft',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'authority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'stakeAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'fromAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mint',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'ownerTokenRecord',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mintMetadata',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mintEdition',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'authorizationRules',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'sysvarInstructions',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'authorizationRulesProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenMetadataProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: [
                {
                    name: 'authBump',
                    type: 'u8'
                },
                {
                    name: 'stakeBump',
                    type: 'u8'
                },
                {
                    name: 'index',
                    type: 'u64'
                },
                {
                    name: 'rewardAmount',
                    type: 'u64'
                },
                {
                    name: 'proof',
                    type: {
                        vec: {
                            array: ['u8', 32]
                        }
                    }
                }
            ]
        },
        {
            name: 'unstakeNft',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'authority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'stakeAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'tokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'toAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mint',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'associatedTokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: []
        },
        {
            name: 'unstakePnft',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'authority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'stakeAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'tokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'toAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mint',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'associatedTokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'stakeAccountTokenRecord',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'ownerTokenRecord',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mintMetadata',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mintEdition',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'authorizationRules',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'sysvarInstructions',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'authorizationRulesProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenMetadataProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: []
        },
        {
            name: 'unstakePnftV2',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'authority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'stakeAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'toAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mint',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'ownerTokenRecord',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mintMetadata',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mintEdition',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'authorizationRules',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'sysvarInstructions',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'authorizationRulesProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenMetadataProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: []
        },
        {
            name: 'unstakeNftAdmin',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'authority',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'stakeAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'tokenAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'admin',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'toAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'mint',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'associatedTokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: []
        },
        {
            name: 'claim',
            accounts: [
                {
                    name: 'config',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'authority',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'rewardAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'userRewardAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'stakeAccount',
                    isMut: true,
                    isSigner: false
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true
                },
                {
                    name: 'mint',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'reward',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'associatedTokenProgram',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false
                }
            ],
            args: []
        }
    ],
    accounts: [
        {
            name: 'stakingAccount',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'bump',
                        type: 'u8'
                    },
                    {
                        name: 'nft',
                        type: 'publicKey'
                    },
                    {
                        name: 'owner',
                        type: 'publicKey'
                    },
                    {
                        name: 'lock',
                        type: 'u64'
                    },
                    {
                        name: 'lastClaim',
                        type: 'u64'
                    },
                    {
                        name: 'amount',
                        type: 'u64'
                    },
                    {
                        name: 'timelock',
                        type: 'u64'
                    }
                ]
            }
        },
        {
            name: 'stakingConfig',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'bump',
                        type: 'u8'
                    },
                    {
                        name: 'reward',
                        type: 'publicKey'
                    },
                    {
                        name: 'authority',
                        type: 'publicKey'
                    },
                    {
                        name: 'interval',
                        type: 'u64'
                    },
                    {
                        name: 'timelock',
                        type: 'u64'
                    },
                    {
                        name: 'count',
                        type: 'u64'
                    },
                    {
                        name: 'rootAll',
                        type: {
                            array: ['u8', 32]
                        }
                    },
                    {
                        name: 'rootRarity',
                        type: {
                            array: ['u8', 32]
                        }
                    }
                ]
            }
        }
    ],
    errors: [
        {
            code: 6000,
            name: 'IncorrectOwner',
            msg: 'Invalid owner account'
        },
        {
            code: 6001,
            name: 'NFTLocked',
            msg: 'NFT is locked'
        },
        {
            code: 6002,
            name: 'NFTNotStaked',
            msg: 'NFT not staked'
        },
        {
            code: 6003,
            name: 'NFTNotFound',
            msg: 'NFT not found'
        },
        {
            code: 6004,
            name: 'NoReward',
            msg: 'No reward'
        },
        {
            code: 6005,
            name: 'InvalidReward',
            msg: 'Invalid reward account'
        },
        {
            code: 6006,
            name: 'InvalidNFT',
            msg: 'Invalid Index'
        },
        {
            code: 6007,
            name: 'InvalidMetadata',
            msg: 'Invalid NFT'
        },
        {
            code: 6008,
            name: 'ClaimReward',
            msg: 'Claim Reward'
        },
        {
            code: 6009,
            name: 'InvalidProof',
            msg: 'Invalid Proof'
        },
        {
            code: 6010,
            name: 'InvalidLockup',
            msg: 'Invalid Lockup Period'
        },
        {
            code: 6011,
            name: 'SignerIsNotAnAdmin',
            msg: 'Signer is not an admin'
        }
    ]
};
