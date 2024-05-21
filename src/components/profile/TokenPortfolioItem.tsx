/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { get, isObject, round } from "lodash";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

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
    <div className="flex gap-1 justify-between hover:bg-opacity-20 hover:bg-purple-600">
      {itemData ? (
        <>
          <img
            src={`${IMAGE_PROXY}${image}`}
            alt="Avatar"
            className="bg-transparent w-10"
          />
          <p className="w-[18%]">{name}</p>
          <p className="w-[18%]">
            {isObject(collection) ? get(collection, "name") : collection}
          </p>
          <p className="w-[12%] text-right">
            {round(Number(itemData.buyIn), 3).toLocaleString()} ◎
          </p>
          <p className="w-[12%] text-right">
            ${round(Number(itemData.buyInUsd), 2).toLocaleString()}
          </p>
          <p
            className="w-[12%] text-right"
            // style={{
            //   color:
            //     Number(
            //       ((itemData.floor_price * solPrice - itemData.buyInUsd) /
            //         itemData.buyInUsd) *
            //         100
            //     ) > 0
            //       ? "var(--success-dark)"
            //       : "var(--error)",
            // }}
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
          </p>
          <p className="w-[14%]">{dayjs.unix(itemData.blockTime).fromNow()}</p>
          <a href={`https://solscan.io/tx/${itemData.txHash}`} target="_blank">
            <img
              src="/images/icons/solscan.png"
              alt="Solscan"
              className="w-5 h-5 border-none bg-transparent"
            />
          </a>
        </>
      ) : (
        <NFTProjectPlaceholder />
      )}
    </div>
  );
};
export default TokenPortfolioItem;
