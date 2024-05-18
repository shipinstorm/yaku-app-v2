import { memo, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { Drawer } from "@material-tailwind/react";

import { useMediaQuery } from "react-responsive";

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
  toggleMobileSidebar: () => void;
  showMobileSidebar: boolean;
}

const Sidebar = ({
  window,
  sticky,
  isPro,
  hideMobileSidebar,
  showMobileSidebar,
}: SidebarProps) => {
  const matchUpMd = useMediaQuery({ query: "(min-width: 900px)" });
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

  const drawer = useMemo(
    () => (
      <PerfectScrollbar
        component="div"
        style={{
          height: "calc(100vh - 140px - 86px)",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
        className="flex flex-col items-center justify-center"
      >
        <>
          <MenuList hideMobileSidebar={hideMobileSidebar} />
        </>
      </PerfectScrollbar>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wallet.publicKey, hasWorkspace, isPro, openItem, currentWS]
  );

  return (
    <nav
      className="w-auto md:w-[260px] md:flex-shrink-0"
      aria-label="mailbox folders"
    >
      <div
        className={
          "z-[100] text-[#d5d9e9] border-r-0 pt-[131.67px] transition-margin-top duration-200 flex flex-col justify-between fixed top-0 h-screen bg-black w-full " +
          (showMobileSidebar ? "!left-0" : " -left-full")
        }
      >
        {drawer}
        <div className="mb-[50px]">
          <SocialSection />
        </div>
      </div>
    </nav>
  );
};

export default memo(Sidebar);
