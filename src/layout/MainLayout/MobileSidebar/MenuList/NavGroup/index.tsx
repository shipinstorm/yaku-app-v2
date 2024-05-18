/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useState } from "react";
import Collapsible from "react-collapsible";

import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useWallet } from "@solana/wallet-adapter-react";

// project imports

import { useAccess } from "@/hooks/useAccess";
import useAuth from "@/hooks/useAuth";
import useStaked from "@/hooks/useStaked";

import { GenericCardProps } from "@/types";

import NavItem from "../NavItem";
// import NavCollapse from "../NavCollapse";

import themeTypography from "@/themes/typography";

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

export interface NavGroupProps {
  item: {
    id?: string;
    type?: string;
    icon?: GenericCardProps["iconPrimary"];
    children?: NavGroupProps["item"][];
    title?: ReactNode | string;
    caption?: ReactNode | string;
    checkAccess?: boolean;
    color?: "primary" | "secondary" | "default";
    defaultOpen?: boolean;
    hidden?: boolean;
  };
  openIdx: any;
  setOpenIdx: React.Dispatch<any>;
}

const NavGroup = ({ item, openIdx, setOpenIdx }: NavGroupProps) => {
  const { checkAccess } = useAccess();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const { pass, yakuPass } = useAuth();
  const { isLoading } = useStaked();

  // menu list collapse & items
  const items = item.children?.map((menu) => {
    if (menu.hidden) {
      return <div key={menu.id}></div>;
    }
    switch (menu.type) {
      // case "collapse":
      //   return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case "item":
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <p
            key={menu.id}
            className="text-lg font-bold text-red-500 text-center"
          >
            Menu Items Error
          </p>
        );
    }
  });

  const updateSection = async () => {
    if (item.checkAccess) {
      setLoading(true);
      if (publicKey && !isLoading) {
        const hasAccess = await checkAccess(publicKey);
        setCanAccess(hasAccess);
        if (hasAccess) {
          pass();
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (item && item.defaultOpen) {
      setOpenIdx(item.id);
    }
    if (!yakuPass) {
      updateSection();
    } else {
      setCanAccess(yakuPass);
    }
  }, []);

  const ListComponentHeader = ({ open }: any) => {
    const Icon = item?.icon!;
    return (
      (item.title && (
        <p className="text-sm font-medium text-gray-700 my-2 cursor-pointer">
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center">
              {item?.icon && <Icon className="ml-1" />}
            </div>
            <div className="flex flex-col justify-center ml-2">
              {item.title}
              {item.caption && (
                <p className="text-xs text-gray-500">{item.caption}</p>
              )}
            </div>
            <div className="flex items-center">
              {open ? <IconChevronUp /> : <IconChevronDown />}
            </div>
          </div>
        </p>
      )) || <></>
    );
  };

  const ListSection = ({ children, groupId }: any) => (
    <Collapsible
      transitionTime={100}
      transitionCloseTime={100}
      easing="ease-in-out"
      open={groupId === openIdx}
      trigger={<ListComponentHeader open={groupId === openIdx} />}
      triggerWhenOpen={<ListComponentHeader open={groupId === openIdx} />}
      onOpen={() => setOpenIdx(groupId)}
      onClose={() => setOpenIdx(-1)}
    >
      {children}
    </Collapsible>
  );

  return (
    <>
      {item.checkAccess ? (
        <>
          {canAccess ? (
            <>
              {!loading ? (
                <>
                  <ListSection groupId={item.id}>{items}</ListSection>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              {!loading ? (
                <></>
              ) : (
                <>
                  <ListSection groupId={item.id}>
                    <p className="text-xs font-medium text-gray-600">
                      <div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-4 w-4 mr-2"></div>
                      Checking your NFT
                    </p>
                  </ListSection>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <ListSection groupId={item.id}>{items}</ListSection>
        </>
      )}
    </>
  );
};

export default NavGroup;
