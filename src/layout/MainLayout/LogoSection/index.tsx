import { Link as RouterLink } from "react-router-dom";

// material-ui
import { Link } from "@mui/material";

// project imports
import defaultConfig from "@/config";
import Logo from "@/components/icons/Logo";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
  <Link component={RouterLink} to={defaultConfig.defaultPath}>
    <Logo withoutText />
  </Link>
);

export default LogoSection;
