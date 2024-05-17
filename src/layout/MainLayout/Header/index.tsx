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
  const { connected } = useWallet();

  return (
    <>
      <YakuBuyLink />
      <div className="flex items-center w-full absolute">
        <div className="hidden md:flex items-center flex-grow justify-center">
          <LogoSection />
        </div>
        <ProfileAvatar />
      </div>

      <div className="flex-grow"></div>
      <div className="flex-grow"></div>

      {connected && <NotificationSection />}

      <ProfileSection />
    </>
  );
};

export default Header;
