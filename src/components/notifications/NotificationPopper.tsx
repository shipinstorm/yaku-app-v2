/* eslint-disable react-hooks/exhaustive-deps */
import MainCard from "@/components/MainCard";
import useNotifications from "@/hooks/useNotifications";
import { useToasts } from "@/hooks/useToasts";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import NotificationList from "./NotificationList";
import useAuth from "@/hooks/useAuth";
import { NotificationStatus } from "@/types/notifications";

import { Palette } from "@/themes/palette";

const NotificationPopper = ({ open, anchorRef, handleClose }: any) => {
  const auth = useAuth();
  const { notifications, reloadNotifications, updateAllStatus } =
    useNotifications();
  const status = [
    {
      value: NotificationStatus.ALL,
      label: "All",
    },
    {
      value: NotificationStatus.UNREAD,
      label: "Unread",
    },
    {
      value: NotificationStatus.READ,
      label: "Read",
    },
  ];

  const { showSuccessToast } = useToasts();
  const [value, setValue] = useState<typeof NotificationStatus | string>(
    NotificationStatus.UNREAD
  );

  const handleChange = (event: any) => {
    event?.target.value && setValue(event?.target.value);
  };
  const handleMarkAllRead = async () => {
    await updateAllStatus({ variables: { status: NotificationStatus.READ } });
    showSuccessToast(`Marked all notifications as read.`);
    await reloadNotifications();
  };

  useEffect(() => {
    if (auth.token) {
      reloadNotifications();
    }
  }, [auth.token, value]);
  return (
    <div className="bg-transparent rounded-3xl">
      {open && (
        <MainCard
          border={false}
          className="!bg-elevation1 !rounded-3xl"
          elevation={16}
          content={false}
          boxShadow
        >
          <div className="flex flex-col space-y-2">
            <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
              <div className="flex items-center justify-between py-2 px-2">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">
                    {status.find((k: any) => k.value === value)?.label}{" "}
                    Notifications
                  </p>
                  <span className="bg-purple-400 text-white text-xs px-2 py-1 rounded">
                    {value === NotificationStatus.ALL
                      ? notifications.length
                      : filter(notifications, (k: any) => k.status === value)
                          .length}
                  </span>
                </div>
                <p
                  className="text-sm font-medium text-primary cursor-pointer"
                  onClick={handleMarkAllRead}
                >
                  Mark all as read
                </p>
              </div>
            </div>
            <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
              <div className="grid grid-cols-1 gap-y-2">
                <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
                  <div className="px-8 pt-1">
                    <select
                      id="outlined-select-currency-native"
                      value={value as string}
                      onChange={handleChange}
                      className="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:pink-main focus:border-pink-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-pink-main dark:focus:border-pink-main"
                    >
                      {status.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
                  <NotificationList
                    notifications={
                      value === NotificationStatus.ALL
                        ? notifications
                        : filter(notifications, (k: any) => k.status === value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="border-t border-gray-300 my-4" />
        </MainCard>
      )}
    </div>
  );
};

export default NotificationPopper;
