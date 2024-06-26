import { forwardRef, Ref } from "react";

// project-imports
import { KeyedObject } from "@/types";

import { Palette } from "@/themes/palette";

// main card
export interface MainCardProps extends KeyedObject {
  border?: boolean;
  boxShadow?: boolean;
  children: React.ReactNode | string;
  subheader?: React.ReactNode | string;
  content?: boolean;
  contentClass?: string;
  contentSX?: any;
  darkTitle?: boolean;
  divider?: boolean;
  elevation?: number;
  primary?: React.ReactNode | string;
  secondary?: React.ReactNode | string;
  shadow?: string;
  sx?: any;
  title?: React.ReactNode | string;
  onClick?: () => void;
}

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      subheader,
      content = true,
      contentSX = {},
      darkTitle,
      divider = true,
      elevation,
      primary,
      secondary,
      shadow,
      sx = {},
      title,
      titleSX = {},
      useBackdropFilter = true,
      ...others
    }: MainCardProps,
    ref: Ref<HTMLDivElement>
  ) => {
    boxShadow = Palette.mode === "dark" ? boxShadow || true : boxShadow;

    return (
      <div
        className={`relative card${useBackdropFilter ? "" : " no-filter"} ${
          elevation === 0 ? "shadow-none" : "shadow-md"
        } ${border ? "border border-purple-900" : ""}`}
        {...others}
      >
        {/* card header & action */}
        {!darkTitle && title && (
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div>{primary}</div>
              <div className="text-sm">{title}</div>
            </div>
            <div>{secondary}</div>
          </div>
        )}

        {darkTitle && title && (
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div>{primary}</div>
              <div>
                <h3 className="text-xl font-bold">{title}</h3>
              </div>
            </div>
            <div>{secondary}</div>
          </div>
        )}

        {/* content & header divider */}
        {title && divider && <hr className="border-t border-gray-200 my-4" />}

        {/* card content */}
        {content && <div className="p-0 md:p-6">{children}</div>}
        {!content && children}
      </div>
    );
  }
);

MainCard.displayName = "MainCard";

export default MainCard;
