// web3
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// project imports
import MainCard from "@/components/MainCard";
import { YakuStakingNftCardProps } from "@/types/staking";
import {
  loadYakuProgram,
  stakeYakuNft,
  stakeYakuPNft,
} from "@/actions/yakuStake";
import { useToasts } from "@/hooks/useToasts";
import { IMAGE_PROXY, YAKU_TOKEN_ICON } from "@/config/config";
import { FormattedMessage } from "react-intl";
import SkeletonProductPlaceholder from "@/components/skeleton/CardPlaceholder";
import Loading from "@/components/loaders/Loading";
import useConnections from "@/hooks/useConnetions";
import { IconCircleCheck } from "@tabler/icons-react";
import { usePriority } from "@/contexts/SolPriorityContext";

const NftCard = ({
  mint,
  image,
  name,
  reward,
  isPNft,
  startLoading,
  stopLoading,
  updatePage,
  isSelected,
  onSelect,
}: YakuStakingNftCardProps) => {
  const { connection } = useConnections();
  const rewardString = (+reward / LAMPORTS_PER_SOL).toFixed(2);
  const wallet: any = useAnchorWallet();
  const { showInfoToast, showTxErrorToast } = useToasts();
  const { priorityRate } = usePriority();

  const onStake = async (mintAddress: string) => {
    if (wallet?.publicKey === null) return;

    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      if (isPNft) {
        await stakeYakuPNft(
          program,
          wallet,
          new PublicKey(mintAddress),
          priorityRate
        );
      } else {
        await stakeYakuNft(program, wallet, new PublicKey(mintAddress));
      }
      showInfoToast("You have successfully staked your NFT.");
      updatePage();
    } catch (error: any) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while staking your nft, please try again."
      );
    } finally {
      stopLoading();
    }
  };
  const handleClick = () => {
    onSelect(mint);
  };

  return (
    <>
      {name ? (
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

            <div className="box-border mb-[10px] mt-[5px] flex-grow max-w-full">
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
                      {`${rewardString} ${msg}`}
                    </span>
                  </div>
                )}
              </FormattedMessage>
            </div>

            <hr className="mb-[10px] border border-[#D5D9E9] border-opacity-20" />

            <div className="box-border m-0 flex-grow max-w-full">
              <div className="flex flex-wrap -mt-2 -ml-2 w-[calc(100%+8px)]">
                <div className="pl-2 pt-2 flex-grow-0 flex-shrink-0 w-1/2 max-w-1/2">
                  <button
                    className="inline-flex items-center justify-center relative box-border select-none align-middle cursor-pointer text-base font-medium leading-tight min-w-16 w-full px-4 py-[6px] border border-transparent rounded transition duration-250 ease-in-out disabled:text-white-opacity-30 disabled:bg-white-opacity-12 disabled:shadow-none disabled:pointer-events-none disabled:cursor-default"
                    tabIndex={-1}
                    type="button"
                    disabled
                  >
                    <FormattedMessage id="claim" />
                  </button>
                </div>
                <div className="pl-2 pt-2 flex-grow-0 flex-shrink-0 w-1/2 max-w-1/2">
                  <button
                    className="inline-flex items-center justify-center relative box-border select-none align-middle cursor-pointer text-base font-medium leading-tight min-w-16 w-full px-4 py-[6px] border border-solid rounded transition duration-250 ease-in-out bg-transparent border-[#F38AFF] border-opacity-50
                    text-[#F38AFF]"
                    onClick={() => onStake(mint)}
                    tabIndex={0}
                    type="button"
                  >
                    <FormattedMessage id="stake" />
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

export default NftCard;
