import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
    AccountInfo,
    Commitment,
    Connection,
    GetMultipleAccountsConfig,
    ParsedAccountData,
    PublicKey,
    SystemProgram
} from '@solana/web3.js';
import findMetadataAccount from './metaplex';

export type TokenData = {
    tokenAccount?: {
        pubkey: PublicKey;
        account: AccountInfo<ParsedAccountData>;
    };
    metaplexData?: { pubkey: PublicKey; data: Metadata } | null;
};

export const createSolTransferInstruction = (authority: PublicKey, recipient: PublicKey, amount = 1000000) =>
    SystemProgram.transfer({
        fromPubkey: authority,
        lamports: amount,
        toPubkey: recipient
    });

export const getLamportsByAddress = async (connection: Connection, address: PublicKey): Promise<number> => {
    const accountBuffer = await connection.getAccountInfo(address);
    return accountBuffer?.lamports ?? 0;
};

export const getTokensOfOwner = async (connection: Connection, pubkey: PublicKey): Promise<TokenData[]> => {
    const allTokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: TOKEN_PROGRAM_ID
    });

    const tokenAccounts = allTokenAccounts.value
        .filter((tokenAccount) => tokenAccount.account.data.parsed.info.tokenAmount.uiAmount > 0)
        .sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()));

    const metaplexIds = await Promise.all(
        tokenAccounts.map(async (tokenAccount) => findMetadataAccount(new PublicKey(tokenAccount.account.data.parsed.info.mint))[0])
    );

    const metaplexAccountInfos = await getBatchedMultipleAccounts(connection, metaplexIds);

    const metaplexData = metaplexAccountInfos.reduce(
        (acc, accountInfo, i) => {
            try {
                acc[tokenAccounts[i]!.pubkey.toString()] = {
                    pubkey: metaplexIds[i]!,
                    ...accountInfo,
                    data: Metadata.deserialize(accountInfo?.data as Buffer, 0)[0]
                };
            } catch (e) {
                console.error('Error occurs while deserializing metadata');
            }
            return acc;
        },
        {} as {
            [tokenAccountId: string]: {
                pubkey: PublicKey;
                data: Metadata;
            };
        }
    );

    const tokens: TokenData[] = tokenAccounts.map((tokenAccount) => ({
        tokenAccount,
        metaplexData: metaplexData[tokenAccount.pubkey.toString()]
    }));

    return tokens;
};

export const getBatchedMultipleAccounts = async (
    connection: Connection,
    ids: PublicKey[],
    config?: GetMultipleAccountsConfig,
    batchSize = 100
): Promise<(AccountInfo<Buffer | ParsedAccountData> | null)[]> => {
    const batches: PublicKey[][] = [[]];
    ids.forEach((id) => {
        const batch = batches[batches.length - 1];
        if (batch) {
            if (batch.length >= batchSize) {
                batches.push([id]);
            } else {
                batch.push(id);
            }
        }
    });
    const batchAccounts = await Promise.all(
        batches.map((b) => (b.length > 0 ? connection.getMultipleAccountsInfo(b, config as unknown as Commitment) : []))
    );
    return batchAccounts.flat();
};

export const getATA = (owner: PublicKey, mint: PublicKey): PublicKey =>
    PublicKey.findProgramAddressSync([owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID)[0];
