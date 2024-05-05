// third-party
import { FormattedMessage } from "react-intl";

// assets
import { IconApps } from "@tabler/icons-react";

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const applications = {
  id: "applications",
  title: <FormattedMessage id="application" />,
  type: "item",
  showInCollapsed: true,
  url: "/applications",
  icon: IconApps,
  breadcrumbs: false,
};

export default applications;
