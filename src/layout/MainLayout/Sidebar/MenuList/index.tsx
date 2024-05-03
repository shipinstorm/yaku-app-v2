import { memo, useState } from "react";

// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import NavItem from "./NavItem";
import menuItem from "@/menu-items";
import proItem from "@/menu-items/pro-items";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = ({ isPro }: any) => {
  const [openIdx, setOpenIdx] = useState<any>(-1);
  const menu = isPro ? proItem : menuItem;

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
          />
        );
      case "item":
        return <NavItem key={`${item.id}_${idx}`} item={item} level={0} />;
      default:
        return (
          <Typography
            key={`${item.id}_${idx}`}
            variant="h6"
            color="error"
            align="center"
          >
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default memo(MenuList);
