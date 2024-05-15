import { DEFAULT_IMAGE_URL, IMAGE_PROXY } from "@/config/config";

import useAuth from "@/hooks/useAuth";

import themeTypography from "@/themes/typography";

const ProfileIcon = ({
  ref,
  hasPopup,
  controls,
  sx = {
    cursor: "pointer",
    backgroundColor: "transparent",
  },
}: any) => {
  const discordImagePath = "https://cdn.discordapp.com/avatars";
  const auth = useAuth();
  const getAvatar = (proxy = IMAGE_PROXY) => {
    if (auth.user?.avatar) {
      return `${proxy}${auth.user?.avatar}`;
    }
    if (auth.user?.discord?.avatar) {
      return `${proxy}${discordImagePath}/${auth.user?.discord?.id}/${auth.user?.discord?.avatar}.png`;
    }
    return `${proxy}${DEFAULT_IMAGE_URL}`;
  };
  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0 font-sans leading-none rounded-full overflow-hidden select-none text-[#24182F] bg-transparent w-[34px] h-[34px] text-[1.2rem] cursor-pointer m-0"
      aria-controls={controls}
      aria-haspopup={hasPopup}
      color="inherit"
    >
      <img
        className="w-full h-full text-center object-cover text-transparent indent-[10000px]"
        src={getAvatar()}
        alt="Avatar"
      ></img>
    </div>
  );
};

export default ProfileIcon;
