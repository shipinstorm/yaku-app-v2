import { Avatar, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "@/store";
import { IconMenu2 } from "@tabler/icons-react";
import { openDrawer } from "@/store/slices/menu";

const ProfileAvatar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector<any>((state) => state.menu);

  const paletteMode = JSON.parse(
    localStorage.getItem("yaku-config") || "{}"
  ).mode;

  return (
    <Avatar
      variant="rounded"
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        overflow: "hidden",
        transition: "all .2s ease-in-out",
        background:
          paletteMode === "dark"
            ? theme.palette.dark.main
            : theme.palette.secondary.light,
        color: paletteMode === "dark" ? "white" : theme.palette.secondary.dark,
        "&:hover": {
          background:
            paletteMode === "dark" ? "white" : theme.palette.secondary.dark,
          color:
            paletteMode === "dark"
              ? theme.palette.secondary.main
              : theme.palette.secondary.light,
        },
      }}
      onClick={() => dispatch(openDrawer(!drawerOpen))}
      color="inherit"
    >
      <IconMenu2 stroke={1.5} size="1.3rem" />
    </Avatar>
  );
};

export default ProfileAvatar;
