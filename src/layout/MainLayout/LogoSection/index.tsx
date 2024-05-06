import { redirect } from "next/navigation";

import { Link as RouterLink } from "react-router-dom";

// material-ui
import { Link } from "@mui/material";

// project imports
import defaultConfig from "@/config";
import Logo from "@/components/icons/Logo";

// ==============================|| MAIN LOGO ||============================== //

const itemHandler = (url: string) => {
  // router.push("/applications");
  redirect(url);
};

const LogoSection = () => (
  <Link
    component={RouterLink}
    to={defaultConfig.defaultPath}
    onClick={() => itemHandler(defaultConfig.defaultPath)}
  >
    <Logo withoutText />
  </Link>
);

export default LogoSection;
