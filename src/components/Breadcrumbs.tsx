/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// project imports
import { BASE_PATH } from "@/config";

import { Palette } from "@/themes/palette";

// assets
import { ApartmentOutlined, HomeFilled, HomeOutlined } from "@ant-design/icons";

import { NavItemType, NavItemTypeObject, OverrideIcon } from "@/types";
import { each, find, get } from "lodash";

interface BreadCrumbSxProps extends React.CSSProperties {
  mb?: string;
  bgcolor?: string;
}

interface BreadCrumbsProps {
  card?: boolean;
  divider?: boolean;
  icon?: boolean;
  icons?: boolean;
  maxItems?: number;
  navigation?: NavItemTypeObject;
  rightAlign?: boolean;
  separator?: OverrideIcon;
  title?: boolean;
  titleBottom?: boolean;
  sx?: BreadCrumbSxProps;
}

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({
  card,
  divider = true,
  icon,
  icons,
  maxItems,
  navigation,
  rightAlign,
  separator,
  title,
  titleBottom,
  sx,
  ...others
}: BreadCrumbsProps) => {
  const [main, setMain] = useState<NavItemType | undefined>();
  const [item, setItem] = useState<NavItemType>();
  const [subItem, setSubItem] = useState<string>();

  const isClient = typeof window !== "undefined";

  const iconSX = {
    marginRight: "0.75rem",
    marginTop: `-0.25rem`,
    width: "1rem",
    height: "1rem",
    color: Palette.secondary.main,
  };

  // set active item state
  const getCollapse = (menu: NavItemTypeObject) => {
    if (menu.children) {
      each(menu.children, (collapse: NavItemType) => {
        if (collapse.type && collapse.type === "collapse") {
          getCollapse(collapse as { children: NavItemType[]; type?: string });
        } else if (collapse.type && collapse.type === "item") {
          if (
            isClient &&
            document.location.pathname === BASE_PATH + collapse.url
          ) {
            setMain(menu);
            setItem(collapse);
          }
        }
      });
    }
  };

  const handleVariablePath = (path: string) => {
    if (!path) {
      return;
    }
    const splitted = path.split("/");
    if (splitted.length > 1) {
      const [, groupPath, parentPath, varPath] = splitted;
      if (groupPath) {
        const mainMenu: any = find(
          navigation?.items,
          (menu: NavItemType | NavItemTypeObject, index: number) =>
            menu.type && menu.type === "group" && get(menu, "id") === groupPath
        );
        setMain(mainMenu);
        if (mainMenu && parentPath) {
          const foundItem = find(
            mainMenu.children,
            (itm: NavItemType) => get(itm, "id") === parentPath
          );
          if (!foundItem) {
            setSubItem(foundItem);
          } else {
            setItem(foundItem);
          }
        }
      }
      if (varPath) {
        setSubItem(varPath);
      }
    }
  };

  useEffect(() => {
    navigation?.items?.map(
      (menu: NavItemType | NavItemTypeObject, index: number) => {
        if (menu.type && menu.type === "group") {
          getCollapse(menu as { children: NavItemType[]; type?: string });
        }
        return false;
      }
    );
  });

  useEffect(() => {
    setMain(undefined);
    setItem(undefined);
    setSubItem("");
    handleVariablePath(window.location.pathname);
  }, [window.location.pathname]);

  // item separator
  const SeparatorIcon = separator!;
  const separatorIcon = separator ? (
    <SeparatorIcon style={{ fontSize: "0.75rem", marginTop: 2 }} />
  ) : (
    "/"
  );

  let mainContent;
  let itemContent;
  let subItemContent;
  let breadcrumbContent: React.ReactElement = <div className="mt-2" />;
  let itemTitle: NavItemType["title"] = "";
  let CollapseIcon;
  let ItemIcon;

  // collapse item
  if (main && main.type === "collapse") {
    CollapseIcon = main.icon;
    mainContent = (
      <a
        href={document.location.pathname}
        className="text-sm font-medium text-gray-500"
      >
        {icons && <CollapseIcon style={iconSX} />}
        {main.title}
      </a>
    );
  }

  // items
  if (item && item.type === "item") {
    itemTitle = item.title;

    ItemIcon = item.icon ? item.icon : ApartmentOutlined;
    itemContent = (
      <p className="text-sm text-gray-900">
        {icons && <ItemIcon style={iconSX} />}
        {itemTitle}
      </p>
    );

    if (subItem) {
      itemContent = (
        <a
          href={item.url || document.location.pathname}
          className="text-base font-medium text-gray-500"
        >
          {icons && <ItemIcon style={iconSX} />}
          {itemTitle}
        </a>
      );
    }

    subItemContent = (
      <p className="text-base text-gray-900">
        {icons && <ItemIcon style={iconSX} />}
        {subItem}
      </p>
    );

    // main
    if (item.breadcrumbs) {
      breadcrumbContent = (
        <div className="mt-2 mb-3 bg-transparent">
          <div
            className={`grid ${
              rightAlign ? "grid-cols-2" : "grid-rows-2"
            } gap-1`}
          >
            {title && !titleBottom && (
              <div>
                <h2 className="text-3xl font-bold">{item.title}</h2>
              </div>
            )}
            <div>
              <nav className="breadcrumb" aria-label="breadcrumb">
                <a
                  href="/home"
                  className="text-base text-primary font-medium"
                  style={{ textDecoration: "none" }}
                >
                  {icons ? (
                    <HomeOutlined style={iconSX} />
                  ) : (
                    <>
                      {icon ? (
                        <HomeFilled style={{ ...iconSX, marginRight: 0 }} />
                      ) : null}
                      {!icon || icons ? "Home" : null}
                    </>
                  )}
                </a>
                {mainContent}
                {itemContent}
                {subItem && subItemContent}
              </nav>
            </div>
            {title && titleBottom && (
              <div className={`mt-${card === false ? "1" : "4"}`}>
                <h2 className="text-3xl font-bold">{item.title}</h2>
              </div>
            )}
          </div>
          {card === false && divider !== false && <hr className="mt-2" />}
        </div>
      );
    }
  }

  return breadcrumbContent;
};

export default Breadcrumbs;
