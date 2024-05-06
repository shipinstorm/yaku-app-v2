"use client";

import dynamic from "next/dynamic";

// project imports
import Locales from "@/providers/Locales";
import NavigationScroll from "@/layout/NavigationScroll";
import ThemeCustomization from "@/themes";

// third-party
import { ToastContainer } from "react-toastify";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { store } from "@/store";
import { ConfigProvider } from "@/contexts/ConfigContext";
import client from "@/config/createApolloClient";

// providers
import { MetaProvider } from "@/contexts/meta/meta";
import { CoinGeckoProvider } from "@/contexts/CoinGecko";

// auth provider
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletContext, WalletHandlerProvider } from "@/contexts/WalletContext";
import { LoaderProvider } from "@/components/loaders/BoxLoader";
import { RecoilRoot } from "recoil";
import { JupitarProvider } from "@/contexts/JupitarContext";
import { JupiterApiProvider } from "@/contexts/JupiterApiProvider";
import { TPSProvider } from "@/contexts/TPSContext";
import Composer from "@/contexts/Composer";
import { ConnectionsProvider } from "@/contexts/ConnectionsContext";
import { BundleWalletProvider } from "@/contexts/BundleWalletContext";
import { CartProvider } from "@/contexts/CartContext";
import { StakedProvider } from "@/contexts/StakedContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import EthWalletProvider from "@/contexts/EthWalletProvider";
import { SolPriorityProvider } from "@/contexts/SolPriorityContext";

import "./styles/global.scss";

const MainLayoutNoSSR = dynamic(() => import("@/layout/MainLayout"), {
  ssr: false,
});

const contexts = [
  AuthProvider,
  WalletContext,
  EthWalletProvider,
  ConnectionsProvider,
  ThemeCustomization,
  Locales,
  MetaProvider,
  WalletHandlerProvider,
  NotificationsProvider,
  CoinGeckoProvider,
  JupiterApiProvider,
  JupitarProvider,
  NavigationScroll,
  LoaderProvider,
  RecoilRoot,
  TPSProvider,
  BundleWalletProvider,
  CartProvider,
  StakedProvider,
  SolPriorityProvider,
];

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <ApolloProvider client={client}>
          <BrowserRouter>
            <Composer components={contexts}>
              <MainLayoutNoSSR>{children}</MainLayoutNoSSR>
              <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                draggable={false}
                pauseOnHover={false}
                theme="colored"
                limit={5}
              />
            </Composer>
          </BrowserRouter>
        </ApolloProvider>
      </ConfigProvider>
    </Provider>
  );
}
