import { Avatar, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "@/store";
import { IconMenu2 } from "@tabler/icons-react";
import { openDrawer } from "@/store/slices/menu";

const ProfileAvatar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector<any>((state) => state.menu);
  return (
    <Avatar
      variant="rounded"
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        overflow: "hidden",
        transition: "all .2s ease-in-out",
        background:
          theme.palette.mode === "dark"
            ? theme.palette.dark.main
            : theme.palette.secondary.light,
        color:
          theme.palette.mode === "dark"
            ? "white"
            : theme.palette.secondary.dark,
        "&:hover": {
          background:
            theme.palette.mode === "dark"
              ? "white"
              : theme.palette.secondary.dark,
          color:
            theme.palette.mode === "dark"
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
