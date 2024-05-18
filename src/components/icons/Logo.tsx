import Image from "next/image";

import { IMAGE_PROXY_LOGO, LOGO } from "@/config/config";
import { Palette } from "@/themes/palette";

const LOGO_DARK = `https://s3.amazonaws.com/img.yaku.ai/logos/X-YAKU.png`;
const LOGO_LIGHT = `https://s3.amazonaws.com/img.yaku.ai/logos/X-YAKU.png`;

// ==============================|| LOGO SVG ||============================== //

const Logo = ({ withoutText = false }: any) => {
  if (withoutText) {
    return (
      <Image
        width={170}
        height={40}
        src={LOGO}
        className="m-auto pt-5 md:pt-0"
        alt="logo"
      />
    );
  }

  return (
    <Image
      src={`${IMAGE_PROXY_LOGO}${
        Palette.mode === "dark" ? LOGO_LIGHT : LOGO_DARK
      }`}
      alt="Yaku Labs"
      width={160}
      height={38}
      className="align-middle pt-[2px]"
    />
  );
};

export default Logo;
