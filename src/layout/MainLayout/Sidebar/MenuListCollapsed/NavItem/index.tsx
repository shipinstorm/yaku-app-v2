// project imports
import useConfig from "@/hooks/useConfig";
import { useSelector } from "@/store";

// types
import { NavItemType } from "@/types";

interface NavItemProps {
  item: NavItemType;
  level: number;
}

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }: NavItemProps) => {
  const { borderRadius } = useConfig();
  const { openItem } = useSelector<any>((state: any) => state.menu);

  const Icon = item?.icon!;
  const itemIcon = item?.icon ? (
    <Icon stroke="1.5" />
  ) : (
    // <Icon stroke="1.5" size="24px" />
    <></>
    // <FiberManualRecordIcon
    //   sx={{
    //     width: openItem.findIndex((id: any) => id === item?.id) > -1 ? 8 : 6,
    //     height: openItem.findIndex((id: any) => id === item?.id) > -1 ? 8 : 6,
    //   }}
    //   fontSize={level > 0 ? "inherit" : "medium"}
    // />
  );

  return (
    <button
      disabled={item.disabled}
      className={
        "flex items-center justify-center px-0 mb-0.5 w-full bg-transparent " +
        (item.hidden ? "not-allowed" : "pointer")
      }
      style={{ borderRadius: `${borderRadius}px` }}
      // selected={openItem?.findIndex((id: any) => id === item.id) > -1}
    >
      <div className="min-w-[unset]">{itemIcon}</div>
    </button>
  );
};

export default NavItem;
