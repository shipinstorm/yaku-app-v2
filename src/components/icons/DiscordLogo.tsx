import { Palette } from "@/themes/palette";

const DiscordLogo = ({ size = 24 }: { size?: string | number }) => {
  return (
    <img
      src={
        Palette.mode === "dark"
          ? "/images/icons/discord.svg"
          : "/images/icons/discord-dark.svg"
      }
      alt="Discord"
      width={size}
    />
  );
};

export default DiscordLogo;
