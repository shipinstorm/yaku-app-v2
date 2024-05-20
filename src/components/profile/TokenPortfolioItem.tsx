/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { get, isObject, round } from "lodash";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import { Avatar, ListItem, Typography } from "@mui/material";

import NFTProjectPlaceholder from "@/components/skeleton/NFTProjectPlaceholder";

import { IMAGE_PROXY } from "@/config/config";

import { useSolPrice } from "@/contexts/CoinGecko";

import { queries } from "@/graphql/graphql";

import useAuthLazyQuery from "@/hooks/useAuthLazyQuery";

dayjs.extend(relativeTime);

const TokenPortfolioItem = ({
  image,
  name,
  blockTime,
  buyIn,
  txHash,
  collection,
  floor_price,
}: any) => {
  const [itemData, setItemData] = useState<any>();
  const solPrice = useSolPrice();
  const [getCoinHistory] = useAuthLazyQuery(queries.GET_COIN_HISTORY);
  const getSolanaHist = async (date: string) => {
    const { data: coinHist } = await getCoinHistory({
      variables: {
        coinId: "solana",
        params: {
          date,
        },
      },
    });
    return coinHist?.fetchHistory?.data;
  };
  const getPortfolioData = async () => {
    const date = dayjs.unix(blockTime).format("DD-MM-YYYY");
    const { market_data } = await getSolanaHist(date);
    const { current_price } = market_data || {};
    const { usd = 0 } = current_price || {};
    setItemData({
      image,
      name,
      buyIn,
      txHash,
      blockTime,
      date,
      buyInUsd: usd * buyIn,
      floor_price,
    });
  };
  useEffect(() => {
    getPortfolioData();
  }, [txHash]);
  return (
    <ListItem
      sx={{
        gap: 1,
        justifyContent: "space-between",
        "&:hover": {
          backgroundColor: "#d329ff15",
        },
      }}
    >
      {itemData ? (
        <>
          <Avatar
            src={`${IMAGE_PROXY}${image}`}
            sx={{ backgroundColor: "transparent" }}
          />
          <Typography component="p" sx={{ width: "18%" }} noWrap>
            {name}
          </Typography>
          <Typography component="p" sx={{ width: "18%" }} noWrap>
            {isObject(collection) ? get(collection, "name") : collection}
          </Typography>
          <Typography
            component="p"
            sx={{ width: "12%", textAlign: "end" }}
            noWrap
          >
            {round(Number(itemData.buyIn), 3).toLocaleString()} ◎
          </Typography>
          <Typography
            component="p"
            sx={{ width: "12%", textAlign: "end" }}
            noWrap
          >
            ${round(Number(itemData.buyInUsd), 2).toLocaleString()}
          </Typography>
          <Typography
            component="p"
            sx={{
              width: "12%",
              textAlign: "end",
            }}
            color={
              Number(
                ((itemData.floor_price * solPrice - itemData.buyInUsd) /
                  itemData.buyInUsd) *
                  100
              ) > 0
                ? "success.dark"
                : "error"
            }
            noWrap
          >
            {round(
              Number(
                ((itemData.floor_price * solPrice - itemData.buyInUsd) /
                  itemData.buyInUsd) *
                  100
              ),
              2
            ).toLocaleString()}{" "}
            %
          </Typography>
          <Typography component="p" sx={{ width: "14%" }}>
            {dayjs.unix(itemData.blockTime).fromNow()}
          </Typography>
          <Typography
            component="a"
            href={`https://solscan.io/tx/${itemData.txHash}`}
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
        </>
      ) : (
        <NFTProjectPlaceholder />
      )}
    </ListItem>
  );
};
export default TokenPortfolioItem;
