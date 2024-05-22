import { memo, useMemo, useState, useRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

import { useWallet } from "@solana/wallet-adapter-react";

import Logo from "@/components/icons/Logo";
import MainCard from "@/components/cards/MainCard";

import { useDispatch, useSelector } from "@/store";
import { openDrawer } from "@/store/slices/menu";

import MenuList from "./MenuList";
import MenuListCollapsed from "./MenuListCollapsed";
import Profile from "./Profile";
import SocialSection from "./SocialSection";

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
  const dispatch = useDispatch();

  const { drawerOpen, hasWorkspace } = useSelector<any>(
    (state: any) => state.menu
  );

  const { openItem, currentWS } = useSelector<any>((state) => state.menu);

  const logo = useMemo(
    () => (
      <div
        className="md:hidden"
        onMouseEnter={(e) => {
          console.log("---Navbar Mouse Enter---");
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
          <Profile noPopper />
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
          console.log("---Navbar Mouse Enter---");
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
      <div
        className={
          "z-[900] w-[260px] text-[#d5d9e9] border-r-0 md:pt-[108.33px] pt-[31.67px] fixed transition-margin-top duration-200 flex flex-col justify-between " +
          (open ? "left-0" : "left-[-260px]")
        }
        onMouseLeave={(e) => {
          console.log("---Navbar Mouse Leave---");
          e.preventDefault();
          setTimeout(() => {
            dispatch(openDrawer(!drawerOpen));
            handleClose(e);
          }, 200);
        }}
      >
        {logo}
        {drawer}
        <div className="MuiBox-root css-0">
          <SocialSection />
        </div>
      </div>

      <div
        className={
          "z-[1000] w-[70px] text-[#d5d9e9] border-r-0 md:pt-[108.33px] pt-[31.67px] fixed transition-margin-top duration-200 flex flex-col justify-between " +
          (!open ? "left-0" : "left-[-70px]")
        }
      >
        <>
          {drawerOpen && logo}
          {!drawerOpen && drawerClosed}
        </>

        <div
          className="relative flex items-center justify-center flex-shrink-0 font-inter rounded-full overflow-hidden select-none text-gray-900 bg-transparent w-6 h-6 text-3xl cursor-pointer mx-auto"
          onMouseEnter={(e) => {
            console.log("---Navbar Mouse Enter---");
            e.preventDefault();
            dispatch(openDrawer(!drawerOpen));
            setOpen(true);
          }}
        ></div>
      </div>

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
