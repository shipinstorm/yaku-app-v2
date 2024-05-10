/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

// web3
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// third party
import { FormattedMessage } from "react-intl";

// project imports
import MainCard from "@/components/MainCard";
import { YakuStakedNftCardProps } from "@/types/staking";
import {
  claimYakuReward,
  loadYakuProgram,
  unstakeYakuNft,
  unstakeYakuNonCust,
  unstakeYakuPNft,
} from "@/actions/yakuStake";
import { IMAGE_PROXY, YAKU_TOKEN_ICON } from "@/config/config";
import { useToasts } from "@/hooks/useToasts";
import SkeletonProductPlaceholder from "@/components/skeleton/CardPlaceholder";
import Loading from "@/components/loaders/Loading";
import useConnections from "@/hooks/useConnetions";
import { IconCircleCheck } from "@tabler/icons-react";
import { usePriority } from "@/contexts/SolPriorityContext";
import { Palette } from "@/themes/palette";

const YakuStakeNftCard = ({
  mint,
  name,
  image,
  reward,
  isPNft,
  stakedType,
  lastClaim,
  interval,
  amount,
  startLoading,
  updatePage,
  stopLoading,
  isSelected,
  onSelect,
}: YakuStakedNftCardProps) => {
  const calcRewardAmount = () =>
    (((Math.floor(Date.now() / 1000) - lastClaim) / interval) * amount) /
    LAMPORTS_PER_SOL;
  const getRewardString = (rewardAmount: number, precision = 2) =>
    `${
      rewardAmount?.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ",") ??
      "0"
    }`;
  const rewardPerDayString = (+reward / LAMPORTS_PER_SOL).toFixed(2);
  const { connection } = useConnections();
  const wallet: any = useAnchorWallet();
  const { showInfoToast, showTxErrorToast } = useToasts();
  const [rewardString, setRewardString] = useState("0");
  const { priorityRate } = usePriority();

  const onUnstake = async () => {
    if (wallet?.publicKey === null) return;
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      if (isPNft && stakedType !== "non-custodial") {
        await unstakeYakuPNft(
          program,
          wallet,
          new PublicKey(mint),
          priorityRate
        );
      } else if (isPNft && stakedType === "non-custodial") {
        await unstakeYakuNonCust(
          program,
          wallet,
          new PublicKey(mint),
          priorityRate
        );
      } else {
        await unstakeYakuNft(program, wallet, new PublicKey(mint));
      }
      showInfoToast("You have successfully unstaked your NFT.");
      updatePage(false);
    } catch (error: any) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while unstaking your nft, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  // Claiming
  const tryClaimRewards = async () => {
    if (wallet?.publicKey === null) return;
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      await claimYakuReward(program, wallet, new PublicKey(mint), priorityRate);
      showInfoToast("You have successfully claimed your NFTs reward.");
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

  const onClaim = async () => {
    if (wallet?.publicKey === null) return;
    try {
      await tryClaimRewards();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    onSelect(mint);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRewardString(getRewardString(calcRewardAmount()));
    }, 1000);
    return () => clearInterval(timer);
  }, [mint]);

  return (
    <>
      {name ? (
        <MainCard
          content={false}
          boxShadow
          useBackdropFilter={false}
          sx={{
            background:
              Palette.mode === "dark" ? "#09080d" : Palette.primary.light,
            "&:hover": {
              transform: "scale3d(1.03, 1.03, 1)",
              transition: ".15s",
            },
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          <div className="min-h-[200px] flex items-center relative bg-cover bg-no-repeat bg-center">
            <img
              src={`${IMAGE_PROXY}${image}`}
              alt={name}
              // showLoading={<Loading />}
              className="relative w-full h-full transition-opacity duration-1500 ease-in-out opacity-100 aspect-w-1 aspect-h-1 animate-materialize"
              style={{ aspectRatio: "1 / 1" }}
            />
            {isSelected && (
              <div className="absolute top-4 right-0 h-8 w-8">
                <IconCircleCheck className="text-pink-main" />
              </div>
            )}
          </div>
          <div className="!p-4">
            {/* name */}
            <div className="flex items-center">
              <p className="m-0 mr-auto leading-tight font-bold text-[#F38AFF] text-lg">
                {name}
              </p>
            </div>

            <div className="box-border flex-grow max-w-full mb-[10px] mt-[5px] flex justify-between">
              <FormattedMessage id="per-day">
                {(msg) => (
                  <div className="max-w-full text-xs inline-flex items-center justify-center h-6 text-black text-opacity-85 bg-[#F38AFF] rounded-full whitespace-nowrap transition duration-300 ease-in-out cursor-default focus:outline-none border-0 p-0">
                    <img
                      className="w-4 ml-1 -mt-1 text-lg h-auto"
                      src={YAKU_TOKEN_ICON}
                      alt=""
                      style={{ borderRadius: 5000 }}
                    />
                    <span className="overflow-hidden whitespace-nowrap px-2 truncate">
                      {`${rewardPerDayString} ${msg}`}
                    </span>
                  </div>
                )}
              </FormattedMessage>

              <div className="max-w-full text-xs inline-flex items-center justify-center h-6 text-white bg-[#606D88] rounded-full whitespace-nowrap transition duration-300 ease-in-out cursor-default focus:outline-none border-0 p-0">
                <img
                  className="w-4 ml-1 -mt-1 text-lg h-auto"
                  src={YAKU_TOKEN_ICON}
                  alt=""
                  style={{ borderRadius: 5000 }}
                />
                <span className="overflow-hidden whitespace-nowrap px-2 truncate">
                  {rewardString}
                </span>
              </div>
            </div>

            <hr className="mb-[10px] border border-[#D5D9E9] border-opacity-20" />

            <div className="box-border m-0 flex-grow max-w-full">
              <div className="flex flex-wrap -mt-2 -ml-2 w-[calc(100%+8px)]">
                <div className="pl-2 pt-2 flex-grow-0 flex-shrink-0 w-1/2 max-w-1/2">
                  <button
                    className="inline-flex items-center justify-center relative box-border select-none align-middle cursor-pointer text-base font-medium leading-tight min-w-16 w-full px-4 py-[6px] border border-transparent rounded transition duration-250 ease-in-out bg-[#F0AD4E]"
                    tabIndex={0}
                    type="button"
                    onClick={() => onClaim()}
                  >
                    <FormattedMessage id="claim" />
                  </button>
                </div>
                <div className="pl-2 pt-2 flex-grow-0 flex-shrink-0 w-1/2 max-w-1/2">
                  <button
                    className="inline-flex items-center justify-center relative box-border select-none align-middle cursor-pointer text-base font-medium leading-tight min-w-16 w-full px-4 py-[6px] border border-solid rounded transition duration-250 ease-in-out bg-transparent border-[#D9534F] border-opacity-50
                    text-[#D9534F]"
                    onClick={() => onUnstake()}
                    tabIndex={0}
                    type="button"
                  >
                    <FormattedMessage id="unstake" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </MainCard>
      ) : (
        <SkeletonProductPlaceholder />
      )}
    </>
  );
};

export default YakuStakeNftCard;
