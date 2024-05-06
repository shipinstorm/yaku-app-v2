/* eslint-disable react/no-danger */
// material-ui
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { Avatar, Chip, IconButton, Tooltip, Typography } from "@mui/material";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { map } from "lodash";
import { useToasts } from "@/hooks/useToasts";
import useNotifications from "@/hooks/useNotifications";
import NotificationIcons from "./NotificationIcons";
import { IconX } from "@tabler/icons-react";
import SolscanLogo from "assets/images/icons/solscan.png";

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
            <Avatar
              sx={{
                color: "#fff",
                backgroundColor: "#36393F",
                border: "1px solid",
                borderColor: "#fff",
              }}
            >
              <NotificationIcons icon={icon} />
            </Avatar>
          </div>
          <div className="flex flex-col mt-2">
            <Typography variant="subtitle1" fontWeight={700}>
              {title}
            </Typography>
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
              <Tooltip
                title="View on Solscan"
                placement="top"
                onClick={() => handleExplore(convertSolscanLink(description))}
                sx={{ cursor: "pointer" }}
                arrow
              >
                <Image
                  src="/images/icons/solscan.png"
                  alt=""
                  width={16}
                  height={16}
                  style={{ cursor: "pointer", objectFit: "contain" }}
                />
              </Tooltip>
            )}
            <IconButton size="small" onClick={() => handleStatusUpdate("read")}>
              <IconX />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="items-center justify-end mt-2 py-2 rounded-xl shadow-none hidden">
        {status === "read" && (
          <Chip
            label="Mark as Unread"
            sx={chipErrorSX}
            onClick={() => handleStatusUpdate("unread")}
          />
        )}
        {status === "unread" && (
          <Chip
            label="Mark as Read"
            sx={chipErrorSX}
            onClick={() => handleStatusUpdate("read")}
          />
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
  const theme = useTheme();

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
            theme={theme}
          />
        ))
      ) : (
        <Typography variant="subtitle1" sx={{ m: 2, textAlign: "center" }}>
          You do not have any notifications.
        </Typography>
      )}
    </div>
  );
};

export default NotificationList;
