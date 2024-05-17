import { memo, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { Drawer } from "@material-tailwind/react";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDispatch, useSelector } from "@/store";

// project imports
import MenuList from "./MenuList";
import MenuListCollapsed from "./MenuListCollapsed";
import Logo from "@/components/icons/Logo";
import MainCard from "@/components/cards/MainCard";
import SocialSection from "./SocialSection";
import { openDrawer, activeItem } from "@/store/slices/menu";
import { drawerWidth, drawerWidthCollapsed } from "@/store/constant";
import { setPage } from "@/store/slices/subpageSlice";
import { LOGO_BLACK } from "@/config/config";

import { Palette } from "@/themes/palette";
import themeTypography from "@/themes/typography";

// ==============================|| SIDEBAR DRAWER ||============================== //

interface SidebarProps {
  window?: Window;
  sticky?: boolean;
  isPro?: boolean;
}

const Sidebar = ({ window, sticky, isPro }: SidebarProps) => {
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

  const logo = useMemo(
    () => (
      <div
        className="md:hidden"
        onMouseEnter={(e) => {
          e.preventDefault();
          dispatch(openDrawer(!drawerOpen));
          setOpen(true);
        }}
      >
        <div className="flex justify-center p-2 mx-auto">
          <Logo />
        </div>
      </div>
    ),
    []
  );

  const drawer = useMemo(
    () => (
      <PerfectScrollbar
        component="div"
        style={{
          height: "calc(100vh - 140px - 86px)",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <>
          <MenuList />
        </>
      </PerfectScrollbar>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wallet.publicKey, hasWorkspace, isPro, openItem, currentWS]
  );

  const drawerClosed = useMemo(
    () => (
      <PerfectScrollbar
        component="div"
        style={{
          height: "calc(100vh - 140px - 56px)",
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
    [isPro]
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
    <nav
      className="w-auto md:w-[260px] md:flex-shrink-0"
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant={"persistent"}
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
            background: Palette.background.default,
            color: Palette.text.primary,
            borderRight: "none",
            paddingTop: "108.33px",
            marginTop: sticky ? "-30px" : "0px",
            transition: "margin-top .2s",
          },
          position: "relative",
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
        onMouseLeave={(e) => {
          e.preventDefault();
          setTimeout(() => {
            dispatch(openDrawer(!drawerOpen));
            handleClose(e);
          }, 200);
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

      <Drawer
        container={container}
        variant={"persistent"}
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
            background: Palette.background.default,
            color: Palette.text.primary,
            borderRight: "none",
              paddingTop: "108.33px",
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
            {/* <MoreHorizRounded
              htmlColor={Palette.mode === "dark" ? "white" : "black"}
            />{" "} */}
          </div>
        </div>
      </Drawer>

      <div className="rounded-none">
        {open && (
          <MainCard border content={false}>
            {!drawerOpen && drawer}
          </MainCard>
        )}
      </div>
    </nav>
  );
};

export default memo(Sidebar);
