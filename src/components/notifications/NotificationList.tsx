/* eslint-disable react/no-danger */
// material-ui
import Image from "next/image";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { map } from "lodash";

import { IconX } from "@tabler/icons-react";

import { useToasts } from "@/hooks/useToasts";
import useNotifications from "@/hooks/useNotifications";

import NotificationIcons from "./NotificationIcons";

dayjs.extend(relativeTime);

const NotificationItem = ({
  id,
  icon,
  title,
  date,
  description,
  status,
  chipErrorSX,
  action,
}: any) => {
  const { showSuccessToast } = useToasts();
  const { updateStatus, deleteNotification, reloadNotifications } =
    useNotifications();

  const handleStatusUpdate = (newStatus: string) => {
    updateStatus({
      variables: { id, status: newStatus },
    }).then(() => {
      showSuccessToast(`Notification status updated.`);
      reloadNotifications();
    });
  };

  const handleDelete = () => {
    deleteNotification({
      variables: { id },
    }).then(() => {
      showSuccessToast(`Notification deleted successfully.`);
      reloadNotifications();
    });
  };

  const convertSignatureToLink = (desc: string) => {
    if (!desc) return "";
    if (desc.includes("Signature: ")) {
      return desc.replace(/Signature:\s(.+)\s*/, "");
    }
    return desc;
  };

  const convertYakuAmount = (desc: string) => {
    if (!desc) return "";
    if (
      desc.includes("YAKU") &&
      desc.includes(" has been airdropped to your wallet.")
    ) {
      return desc.split(" has been airdropped to your wallet.")[0];
    }
    return "";
  };

  const convertSolscanLink = (desc: string) => {
    if (!desc) return "";
    if (desc.includes("Signature: ")) {
      return desc
        .replace(/Signature:\s(.+)\s*/, "<br>https://solscan.io/tx/$1")
        .split("<br>")[1];
    }
    return "";
  };

  const handleExplore = (link: string) => {
    window.open(link, "_blank");
  };
  return (
    <div className="activity-item p-[12px] bg-elevation2 mt-0 rounded-2xl shadow-sm max-w-full mx-4 my-2">
      <div className="flex justify-between w-full">
        <div className="flex flex-row gap-2 justify-start">
          <div className="mt-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border border-white">
              <NotificationIcons icon={icon} />
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <p className="text-lg font-bold">{title}</p>
            <div
              style={{
                whiteSpace: "pre-wrap",
              }}
              className="text-terciary text-sm font-medium"
              dangerouslySetInnerHTML={{
                __html: convertSignatureToLink(description),
              }}
            />
          </div>
        </div>
        <div className="mt-1">
          <div className="flex gap-1 w-full pr-2">
            {convertSolscanLink(description) && (
              <button
                onClick={() => handleExplore(convertSolscanLink(description))}
                className="relative"
              >
                <Image
                  src="/images/icons/solscan.png"
                  alt=""
                  width={16}
                  height={16}
                  style={{ cursor: "pointer", objectFit: "contain" }}
                />
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-white p-1 rounded-md shadow-md">
                  View on Solscan
                </span>
              </button>
            )}
            <button
              onClick={() => handleStatusUpdate("read")}
              className="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
            >
              <IconX />
            </button>
          </div>
        </div>
      </div>
      <div className="items-center justify-end mt-2 py-2 rounded-xl shadow-none hidden">
        {status === "read" && (
          <button
            className={`${chipErrorSX} py-1 px-2 rounded cursor-pointer`}
            onClick={() => handleStatusUpdate("unread")}
          >
            Mark as Unread
          </button>
        )}
        {status === "unread" && (
          <button
            className={`${chipErrorSX} py-1 px-2 rounded cursor-pointer`}
            onClick={() => handleStatusUpdate("read")}
          >
            Mark as Read
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 rounded-xl shadow-none">
        <h4 className="font-bold">{convertYakuAmount(description)}</h4>
        <p className="text-terciary">
          <span>{dayjs(date).fromNow()}</span>
        </p>
      </div>
    </div>
  );
};

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = ({ notifications }: any) => {
  const chipSX = {
    height: 24,
    padding: "0 6px",
  };

  const chipErrorSX = {
    ...chipSX,
    color: "#000",
    backgroundColor: "#f38aff",
    marginRight: "5px",
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {notifications.length > 0 ? (
        map(notifications, (notification) => (
          <NotificationItem
            key={notification.id}
            {...notification}
            chipErrorSX={chipErrorSX}
          />
        ))
      ) : (
        <p className="text-lg m-2 text-center">
          You do not have any notifications.
        </p>
      )}
    </div>
  );
};

export default NotificationList;
