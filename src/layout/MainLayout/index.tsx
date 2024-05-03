/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { useRouter } from "next/navigation";

// material-ui
import { styled, useTheme, Theme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
// import { Menu } from '@mui/icons-material';

// project imports
import Breadcrumbs from "@/components/Breadcrumbs";
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

    if (isChrome && typeof get(window, "chrome") !== "undefined") {
      const chrome = get(window, "chrome");
      if (isFunction(chrome?.runtime?.sendMessage)) {
        chrome?.runtime?.sendMessage(
          EXTENSION_ID,
          { command: "start_host" },
          (response: any) => {
            console.log({ response });
            setHasExtension(true);
          }
        );
      } else {
        console.debug("Chrome runtime has not found.", {
          isChrome,
          chrome: get(window, "chrome"),
        });
        setHasExtension(false);
      }
    } else {
      console.debug({ isChrome, chrome: get(window, "chrome") });
      setHasExtension(false);
    }
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
      <Toolbar sx={{ paddingTop: 0 }}>
        <Header />
      </Toolbar>
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
      <Box
        sx={{ display: "flex", mb: "1rem" }}
        className={
          window.location.pathname === "/home"
            ? `video-main ${scrolling ? "scrolling" : "init"}`
            : ""
        }
      >
        {window.location.pathname === "/home" && (
          <VideoSlidesBackground {...dashboardSlides} />
        )}
        <CssBaseline />

        {/* header */}
        <AppBar
          enableColorOnDark
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            bgcolor: theme.palette.background.default,
            transition: drawerOpen ? theme.transitions.create("width") : "none",
            ".MuiToolbar-root": {
              paddingLeft: "18px",
              paddingRight: "18px",
              paddingTop: "16px",
              paddingBottom: "16px",
            },
          }}
        >
          <Container
            className="bg-[#000]"
            maxWidth="xl"
            sx={{
              display: "flex",
              maxWidth: "100% !important",
              py: 1,
              justifyContent: "center",
              gap: 2,
              marginTop: sticky > 108 ? "-30px" : "0px",
              transition: "margin-top .2s",
            }}
          >
            {matchUpMd ? (
              <>
                <Typography component="p" fontSize={10}>
                  Solana:{" "}
                  <Typography component="span" color="secondary" fontSize={10}>
                    ${solPrice}
                  </Typography>
                </Typography>
                <Typography
                  component="p"
                  sx={{ display: "none" }}
                  fontSize={10}
                >
                  Yaku/Sol:{" "}
                  <Typography component="span" color="secondary" fontSize={10}>
                    {yakuPrice.toFixed(6)} ◎
                  </Typography>
                </Typography>
                <Typography component="p" fontSize={10}>
                  Yaku/USDC:{" "}
                  <Typography component="span" color="secondary" fontSize={10}>
                    ${yakuUSDCPrice.toFixed(4)}
                  </Typography>
                </Typography>
                <Typography
                  component="p"
                  sx={{ display: { xs: "none", sm: "block" } }}
                  fontSize={10}
                >
                  Ethereum:{" "}
                  <Typography component="span" color="secondary" fontSize={10}>
                    ${ethPrice}
                  </Typography>
                </Typography>
                <Typography
                  component="p"
                  sx={{ display: { xs: "none", sm: "block" } }}
                  fontSize={10}
                >
                  Gas Fee:{" "}
                  <Typography component="span" color="secondary" fontSize={10}>
                    {ethGas} gwei
                  </Typography>
                </Typography>
              </>
            ) : (
              <YakuBuyLink />
            )}
          </Container>
          {matchUpMd ? header : <MobileHeader buttons={[<ProfileSection />]} />}
        </AppBar>
        {/* drawer */}
        {/* <Sidebar sticky={sticky > 108} isPro={isPro} /> */}
        <Sidebar sticky={sticky > 108} isPro={false} />
        {/* main content */}
        <Main
          theme={theme}
          open={drawerOpen}
          openedcart={isOpen}
          className="max-sm:px-4 max-sm:mx-0"
        >
          {/* breadcrumb */}
          {container ? (
            <Container maxWidth="lg">
              <Breadcrumbs
                navigation={navigation}
                title={false}
                titleBottom={false}
                card={false}
                divider={false}
              />
              <Outlet />
              {children}
            </Container>
          ) : (
            <>
              <Breadcrumbs
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
      </Box>
      <Box className="max-md:mb-14 w-full pb-2">
        <Typography
          fontSize={10}
          sx={{ px: 2, textAlign: "center", width: "100%" }}
        >
          © {dayjs().get("y")} Yakushima Corp. All right reserved.
        </Typography>
      </Box>
    </>
  );
};

export default MainLayout;
