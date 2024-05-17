import dayjs from "dayjs";

// web3
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

// project imports
import MainCard from "@/components/MainCard";
import { StakedNftCardProps } from "@/types/staking";
import { roleRewards } from "@/utils/utils";
import { claimReward, withdrawNft } from "@/actions/stake";
import { useToasts } from "@/hooks/useToasts";

// third-party
import { FormattedMessage } from "react-intl";
import { IMAGE_PROXY } from "@/config/config";
import Loading from "@/components/loaders/Loading";
import useConnections from "@/hooks/useConnetions";

const StakeNftCard = ({
  mint,
  name,
  image,
  role,
  lockTime,
  stakedTime,
  startLoading,
  stopLoading,
  updatePage,
}: StakedNftCardProps) => {
  const reward = roleRewards.find((rRole) => rRole.roles.includes(role));
  const rewardString = `${reward?.dailyReward} $COSMIC / DAY`;
  const { connection } = useConnections();
  const wallet = useWallet();
  const { showInfoToast } = useToasts();

  const onUnstake = async () => {
    try {
      startLoading();
      await withdrawNft(connection, wallet, new PublicKey(mint));
      showInfoToast("You have successfully unstaked your NFT.");
    } catch (error) {
      console.error(error);
    } finally {
      updatePage();
      stopLoading();
    }
  };

  // Claiming
  const tryClaimRewards = async () => {
    try {
      startLoading();
      await claimReward(connection, wallet, new PublicKey(mint));
      showInfoToast("You have successfully claimed your NFTs reward.");
    } catch (error) {
      console.error(error);
    } finally {
      updatePage();
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

  return (
    <>
      <MainCard
        content={false}
        boxShadow
        useBackdropFilter={false}
        sx={{
          background: "#09080d",
          "&:hover": {
            transform: "scale3d(1.03, 1.03, 1)",
            transition: ".15s",
          },
        }}
      >
        <div className="min-h-[200px] flex items-center relative bg-cover bg-no-repeat bg-center">
          <img
            src={`${IMAGE_PROXY}${image}`}
            alt={name}
            // showLoading={<Loading />}
            className="relative w-full h-full transition-opacity duration-1500 ease-in-out opacity-100 aspect-w-1 aspect-h-1 animate-materialize"
            style={{ aspectRatio: "1 / 1" }}
          />
        </div>
        <div className="!p-4">
          {/* name */}
          <div className="flex items-center">
            <p className="m-0 mr-auto leading-tight font-bold text-[#F38AFF] text-lg">
              {name}
            </p>
          </div>

          <div className="box-border flex-grow max-w-full mb-[10px] mt-[5px]">
            <div className="flex">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800 mr-1">
                {role}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                {rewardString}
              </span>
            </div>
          </div>

          <hr className="mb-[10px] border border-[#D5D9E9] border-opacity-20" />

          <div className="box-border flex-grow max-w-full mb-[15px]">
            <div className="flex items-center">
              <h5 className="text-lg font-medium">Staked Duration:</h5>
              <span className="text-xl font-semibold ml-1">
                {dayjs(Date.now()).diff(stakedTime * 1000, "hours")} hours
              </span>
            </div>
          </div>

          <div className="box-border m-0 flex-grow max-w-full">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => onClaim()}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full w-full"
              >
                <FormattedMessage id="claim" />
              </button>
              <button
                onClick={() => onUnstake()}
                className="border border-red-500 text-red-500 font-bold py-2 px-4 rounded-full w-full"
              >
                <FormattedMessage id="unstake" />
              </button>
            </div>
          </div>

          <div className="box-border flex-grow max-w-full pl-6 pt-6 mt-2 !mb-0 text-center">
            <p className="text-xs">
              Staking Penalty Ends:{" "}
              <span className="font-semibold ml-1">
                {dayjs(lockTime * 1000).format("MMMM DD, yyyy")}
              </span>
            </p>
          </div>
        </div>
      </MainCard>
    </>
  );
};

export default StakeNftCard;
