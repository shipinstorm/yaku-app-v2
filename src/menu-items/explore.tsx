// third-party
import { FormattedMessage } from "react-intl";

// assets
import { IconDeviceDesktopAnalytics } from "@tabler/icons-react";

// ==============================|| EXPLORE MENU ITEMS ||============================== //

const explore = {
  id: "explore",
  title: <FormattedMessage id="explore" />,
  type: "group",
  showInCollapsed: true,
  icon: IconDeviceDesktopAnalytics,
  defaultOpen: true,
  children: [
    {
      id: "comingSoon",
      title: "Coming Soon",
      type: "item",
      url: "#",
      breadcrumbs: false,
      soon: true,
    },
    {
      id: "wallets",
      title: <FormattedMessage id="wallets" />,
      type: "item",
      url: "/explore/wallets",
      hidden: true,
      breadcrumbs: false,
      soon: true,
    },
    {
      id: "collection",
      title: <FormattedMessage id="nfts" />,
      type: "item",
      url: "/explore/collection/All",
      breadcrumbs: false,
      hidden: true,
    },
    {
      id: "token",
      title: <FormattedMessage id="tokens" />,
      type: "item",
      url: "/explore/token",
      hidden: true,
      breadcrumbs: false,
    },
    {
      id: "defi",
      title: <FormattedMessage id="defi" />,
      type: "item",
      url: "/explore/defi",
      hidden: true,
      breadcrumbs: false,
    },
    {
      id: "dao",
      title: <FormattedMessage id="dao" />,
      type: "item",
      url: "#",
      hidden: true,
      breadcrumbs: false,
      soon: true,
    },
  ],
};

export default explore;
