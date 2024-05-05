/* eslint-disable react-hooks/exhaustive-deps */
import { FC, ReactNode, createContext, useState, useEffect } from "react";

// types
import { StakedContextType } from "@/types/staked";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  getGlobalData,
  getTokenDistribution,
  getUserPoolData,
} from "@/app/applications/staking/fetchData";
import useConnections from "@/hooks/useConnetions";
import { each, min, sortBy } from "lodash";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getStakingState, loadYakuProgram } from "@/actions/yakuStake";
import { useSolPrice } from "./CoinGecko";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useRequests } from "@/hooks/useRequests";
import { useToasts } from "@/hooks/useToasts";

// context & provider
const StakedContext = createContext<StakedContextType | null>(null);

export const StakedProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnections();
  const wallet = useWallet();
  const auth = useAuth();

  const solPrice = useSolPrice();
  const [isInited, setIsInited] = useState(false);
  const [totalStaked, setTotalStaked] = useState(0);
  const [valueLocked, setValueLocked] = useState(0);
  const [tokenDistributed, setTokenDistributed] = useState(0);
  const [dailyYield, setDailyYield] = useState(0);

  const [nftList, setNftList] = useState<any>([]);
  const [stakedNfts, setStakedNfts] = useState<any>([]);
  const [stakedYakuNfts, setStakedYakuNfts] = useState<any>([]);
  const [metaDataCache, setMetaDataCache] = useState<any>({});
  const [rewardAmount, setRewardAmount] = useState(0);
  const [yakuRewardAmount, setYakuRewardAmount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [assetsCount, setAssetsCount] = useState<any>({});
  const [yakusFP, setYakusFP] = useState<any>(0);
  const [isLoading, setIsLoading] = useState(false);

  const { getCollectionStats } = useRequests();
  const { showErrorToast, showTxErrorToast, showLoadingToast, dismissToast } =
    useToasts();

  const getStats = async () => {
    try {
      const program = loadYakuProgram(connection, wallet);
      const statsArr = await getCollectionStats({ symbol: "all" });
      const oniFP = statsArr[0].floorPrice;
      const capsuleFP = statsArr[1].floorPrice;
      const xFP = statsArr[2].floorPrice;
      const { totalStaked: total = 0, valueLocked: caValueLocked = 0 } =
        (await getGlobalData(connection, solPrice, xFP)) || {};
      const { count = 0 } = await getStakingState(program);
      const locked =
        caValueLocked +
        (min([oniFP, capsuleFP, xFP]) / LAMPORTS_PER_SOL) * count * solPrice;

      setTotalStaked(total + count);
      setValueLocked(locked);
      setYakusFP({
        yakucorp1: oniFP,
        capsulex: capsuleFP,
        yakux: xFP,
      });
      return {
        totalStaked: total + count,
        valueLocked: locked,
        yakusFP: {
          yakucorp1: oniFP,
          capsulex: capsuleFP,
          yakux: xFP,
        },
      };
    } catch (error) {
      console.error(error);
    }
    return {};
  };

  // Fetch Main Wallet Yaku collections
  const getAllYakuNfts = async () => {
    if (isLoading) {
      showLoadingToast("Loading with your wallet...");
    }
    if (!wallet?.publicKey?.toBase58()) {
      showErrorToast("Failed to found wallet public key.");
      return;
    }
    setIsLoading(true);
    try {
      const { staked: stakedCA = [], claimReward = 0 } = await getUserPoolData({
        connection,
        wallet,
      });
      setRewardAmount(claimReward);
      setStakedNfts(sortBy(stakedCA, "name"));
    } catch (error) {
      showTxErrorToast(error, "Failed to fetch CA User Pool.");
      console.error("Failed to fetch CA User Pool.");
    }
    try {
      const {
        data: { unstaked, staked, dailyYield: myDailyYield },
      } = await axios.post("https://nft.yaku.ai/api/yaku/wallet", {
        wallet: wallet.publicKey?.toBase58(),
      });
      setNftList(unstaked);
      setStakedYakuNfts(staked);

      setNftList(sortBy(unstaked, "name"));
      setStakedYakuNfts(sortBy(staked, "name"));
      setDailyYield(myDailyYield);
    } catch (error) {
      showTxErrorToast(error, "Failed to fetch Yaku staked protocol.");
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsInited(true);
      dismissToast();
    }
  };

  const getStakedList = async (shouldSet = true, otherWallet?: string) => {
    if (!(otherWallet || wallet.publicKey?.toBase58())) {
      showErrorToast("Failed to found wallet public key.");
      return [];
    }
    try {
      const {
        data: { staked },
      } = await axios.post("https://nft.yaku.ai/api/yaku/wallet", {
        wallet: otherWallet || wallet.publicKey?.toBase58(),
      });
      if (shouldSet) {
        setStakedYakuNfts(staked);
      }
      return staked;
    } catch (error) {
      showTxErrorToast(error, "Failed to fetch Yaku staked protocol.");
      console.error(error);
    }
    return [];
  };

  const resetList = () => {
    setStakedNfts([]);
    setStakedYakuNfts([]);
    setNftList([]);
  };

  const updateContext = () => {
    resetList();
    getStats();
    getAllYakuNfts();
    if (!tokenDistributed) {
      getTokenDistribution(connection).then((tokenDist) =>
        setTokenDistributed(tokenDist)
      );
    }
  };

  useEffect(() => {
    if (nftList && stakedYakuNfts && stakedNfts) {
      setTotalCount(nftList.length + stakedYakuNfts.length + stakedNfts.length);
      let yakuXCnt = 0;
      let capsuleCnt = 0;
      let bikeCnt = 0;
      let mansionCnt = 0;
      let setCnt = 0;
      each([...nftList, ...stakedNfts, ...stakedYakuNfts], ({ name = "" }) => {
        if (name.includes("Yaku X")) {
          yakuXCnt += 1;
        } else if (name.includes("Capsule X")) {
          const [, num] = name.split(" #");
          if (+num < 7000) {
            capsuleCnt += 1;
          } else {
            mansionCnt += 1;
          }
        } else if (name.includes("Yaku Engineering ONI")) {
          bikeCnt += 1;
        }
      });
      setCnt = min([yakuXCnt, capsuleCnt + mansionCnt * 10, bikeCnt]) || 0;
      setAssetsCount({
        yakuXCnt,
        capsuleCnt,
        bikeCnt,
        mansionCnt,
        setCnt,
      });
    }
  }, [stakedYakuNfts]);

  useEffect(() => {
    if (auth.token) {
      updateContext();
    }
  }, [auth.token]);

  return (
    <StakedContext.Provider
      value={{
        totalStaked,
        setTotalStaked,
        valueLocked,
        setValueLocked,
        tokenDistributed,
        setTokenDistributed,
        dailyYield,
        setDailyYield,
        nftList,
        setNftList,
        stakedNfts,
        setStakedNfts,
        stakedYakuNfts,
        setStakedYakuNfts,
        metaDataCache,
        setMetaDataCache,
        rewardAmount,
        setRewardAmount,
        yakuRewardAmount,
        setYakuRewardAmount,
        totalCount,
        setTotalCount,
        assetsCount,
        setAssetsCount,
        yakusFP,
        setYakusFP,
        updateContext,
        getStats,
        getStakedList,
        isLoading,
        isInited,
        setIsInited,
      }}
    >
      {children}
    </StakedContext.Provider>
  );
};

export default StakedContext;
