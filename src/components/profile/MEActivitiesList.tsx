/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Promise } from "bluebird";
import { find, map, round, uniq } from "lodash";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Tooltip } from "@material-tailwind/react";

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
    <ul>
      <li className="flex justify-between gap-1">
        <div className="w-10"></div>
        <p className="font-bold w-[18%]">Name</p>
        <p className="font-bold w-[12%] text-right">Price</p>
        <p className="font-bold w-[14%]">Buyer</p>
        <p className="font-bold w-[14%]">Seller</p>
        <div className="w-5"></div>
        <p className="w-[14%] font-bold">Time</p>
        <div className="w-5"></div>
        <p className="min-w-[18%] font-bold">Status</p>
      </li>
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
            <li className="flex justify-between gap-1 hover:bg-purple-100">
              <img src={`${IMAGE_PROXY}${image}`} className="w-full h-full" />
              <p className="w-[18%] break-words">{name}</p>
              <p className="w-[12%] text-right break-words">
                {round(Number(price), 3).toLocaleString()} ◎
              </p>

              <p className="w-[14%] break-words text-start">
                {shortenAddress(buyer || "")}
              </p>
              <p className="w-[14%] break-words text-start">
                {shortenAddress(seller || "")}
              </p>

              <Tooltip content={source}>
                <img src={getMarketplaceIcon(source)} className="w-5 h-5" />
              </Tooltip>
              <p className="w-[14%]">{dayjs.unix(blockTime).fromNow()}</p>
              <div className="flex items-center">
                <a href="https://solscan.io/tx/${signature}" target="_blank">
                  <img src="/images/icons/solscan.png" className="w-5 h-5" />
                </a>
                <p className="min-w-[18%]">${getStatusLabel(type)}</p>
              </div>
            </li>
          )
        )
      ) : (
        <div className="h-4 bg-primary-light rounded-full overflow-hidden">
          <div className="h-full bg-secondary"></div>
        </div>
      )}
    </ul>
  );
};
export default MEActivitiesList;
