/* eslint-disable no-nested-ternary */
import { useState, memo } from "react";
import { useRouter } from "next/navigation";

// web3 imports
import { useWallet } from "@solana/wallet-adapter-react";

// project imports
import { IMAGE_PROXY, DEFAULT_IMAGE_URL } from "@/config/config";

import { useEthcontext } from "@/contexts/EthWalletProvider";

import useAuth from "@/hooks/useAuth";

import { useDispatch, useSelector } from "@/store";
import { activeItem, openDrawer } from "@/store/slices/menu";
import { setPage } from "@/store/slices/subpageSlice";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const Profile = ({ noPopper, asButton = false }: any) => {
  const auth = useAuth();
  const router = useRouter();
  const mainWallet = useWallet();
  const { ethConnected } = useEthcontext();
  const { publicKey } = mainWallet;

  const [open, setOpen] = useState(false);

  const getAvatar = (proxy = IMAGE_PROXY) => {
    if (auth.user?.avatar) {
      return `${proxy}${auth.user?.avatar}`;
    }
    if (auth.user?.discord?.avatar) {
      return `${proxy}https://cdn.discordapp.com/avatars/${auth.user?.discord?.id}/${auth.user?.discord?.avatar}.png`;
    }
    return `${proxy}${DEFAULT_IMAGE_URL}`;
  };

  const dispatch = useDispatch();
  const { openItem } = useSelector<any>((state: any) => state.menu);

  const handleClick = () => {
    dispatch(setPage("Profile"));
    dispatch(activeItem(["profile"]));
    dispatch(openDrawer(true));
    router.push("/account");
  };

  return (
    <>
      {(publicKey || ethConnected) && (
        <div
          className={`my-[10px] py-3 rounded-lg ${
            openItem.findIndex((el: any) => el === "profile") > -1
              ? "color-[#f38aff]"
              : ""
          } ${
            openItem.findIndex((el: any) => el === "profile") > -1
              ? "bg-[#f38aff15]"
              : ""
          } cursor-pointer transition-all duration-300 hover:color-[#f38aff] ${
            asButton ? "!bg-elevation1 !rounded-xl" : ""
          }`}
          onClick={handleClick}
        >
          <div className="w-full flex items-center">
            <img
              src={getAvatar()}
              className="w-6 h-6 ml-1 cursor-pointer bg-transparent object-cover rounded-full"
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              color="inherit"
            />
            <p className="font-medium ml-3">My Profile</p>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Profile);
