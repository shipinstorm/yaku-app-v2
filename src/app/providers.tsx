"use client";

// project imports
import MainLayout from "@/layout/MainLayout";
import Locales from "@/providers/Locales";
import NavigationScroll from "@/layout/NavigationScroll";
import ThemeCustomization from "@/themes";

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
// import { MECollectionsProvider } from '@/contexts/MECollectionsContext';
import EthWalletProvider from "@/contexts/EthWalletProvider";
import { SolPriorityProvider } from "@/contexts/SolPriorityContext";

import "./styles/global.scss";

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
  // MECollectionsProvider
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
              <MainLayout />
              {children}
            </Composer>
          </BrowserRouter>
        </ApolloProvider>
      </ConfigProvider>
    </Provider>
  );
}
