import React, { Ref } from "react";

// project imports
import { KeyedObject } from "@/types";

// ==============================|| CUSTOM MAIN CARD ||============================== //

export interface MainCardProps extends KeyedObject {
  border?: boolean;
  boxShadow?: boolean;
  children: React.ReactNode | string;
  style?: React.CSSProperties;
  content?: boolean;
  className?: string;
  contentClass?: string;
  contentSX?: any;
  darkTitle?: boolean;
  sx?: any;
  secondary?: any;
  shadow?: string;
  elevation?: number;
  title?: React.ReactNode | string;
  onClick?: () => void;
}

const MainCard = React.forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = "",
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      titleComponent,
      ...others
    }: MainCardProps,
    ref: Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      {...others}
      className="text-[rgba(0,0,0,0.87)] overflow-hidden bg-transparent shadow-none"
    >
      {!darkTitle && title && (
        <div className="flex items-center justify-between p-6 overflow-x-auto">
          {title}
          {secondary}
        </div>
      )}
      {darkTitle && title && (
        <div className="p-6">
          {!titleComponent ? <h3>{title}</h3> : titleComponent}
          {secondary}
        </div>
      )}

      {title && <hr />}

      {content && (
        <div className={`${contentSX} ${contentClass}` + " p-6"}>{children}</div>
      )}
      {!content && children}
    </div>
  )
);

MainCard.displayName = "MainCard";

export default MainCard;
