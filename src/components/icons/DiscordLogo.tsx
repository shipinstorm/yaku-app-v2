// material-ui
import { useTheme } from "@mui/material/styles";

const DiscordLogo = ({ size = 24 }: { size?: string | number }) => {
  const theme = useTheme();

  return (
    <img
      src={
        theme.palette.mode === "dark"
          ? "/images/icons/discord.svg"
          : "/images/icons/discord-dark.svg"
      }
      alt="Discord"
      width={size}
    />
  );
};

export default DiscordLogo;
