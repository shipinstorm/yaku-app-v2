import React, { Ref } from "react";

// material-ui
import {
  CardContent,
  CardHeader,
  Divider,
  Typography,
  CardProps,
  CardHeaderProps,
  CardContentProps,
} from "@mui/material";

// project imports
import { KeyedObject } from "@/types";

// constant
const headerSX = {
  "& .MuiCardHeader-action": { mr: 0 },
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

export interface MainCardProps extends KeyedObject {
  border?: boolean;
  boxShadow?: boolean;
  children: React.ReactNode | string;
  style?: React.CSSProperties;
  content?: boolean;
  className?: string;
  contentClass?: string;
  contentSX?: CardContentProps["sx"];
  darkTitle?: boolean;
  sx?: CardProps["sx"];
  secondary?: CardHeaderProps["action"];
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
      {/* card header and action */}
      {!darkTitle && title && (
        <CardHeader sx={headerSX} title={title} action={secondary} />
      )}
      {darkTitle && title && (
        <CardHeader
          sx={headerSX}
          title={
            !titleComponent ? (
              <Typography variant="h3">{title}</Typography>
            ) : (
              titleComponent
            )
          }
          action={secondary}
        />
      )}

      {/* content & header divider */}
      {title && <Divider />}

      {/* card content */}
      {content && (
        <CardContent sx={contentSX} className={contentClass}>
          {children}
        </CardContent>
      )}
      {!content && children}
    </div>
  )
);

MainCard.displayName = "MainCard";

export default MainCard;
