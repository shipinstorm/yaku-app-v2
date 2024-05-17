import { redirect } from "next/navigation";

// project imports
import defaultConfig from "@/config";
import Logo from "@/components/icons/Logo";

// ==============================|| MAIN LOGO ||============================== //

const itemHandler = (url: string) => {
  redirect(url);
};

const LogoSection = () => (
  <a
    href={defaultConfig.defaultPath}
    onClick={() => itemHandler(defaultConfig.defaultPath)}
    className="cursor-pointer"
  >
    <Logo withoutText />
  </a>
);

export default LogoSection;
