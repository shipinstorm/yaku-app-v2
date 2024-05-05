/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useParams } from "react-router-dom";
import { useRouter } from "next/navigation";

import { round } from "lodash";
import { Avatar, Box, Grid, Typography } from "@mui/material";

import { useSolPrice } from "@/contexts/CoinGecko";
import { IMAGE_PROXY } from "@/config/config";
import { formatAmount } from "@/utils/utils";
import PercentText from "@/components/PercentText";

import SolanaLogo from "assets/images/blockchains/solana-icon.svg";
import EthLogo from "assets/images/blockchains/ethereum-icon.svg";
import NFTProjectRowSkeleton from "../skeleton/NFTProjectRowSkeleton";

const NFTProjectRow = ({
  project_id,
  project,
  floor_price,
  market_cap,
  floor_price_1day_change,
  average_price,
  average_price_1day_change,
  volume_7day,
  volume_1day_change,
  percentage_of_token_listed,
  num_of_token_listed,
  isLoading,
  theme,
  index,
  page,
  pageSize,
  chain: collectionChain,
}: any) => {
  const { chain: urlChain } = useParams();
  const router = useRouter();
  const solPrice = useSolPrice();
  const chain = collectionChain || urlChain;
  if (isLoading) {
    return <NFTProjectRowSkeleton index={index} />;
  }

  return (
    <Grid
      item
      xs={12}
      sx={{
        p: { xs: 1, md: 0 },
        paddingLeft: { xs: 1, md: "0 !important" },
        paddingTop: { xs: 1, md: "0 !important" },
      }}
    >
      <div
        className="bg-elevation1 hover:bg-elevation1-hover rounded-2xl w-full mt-1 shadow-none cursor-pointer"
        onClick={() =>
          router.push(`/explore/collection/${chain}/${project_id}`)
        }
      >
        <Grid
          container
          sx={{ alignItems: "center", justifyContent: "flex-start" }}
        >
          <Grid
            item
            sx={{ textAlign: "start", paddingLeft: "10px", fontSize: "12px" }}
          >
            {(page - 1) * pageSize + (index + 1)}
          </Grid>
          <Grid item xs={2.5} sm={1} md={1.5} lg={0.5} xl={0.5} sx={{ p: 1 }}>
            <Avatar src={`${IMAGE_PROXY}${project.img_url}`} />
          </Grid>
          <Grid item xs={8} sm={4} md={3} lg={2} xl={2} sx={{ p: 1 }}>
            <Typography
              component="h6"
              fontWeight={700}
              className="truncate ..."
            >
              {project.display_name}
            </Typography>
            {Number(project.supply).toLocaleString()}
          </Grid>
          <Grid
            item
            xs={4}
            sm={2}
            md={1}
            lg={1}
            xl={1}
            sx={{ p: 1, textAlign: { xs: "end", sm: "start" } }}
          >
            <Typography
              component="p"
              sx={{ fontSize: 12, display: { xs: "initial", md: "none" } }}
              noWrap
            >
              Floor Price
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                justifyContent: { xs: "flex-end", sm: "flex-start" },
                minHeight: 24,
                lineHeight: "normal",
              }}
            >
              <Avatar
                src={chain === "SOL" ? SolanaLogo : EthLogo}
                sx={{
                  width: chain === "SOL" ? 16 : 16,
                  height: chain === "SOL" ? 16 : 16,
                  objectFit: "contain",
                  backgroundColor: "transparent",
                  borderRadius: "unset",
                  ".MuiAvatar-img": { objectFit: "contain" },
                }}
                color="inherit"
              />
              {Number(round(floor_price, 2)).toLocaleString()}
            </Box>
          </Grid>
          <Grid
            item
            xs={8}
            sm={2}
            md={2}
            lg={2}
            xl={1}
            sx={{ textAlign: "end", p: 1 }}
          >
            <Typography
              component="p"
              sx={{ fontSize: 12, display: { xs: "initial", md: "none" } }}
              noWrap
            >
              Market Cap.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-end", sm: "flex-start" },
                alignItems: "center",
                minHeight: 24,
              }}
            >
              ${formatAmount(Number(market_cap))}
            </Box>
          </Grid>
          <Grid
            item
            xs={4}
            sm={2}
            md={2}
            lg={1}
            xl={1}
            sx={{ textAlign: { xs: "end", md: "center" }, p: 1 }}
          >
            <Typography
              component="p"
              sx={{ fontSize: 12, display: { xs: "initial", md: "none" } }}
              noWrap
            >
              Floor 24h %
            </Typography>
            <PercentText percent={floor_price_1day_change} />
          </Grid>
          <Grid
            item
            xs={4}
            sm={2}
            md={1}
            lg={1}
            xl={1}
            sx={{ p: 1, textAlign: { xs: "end", sm: "center" } }}
          >
            <Typography
              component="p"
              sx={{ fontSize: 12, display: { xs: "initial", md: "none" } }}
              noWrap
            >
              Avg. Price
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                justifyContent: { xs: "flex-end", sm: "flex-start" },
                minHeight: 24,
                lineHeight: "normal",
              }}
            >
              <Avatar
                src={chain === "SOL" ? SolanaLogo : EthLogo}
                sx={{
                  width: chain === "SOL" ? 16 : 16,
                  height: chain === "SOL" ? 16 : 16,
                  objectFit: "contain",
                  backgroundColor: "transparent",
                  borderRadius: "unset",
                  ".MuiAvatar-img": { objectFit: "contain" },
                }}
                color="inherit"
              />
              {formatAmount(Number(round(average_price, 2)))}
            </Box>
          </Grid>
          <Grid
            item
            xs={4}
            sm={2}
            md={1}
            lg={1}
            xl={1}
            sx={{ textAlign: { xs: "end", sm: "center" }, p: 1 }}
          >
            <Typography
              component="p"
              sx={{ fontSize: 12, display: { xs: "initial", md: "none" } }}
              noWrap
            >
              Avg 24h %
            </Typography>
            <PercentText percent={average_price_1day_change} />
          </Grid>
          <Grid
            item
            xs={4}
            sm={2}
            md={2}
            lg={1}
            xl={1}
            sx={{ textAlign: "end", p: 1 }}
          >
            <Typography
              component="p"
              sx={{ fontSize: 12, display: { xs: "initial", md: "none" } }}
              noWrap
            >
              Vol (7D)
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                minHeight: 24,
              }}
            >
              {formatAmount(Number(volume_7day / solPrice), 2)}◎
            </Box>
          </Grid>
          <Grid
            item
            xs={4}
            sm={2}
            md={2}
            lg={1}
            xl={1}
            sx={{ textAlign: { xs: "end", sm: "center" }, p: 1 }}
          >
            <Typography
              component="p"
              sx={{ fontSize: 12, display: { xs: "initial", md: "none" } }}
              noWrap
            >
              Vol 24h %
            </Typography>
            <PercentText percent={volume_1day_change} />
          </Grid>
          <Grid
            item
            xs={4}
            sm={2}
            md={2}
            lg={1}
            xl={1}
            sx={{
              textAlign: { xs: "end", sm: "center" },
              px: { xs: 1, sm: 2, lg: 1 },
              py: 1,
            }}
          >
            <Typography
              component="p"
              sx={{ fontSize: 12, display: { xs: "initial", md: "none" } }}
              noWrap
            >
              Listed
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-end", sm: "center" },
                alignItems: "center",
                minHeight: 24,
              }}
            >
              {Number(
                round(percentage_of_token_listed * 100, 1)
              ).toLocaleString()}
              % ({num_of_token_listed})
            </Box>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export default NFTProjectRow;
