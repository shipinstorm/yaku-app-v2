"use client";

/* eslint-disable */
import { ReactElement, useState, useEffect } from "react";

import defaultColor from "@/app/styles/_themes-vars.module.scss";

// web3 imports
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { calculateAllRewards, claimRewardAll } from "@/actions/stake";

// project imports
import RevenueCard from "@/components/cards/RevenueCard";
import SkeletonProductPlaceholder from "@/components/skeleton/CardPlaceholder";
import MainCard from "@/components/cards/MainCard";
import StakeEmpty from "./StakeEmpty";
import StakedNftCard from "./StakedNftCard";
import NftCard from "./StakeNftCard";
import { formatNumber, formatUSD } from "@/utils/utils";
import { useMeta } from "@/contexts/meta/meta";
import { useToasts } from "@/hooks/useToasts";

import { calculateAllYakuRewards } from "./fetchData";
import YakuStakeNftCard from "./YakuStakedNftCard";
import {
  claimRewardV2Multiple,
  loadYakuProgram,
  stakeNftV2Multiple,
  unStakeNftV2Multiple,
} from "@/actions/yakuStake";
import { get, isEmpty, map, pull } from "lodash";
import { PublicKey } from "@solana/web3.js";
import { FormattedMessage } from "react-intl";
import useConnections from "@/hooks/useConnetions";
import useStaked from "@/hooks/useStaked";
import CAConversion from "@/components/home/CAConversion";
import { usePriority } from "@/contexts/SolPriorityContext";

function Staking() {
  const { connection } = useConnections();
  const colors = defaultColor;
  const showCAConvert = true;
  const {
    totalStaked,
    valueLocked,
    tokenDistributed,
    dailyYield,
    nftList,
    stakedNfts,
    stakedYakuNfts,
    rewardAmount,
    setRewardAmount,
    yakuRewardAmount,
    setYakuRewardAmount,
    totalCount,
    assetsCount,
    updateContext,
    isLoading,
  } = useStaked();

  const { priorityRate, setShowPriorityDialog } = usePriority();

  const { showInfoToast, showTxErrorToast, showErrorToast } = useToasts();
  const { startLoading, stopLoading } = useMeta();
  const wallet: any = useAnchorWallet();
  const mainWallet = useWallet();

  const [tabIdx, setTabIdx] = useState(
    nftList && nftList.length > 0 ? "1" : "2"
  );
  const [selected, setSelected] = useState<any[]>([]);
  const [selectedUnstake, setSelectedUnstake] = useState<any[]>([]);

  let timer: any;

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIdx(newValue);
  };

  // Claim all COSMIC
  const claimAll = async () => {
    try {
      startLoading();
      await claimRewardAll(connection, mainWallet);
      showInfoToast("You have claimed all of your $COSMIC.");
      updatePage();
    } catch (error: any) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while claiming your rewards, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const claimAllYaku = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(stakedYakuNfts, ({ mint }) => new PublicKey(mint));
      await claimRewardV2Multiple(
        connection,
        program,
        wallet,
        mintList,
        priorityRate
      );
      showInfoToast("You have claimed all of your $YAKU.");
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while claiming your rewards, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const claimSelected = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(selected, (mint) => new PublicKey(mint));
      await claimRewardV2Multiple(
        connection,
        program,
        wallet,
        mintList,
        priorityRate
      );
      showInfoToast(`You have claimed ${selected.length} of your $YAKU.`);
      setSelected([]);
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while claiming your rewards, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const stakeAll = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(
        nftList,
        ({ mint, mintAddress }) => new PublicKey(mint || mintAddress)
      );
      await stakeNftV2Multiple(
        connection,
        program,
        wallet,
        mintList,
        priorityRate
      );
      showInfoToast("You have staked all of your NFTs.");
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while staking your nfts, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const stakeSelected = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(selectedUnstake, (mint) => new PublicKey(mint));
      await stakeNftV2Multiple(
        connection,
        program,
        wallet,
        mintList,
        priorityRate
      );
      showInfoToast(`You have staked ${selectedUnstake.length} of your NFTs.`);
      setSelectedUnstake([]);
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while staking your nfts, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const unstakeAll = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(
        stakedYakuNfts,
        ({ mint, mintAddress }) => new PublicKey(mint || mintAddress)
      );
      const withType = map(
        stakedYakuNfts,
        ({ mint, mintAddress, stakedType }) => ({
          mint: new PublicKey(mint || mintAddress),
          stakedType,
        })
      );
      await unStakeNftV2Multiple(
        connection,
        program,
        wallet,
        withType,
        priorityRate
      );
      showInfoToast("You have unstaked all of your NFTs.");
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while unstaking your nfts, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const unstakeSelected = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(selected, (mint) => new PublicKey(mint));
      await unStakeNftV2Multiple(
        connection,
        program,
        wallet,
        mintList,
        priorityRate
      );
      showInfoToast(`You have unstaked ${mintList.length} of your NFTs.`);
      setSelected([]);
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while unstaking your nfts, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const refreshYakuReward = () => {
    timer = setInterval(() => {
      const rewardAmount = calculateAllYakuRewards(stakedYakuNfts);
      if (rewardAmount) {
        setYakuRewardAmount(rewardAmount);
      }
    }, 1000);
  };

  const updatePage = () => {
    updateContext();
  };

  const handleSelect = (mint: any) => {
    if (selected.includes(mint)) {
      pull(selected, mint);
    } else {
      selected.push(mint);
    }
    setSelected([...selected]);
  };

  const handleSelectUnstake = (mint: any) => {
    if (selectedUnstake.includes(mint)) {
      pull(selectedUnstake, mint);
    } else {
      selectedUnstake.push(mint);
    }
    setSelectedUnstake([...selectedUnstake]);
  };

  useEffect(() => {
    if (!wallet || wallet?.publicKey === null) {
      showErrorToast("Failed to found wallet public key.");
      return;
    }
    updatePage();

    let timerId = 0;
    const queryClaimAmount = async () => {
      const claimReward = await calculateAllRewards(connection, wallet);
      setRewardAmount(claimReward);

      startTimer();
    };

    const startTimer = () => {
      timerId = window.setTimeout(async () => {
        await queryClaimAmount();
      }, 35000);
    };

    queryClaimAmount();
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    refreshYakuReward();
    return () => clearInterval(timer);
  }, [stakedYakuNfts]);

  let stakedNftResult: ReactElement | ReactElement[] = <></>;
  if (stakedNfts && stakedNfts.length !== 0) {
    stakedNftResult = stakedNfts.map((nft: any, index: number) => (
      <div
        key={index}
        className="pl-6 pt-6 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full sm:w-1/2 sm:max-w-1/2 md:w-1/3 md:max-w-1/3 lg:w-1/4 lg:max-w-1/4"
      >
        <StakedNftCard
          mint={nft.mint}
          name={nft.name}
          image={nft.image}
          role={nft.role}
          lockTime={nft.lockTime}
          rate={nft.rate}
          rewardTime={nft.rewardTime}
          stakedTime={nft.stakedTime}
          startLoading={() => startLoading()}
          stopLoading={() => stopLoading()}
          updatePage={() => updatePage()}
        />
      </div>
    ));
  } else {
    stakedNftResult = <></>;
  }

  let stakedYakuNftResult: ReactElement | ReactElement[] = <></>;
  if (stakedYakuNfts && stakedYakuNfts.length !== 0) {
    stakedYakuNftResult = stakedYakuNfts.map((nft: any, index: number) => (
      <div
        key={index}
        className="pl-6 pt-6 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full sm:w-1/2 sm:max-w-1/2 md:w-1/3 md:max-w-1/3 lg:w-1/4 lg:max-w-1/4"
      >
        <YakuStakeNftCard
          mint={nft.mint || nft.mintAddress}
          name={get(nft, "metadata.json.name")}
          image={get(nft, "metadata.json.image")}
          reward={nft.reward}
          interval={nft.interval}
          lastClaim={nft.lastClaim}
          amount={nft.amount}
          isPNft={!isEmpty(get(nft, "metaplex.programmableConfig"))}
          stakedType={get(nft, "stakedType", "custodial")}
          startLoading={() => startLoading()}
          stopLoading={() => stopLoading()}
          updatePage={() => updatePage()}
          isSelected={selected?.includes(nft.mint || nft.mintAddress)}
          onSelect={handleSelect}
        />
      </div>
    ));
  } else {
    stakedYakuNftResult = <></>;
  }

  let nftResult: ReactElement | ReactElement[] = <></>;
  if (nftList && nftList.length !== 0) {
    nftResult = nftList.map((nft: any, index: number) => (
      <div
        key={index}
        className="pl-6 pt-6 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full sm:w-1/2 sm:max-w-1/2 md:w-1/3 md:max-w-1/3 lg:w-1/4 lg:max-w-1/4"
      >
        <NftCard
          mint={nft.mint || nft.mintAddress}
          reward={nft.reward}
          name={get(nft, "metadata.json.name", nft.name)}
          image={get(nft, "metadata.json.image", nft.image)}
          isPNft={!isEmpty(get(nft, "metaplex.programmableConfig"))}
          startLoading={() => startLoading()}
          stopLoading={() => stopLoading()}
          updatePage={() => updatePage()}
          isSelected={selectedUnstake?.includes(nft.mint || nft.mintAddress)}
          onSelect={handleSelectUnstake}
        />
      </div>
    ));
  } else if (nftList && nftList.length === 0) {
    nftResult = (
      <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
        <StakeEmpty />
      </div>
    );
  }

  const paletteMode = JSON.parse(
    localStorage.getItem("yaku-config") || "{}"
  ).mode;

  return (
    <>
      <div className="box-border flex flex-wrap mt-[-24px] w-[calc(100% + 24px)] ml-[-24px] pb-4">
        <div className="pl-6 pt-6 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full md:w-1/2 md:max-w-1/2 lg:w-1/4 lg:max-w-1/4">
          <RevenueCard
            primary={<FormattedMessage id="total-staked" />}
            secondary={formatNumber.format(totalStaked)}
            content={<FormattedMessage id="vault-holdings" />}
            iconPrimary="/images/icons-material/AccountBalanceTwoToneIcon.svg"
            color={paletteMode === "dark" ? colors.darkSecondaryDark : colors.secondaryDark}
          />
        </div>

        <div className="pl-6 pt-6 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full md:w-1/2 md:max-w-1/2 lg:w-1/4 lg:max-w-1/4">
          <RevenueCard
            primary={<FormattedMessage id="tvl" />}
            secondary={formatUSD.format(valueLocked)}
            content={<FormattedMessage id="tvl-desc" />}
            iconPrimary="/images/icons-material/MonetizationOnTwoToneIcon.svg"
            color={paletteMode === "dark" ? colors.darkPrimaryDark : colors.primaryDark}
          />
        </div>

        <div className="pl-6 pt-6 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full md:w-1/2 md:max-w-1/2 lg:w-1/4 lg:max-w-1/4">
          <RevenueCard
            primary={<FormattedMessage id="distributed" />}
            secondary={formatNumber.format(tokenDistributed)}
            content={<FormattedMessage id="est-circular-supply" />}
            iconPrimary="/images/icons-material/EqualizerTwoToneIcon.svg"
            color={colors.warningMain}
          />
        </div>

        <div className="pl-6 pt-6 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full md:w-1/2 md:max-w-1/2 lg:w-1/4 lg:max-w-1/4">
          <RevenueCard
            primary={<FormattedMessage id="daily-yield" />}
            secondary={formatNumber.format(dailyYield)}
            content={<FormattedMessage id="daily-yield-desc" />}
            iconPrimary="/images/icons-material/FormatListBulletedTwoToneIcon.svg"
            color="#0288D1"
          />
        </div>
      </div>

      <div className="box-border flex flex-wrap mt-[-24px] w-[calc(100% + 24px)] ml-[-24px] pb-4">
        <div className="box-border m-0 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full xs:w-1/2 xs:max-w-1/2 sm:w-1/3 sm:max-w-1/3 md:w-1/4 md:max-w-1/4 lg:w-1/6 lg:max-w-1/6 pl-6 pt-6">
          <div className="flex flex-col">
            <div className="transition-shadow shadow-none bg-gray-900 rounded-md text-gray-300 font-normal leading-6 font-inter text-sm p-2 text-center">
              Your Assets
              <br />
              {totalCount}
            </div>
          </div>
        </div>
        <div className="box-border m-0 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full xs:w-1/2 xs:max-w-1/2 sm:w-1/3 sm:max-w-1/3 md:w-1/4 md:max-w-1/4 lg:w-1/6 lg:max-w-1/6 pl-6 pt-6">
          <div className="flex flex-col">
            <div className="transition-shadow shadow-none bg-gray-900 rounded-md text-gray-300 font-normal leading-6 font-inter text-sm p-2 text-center">
              Yaku X
              <br />
              {isLoading ? (
                <div className="mx-auto">
                  <div className="w-15 h-4 bg-gray-800 rounded-full"></div>
                </div>
              ) : (
                assetsCount?.yakuXCnt ?? 0
              )}
            </div>
          </div>
        </div>
        <div className="box-border m-0 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full xs:w-1/2 xs:max-w-1/2 sm:w-1/3 sm:max-w-1/3 md:w-1/4 md:max-w-1/4 lg:w-1/6 lg:max-w-1/6 pl-6 pt-6">
          <div className="flex flex-col">
            <div className="transition-shadow shadow-none bg-gray-900 rounded-md text-gray-300 font-normal leading-6 font-inter text-sm p-2 text-center">
              Capsule X
              <br />
              {isLoading ? (
                <div className="mx-auto">
                  <div className="w-15 h-4 bg-gray-800 rounded-full"></div>
                </div>
              ) : (
                assetsCount?.capsuleCnt ?? 0
              )}
            </div>
          </div>
        </div>
        <div className="box-border m-0 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full xs:w-1/2 xs:max-w-1/2 sm:w-1/3 sm:max-w-1/3 md:w-1/4 md:max-w-1/4 lg:w-1/6 lg:max-w-1/6 pl-6 pt-6">
          <div className="flex flex-col">
            <div className="transition-shadow shadow-none bg-gray-900 rounded-md text-gray-300 font-normal leading-6 font-inter text-sm p-2 text-center">
              ONI S-01
              <br />
              {isLoading ? (
                <div className="mx-auto">
                  <div className="w-15 h-4 bg-gray-800 rounded-full"></div>
                </div>
              ) : (
                assetsCount?.bikeCnt ?? 0
              )}
            </div>
          </div>
        </div>
        <div className="box-border m-0 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full xs:w-1/2 xs:max-w-1/2 sm:w-1/3 sm:max-w-1/3 md:w-1/4 md:max-w-1/4 lg:w-1/6 lg:max-w-1/6 pl-6 pt-6">
          <div className="flex flex-col">
            <div className="transition-shadow shadow-none bg-gray-900 rounded-md text-gray-300 font-normal leading-6 font-inter text-sm p-2 text-center">
              Mansion
              <br />
              {isLoading ? (
                <div className="mx-auto">
                  <div className="w-15 h-4 bg-gray-800 rounded-full"></div>
                </div>
              ) : (
                assetsCount?.mansionCnt ?? 0
              )}
            </div>
          </div>
        </div>
        <div className="box-border m-0 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full xs:w-1/2 xs:max-w-1/2 sm:w-1/3 sm:max-w-1/3 md:w-1/4 md:max-w-1/4 lg:w-1/6 lg:max-w-1/6 pl-6 pt-6">
          <div className="flex flex-col">
            <div className="transition-shadow shadow-none bg-gray-900 rounded-md text-gray-300 font-normal leading-6 font-inter text-sm p-2 text-center">
              Sets
              <br />
              {isLoading ? (
                <div className="mx-auto">
                  <div className="w-15 h-4 bg-gray-800 rounded-full"></div>
                </div>
              ) : (
                assetsCount?.setCnt ?? 0
              )}
            </div>
          </div>
        </div>
      </div>

      {showCAConvert && <CAConversion />}

      <div>
        <MainCard
          sx={{
            ".MuiCardHeader-root": {
              overflowX: "auto",
            },
          }}
          title={
            <div className="flex">
              <div className="overflow-hidden max-h-[12rem] flex -mt-3">
                <div className="overflow-hidden mb-0 relative inline-block flex-auto whitespace-nowrap w-full">
                  <div className="flex">
                    <button
                      className={
                        "inline-flex items-center justify-center flex-shrink-0 flex-col max-w-[360px] min-w-[90px] min-h-12 px-4 py-3 text-center no-underline capitalize font-medium text-sm leading-tight bg-transparent rounded-none cursor-pointer select-none align-middle border-0 outline-none overflow-hidden whitespace-normal " +
                        (tabIdx === "1" ? "text-[#f38aff]" : "text-[#d8ddf0]")
                      }
                      onClick={(e) => handleTabChange(e, "1")}
                    >
                      Unstaked
                      <span className="overflow-hidden pointer-events-none absolute z-0 inset-0"></span>
                    </button>
                    <button
                      className={
                        "inline-flex items-center justify-center flex-shrink-0 flex-col max-w-[360px] min-w-[90px] min-h-12 px-4 py-3 text-center no-underline capitalize font-medium text-sm leading-tight bg-transparent rounded-none cursor-pointer select-none align-middle border-0 outline-none overflow-hidden whitespace-normal " +
                        (tabIdx === "2" ? "text-[#f38aff]" : "text-[#d8ddf0]")
                      }
                      onClick={(e) => handleTabChange(e, "2")}
                    >
                      Staked
                      <span className="overflow-hidden pointer-events-none absolute z-0 inset-0"></span>
                    </button>
                  </div>
                  <span
                    className={
                      "absolute h-[2px] bottom-0 w-[90px] bg-[#f38aff] transition-height-width duration-300 ease-custom " +
                      (tabIdx === "1" ? "left-0" : "left-[95.8281px]")
                    }
                  ></span>
                </div>
              </div>
            </div>
          }
          secondary={
            <>
              {selected && selected.length > 0 && (
                <>
                  <button
                    className="inline-flex items-center justify-center relative box-border tap-highlight-transparent focus:outline-none border-0 ml-4 cursor-pointer select-none align-middle appearance-none text-[0.875rem] font-medium font-inter leading-7 min-w-16 px-4 py-[6px] transition duration-250 ease-in-out text-white bg-[#D9534F] shadow-md rounded-md disabled:bg-[#FFFFFF] disabled:bg-opacity-10 disabled:text-white disabled:text-opacity-30"
                    disabled={selected && !selected.length}
                    onClick={() => unstakeSelected()}
                  >
                    Unstake ({selected.length})
                  </button>
                  <button
                    className="inline-flex items-center justify-center relative box-border tap-highlight-transparent focus:outline-none border-0 ml-4 cursor-pointer select-none align-middle appearance-none capitalize font-inter text-[0.875rem] font-medium leading-7 min-w-16 px-4 py-[6px] transition duration-250 ease-in-out text-black bg-[#F0AD4E] shadow-md rounded-md disabled:bg-[#FFFFFF] disabled:bg-opacity-10 disabled:text-white disabled:text-opacity-30"
                    disabled={selected && !selected.length}
                    onClick={() => claimSelected()}
                  >
                    Claim ({selected.length})
                  </button>
                </>
              )}
              {selectedUnstake && selectedUnstake.length > 0 && (
                <>
                  <button
                    className="inline-flex items-center justify-center relative box-border tap-highlight-transparent focus:outline-none border-0 ml-4 cursor-pointer select-none align-middle appearance-none capitalize font-inter text-sm font-medium leading-7 min-w-16 px-4 py-[6px] transition duration-250 ease-in-out text-black bg-[#F38AFF] shadow-md rounded-md disabled:bg-[#FFFFFF] disabled:bg-opacity-10 disabled:text-white disabled:text-opacity-30"
                    disabled={selectedUnstake && !selectedUnstake.length}
                    onClick={() => stakeSelected()}
                  >
                    Stake ({selectedUnstake.length})
                  </button>
                </>
              )}
              {(!selectedUnstake || selectedUnstake?.length === 0) &&
                tabIdx === "1" && (
                  <>
                    <button
                      className="inline-flex items-center justify-center relative box-border tap-highlight-transparent focus:outline-none border-0 ml-4 cursor-pointer select-none align-middle appearance-none capitalize font-inter text-sm font-medium leading-7 min-w-16 px-4 py-[6px] transition duration-250 ease-in-out text-black bg-[#F38AFF] shadow-md rounded-md disabled:bg-[#FFFFFF] disabled:bg-opacity-10 disabled:text-white disabled:text-opacity-30"
                      disabled={nftList && !nftList.length}
                      onClick={() => stakeAll()}
                    >
                      <FormattedMessage id="stake-all" />
                    </button>
                  </>
                )}
              {(!selected || selected?.length === 0) && tabIdx === "2" && (
                <>
                  <button
                    className="inline-flex items-center justify-center relative box-border tap-highlight-transparent focus:outline-none border-0 ml-4 cursor-pointer select-none align-middle appearance-none text-[0.875rem] font-medium font-inter leading-7 min-w-16 px-4 py-[6px] transition duration-250 ease-in-out text-white bg-[#D9534F] shadow-md rounded-md"
                    onClick={() => unstakeAll()}
                  >
                    <FormattedMessage id="unstake-all" />
                  </button>
                  {rewardAmount > 0 && (
                    <div className="relative flex flex-col items-center group">
                      <button
                        className="inline-flex items-center justify-center relative box-border tap-highlight-transparent focus:outline-none border-0 ml-4 cursor-pointer select-none align-middle appearance-none capitalize font-inter text-sm font-medium leading-7 min-w-16 px-4 py-[6px] transition duration-250 ease-in-out text-black bg-[#F38AFF] shadow-md rounded-md"
                        onClick={() => claimAll()}
                      >
                        <FormattedMessage id="claim-all" /> (
                        {rewardAmount.toLocaleString()} $COSMIC)
                      </button>
                      <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                        <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg rounded">
                          You may lose 25% of accumulated rewards if claiming
                          within 15 days of the original staking date.
                        </span>
                        <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                      </div>
                    </div>
                  )}
                  <button
                    className="inline-flex items-center justify-center relative box-border tap-highlight-transparent focus:outline-none border-0 ml-4 cursor-pointer select-none align-middle appearance-none capitalize font-inter text-[0.875rem] font-medium leading-7 min-w-16 px-4 py-[6px] transition duration-250 ease-in-out text-black bg-[#F0AD4E] shadow-md rounded-md"
                    onClick={() => claimAllYaku()}
                  >
                    <FormattedMessage id="claim-all" /> (
                    {yakuRewardAmount.toFixed(3).toLocaleString()} $YAKU)
                  </button>
                </>
              )}
              <button
                className="inline-flex items-center justify-center relative box-border tap-highlight-transparent focus:outline-none border-0 ml-4 cursor-pointer select-none align-middle appearance-none text-center flex-none text-2xl p-2 rounded-full overflow-visible text-white transition duration-150 ease-in-out bg-transparent"
                onClick={() => updatePage()}
              >
                <img src="/images/icons-material/RefreshOutlined.svg" />
              </button>
              <button
                className="inline-flex items-center justify-center relative box-border tap-highlight-transparent focus:outline-none border-0 ml-4 cursor-pointer select-none align-middle appearance-none capitalize font-inter text-sm font-medium leading-7 min-w-16 px-4 py-[6px] transition duration-250 ease-in-out text-black bg-[#F38AFF] shadow-md rounded-md"
                onClick={() => setShowPriorityDialog(true)}
              >
                Priority Rate
              </button>
            </>
          }
        >
          {/* Content */}
          {tabIdx === "1" && (
            <div>
              <div className="box-border flex flex-wrap mt-[-24px] w-[calc(100% + 24px)] ml-[-24px] pb-4">
                {isLoading ? (
                  [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                      key={item}
                      className="pl-6 pt-6 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full sm:w-1/2 sm:max-w-1/2 md:w-1/3 md:max-w-1/3 lg:w-1/4 lg:max-w-1/4"
                    >
                      <SkeletonProductPlaceholder />
                    </div>
                  ))
                ) : (
                  <>{nftResult}</>
                )}
              </div>
            </div>
          )}

          {tabIdx === "2" && (
            <div>
              <div className="box-border flex flex-wrap mt-[-24px] w-[calc(100% + 24px)] ml-[-24px] pb-4">
                {isLoading ? (
                  [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                      key={item}
                      className="pl-6 pt-6 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full sm:w-1/2 sm:max-w-1/2 md:w-1/3 md:max-w-1/3 lg:w-1/4 lg:max-w-1/4"
                    >
                      <SkeletonProductPlaceholder />
                    </div>
                  ))
                ) : (
                  <>
                    {stakedNftResult}
                    {stakedYakuNftResult}
                  </>
                )}
              </div>
            </div>
          )}
        </MainCard>
      </div>
    </>
  );
}

export default Staking;
