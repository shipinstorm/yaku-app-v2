import users from "./users";
import project from "./project";
import vault from "./vault";
import apps from "./apps";
import { NavItemType } from "@/types";

const proItems: { items: NavItemType[] } = {
  items: [users, project, vault, apps],
};

export default proItems;
