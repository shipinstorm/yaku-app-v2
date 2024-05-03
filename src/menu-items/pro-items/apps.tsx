/* eslint-disable @typescript-eslint/no-unused-vars */
// third-party
import { FormattedMessage } from "react-intl";

// assets
import { IconApps } from "@tabler/icons-react";

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const applications = {
  id: "applications",
  title: <FormattedMessage id="apps" />,
  type: "item",
  showInCollapsed: true,
  url: "/workspaces/apps",
  icon: IconApps,
  breadcrumbs: false,
};

export default applications;
