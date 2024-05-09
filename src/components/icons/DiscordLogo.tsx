const DiscordLogo = ({ size = 24 }: { size?: string | number }) => {
  const paletteMode = JSON.parse(
    localStorage.getItem("yaku-config") || "{}"
  ).mode;

  return (
    <img
      src={
        paletteMode === "dark"
          ? "/images/icons/discord.svg"
          : "/images/icons/discord-dark.svg"
      }
      alt="Discord"
      width={size}
    />
  );
};

export default DiscordLogo;
