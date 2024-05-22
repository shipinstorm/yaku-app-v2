/* eslint-disable no-nested-ternary */
import { memo } from "react";

// project imports
import { NavItemTypeObject } from "@/types";
import menuItem from "@/menu-items";
import NavItem from "./NavItem";
import useAuth from "@/hooks/useAuth";
import { DEFAULT_IMAGE_URL, IMAGE_PROXY, LOGO_BLACK } from "@/config/config";
import { isEmpty } from "lodash";
import { useWallet } from "@solana/wallet-adapter-react";

import { useSelector } from "@/store";
import { useEthcontext } from "@/contexts/EthWalletProvider";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuListCollapsed = ({ isPro }: any) => {
  const showAvatar = true;
  const auth = useAuth();
  const wallet = useWallet();
  const { ethConnected } = useEthcontext();

  const allItems: NavItemTypeObject[] = [];
  const menu = menuItem;

  menu.items.forEach((item: NavItemTypeObject) => {
    if (item && item.showInCollapsed) {
      allItems.push(item);
    }
  });

  const getAvatar = (proxy = IMAGE_PROXY) => {
    if (auth.user?.avatar) {
      return `${proxy}${auth.user?.avatar}`;
    }
    if (auth.user?.discord?.avatar) {
      return `${proxy}https://cdn.discordapp.com/avatars/${auth.user?.discord?.id}/${auth.user?.discord?.avatar}.png`;
    }
    return `${proxy}${DEFAULT_IMAGE_URL}`;
  };

  const { openItem } = useSelector<any>((state: any) => state.menu);

  return (
    <>
      {showAvatar &&
        !isEmpty(auth.user) &&
        (wallet.connected || ethConnected) && (
          <div
            className={`py-3 my-[10px] rounded-lg ${
              openItem.findIndex((el: any) => el === "profile") > -1
                ? "bg-[#f38aff15]"
                : ""
            }`}
          >
            <img
              src={getAvatar()}
              alt="Avatar"
              className="w-6 h-6 mx-auto bg-transparent rounded-full"
            />
          </div>
        )}
      {allItems.map((el, idx) => (
        <NavItem key={idx} item={el} level={0} />
      ))}
    </>
  );
};

export default memo(MenuListCollapsed);
