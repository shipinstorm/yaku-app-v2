import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "@/store";
import { IconMenu2 } from "@tabler/icons-react";
import { openDrawer } from "@/store/slices/menu";
import { Palette } from "@/themes/palette";
import themeTypography from "@/themes/typography";

const ProfileAvatar = () => {
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector<any>((state) => state.menu);

  return (
    <Avatar
      variant="rounded"
      sx={{
        ...themeTypography.commonAvatar,
        ...themeTypography.mediumAvatar,
        overflow: "hidden",
        transition: "all .2s ease-in-out",
        background:
          Palette.mode === "dark" ? Palette.dark.main : Palette.secondary.light,
        color: Palette.mode === "dark" ? "white" : Palette.secondary.dark,
        "&:hover": {
          background:
            Palette.mode === "dark" ? "white" : Palette.secondary.dark,
          color:
            Palette.mode === "dark"
              ? Palette.secondary.main
              : Palette.secondary.light,
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
