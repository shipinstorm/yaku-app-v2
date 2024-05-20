/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Promise } from "bluebird";
import { find, map, round, uniq } from "lodash";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
  Avatar,
  Box,
  LinearProgress,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";

import { IMAGE_PROXY } from "@/config/config";

import { useRequests } from "@/hooks/useRequests";

import { getMarketplaceIcon, shortenAddress } from "@/utils/utils";

dayjs.extend(relativeTime);

const getStatusLabel = (type: string) => {
  switch (type) {
    case "bid":
      return "Placed Bid";
    case "list":
      return "Listed";
    case "buyNow":
      return "Bought";
    case "cancelBid":
      return "Cancelled Bid";
    case "delist":
      return "Delisted";
    default:
      return "Unknown";
  }
};

const MEActivitiesList = ({ wallet, tabIdx }: any) => {
  const { fetchMetadatas, getWalletActivities } = useRequests();
  const [list, setList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTokensData = async (walletHist: any[]) => {
    try {
      const mintList = uniq(map(walletHist, ({ tokenMint }: any) => tokenMint));
      const metadatas = await fetchMetadatas({
        mint: mintList,
      });
      const digestedList = await Promise.mapSeries(
        walletHist,
        async (item: any) => ({
          ...item,
          ...(find(metadatas, ({ mint }: any) => mint === item.tokenMint) || {})
            .metadata?.json,
        })
      );
      setList(digestedList);
    } catch (error) {
      console.error(error);
    }
  };

  const updateView = async () => {
    setIsLoading(true);
    const data = await getWalletActivities({
      wallet,
      offset: 0,
      limit: 10,
    });
    if (data) {
      await getTokensData(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    updateView();
  }, [wallet, tabIdx]);

  return (
    <List>
      <ListItem
        sx={{
          gap: 1,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: 40 }} />
        <Typography component="p" sx={{ width: "18%" }} fontWeight={700} noWrap>
          Name
        </Typography>
        <Typography
          component="p"
          sx={{ width: "12%", textAlign: "end" }}
          fontWeight={700}
          noWrap
        >
          Price
        </Typography>
        <Typography
          component="p"
          sx={{ width: "14%", textAlign: "start" }}
          fontWeight={700}
          noWrap
        >
          Buyer
        </Typography>
        <Typography
          component="p"
          sx={{ width: "14%", textAlign: "start" }}
          fontWeight={700}
          noWrap
        >
          Seller
        </Typography>
        <Box sx={{ width: 20 }} />
        <Typography component="p" sx={{ width: "14%" }} fontWeight={700}>
          Time
        </Typography>
        <Box sx={{ width: 20 }} />
        <Typography component="p" sx={{ minWidth: "18%" }} fontWeight={700}>
          Status
        </Typography>
      </ListItem>
      {!isLoading ? (
        map(
          list,
          ({
            signature,
            type,
            source,
            image,
            name,
            blockTime,
            buyer,
            seller,
            price,
          }) => (
            <ListItem
              sx={{
                gap: 1,
                justifyContent: "space-between",
                "&:hover": {
                  backgroundColor: "#d329ff15",
                },
              }}
            >
              <Avatar src={`${IMAGE_PROXY}${image}`} />
              <Typography component="p" sx={{ width: "18%" }} noWrap>
                {name}
              </Typography>
              <Typography
                component="p"
                sx={{ width: "12%", textAlign: "end" }}
                noWrap
              >
                {round(Number(price), 3).toLocaleString()} ◎
              </Typography>

              <Typography
                component="p"
                sx={{ width: "14%", textAlign: "start" }}
                noWrap
              >
                {shortenAddress(buyer || "")}
              </Typography>
              <Typography
                component="p"
                sx={{ width: "14%", textAlign: "start" }}
                noWrap
              >
                {shortenAddress(seller || "")}
              </Typography>

              <Tooltip title={source}>
                <Avatar
                  src={getMarketplaceIcon(source)}
                  sx={{
                    width: 20,
                    height: 20,
                    border: "none",
                    backgroundColor: "transparent",
                  }}
                />
              </Tooltip>
              <Typography component="p" sx={{ width: "14%" }}>
                {dayjs.unix(blockTime).fromNow()}
              </Typography>
              <Typography
                component="a"
                href={`https://solscan.io/tx/${signature}`}
                target="_blank"
              >
                <Avatar
                  src="/images/icons/solscan.png"
                  sx={{
                    width: 20,
                    height: 20,
                    border: "none",
                    backgroundColor: "transparent",
                  }}
                />
              </Typography>
              <Typography component="p" sx={{ minWidth: "18%" }}>
                {getStatusLabel(type)}
              </Typography>
            </ListItem>
          )
        )
      ) : (
        <LinearProgress color="secondary" />
      )}
    </List>
  );
};
export default MEActivitiesList;
