import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import * as anchor from '@project-serum/anchor';
import { STAKING_REWARD_MINT, YAKU_COLLECTION_CREATORS, YAKU_TOKEN_EXCLUDE_WALLET } from '@/config/config';
import { Promise } from 'bluebird';
import { filter, sum, get, map, uniqBy } from 'lodash';
import { calculateAllRewards, getGlobalState, getUserPoolState } from '@/actions/stake';
import { loadYakuProgram, getStakedNFTMintList, fetchMetadata } from '@/actions/yakuStake';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { YAKU_NFT } from '@/types/staking';
import Big from 'big.js';

interface NFTType {
    mint: string;
    updateAuthority: string;
    data: {
        creators: any[];
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
    };
    key: any;
    primarySaleHappened: boolean;
    isMutable: boolean;
    editionNonce: number;
    masterEdition?: string;
    edition?: string;
}

export const getUnstakedNfts = async ({
    connection,
    wallet,
    shouldfetchJson = true,
    cache = {}
}: {
    connection: Connection;
    wallet: WalletContextState;
    shouldfetchJson?: boolean;
    cache?: any;
}) => {
    if (wallet?.publicKey === null) {
        return [];
    }
    const nftsList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey.toBase58(), connection });

    const list: Array<any> = await Promise.mapSeries(nftsList, async (item: NFTType) => {
        try {
            const creators = get(item, 'data.creators', []);
            if (!!get(creators, '[0].verified') && YAKU_COLLECTION_CREATORS.includes(get(creators, '[0].address'))) {
                const result = await fetchMetadata(item.data.uri, item.mint, undefined, shouldfetchJson);
                return result;
            }
        } catch (error) {
            console.error(error);
        }
        return undefined;
    });
    return filter(list, (itm) => !!itm);
};

export const calculateAllYakuRewards = (staked: Array<YAKU_NFT>) => {
    const allRewards = map(
        staked,
        ({ lastClaim, interval, amount }) => (((Math.floor(Date.now() / 1000) - lastClaim) / interval) * amount) / LAMPORTS_PER_SOL
    );

    return sum(allRewards);
};

export const getYakuStakedNfts = async ({
    connection,
    wallet,
    otherWallet
}: {
    connection: Connection;
    wallet: WalletContextState;
    shouldfetchJson?: boolean;
    cache?: any;
    otherWallet?: string;
}) => {
    if (wallet?.publicKey === null) {
        return {};
    }
    const program = loadYakuProgram(connection, wallet);
    const staked = await getStakedNFTMintList(connection, program, wallet, otherWallet);

    return {
        staked,
        rewardAmount: calculateAllYakuRewards(staked)
    };
};

export const getTokenBalance = async (
    connection: Connection,
    pubkey: anchor.web3.PublicKey,
    wallet?: WalletContextState,
    verbose: boolean = true
) => {
    const cloneWindow: any = window;
    const provider = new anchor.AnchorProvider(connection, wallet || cloneWindow.solana, anchor.AnchorProvider.defaultOptions());
    const token = await provider.connection.getTokenAccountBalance(pubkey);
    const tokenAmount = token.value.uiAmount;
    if (verbose) {
        console.log(`${pubkey.toBase58()} has ${tokenAmount} Tokens`);
    }
    return tokenAmount;
};

// Get Cosmic Astronauts global data
export const getGlobalData = async (connection: Connection, solPrice: number, floorPrice = 0) => {
    const globalPoolData = await getGlobalState(connection);
    if (globalPoolData === null) return {};
    const totalStaked = globalPoolData.totalAmount?.toNumber() ?? 0;
    return {
        totalStaked,
        valueLocked: totalStaked * (floorPrice / LAMPORTS_PER_SOL) * solPrice
    };
};

export const getUserPoolData = async (props: { connection: Connection; wallet: WalletContextState }) => {
    const { connection, wallet } = props;
    if (wallet?.publicKey === null) return {};

    const userPoolData = await getUserPoolState(connection, wallet);
    if (userPoolData === null) return {};

    const claimReward = await calculateAllRewards(connection, wallet);

    const count = userPoolData.itemCount.toNumber();
    const reward: number = 0;
    if (count === 0) {
        return {
            staked: [],
            count,
            claimReward,
            reward
        };
    }
    const staked = [];
    if (count !== 0) {
        for (let i = 0; i < count; i += 1) {
            staked.push({
                lockTime: userPoolData.items[i].lockTime.toNumber(),
                model: userPoolData.items[i].model.toNumber(),
                mint: userPoolData.items[i].nftAddr.toBase58(),
                rate: userPoolData.items[i].rate.toNumber(),
                rewardTime: userPoolData.items[i].rewardTime.toNumber(),
                stakedTime: userPoolData.items[i].stakeTime.toNumber()
            });
        }
    }
    return {
        staked: uniqBy(
            filter(staked, (itm) => !!itm && itm.mint !== '11111111111111111111111111111111'),
            'mint'
        ),
        count,
        claimReward,
        reward
    };
};

export const getTokenDistribution = async (connection: Connection) => {
    const deduceList: any = [];
    let yakuMeta: any = {};
    try {
        ({ value: yakuMeta } = await connection.getTokenSupply(new PublicKey(STAKING_REWARD_MINT)));
    } catch (error: any) {
        console.debug(error?.message);
    }
    let totalSupply = Big(yakuMeta.amount || 495529631357113148);
    const decimal = Math.pow(10, yakuMeta.decimals) || LAMPORTS_PER_SOL;
    await Promise.each(YAKU_TOKEN_EXCLUDE_WALLET, async (account, index: number) => {
        const info = await connection.getTokenAccountsByOwner(new PublicKey(account), { mint: new PublicKey(STAKING_REWARD_MINT) });
        const res = await connection.getTokenAccountBalance(new PublicKey(info.value?.[0]?.pubkey));
        deduceList.push((+res.value?.amount ?? 0) / decimal);
    });
    totalSupply = totalSupply.div(decimal).minus(sum(deduceList));
    return totalSupply.toNumber();
};

const fetchData = {
    getUnstakedNfts,
    getGlobalData,
    getUserPoolData,
    getTokenDistribution
};

export default fetchData;
