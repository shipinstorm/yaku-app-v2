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
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          alignItems: "center",
          // [theme.breakpoints.down('md')]: {
          //     width: 'auto'
          // }
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Box
          component="span"
          sx={{
            display: { xs: "none", md: "block" },
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <LogoSection />
        </Box>
        {!matchUpMd && <ProfileAvatar />}
      </Box>

      {/* header search */}
      {/*<SearchSection />*/}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

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
