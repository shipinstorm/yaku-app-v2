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
            <Chip
              label={role}
              size="small"
              color="secondary"
              sx={{ mr: "5px" }}
            />
            <Chip label={rewardString} size="small" />
          </div>

          <hr className="mb-[10px] border border-[#D5D9E9] border-opacity-20" />

          <div className="box-border flex-grow max-w-full mb-[15px]">
            <Typography variant="h5" fontWeight="500">
              Staked Duration:
              <Typography
                component="span"
                variant="h4"
                fontWeight="700"
                sx={{ ml: "5px" }}
              >
                {dayjs(Date.now()).diff(stakedTime * 1000, "hours")} hours
              </Typography>
            </Typography>
          </div>

          <div className="box-border m-0 flex-grow max-w-full">
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button onClick={() => onClaim()} variant="contained" fullWidth>
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

          <div className="box-border flex-grow max-w-full pl-6 pt-6 mt-2 !mb-0 text-center">
            <Typography variant="caption">
              Staking Penalty Ends:
              <Typography
                component="span"
                variant="caption"
                fontWeight="700"
                sx={{ ml: "5px" }}
              >
                {dayjs(lockTime * 1000).format("MMMM DD, yyyy")}
              </Typography>
            </Typography>
          </div>
        </div>
      </MainCard>
    </>
  );
};

export default StakeNftCard;
