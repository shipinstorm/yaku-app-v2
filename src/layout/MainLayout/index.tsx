/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

// project imports
import Header from "./Header";
import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";
import navigation from "@/menu-items";
import useConfig from "@/hooks/useConfig";
import { drawerWidth, cartWidth, drawerWidthCollapsed } from "@/store/constant";
import { activeItem } from "@/store/slices/menu";
import { useDispatch, useSelector } from "@/store";

// assets
import { useEthPrice, useSolPrice } from "@/contexts/CoinGecko";
import { useYakuPrice, useYakuUSDCPrice } from "@/contexts/JupitarContext";
import { useETHGasFee } from "@/contexts/TPSContext";
import { useCartItems } from "@/contexts/CartContext";
import { useWallet } from "@solana/wallet-adapter-react";
import useAuth from "@/hooks/useAuth";
import dayjs from "dayjs";
import { useMeta } from "@/contexts/meta/meta";
import { get } from "lodash";
import { useRequests } from "@/hooks/useRequests";
import ProfileSection from "./Header/ProfileSection";
import { setPage } from "@/store/slices/subpageSlice";
import VideoSlidesBackground from "./VideoSlidesBackground";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRequest } from "ahooks";
import useRelay from "@/hooks/useRelay";
import YakuBuyLink from "./YakuBuyLink";

import { Palette } from "@/themes/palette";
import { match } from "assert";

const BreadcrumbsNoSSR = dynamic(() => import("@/components/Breadcrumbs"), {
  ssr: false,
});

interface MainStyleProps {
  open: boolean;
  openedcart: boolean;
}

// styles
const Main = ({ open, openedcart, children }: any) => {
  const baseStyles = "transition-margin duration-400 pt-4";
  const commonStyles = "mt-[88px] min-h-[calc(-144px+100vh)]";

  const openStyles = `ml-0 w-[calc(100%-260px)] sm:ml-2.5 md:ml-5`;

  const closedStyles = `md:w-[calc(100%-70px)] p-4  ml-[10px] sm:ml-[20px] md:ml-[-190px]`;

  const styles = `${baseStyles} ${open ? openStyles : closedStyles}`;

  return <main className={`${styles} ${commonStyles}`}>{children}</main>;
};

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const auth = useAuth();
  const matchUpMd = useMediaQuery({ query: "(min-width: 900px)" });

  const wallet = useWallet();
  const dispatch = useDispatch();
  const solPrice = useSolPrice() || 0;
  const ethPrice = useEthPrice() || 0;
  const yakuPrice = useYakuPrice() || 0;
  const yakuUSDCPrice = useYakuUSDCPrice() || 0;
  const { drawerOpen } = useSelector<any>((state: any) => state.menu);
  const { container } = useConfig();
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
  const { processWalletConnection } = useRelay();

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
      console.log("MainLayout");
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

        <header
          className={`fixed w-full ${drawerOpen ? "transition-width" : ""} bg-${
            Palette.background.default
          } z-[1100]`}
        >
          <div className="w-full mx-auto box-border px-4 py-2 flex justify-center gap-16 transition-all duration-200 ease-in-out max-w-full md:px-6">
            {matchUpMd ? (
              <>
                <p className="m-0 font-normal leading-1.334 font-inter text-[10px]">
                  Solana:{" "}
                  <span className="m-0 font-normal leading-1.334 font-inter text-[10px] text-[#F38AFF]">
                    ${solPrice}
                  </span>
                </p>
                <p className="hidden">
                  Yaku/Sol:{" "}
                  <span className="m-0 font-normal leading-1.334 font-inter text-[10px] text-[#F38AFF]">
                    {yakuPrice.toFixed(6)} ◎
                  </span>
                </p>
                <p className="m-0 font-normal leading-1.334 font-inter text-[10px]">
                  Yaku/USDC:{" "}
                  <span className="m-0 font-normal leading-1.334 font-inter text-[10px] text-[#F38AFF]">
                    ${yakuUSDCPrice.toFixed(4)}
                  </span>
                </p>
                <p className="hidden sm:block m-0 font-normal leading-1.334 font-inter text-[10px]">
                  Ethereum:{" "}
                  <span className="m-0 font-normal leading-1.334 font-inter text-[10px] text-[#F38AFF]">
                    ${ethPrice}
                  </span>
                </p>
                <p className="hidden sm:block m-0 font-normal leading-1.334 font-inter text-[10px]">
                  Gas Fee:{" "}
                  <span className="m-0 font-normal leading-1.334 font-inter text-[10px] text-[#F38AFF]">
                    {ethGas} gwei
                  </span>
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

        {matchUpMd && <Sidebar sticky={sticky > 108} isPro={false} />}

        <Main
          open={drawerOpen}
          openedcart={isOpen}
          className="max-sm:px-4 max-sm:mx-0"
        >
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
        </Main>
      </div>
      <div className="max-md:mb-14 w-full pb-2">
        <p className="text-[10px] px-2 text-center w-full">
          © {dayjs().get("y")} Yakushima Corp. All right reserved.
        </p>
      </div>
    </>
  );
};

export default MainLayout;
