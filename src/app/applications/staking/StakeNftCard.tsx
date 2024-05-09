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
          <CardMedia className="min-h-[200px] flex items-center relative">
            <Image
              src={`${IMAGE_PROXY}${image}`}
              alt={name}
              showLoading={<Loading />}
              style={{ aspectRatio: "1 / 1" }}
            />
            {isSelected && (
              <div className="absolute top-4 right-0 h-8 w-8">
                <IconCircleCheck className="text-pink-main" />
              </div>
            )}
          </CardMedia>
          <CardContent sx={{ p: 2, pb: "16px !important" }}>
            {/* name */}
            <Box display="flex" alignItems="center">
              <Typography
                fontWeight="800"
                color="secondary"
                sx={{
                  fontSize: "1.175rem",
                  display: "block",
                  textDecoration: "none",
                  mr: "auto",
                }}
              >
                {name}
              </Typography>
            </Box>

            <div className="box-border mb-[10px] mt-[5px] flex-grow max-w-full pl-6 pt-6">
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
                    label={`${rewardString} ${msg}`}
                    size="small"
                    color="secondary"
                  />
                )}
              </FormattedMessage>
            </div>

            <Divider sx={{ mb: "10px" }} />

            <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button variant="contained" disabled fullWidth>
                    <FormattedMessage id="claim" />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={() => onStake(mint)}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                  >
                    <FormattedMessage id="stake" />
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

export default NftCard;
