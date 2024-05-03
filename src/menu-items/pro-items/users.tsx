/* eslint-disable @typescript-eslint/no-unused-vars */
// third-party
import { FormattedMessage } from "react-intl";

// assets
import { IconUsers } from "@tabler/icons-react";

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const users = {
  id: "users",
  title: <FormattedMessage id="users" />,
  type: "item",
  showInCollapsed: true,
  url: `/workspaces/users`,
  icon: IconUsers,
  breadcrumbs: false,
};

export default users;
