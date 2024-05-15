/* eslint-disable no-nested-ternary */
import { memo } from "react";

// project imports
import { NavItemTypeObject } from "@/types";
import menuItem from "@/menu-items";
import proItem from "@/menu-items/pro-items";
import NavItem from "./NavItem";
import { Avatar, Box } from "@mui/material";
import { Workspaces } from "@mui/icons-material";
import useAuth from "@/hooks/useAuth";
import { DEFAULT_IMAGE_URL, IMAGE_PROXY, LOGO_BLACK } from "@/config/config";
import { isEmpty } from "lodash";
import { useWallet } from "@solana/wallet-adapter-react";

import { useSelector } from "@/store";
import themeTypography from "@/themes/typography";
import { useEthcontext } from "@/contexts/EthWalletProvider";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuListCollapsed = ({ isPro }: any) => {
  const showAvatar = true;
  const auth = useAuth();
  const wallet = useWallet();
  const { ethConnected } = useEthcontext();

  const allItems: NavItemTypeObject[] = [];
  const menu = isPro ? proItem : menuItem;

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
  const workspace = JSON.parse(localStorage.getItem("workspace") || "{}");
  const avatar = workspace.image;

  return (
    <>
      {isPro ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
            borderRadius: "8px",
            color:
              openItem.findIndex((el: any) => el === "workspace") > -1
                ? "#f38aff"
                : "",
            backgroundColor:
              openItem.findIndex((el: any) => el === "workspace") > -1
                ? "#f38aff15"
                : "",
          }}
        >
          {avatar && avatar !== null ? (
            <img className="w-7 rounded-full" src={avatar} alt="avatar" />
          ) : (
            <Box
              sx={{
                padding: "10px",
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
                  ...themeTypography.largeAvatar,
                  width: 24,
                  height: 24,
                  margin: "0 auto",
                }}
              />
            </Box>
          )}
        </Box>
      ) : (
        showAvatar &&
        !isEmpty(auth.user) &&
        (wallet.connected || ethConnected) && (
          <Box
            sx={{
              padding: "10px",
              borderRadius: "8px",
              backgroundColor:
                openItem.findIndex((el: any) => el === "profile") > -1
                  ? "#f38aff15"
                  : "",
            }}
          >
            <Avatar
              src={getAvatar()}
              sx={{
                ...themeTypography.largeAvatar,
                width: 24,
                height: 24,
                margin: "0 auto",
                background: "transparent",
              }}
            />
          </Box>
        )
      )}
      {allItems.map((el, idx) => (
        <NavItem key={idx} item={el} level={0} />
      ))}
      {isPro && (
        <>
          <Box
            sx={{
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor:
                openItem.findIndex((el: any) => el === "workspace") > -1
                  ? "#f38aff15"
                  : "",
            }}
          >
            <Workspaces />
          </Box>
          {showAvatar &&
            !isEmpty(auth.user) &&
            (wallet.connected || ethConnected) && (
              <Box
                sx={{
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor:
                    openItem.findIndex((el: any) => el === "profile") > -1
                      ? "#f38aff15"
                      : "",
                }}
              >
                <Avatar
                  src={getAvatar()}
                  sx={{
                    ...themeTypography.largeAvatar,
                    width: 24,
                    height: 24,
                    margin: "0 auto",
                    background: "transparent",
                  }}
                />
              </Box>
            )}
        </>
      )}
    </>
  );
};

export default memo(MenuListCollapsed);
