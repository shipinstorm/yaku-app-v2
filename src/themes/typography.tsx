import { Palette } from "./palette";

const themeTypography = {
  h6: {
    fontWeight: 500,
    color: Palette.grey[600],
    fontSize: "0.75rem",
  },
  h5: {
    fontSize: "0.875rem",
    color: Palette.grey[600],
    fontWeight: 500,
  },
  h4: {
    fontSize: "1rem",
    color: Palette.grey[600],
    fontWeight: 600,
  },
  h3: {
    fontSize: "1.25rem",
    color: Palette.grey[600],
    fontWeight: 600,
  },
  h2: {
    fontSize: "1.5rem",
    color: Palette.grey[600],
    fontWeight: 700,
  },
  h1: {
    fontSize: "2.125rem",
    color: Palette.grey[600],
    fontWeight: 700,
  },
  subtitle1: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: Palette.text.dark,
  },
  subtitle2: {
    fontSize: "0.75rem",
    fontWeight: 400,
    color: Palette.text.secondary,
  },
  caption: {
    fontSize: "0.75rem",
    color: Palette.text.secondary,
    fontWeight: 400,
  },
  body1: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: "1.334em",
  },
  body2: {
    letterSpacing: "0em",
    fontWeight: 400,
    lineHeight: "1.5em",
    color: Palette.text.primary,
  },
  button: {
    textTransform: "capitalize",
  },
  customInput: {
    marginTop: 1,
    marginBottom: 1,
    "& > label": {
      top: 23,
      left: 0,
      color: Palette.grey[500],
      '&[data-shrink="false"]': {
        top: 5,
      },
    },
    "& > div > input": {
      padding: "30.5px 14px 11.5px !important",
    },
    "& legend": {
      display: "none",
    },
    "& fieldset": {
      top: 0,
    },
  },
  mainContent: {
    width: "100%",
    minHeight: "calc(100vh - 88px - 56px)",
    flexGrow: 1,
    marginTop: "88px",
    paddingRight: "15px",
    // borderRadius: `${borderRadius}px`,
  },
  menuCaption: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: Palette.grey[600],
    padding: "6px",
    textTransform: "capitalize",
    marginTop: "10px",
  },
  subMenuCaption: {
    fontSize: "0.6875rem",
    fontWeight: 500,
    color: Palette.text.secondary,
    textTransform: "capitalize",
  },
  commonAvatar: {
    cursor: "pointer",
    borderRadius: "8px",
  },
  smallAvatar: {
    width: "22px",
    height: "22px",
    fontSize: "1rem",
  },
  mediumAvatar: {
    width: "34px",
    height: "34px",
    fontSize: "1.2rem",
  },
  largeAvatar: {
    width: "44px",
    height: "44px",
    fontSize: "1.5rem",
  },
};

export default themeTypography;
