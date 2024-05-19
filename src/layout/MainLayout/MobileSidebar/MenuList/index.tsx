import { memo, useState } from "react";

// project imports
import NavGroup from "./NavGroup";
import NavItem from "./NavItem";
import menuItem from "@/menu-items";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = ({ isPro, hideMobileSidebar }: any) => {
  const [openIdx, setOpenIdx] = useState<any>(-1);
  const menu = menuItem;

  const navItems = menu.items.map((item, idx) => {
    if (item.hidden) {
      return <></>;
    }
    switch (item.type) {
      case "group":
        return (
          <NavGroup
            key={`${item.id}_${idx}`}
            item={item}
            openIdx={openIdx}
            setOpenIdx={setOpenIdx}
            hideMobileSidebar={hideMobileSidebar}
          />
        );
      case "item":
        return <NavItem key={`${item.id}_${idx}`} item={item} level={0} hideMobileSidebar={hideMobileSidebar} />;
      default:
        return (
          <h6
            key={`${item.id}_${idx}`}
            className="text-lg text-red-600 text-center"
          >
            Menu Items Error
          </h6>
        );
    }
  });

  return <>{navItems}</>;
};

export default memo(MenuList);
