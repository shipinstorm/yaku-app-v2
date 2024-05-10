import React, { ReactNode, Ref } from "react";

// material-ui
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";
import { Palette } from "@/themes/palette";

interface SubCardProps {
  children: ReactNode | string | null;
  content?: boolean;
  className?: string;
  contentClass?: string;
  darkTitle?: boolean;
  secondary?: ReactNode | string;
  sx?: {};
  contentSX?: {};
  title?: ReactNode | string;
}

// ==============================|| CUSTOM SUB CARD ||============================== //

const SubCard = React.forwardRef(
  (
    {
      children,
      className,
      content,
      contentClass,
      darkTitle,
      secondary,
      sx = {},
      contentSX = {},
      title,
      ...others
    }: SubCardProps,
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <Card
        ref={ref}
        sx={{
          border: "1px solid",
          borderColor:
            Palette.mode === "dark"
              ? Palette.dark.light + 15
              : Palette.primary.light,
          ":hover": {
            boxShadow:
              Palette.mode === "dark"
                ? "0 2px 14px 0 rgb(33 150 243 / 10%)"
                : "0 2px 14px 0 rgb(32 40 45 / 8%)",
          },
          ...sx,
        }}
        {...others}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader
            sx={{ p: 2.5 }}
            title={<Typography variant="h5">{title}</Typography>}
            action={secondary}
          />
        )}
        {darkTitle && title && (
          <CardHeader
            sx={{ p: 2.5 }}
            title={<Typography variant="h4">{title}</Typography>}
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && (
          <Divider
            sx={{
              opacity: 1,
              borderColor:
                Palette.mode === "dark"
                  ? Palette.dark.light + 15
                  : Palette.primary.light,
            }}
          />
        )}

        {/* card content */}
        {content && (
          <CardContent
            sx={{ p: 2.5, ...contentSX }}
            className={contentClass || ""}
          >
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

SubCard.defaultProps = {
  content: true,
};

SubCard.displayName = "SubCard";

export default SubCard;
