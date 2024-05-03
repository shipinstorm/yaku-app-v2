/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { useRequests } from '@/hooks/useRequests';

export const TPS_POOL_INTERVAL = 1000 * 60; // 60 sec

export interface TPSContextState {
    tps: number;
    ethGas: number;
}

const TPSContext = React.createContext<TPSContextState | null>(null);

export function TPSProvider({ children = null }: { children: any }) {
    const { publicKey, connected } = useWallet();

    const [tps, setTps] = useState(0);
    const [ethGas, setEthGas] = useState(0);
    const { getEthGas } = useRequests();
    const getTps = async () => {
        try {
            const { data: tpsVal } = await axios.get('https://nft.yaku.ai/api/tps');
            return tpsVal;
        } catch (err) {
            console.error(err);
        }
        return 0;
    };
    const getEthGasFee = async () => {
        const { gas = 0 } = await getEthGas();
        return gas;
    };
    useEffect(() => {
        let timerId = 0;
        const queryPrice = async () => {
            const val = await getTps();
            setTps(val);
            const fee = await getEthGasFee();
            setEthGas(fee);

            if (publicKey && connected) {
                startTimer();
            }
        };

        const startTimer = () => {
            timerId = window.setTimeout(async () => {
                queryPrice();
            }, TPS_POOL_INTERVAL);
        };

        queryPrice();
        return () => {
            clearTimeout(timerId);
        };
    }, [setTps]);

    // prettier-ignore
    return (
        <TPSContext.Provider value={{ tps, ethGas }}>
            {children}
        </TPSContext.Provider>
    );
}

export const useTPS = () => {
    const context = useContext(TPSContext);
    return context as TPSContextState;
};

export const useETHGas = () => {
    const context = useContext(TPSContext);
    return context as TPSContextState;
};
export const useETHGasFee = () => {
    const { ethGas } = useETHGas();
    return ethGas;
};
export const useTPSValue = () => {
    const { tps } = useTPS();
    return tps;
};
