/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

// material-ui
import { styled, useTheme, Theme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
// import { Menu } from '@mui/icons-material';

// project imports
import Header from "./Header";
import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";
// import Cart from './Cart';
import navigation from "@/menu-items";
import useConfig from "@/hooks/useConfig";
import { drawerWidth, cartWidth, drawerWidthCollapsed } from "@/store/constant";
import { activeItem } from "@/store/slices/menu";
import { useDispatch, useSelector } from "@/store";
// assets
import { useEthPrice, useSolPrice } from "@/contexts/CoinGecko";
import { useYakuPrice, useYakuUSDCPrice } from "@/contexts/JupitarContext";
import { useETHGasFee, useTPSValue } from "@/contexts/TPSContext";
import { useCartItems } from "@/contexts/CartContext";
import { useWallet } from "@solana/wallet-adapter-react";
import useAuth from "@/hooks/useAuth";
import dayjs from "dayjs";
import { useMeta } from "@/contexts/meta/meta";
import { get, isFunction } from "lodash";
import { useRequests } from "@/hooks/useRequests";
import ProfileSection from "./Header/ProfileSection";
// import MobileFooter from './MobileFooter';
import { setPage } from "@/store/slices/subpageSlice";
import VideoSlidesBackground from "./VideoSlidesBackground";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRequest } from "ahooks";
import useRelay from "@/hooks/useRelay";
import YakuBuyLink from "./YakuBuyLink";

const BreadcrumbsNoSSR = dynamic(() => import("@/components/Breadcrumbs"), {
  ssr: false,
});

interface MainStyleProps {
  theme: Theme;
  open: boolean;
  openedcart: boolean;
}

// styles
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open, openedcart }: MainStyleProps) => ({
    ...theme.typography.mainContent,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeInOut,
      duration: 400,
    }),
    paddingTop: "18px",
    ...(!open && {
      [theme.breakpoints.up("md")]: {
        marginLeft: -drawerWidth + drawerWidthCollapsed,
        marginRight: openedcart && cartWidth,
        width: `calc(100% - ${drawerWidthCollapsed}px - ${
          openedcart ? cartWidth : 0
        }px)`,
      },
      [theme.breakpoints.down("md")]: {
        marginLeft: "20px",
        width: `calc(100% - ${drawerWidthCollapsed}px - ${
          openedcart ? cartWidth : 0
        }px)`,
        padding: "16px",
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: "10px",
        width: `calc(100% - ${drawerWidthCollapsed}px - ${
          openedcart ? cartWidth : 0
        }px)`,
        padding: "16px",
        marginRight: "10px",
      },
    }),
    ...(open && {
      marginLeft: 0,
      width: `calc(100% - ${drawerWidth}px - ${openedcart ? cartWidth : 0}px)`,
      [theme.breakpoints.down("md")]: {
        marginLeft: "20px",
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: "10px",
      },
    }),
  })
);

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const theme = useTheme();
  const auth = useAuth();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("lg"));
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));

  const wallet = useWallet();
  const dispatch = useDispatch();
  const solPrice = useSolPrice() || 0;
  const ethPrice = useEthPrice() || 0;
  const yakuPrice = useYakuPrice() || 0;
  const yakuUSDCPrice = useYakuUSDCPrice() || 0;
  const { drawerOpen } = useSelector<any>((state: any) => state.menu);
  const { container } = useConfig();
  const tps = useTPSValue();
  const ethGas = useETHGasFee();
  const { sticky } = useMeta();

  const [searchParams] = useSearchParams();
  const router = useRouter();
  const [exCode, setExCode] = useState("");
  const { csrf, connectDiscord, connectTwitter, getDashboardSlides } =
    useRequests();
  const { isOpen } = useCartItems();
  const [scrolling, setScrolling] = useState(false);
  const [cacheDashboardSlides, setDashboardSlides] = useLocalStorage(
    "dashboardSlides",
    {}
  );
  const { EXTENSION_ID, processWalletConnection, setHasExtension } = useRelay();

  const { data: dashboardSlides, loading: isLoading } = useRequest(
    getDashboardSlides,
    {
      cacheKey: "dashboardSlides",
      setCache: (data) => setDashboardSlides(data),
      getCache: () => cacheDashboardSlides,
    }
  );
  useEffect(() => {
    const code = searchParams?.get("code") || exCode;
    const state = searchParams?.get("state");
    if (code && auth.token) {
      console.log("Wallet is connected, with Code:", code);
      setExCode(code);
      if (state === "connect-twitter") {
        connectTwitter({
          address: wallet?.publicKey?.toBase58()!,
          code,
          redirectUri: window.location.origin,
        }).then((resp) => {
          if (resp) {
            auth.setUserData(resp);
          }
        });
      } else {
        connectDiscord({
          address: wallet?.publicKey?.toBase58()!,
          code,
          redirectUri: window.location.origin,
        }).then((resp) => {
          if (resp) {
            auth.setUserData(resp);
          }
        });
      }
    }
  }, [auth.token]);

  useEffect(() => {
    console.log("Starting the host...");
    const isChrome =
      !!get(window, "chrome") &&
      (!!get(window, "chrome.webstore") || !!get(window, "chrome.runtime"));

    // if (isChrome && typeof get(window, "chrome") !== "undefined") {
    //   const chrome = get(window, "chrome");
    //   if (isFunction(chrome?.runtime?.sendMessage)) {
    //     chrome?.runtime?.sendMessage(
    //       EXTENSION_ID,
    //       { command: "start_host" },
    //       (response: any) => {
    //         console.log({ response });
    //         setHasExtension(true);
    //       }
    //     );
    //   } else {
    //     console.debug("Chrome runtime has not found.", {
    //       isChrome,
    //       chrome: get(window, "chrome"),
    //     });
    //     setHasExtension(false);
    //   }
    // } else {
    //   console.debug({ isChrome, chrome: get(window, "chrome") });
    //   setHasExtension(false);
    // }
  }, []);

  useEffect(() => {
    const command = searchParams?.get("command");
    if (command) {
      localStorage.setItem("relay-command", command);
    }
  });

  useEffect(() => {
    processWalletConnection();
  }, [processWalletConnection]);

  useEffect(() => {
    const code = searchParams?.get("code") || exCode;
    const state = searchParams?.get("state");

    let queryString = "";
    if (code) {
      queryString = `?code=${code}`;
    }
    if (state) {
      queryString = `${queryString}${code ? "&" : "?"}state=${state}`;
    }

    if (window.location.pathname !== "/") {
      console.log(window.location.pathname);
      router.push(`${window.location.pathname}${queryString}`);
    } else {
      router.push(`home${queryString}`);
    }
  }, [wallet.connected]);

  useEffect(() => {
    if (window.location.pathname && window.location.pathname.includes("home")) {
      dispatch(setPage(""));
      dispatch(activeItem(["home"]));
    }
  }, [window.location.pathname]);

  const header = useMemo(
    () => (
      <div className="px-4 py-2 flex">
        <Header />
      </div>
    ),
    []
  );

  // Switch Sidebar
  // const [isPro, setPro] = useState<boolean>(false);

  // useEffect(() => {
  //     if (window.location.pathname.includes('workspaces/') && !window.location.pathname.includes('create')) {
  //         setPro(true);
  //     } else {
  //         setPro(false);
  //     }
  // }, [window.location.pathname]);

  useEffect(() => {
    csrf();
  }, []);

  const handleVideoScroll = (event: any) => {
    if (window.location.pathname !== "/home") {
      return;
    }
    if (event.target.scrollTop > 0) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  document
    .getElementById("root")
    ?.addEventListener("scroll", handleVideoScroll);

  return (
    <>
      <div
        className={`flex mb-4 ${
          window.location.pathname === "/home" ? "video-main" : ""
        } ${scrolling ? "scrolling" : "init"}`}
      >
        {window.location.pathname === "/home" && (
          <VideoSlidesBackground {...dashboardSlides} />
        )}
        <div className="font-sans antialiased text-gray-900 bg-white"></div>

        {/* header */}
        <header
          className={`fixed w-full ${drawerOpen ? "transition-width" : ""} bg-${
            theme.palette.background.default
          } z-[1100]`}
        >
          <div className="bg-black container mx-auto flex justify-center py-4 gap-8">
            {matchUpMd ? (
              <>
                <p className="text-base">
                  Solana:{" "}
                  <span className="text-secondary text-xs">${solPrice}</span>
                </p>
                <p className="hidden">
                  Yaku/Sol:{" "}
                  <span className="text-secondary text-xs">
                    {yakuPrice.toFixed(6)} ◎
                  </span>
                </p>
                <p className="text-base">
                  Yaku/USDC:{" "}
                  <span className="text-secondary text-xs">
                    ${yakuUSDCPrice.toFixed(4)}
                  </span>
                </p>
                <p className="hidden sm:block text-base">
                  Ethereum:{" "}
                  <span className="text-secondary text-xs">${ethPrice}</span>
                </p>
                <p className="hidden sm:block text-base">
                  Gas Fee:{" "}
                  <span className="text-secondary text-xs">{ethGas} gwei</span>
                </p>
              </>
            ) : (
              <YakuBuyLink />
            )}
          </div>
          {matchUpMd ? (
            header
          ) : (
            <MobileHeader buttons={[<ProfileSection key="profile" />]} />
          )}
        </header>
        {/* drawer */}
        {/* <Sidebar sticky={sticky > 108} isPro={isPro} /> */}
        <Sidebar sticky={sticky > 108} isPro={false} />
        {/* main content */}
        <Main
          theme={theme}
          open={drawerOpen}
          openedcart={isOpen ? 1 : 0}
          className="max-sm:px-4 max-sm:mx-0"
        >
          {/* breadcrumb */}
          {container ? (
            <div className="container mx-auto max-w-lg">
              <BreadcrumbsNoSSR
                navigation={navigation}
                title={false}
                titleBottom={false}
                card={false}
                divider={false}
              />
              <Outlet />
              {children}
            </div>
          ) : (
            <>
              <BreadcrumbsNoSSR
                navigation={navigation}
                title={false}
                titleBottom={false}
                card={false}
                divider={false}
              />
              <Outlet />
              {children}
            </>
          )}
          {/* {isOpen && <Cart />} */}
        </Main>
        {/* <MobileFooter show={!matchUpMd} /> */}
      </div>
      <div className="md:max-h-14 w-full pb-2">
        <p className="text-base px-2 text-center w-full">
          © {dayjs().get("y")} Yakushima Corp. All right reserved.
        </p>
      </div>
    </>
  );
};

export default MainLayout;
