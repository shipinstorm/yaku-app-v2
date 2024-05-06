// material-ui
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
// web3 imports
import { useWallet } from "@solana/wallet-adapter-react";

// project imports
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
      <YakuBuyLink />
      <div className="flex items-center w-full absolute">
        <div className="hidden md:flex items-center flex-grow justify-center">
          <LogoSection />
        </div>
        {!matchUpMd && <ProfileAvatar />}
      </div>

      <div className="flex-grow"></div>
      <div className="flex-grow"></div>

      {connected && <NotificationSection />}

      <ProfileSection />
    </>
  );
};

export default Header;
