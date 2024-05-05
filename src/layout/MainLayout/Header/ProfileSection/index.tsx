/* eslint-disable no-nested-ternary */
import { useEffect, useRef, useState } from "react";

// material-ui
import { Badge, Popper } from "@mui/material";

// web3 imports
import { useWallet } from "@solana/wallet-adapter-react";

// assets
import ProfilePopperContext from "@/components/profiles/ProfilePopperContent";
import { useCartItems } from "@/contexts/CartContext";
import ProfileAvatarIconButton from "@/components/profiles/ProfileAvatarIconButton";
import ConnectWalletButton from "@/components/buttons/ConnectWalletButton";
import { useEthcontext } from "@/contexts/EthWalletProvider";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const mainWallet = useWallet();
  const { ethConnected } = useEthcontext();
  const { setOpen: setCartOpen } = useCartItems();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const anchorRef = useRef<any>(null);

  const handleToggle = (event: any) => {
    setCartOpen(false);
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (
    event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent
  ) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }

    prevOpen.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      {mainWallet.connected || ethConnected ? (
        <Badge badgeContent={0} color="secondary">
          <ProfileAvatarIconButton
            ref={anchorRef}
            controls={open ? "menu-list-grow" : undefined}
            hasPopup="true"
            onClick={handleToggle}
          />
        </Badge>
      ) : (
        <ConnectWalletButton />
      )}

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorEl || anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <ProfilePopperContext
            handleClose={handleClose}
            showProfile
            TransitionProps={TransitionProps}
            open={open}
          />
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
