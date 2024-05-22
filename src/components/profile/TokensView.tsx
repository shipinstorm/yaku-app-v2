/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, includes, map, orderBy, round, toLower } from "lodash";

// import { ArrowDownwardOutlined } from "@mui/icons-material";

import TokenChart from "@/components/charts/TokenChart";

import { IMAGE_PROXY } from "@/config/config";

import { useYakuUSDCPrice } from "@/contexts/JupitarContext";

import { queries } from "@/graphql/graphql";

import useAuthLazyQuery from "@/hooks/useAuthLazyQuery";

const SortingArrow = ({ fieldNames, orderField, ordering }: any) => (
  <>
    {includes(fieldNames, orderField) ? (
      // <ArrowDownwardOutlined
      //   sx={{
      //     fontSize: 14,
      //     transform: ordering === "ASC" ? "rotate(180deg)" : "none",
      //   }}
      // />
      <></>
    ) : (
      <></>
    )}
  </>
);

const TokensView = ({ wallet, tabIdx }: any) => {
  const navigate = useNavigate();
  const yakuUSDCPrice = useYakuUSDCPrice();
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [priceList, setPriceList] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [orderField, setOrderField] = useState<string>("estValue");
  const [ordering, setOrdering] = useState<boolean | "asc" | "desc">("desc");
  const coinIdSymbols: Record<string, string> = {
    usdc: "usd-coin",
    usdt: "tether",
    dust: "dust-protocol",
  };
  const [getAccountTokens] = useAuthLazyQuery(queries.GET_ACCOUNT_TOKENS, {
    variables: {
      account: wallet,
    },
  });
  const [getSimplePrice] = useAuthLazyQuery(queries.GET_SIMPLE_PRICE);

  const handleFilterChange = (event: any) => {
    const {
      target: { value },
    } = event;
    if (value === orderField) {
      const newOrdering = ordering === "desc" ? "asc" : "desc";
      setOrdering(newOrdering);
      setTokenList(orderBy(tokenList, value, newOrdering));
      return;
    }
    setOrderField(value);
    setOrdering("desc");
    setTokenList(orderBy(tokenList, value, "desc"));
  };
  const updateView = async () => {
    setIsLoading(true);
    setTokenList([]);
    try {
      const { data } = await getAccountTokens({
        variables: {
          account: wallet,
        },
      });

      if (data && data?.getAccountTokens) {
        const { data: priceData } = await getSimplePrice({
          variables: {
            params: {
              ids: map(
                data?.getAccountTokens,
                ({ tokenSymbol }) =>
                  coinIdSymbols[toLower(tokenSymbol)] || toLower(tokenSymbol)
              ),
              vs_currencies: ["usd"],
            },
          },
        });
        const prices = priceData?.simplePrice?.data;
        setPriceList(prices);
        const tokens = map(
          data?.getAccountTokens,
          ({ tokenIcon, tokenName, tokenAmount, tokenSymbol }: any) => ({
            coinId: coinIdSymbols[toLower(tokenSymbol)] || toLower(tokenSymbol),
            tokenIcon,
            tokenName,
            amount: Number(tokenAmount?.uiAmount),
            estValue:
              Number(tokenAmount?.uiAmount) *
              +getCoinPrice(
                coinIdSymbols[toLower(tokenSymbol)] || toLower(tokenSymbol),
                prices
              ),
          })
        );
        setTokenList(orderBy(tokens, orderField, ordering));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCoinPrice = (coinId: string, prices = priceList) => {
    if (coinId === "yaku") {
      return yakuUSDCPrice;
    }
    return get(prices, [coinId, "usd"], 0);
  };

  useEffect(() => {
    if (wallet) {
      updateView();
    }
  }, [wallet, tabIdx]);
  return (
    <ul className="text-[#d5d9e9]">
      <li className="flex justify-between gap-1">
        <div className="w-10"></div>
        <p className="font-bold w-[30%]">Name</p>
        <p className="font-bold w-[18%] text-right"></p>
        <p
          className="font-bold w-[18%] text-right cursor-pointer"
          onClick={() => handleFilterChange({ target: { value: "amount" } })}
        >
          Amount{" "}
          <SortingArrow {...{ orderField, fieldNames: ["amount"], ordering }} />
        </p>
        <p
          className="font-bold w-[40%] text-right cursor-pointer"
          onClick={() => handleFilterChange({ target: { value: "estValue" } })}
        >
          Est. Value (USD){" "}
          <SortingArrow
            {...{ orderField, fieldNames: ["estValue"], ordering }}
          />
        </p>
      </li>
      {!isLoading
        ? map(
            tokenList,
            ({ coinId, tokenIcon, tokenName, amount, estValue }) => (
              <li className="flex justify-between gap-1 hover:bg-opacity-20 hover:bg-purple-500">
                <img
                  src={`${IMAGE_PROXY}${tokenIcon}`}
                  className="w-full h-full object-cover"
                />
                <p className="w-18">{tokenName}</p>
                <div className="w-40">
                  <TokenChart coinId={coinId} />
                </div>
                <p className="w-18 text-right">
                  {round(amount, 4).toLocaleString()}
                </p>
                <p className="w-18 text-right">
                  ${round(estValue, 4).toLocaleString()}
                </p>
              </li>
            )
          )
        : map([1, 2, 3, 4, 5, 6, 7, 8], (idx, key) => (
            <li
              key={key}
              className="flex items-center justify-between gap-1 hover:bg-d329ff15"
            >
              <div className="w-6 h-6 rounded-full"></div>
              <div className="w-[18%] h-4 rounded"></div>
              <div className="w-[40%] h-4 rounded"></div>
              <div className="w-[18%] h-4 rounded"></div>
              <div className="w-[18%] h-4 rounded"></div>
            </li>
          ))}
    </ul>
  );
};

export default TokensView;
