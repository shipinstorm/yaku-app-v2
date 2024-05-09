/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

// material-ui
import {
  Box,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { Image } from "mui-image";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
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
              theme.palette.mode === "dark"
                ? "#09080d"
                : theme.palette.primary.light,
            "&:hover": {
              transform: "scale3d(1.03, 1.03, 1)",
              transition: ".15s",
            },
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          <CardMedia className="min-h-[200px] flex items-center relative">
            <Image
              src={`${IMAGE_PROXY}${image}`}
              style={{ aspectRatio: "1 / 1" }}
              alt={name}
              fit="cover"
              showLoading={<Loading />}
            />
            {isSelected && (
              <div className="absolute top-4 right-0 h-8 w-8">
                <IconCircleCheck className="text-pink-main" />
              </div>
            )}
          </CardMedia>
          <CardContent className="p-2 !pb-[16px]">
            {/* name */}
            <Box display="flex" alignItems="center">
              <Typography
                fontWeight="800"
                color="secondary"
                className="text-lg block text-decoration-none mr-auto"
              >
                {name}
              </Typography>
            </Box>

            <div className="box-border flex-grow max-w-full pl-6 pt-6 mb-[10px] mt-[5px] flex justify-between">
              <FormattedMessage id="per-day">
                {(msg) => (
                  <Chip
                    icon={
                      <img
                        src={YAKU_TOKEN_ICON}
                        alt=""
                        style={{ width: 16, borderRadius: 5000 }}
                      />
                    }
                    label={`${rewardPerDayString} ${msg}`}
                    size="small"
                    color="secondary"
                  />
                )}
              </FormattedMessage>

              <Chip
                icon={
                  <img
                    src={YAKU_TOKEN_ICON}
                    alt=""
                    style={{ width: 16, borderRadius: 5000 }}
                  />
                }
                label={rewardString}
                size="small"
                color="primary"
              />
            </div>

            <Divider sx={{ mb: "10px" }} />

            <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    onClick={() => onClaim()}
                    variant="contained"
                    fullWidth
                    color="warning"
                  >
                    <FormattedMessage id="claim" />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={() => onUnstake()}
                    variant="outlined"
                    color="error"
                    fullWidth
                  >
                    <FormattedMessage id="unstake" />
                  </Button>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </MainCard>
      ) : (
        <SkeletonProductPlaceholder />
      )}
    </>
  );
};

export default YakuStakeNftCard;
