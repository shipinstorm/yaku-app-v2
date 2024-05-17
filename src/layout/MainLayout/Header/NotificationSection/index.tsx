/* eslint-disable react-hooks/exhaustive-deps */
// assets
import { IconBell } from "@tabler/icons-react";
import useNotifications from "@/hooks/useNotifications";
import themeTypography from "@/themes/typography";

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const { unreadCount, open, handleToggle, anchorRef } = useNotifications();

  return (
    <div className="ml-1.5">
      <span className="relative inline-block">
        <button
          className="button-small items-center p-0 relative flex justify-center flex-shrink-0 text-xl leading-none overflow-hidden select-none bg-[#d5d9e9]"
          onClick={handleToggle}
          aria-haspopup="true"
          aria-controls={open ? "menu-list-grow" : undefined}
        >
          <IconBell className="h-5 w-5" strokeWidth={1.5} />
        </button>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1">
            <span className="inline-flex items-center justify-center h-4 w-4 bg-red-500 text-white rounded-full text-xs">
              {unreadCount}
            </span>
          </span>
        )}
      </span>
    </div>
  );
};

export default NotificationSection;
