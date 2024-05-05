/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { YAKU_TOKEN_MINT } from "@/config";

export const JUPITAR_POOL_INTERVAL = 1000 * 60; // 60 sec
export const JUPITAR_QUOTE_API = "https://quote-api.jup.ag/v6/quote";
export const JUPITAR_PRICE_API = "https://price.jup.ag/v4/price";

export interface JupitarContextState {
  yakuPrice: number;
  yakuUSDCPrice: number;
}

export const yakuToSol = async (): Promise<number> => {
  const url = `${JUPITAR_PRICE_API}?ids=${YAKU_TOKEN_MINT}&vsToken=SOL`;
  const { data } = await (await fetch(url)).json();
  if (data) {
    const { price } = data;
    return price;
  }
  return 0;
};
export const yakuToUSDC = async (): Promise<number> => {
  const url = `${JUPITAR_PRICE_API}?ids=${YAKU_TOKEN_MINT}&vsToken=USDC`;
  const { data } = await (await fetch(url)).json();
  if (data) {
    const { price } = data;
    return price;
  }
  return 0;
};
export async function getCryptoPrice(cryptoName: string): Promise<number> {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoName}&vs_currencies=usd`
  );
  const data = await response.json();
  const cryptoKey = cryptoName as unknown as keyof typeof data;
  return data[cryptoKey].usd as number;
}

const JupitarContext = React.createContext<JupitarContextState | null>(null);

export function JupitarProvider({ children = null }: { children: any }) {
  const { publicKey, connected } = useWallet();

  const [yakuPrice, setYakuPrice] = useState<number>(0);
  const [yakuUSDCPrice, setYakuUSDCPrice] = useState<number>(0);

  const getYakuPrice = useCallback(async () => {
    const yakuUSDPrice = await getCryptoPrice("yaku");
    setYakuUSDCPrice(yakuUSDPrice);
  }, []);

  useEffect(() => {
    getYakuPrice();
  }, []);

  // useEffect(() => {
  //     let timerId = 0;
  //     const queryPrice = async () => {
  //         const price = await yakuToSol();
  //         setYakuPrice(price);
  //         const usdcPrice = await yakuToUSDC();
  //         setYakuUSDCPrice(usdcPrice);

  //         if (publicKey && connected) {
  //             startTimer();
  //         }
  //     };

  //     const startTimer = () => {
  //         timerId = window.setTimeout(async () => {
  //             queryPrice();
  //         }, JUPITAR_POOL_INTERVAL);
  //     };

  //     queryPrice();
  //     return () => {
  //         clearTimeout(timerId);
  //     };
  // }, [setYakuPrice]);

  // prettier-ignore
  return (
        <JupitarContext.Provider value={{ yakuPrice, yakuUSDCPrice }}>
            {children}
        </JupitarContext.Provider>
    );
}

export const useJupitar = () => {
  const context = useContext(JupitarContext);
  return context as JupitarContextState;
};

export const useYakuPrice = () => {
  const { yakuPrice } = useJupitar();
  return yakuPrice;
};

export const useYakuUSDCPrice = () => {
  const { yakuUSDCPrice } = useJupitar();
  return yakuUSDCPrice;
};
