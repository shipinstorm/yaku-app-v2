import { Button, Tooltip, Typography } from "@mui/material";

const SocialButton = ({ title, link, icon, label, theme }: any) => (
  <Tooltip title={title}>
    <Button
      className="text-secondary bg-elevation1 hover:bg-elevation1-hover hover:text-terciary rounded-xl text-sm font-medium w-full duration-300"
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        width: "100%",
        transition: "all .2s ease-in-out",
      }}
      color="inherit"
      onClick={() => window.open(link)}
      startIcon={icon}
    >
      <Typography>{label}</Typography>
    </Button>
  </Tooltip>
);

export default SocialButton;
