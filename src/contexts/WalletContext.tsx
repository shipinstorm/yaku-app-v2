"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import {
  FC,
  ReactNode,
  useState,
  useCallback,
  useEffect,
  useMemo,
  createContext,
} from "react";
import { useSearchParams } from "react-router-dom";
import { useRouter } from "next/navigation";

import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import { map, uniqBy } from "lodash";

// project imports
import { DEFAULT_RPC, USE_QUIKNODE } from "@/config/config";
import { useToasts } from "@/hooks/useToasts";
import useAuth from "@/hooks/useAuth";
import useGame from "@/hooks/useGame";
import { selectFastestRpc } from "@/actions/shared";
import { shortenAddress } from "@/utils/utils";
import { useDispatch } from "@/store";
import { updateHasWorkspace } from "@/store/slices/menu";

// web3 imports
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
  TokenPocketWalletAdapter,
  WalletConnectWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useEthcontext } from "./EthWalletProvider";
import WalletLogin from "@/components/authentication/WalletLogin";
import { useRequests } from "@/hooks/useRequests";
import { isMobile } from "react-device-detect";
import useLocalStorage from "@/hooks/useLocalStorage";

export const WalletsContext = createContext<any>(null);
export const WalletHandlerProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();
  const wallet = useWallet();
  const router = useRouter();
  const { publicKey } = wallet;
  const auth = useAuth();
  const game = useGame();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [connected, setConnected] = useState(!!publicKey);
  const [exCode, setExCode] = useState("");
  const [open, setOpen] = useState(false);
  const [needSign, setNeedSign] = useState(false);
  const [canDismiss, setCanDismiss] = useState(true);
  const [hideEthButton, setHideEthButton] = useState(false);
  const [addressType, setAddressType] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const { showInfoToast, showWarningToast } = useToasts();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    getSubwallet,
    getAllWorkspaces,
    getAllWorkspacesByUser,
    login,
    connectDiscord,
    connectTwitter,
  } = useRequests();
  // Metamask context
  const { ethAddress, ethConnected } = useEthcontext();
  const [workspace, setWorkspace, removeWorkspace] = useLocalStorage(
    "workspace",
    {}
  );

  const attemptLogin = async (slient = true) => {
    if (publicKey && !auth.isAttempting) {
      try {
        auth.attempting(true);
        const data = await login({ wallet: publicKey.toBase58(), ethAddress });
        if (data?.token) {
          auth.signin(data.token, publicKey.toBase58());
          auth.setUserData(data.user);
          if (publicKey && !slient) {
            showInfoToast(
              `Connected to wallet ${shortenAddress(publicKey.toBase58())}`
            );
          } else if (ethAddress && !slient) {
            showInfoToast(`Connected to wallet ${shortenAddress(ethAddress)}`);
          }
          setConnected(!!publicKey || ethConnected);
          if (
            searchParams &&
            searchParams.get("code") &&
            (auth.token || data.token)
          ) {
            const code = searchParams.get("code") || exCode;
            const state = searchParams?.get("state");
            if (code) {
              console.log("Wallet is connected, with Code:", code);
              setExCode(code);
              if (state === "connect-twitter") {
                connectTwitter({
                  address: publicKey.toBase58(),
                  code,
                  redirectUri: window.location.origin,
                }).then((resp: any) => {
                  if (resp) {
                    auth.setUserData(resp);
                  }
                });
              } else {
                connectDiscord({
                  address: publicKey.toBase58(),
                  code,
                  redirectUri: window.location.origin,
                }).then((resp: any) => {
                  if (resp && resp.discordAuth) {
                    auth.setUserData(resp.discordAuth);
                  }
                });
              }
            }
          }
          const subwallets = await getSubwallet({ user: data.user.id });
          if (subwallets) {
            auth.setUserData({
              ...data.user,
              wallets: map(subwallets, ({ wallet: address }: any) => address),
            });
          }
        }
      } catch (error) {
        console.error(error);
        showWarningToast("Failed attempt auto login.");
      } finally {
        auth.attempting(false);
      }
    }
  };

  const attemptLoginEth = async (slient = true) => {
    if (ethAddress && !auth.isAttempting) {
      try {
        handleClose("attemptLoginEth");
        auth.attempting(true);
        const data = await login({
          ethAddress,
          wallet: auth.myPublic || publicKey?.toBase58(),
        });
        if (data?.token) {
          auth.signin(data.token);
          auth.setUserData(data.user);
          if (ethAddress && !slient) {
            showInfoToast(`Connected to wallet ${shortenAddress(ethAddress)}`);
          }
        }
      } catch (error) {
        console.error(error);
        showWarningToast("Failed attempt auto login with Eth.");
      } finally {
        auth.attempting(false);
      }
    }
  };

  const handleClose = (caller?: string) => {
    console.debug("handleClose", caller);
    setOpen(false);
    auth.attempting(false);
    if (caller !== "self" && !publicKey) {
      router.push("/home");
    }
  };

  useEffect(() => {
    if (!isMobile && (!ethAddress || ethConnected)) {
      attemptLoginEth();
    }
  }, [ethConnected, ethAddress]);

  const checkWallet = () => {
    auth.attempting(!publicKey && !connected && !auth.isAttempting);
    setOpen(!publicKey && !connected && !auth.isAttempting);
  };

  useEffect(() => {
    if (!publicKey && connected) {
      showInfoToast("Disconnected from wallet");
      removeWorkspace();
      dispatch(updateHasWorkspace(false));
      auth.logout();
    }
    console.debug({
      publicKey,
      connected,
      token: auth.token,
      isAttempting: auth.isAttempting,
    });

    if (publicKey && connected) {
      fetchWorkpacesCount();

      if (!auth.token) {
        const jwt = localStorage.getItem("yaku-lemonade");
        if (jwt) {
          auth.signin(jwt, publicKey.toBase58());
        }
        console.debug("Auto login");
        handleClose("self");
        attemptLogin();
      }
    }
    setConnected(!!publicKey);
  }, [publicKey, connected]);

  const fetchWorkpacesCount = async () => {
    if (publicKey) {
      try {
        // console.debug('WORKSPACES_COUNT_FETCHING...');
        // const ownedWorkspaces = await getAllWorkspaces({ owner: publicKey.toBase58() });
        // const relatedWorkspaces = await getAllWorkspacesByUser({ user: publicKey.toBase58() });
        // console.debug('OWNED WORKSPACES: ', ownedWorkspaces);
        // console.debug('RELATED WORKSPACES: ', relatedWorkspaces);
        // const myWorkspaces = uniqBy([...(ownedWorkspaces || []), ...(relatedWorkspaces || [])], '_id');
        // setWorkspaces(myWorkspaces);
        // console.debug('WORKSPACES_COUNT: ', myWorkspaces?.length);
        // if (myWorkspaces?.length > 0) {
        //     dispatch(updateHasWorkspace(true));
        // } else {
        //     dispatch(updateHasWorkspace(false));
        // }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const showLoginDialog = (
    requireSign = true,
    allowDismiss = true,
    hideEth = false,
    addressType = true,
    stepNumber = 0,
  ) => {
    setNeedSign(requireSign);
    setCanDismiss(allowDismiss);
    setHideEthButton(hideEth);
    setOpen(true);
    setAddressType(addressType);
    setStepNumber(stepNumber);
    console.debug({ needSign, canDismiss, open, hideEthButton });
  };

  useEffect(() => {
    console.debug({ needSign, canDismiss, open });
  }, [open]);

  return (
    <WalletsContext.Provider
      value={{
        checkWallet,
        handleClose,
        attemptLoginEth,
        attemptLogin,
        showLoginDialog,
        workspaces,
        fetchWorkpacesCount,
      }}
    >
      {children}
      <Dialog
        open={open}
        disableEscapeKeyDown={canDismiss}
        fullScreen={fullScreen}
        sx={{ ".MuiPaper-root": { p: 0, backgroundColor: "transparent" } }}
        keepMounted
      >
        <WalletLogin
          open={open}
          dismiss={canDismiss && handleClose}
          requireSign={needSign}
          hideEthButton={hideEthButton}
          addressType={addressType}
          stepNumber={stepNumber}
        />
      </Dialog>
    </WalletsContext.Provider>
  );
};

export const WalletContext: FC<{ children: ReactNode }> = ({ children }) => {
  const PERFORM_SPEED_TEST = false;
  const network = WalletAdapterNetwork.Mainnet;
  const [selectedEndpt, setSelectedEndpt] = useState(
    USE_QUIKNODE ? DEFAULT_RPC : clusterApiUrl(network)
  );
  const endpoint = useMemo(() => selectedEndpt, [selectedEndpt]);
  const { showErrorToast, showTxErrorToast, showInfoToast } = useToasts();

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new TorusWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new LedgerWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter(),
      new TokenPocketWalletAdapter(),
      new WalletConnectWalletAdapter({ network, options: {} }),
    ],
    [network]
  );

  const selectEndpoint = async () => {
    let selectedNode = USE_QUIKNODE ? DEFAULT_RPC : clusterApiUrl(network);
    if (PERFORM_SPEED_TEST) {
      selectedNode = (await selectFastestRpc()).uri;
    }
    setSelectedEndpt(selectedNode);
  };

  const onError = useCallback((error: WalletError) => {
    // custom handling for Slope since it doesn't return a message
    switch (error.name) {
      case "WalletAccountError":
        showErrorToast(`The request was rejected, please try again.`);
        break;
      case "WalletNotSelectedError":
        showInfoToast(`Wallet has not been selected.`);
        break;
      default:
        showTxErrorToast(error);
        break;
    }
  }, []);

  useEffect(() => {
    selectEndpoint();
  }, [network]);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{ confirmTransactionInitialTimeout: 240000 }}
    >
      <WalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={!isMobile}
      >
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
