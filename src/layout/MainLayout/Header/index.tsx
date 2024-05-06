// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";
// web3 imports
import { useWallet } from "@solana/wallet-adapter-react";

// project imports
{
  /*import SearchSection from './SearchSection';*/
}
{
  /*import CartSection from './CartSection';*/
}
import NotificationSection from "./NotificationSection";
import LogoSection from "../LogoSection";
import ProfileSection from "./ProfileSection";
import ProfileAvatar from "@/components/profiles/ProfileAvatar";
import YakuBuyLink from "../YakuBuyLink";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const { connected } = useWallet();

  return (
    <>
      {/* logo & toggler button */}
      <YakuBuyLink />
      <div className="flex items-center w-full absolute">
        <div className="hidden md:flex items-center flex-grow justify-center">
          <LogoSection />
        </div>
        {!matchUpMd && <ProfileAvatar />}
      </div>

      {/* header search */}
      {/*<SearchSection />*/}
      <div className="flex-grow"></div>
      <div className="flex-grow"></div>

      {/*{connected && <CartSection />}*/}
      {/* notification & profile */}
      {connected && <NotificationSection />}

      <ProfileSection />
      {/* mobile header
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MobileSection />
            </Box> */}
    </>
  );
};

export default Header;
