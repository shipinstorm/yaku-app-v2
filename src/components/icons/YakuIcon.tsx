import Image from 'next/image'
import { LOGO_BLACK } from "@/config/config";

const YakuIcon = ({
  cssClass = "h-12 w-12 mr-2 rounded-2xl object-cover yaku-icon",
  icon = LOGO_BLACK,
}: any) => <Image fill className={cssClass} src={icon} alt="Yaku" />;

export default YakuIcon;
