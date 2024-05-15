import themeTypography from "@/themes/typography";
import { Button, Tooltip, Typography } from "@mui/material";

const SocialButton = ({ title, link, icon, label, theme }: any) => (
  <Tooltip title={title}>
    <Button
      className="text-secondary bg-elevation1 hover:bg-elevation1-hover hover:text-terciary rounded-xl text-sm font-medium w-full duration-300"
      sx={{
        ...themeTypography.commonAvatar,
        ...themeTypography.mediumAvatar,
        width: "100%",
        transition: "all .2s ease-in-out",
      }}
      color="inherit"
      onClick={() => window.open(link)}
      startIcon={icon}
    >
      <p className="text-base">{label}</p>
    </Button>
  </Tooltip>
);

export default SocialButton;
