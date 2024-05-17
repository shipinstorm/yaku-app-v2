import {
  ForwardRefExoticComponent,
  RefAttributes,
  forwardRef,
  useEffect,
} from "react";
import { Link } from "react-router-dom";

import { useRouter, redirect } from "next/navigation";

// project imports
import useConfig from "@/hooks/useConfig";
import { useDispatch, useSelector } from "@/store";
import { activeItem, openDrawer } from "@/store/slices/menu";

// types
import { LinkTarget, NavItemType } from "@/types";
import { setPage } from "@/store/slices/subpageSlice";
import themeTypography from "@/themes/typography";

interface NavItemProps {
  item: NavItemType;
  level: number;
}

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }: NavItemProps) => {
  const router = useRouter();

  const { borderRadius } = useConfig();
  const dispatch = useDispatch();
  const { openItem } = useSelector<any>((state: any) => state.menu);

  let itemTarget: LinkTarget = "_self";
  if (item.target) {
    itemTarget = "_blank";
  }

  const MyComponent = forwardRef((props, ref: React.Ref<HTMLAnchorElement>) => (
    <Link ref={ref} {...props} to={item.url!} target={itemTarget} />
  ));

  MyComponent.displayName = "MyComponent";

  let listItemProps: {
    component:
      | ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement>>
      | string;
    href?: string;
    target?: LinkTarget;
  } = {
    component: MyComponent,
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: itemTarget };
  }

  const itemHandler = (id: string, title: string) => {
    dispatch(setPage(title));
    dispatch(activeItem([id]));
    dispatch(openDrawer(true));
    // router.push("/applications");
    redirect("/applications");
  };

  // active menu item on page load
  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split("/")
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch(setPage(item.title));
      dispatch(activeItem([item.id!]));
    }
    // eslint-disable-next-line
  }, []);
  const Icon = item?.icon!;

  return (
    <button
      {...listItemProps}
      disabled={item.disabled}
      className={`cursor-${
        item.hidden ? "not-allowed" : "pointer"
      } rounded-${borderRadius} mb-0.5 ${
        level > 1 ? "bg-transparent !important" : "bg-inherit"
      } py-${level > 1 ? 1 : 1.25} ${level > 0 ? `pl-${level * 6}` : "pl-6"}`}
      // selected={openItem?.findIndex((id: any) => id === item.id) > -1}
      onClick={() => itemHandler(item.id!, item.title as string)}
    >
      {level === 0 && item?.icon && (
        <Icon stroke="1.5" className="ml-1" />
        // <Icon stroke="1.5" className="ml-1" size="24px" />
      )}
      {item.hidden ? (
        <p
          className={`${
            openItem?.findIndex((id: any) => id === item.id) > -1
              ? "text-xl"
              : "text-base"
          } glitch layers text-gray-800`}
          data-text="???????"
          style={{
            animation: "paths 5s step-end infinite",
            letterSpacing: "6px",
            filter: "drop-shadow(0 1px 3px)",
          }}
        >
          ???????
        </p>
      ) : (
        <p
          className={`${
            openItem?.findIndex((id: any) => id === item.id) > -1
              ? "text-xl"
              : "text-base"
          } text-gray-800 font-medium`}
          style={{ marginLeft: "12px" }}
        >
          {item.title}
        </p>
      )}
      {item.caption && <p className="text-xs text-gray-500">{item.caption}</p>}
      {item.hidden && (
        <div className="font-medium bg-pink-main rounded-2xl">
          <span className="text-white px-2 py-1">SOON</span>
        </div>
      )}
      {item.soon && (
        <span className="font-medium bg-pink-main rounded-2xl text-white px-2 py-1">
          SOON
        </span>
      )}
      {item.hot && (
        <span className="font-medium bg-d48342 rounded-2xl text-white px-2 py-1">
          HOT
        </span>
      )}
      {item.new && (
        <span className="font-medium bg-4291d4 rounded-2xl text-white px-2 py-1">
          NEW
        </span>
      )}
      {item.chip && (
        <span
          className={`font-medium rounded-2xl px-2 py-1 ${
            item.chip.color === "primary"
              ? "bg-blue-500"
              : item.chip.color === "secondary"
              ? "bg-gray-500"
              : ""
          }`}
        >
          {item.chip.label}
        </span>
      )}
    </button>
  );
};

export default NavItem;
