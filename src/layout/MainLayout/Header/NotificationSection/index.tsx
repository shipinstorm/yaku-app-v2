/* eslint-disable react-hooks/exhaustive-deps */

// material-ui
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Badge, Tooltip } from "@mui/material";

// assets
import { IconBell } from "@tabler/icons-react";
import useNotifications from "@/hooks/useNotifications";

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const { unreadCount, open, handleToggle, anchorRef } = useNotifications();

  return (
    <>
      <Box sx={{ ml: 1.5 }}>
        <Badge color="secondary" badgeContent={unreadCount}>
          <Tooltip title="Notifications">
            <Avatar
              className="button-small"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: "all .2s ease-in-out",
              }}
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              color="inherit"
            >
              <IconBell stroke={1.5} size="1.3rem" />
            </Avatar>
          </Tooltip>
        </Badge>
      </Box>
    </>
  );
};

export default NotificationSection;
