import { memo, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer,
  useMediaQuery,
  Popper,
  Paper,
  ClickAwayListener,
  Avatar,
} from "@mui/material";
import { MoreHorizRounded } from "@mui/icons-material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDispatch, useSelector } from "@/store";

// project imports
import MenuList from "./MenuList";
import MenuListCollapsed from "./MenuListCollapsed";
import Profile from "./Profile";
import Logo from "@/components/icons/Logo";
import MainCard from "@/components/cards/MainCard";
import SocialSection from "./SocialSection";
import { openDrawer, activeItem } from "@/store/slices/menu";
import { drawerWidth, drawerWidthCollapsed } from "@/store/constant";
import { setPage } from "@/store/slices/subpageSlice";
import { LOGO_BLACK } from "@/config/config";

// ==============================|| SIDEBAR DRAWER ||============================== //

interface SidebarProps {
  window?: Window;
  sticky?: boolean;
  isPro?: boolean;
}

const Sidebar = ({ window, sticky, isPro }: SidebarProps) => {
  const showProfile = true;
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<any>(null);
  const wallet = useWallet();

  const router = useRouter();
  const dispatch = useDispatch();

  const workspace = JSON.parse(localStorage.getItem("workspace") || "{}");
  const avatar = workspace?.image;
  const { drawerOpen, hasWorkspace } = useSelector<any>(
    (state: any) => state.menu
  );

  const { openItem, currentWS } = useSelector<any>((state) => state.menu);

  const handleClick = () => {
    dispatch(setPage("Workspace"));
    dispatch(activeItem(["workspace"]));
    dispatch(openDrawer(true));
    router.push("/workspaces/home");
  };
  const handleMyWorkspacesClick = () => {
    dispatch(setPage("Workspace"));
    dispatch(activeItem(["workspace"]));
    dispatch(openDrawer(true));
    router.push("/workspaces");
  };

  const logo = useMemo(
    () => (
      <Box
        sx={{ display: { xs: "block", md: "none" } }}
        onMouseEnter={(e) => {
          e.preventDefault();
          dispatch(openDrawer(!drawerOpen));
          setOpen(true);
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 2,
            mx: "auto",
          }}
        >
          <Logo />
        </Box>
      </Box>
    ),
    []
  );

  const drawer = useMemo(
    () => (
      <PerfectScrollbar
        component="div"
        style={{
          height: !matchUpMd
            ? "calc(100vh - 56px - 96px)"
            : "calc(100vh - 140px - 86px)",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        {isPro ? (
          <>
            <Box
              className="flex items-center mt-2 px-2 py-3 rounded-lg cursor-pointer"
              sx={{
                color:
                  openItem.findIndex((el: any) => el === "workspace") > -1
                    ? "#f38aff"
                    : "white",
                backgroundColor:
                  openItem.findIndex((el: any) => el === "workspace") > -1
                    ? "#f38aff15"
                    : "transparent",
                "&:hover": {
                  color: "#f38aff",
                },
              }}
              onClick={handleClick}
            >
              {avatar && avatar !== null ? (
                <img className="w-7 rounded-full" src={avatar} alt="avatar" />
              ) : (
                <Box
                  sx={{
                    padding: "2px",
                    borderRadius: "8px",
                    backgroundColor:
                      openItem.findIndex((el: any) => el === "workspace") > -1
                        ? "#f38aff15"
                        : "",
                  }}
                >
                  <Avatar
                    src={LOGO_BLACK}
                    sx={{
                      ...theme.typography.largeAvatar,
                      width: 24,
                      height: 24,
                      margin: "0 auto",
                    }}
                  />
                </Box>
              )}
              <span className="ml-2 font-medium" style={{ color: "#d5d9e9" }}>
                {currentWS}
              </span>
            </Box>
            <MenuList isPro={isPro} />
            {showProfile && <Profile noPopper asButton />}
          </>
        ) : (
          <>
            {showProfile && <Profile noPopper />}
            <MenuList />
          </>
        )}
      </PerfectScrollbar>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchUpMd, wallet.publicKey, hasWorkspace, isPro, openItem, currentWS]
  );

  const drawerClosed = useMemo(
    () => (
      <PerfectScrollbar
        component="div"
        style={{
          height: !matchUpMd
            ? "calc(100vh - 56px - 56px)"
            : "calc(100vh - 140px - 56px)",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
        onMouseEnter={(e) => {
          e.preventDefault();
          dispatch(openDrawer(!drawerOpen));
          setOpen(true);
        }}
      >
        <MenuListCollapsed isPro={isPro} />
      </PerfectScrollbar>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchUpMd, isPro]
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  const handleClose = (
    event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent
  ) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <nav className="w-[260px] md:flex-shrink-0" aria-label="mailbox folders">
      <Drawer
        container={container}
        variant={matchUpMd ? "persistent" : "temporary"}
        anchor="left"
        open={drawerOpen}
        transitionDuration={{
          enter: 400,
          exit: 400,
        }}
        onClose={() => dispatch(openDrawer(!drawerOpen))}
        sx={{
          zIndex: 900,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: "none",
            [theme.breakpoints.up("md")]: {
              paddingTop: "108.33px",
            },
            paddingTop: "31.67px",
            marginTop: sticky ? "-30px" : "0px",
            transition: "margin-top .2s",
          },
          position: "relative",
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
        onMouseLeave={(e) => {
          e.preventDefault();
          if (matchUpMd) {
            setTimeout(() => {
              dispatch(openDrawer(!drawerOpen));
              handleClose(e);
            }, 200);
          }
        }}
      >
        {true && (
          <div className="flex flex-col justify-between">
            {logo}
            {drawer}
            <div className="MuiBox-root css-0">
              <SocialSection />
            </div>
          </div>
        )}
      </Drawer>

      {matchUpMd && (
        <Drawer
          container={container}
          variant={matchUpMd ? "persistent" : "temporary"}
          anchor="left"
          open={!drawerOpen}
          transitionDuration={{
            appear: 400,
            enter: 200,
            exit: 200,
          }}
          onClose={() => dispatch(openDrawer(drawerOpen))}
          sx={{
            zIndex: 900,
            "& .MuiDrawer-paper": {
              width: drawerWidthCollapsed,
              background: theme.palette.background.default,
              color: theme.palette.text.primary,
              borderRight: "none",
              [theme.breakpoints.up("md")]: {
                paddingTop: "108.33px",
              },
              paddingTop: "31.67px",
              marginTop: sticky ? "-30px" : "0px",
              transition: "margin-top .2s",
              zIndex: 1000,
            },
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          <div className="flex flex-col justify-between">
            <>
              {drawerOpen && logo}
              {!drawerOpen && drawerClosed}
            </>

            <div
              className="relative flex items-center justify-center flex-shrink-0 font-inter rounded-full overflow-hidden select-none text-gray-900 bg-transparent w-6 h-6 text-3xl cursor-pointer mx-auto"
              onMouseEnter={(e) => {
                e.preventDefault();
                dispatch(openDrawer(!drawerOpen));
                setOpen(true);
              }}
            >
              <MoreHorizRounded
                htmlColor={theme.palette.mode === "dark" ? "white" : "black"}
              />{" "}
            </div>
          </div>
        </Drawer>
      )}

      <Popper
        placement="left"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{
          position: "fixed",
          top: 95,
          left: 0,
          zIndex: 999,
          width: drawerWidth,
          borderRadius: 0,
        }}
        onMouseLeave={handleClose}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Paper style={{ borderRadius: 0 }}>
              {open && (
                <MainCard border content={false}>
                  {!drawerOpen && drawer}
                </MainCard>
              )}
            </Paper>
          </ClickAwayListener>
        )}
      </Popper>
    </nav>
  );
};

export default memo(Sidebar);
