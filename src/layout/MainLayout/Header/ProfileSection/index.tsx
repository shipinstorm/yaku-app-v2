import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";

// web3 imports
import { useWallet } from "@solana/wallet-adapter-react";

// assets
import ProfilePopperContext from "@/components/profiles/ProfilePopperContent";
import ProfileAvatarIconButton from "@/components/profiles/ProfileAvatarIconButton";
import ConnectWalletButton from "@/components/buttons/ConnectWalletButton";

import { useCartItems } from "@/contexts/CartContext";
import { useEthcontext } from "@/contexts/EthWalletProvider";
import { usePlayerView } from "@/contexts/PlayerWalletContext";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const mainWallet = useWallet();
  const { ethConnected } = useEthcontext();
  const { playerAddress } = usePlayerView();
  const { setOpen: setCartOpen } = useCartItems();

  const handleToggle = (event: any) => {
    setCartOpen(false);
  };

  return (
    <>
      {mainWallet.connected || ethConnected || playerAddress ? (
        <Popover placement="bottom-end">
          <PopoverHandler>
            <span className="relative inline-flex align-middle shrink-0">
              <ProfileAvatarIconButton hasPopup="true" onClick={handleToggle} />
            </span>
          </PopoverHandler>
          <PopoverContent
            className="z-[10000] bg-transparent border-none"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            <ProfilePopperContext showProfile />
          </PopoverContent>
        </Popover>
      ) : (
        <ConnectWalletButton />
      )}
    </>
  );
};

export default ProfileSection;
