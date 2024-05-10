import { alpha, Theme } from "@mui/material/styles";

import { Palette } from "./palette";

const createCustomShadow = (color: string) => {
  const transparent = alpha(color, 0.24);
  return {
    button:
      Palette.mode === "dark" ? `0 2px 0 rgb(0 0 0 / 5%)` : `0 2px #0000000b`,

    z1:
      Palette.mode === "dark"
        ? `0px 1px 1px rgb(0 0 0 / 14%), 0px 2px 1px rgb(0 0 0 / 12%), 0px 1px 3px rgb(0 0 0 / 20%)`
        : `0px 1px 4px ${alpha(Palette.grey[900], 0.08)}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z12: `0 12px 24px 0 ${transparent} 0 10px 20px 0 ${transparent}`,
    z16: `0 0 3px 0 ${transparent} 0 14px 28px -5px ${transparent}`,
    z20: `0 0 3px 0 ${transparent} 0 18px 36px -5px ${transparent}`,
    z24: `0 0 6px 0 ${transparent} 0 21px 44px 0 ${transparent}`,

    primary: `0px 12px 14px 0px ${alpha(Palette.primary.main, 0.3)}`,
    secondary: `0px 12px 14px 0px ${alpha(Palette.secondary.main, 0.3)}`,
    orange: `0px 12px 14px 0px ${alpha(Palette.orange.main, 0.3)}`,
    success: `0px 12px 14px 0px ${alpha(Palette.success.main, 0.3)}`,
    warning: `0px 12px 14px 0px ${alpha(Palette.warning.main, 0.3)}`,
    error: `0px 12px 14px 0px ${alpha(Palette.error.main, 0.3)}`,

    primaryTest: `0 0 0 2px ${alpha(Palette.primary.main, 0.2)}`,
    secondaryTest: `0 0 0 2px ${alpha(Palette.secondary.main, 0.2)}`,
    errorTest: `0 0 0 2px ${alpha(Palette.error.main, 0.2)}`,
    warningTest: `0 0 0 2px ${alpha(Palette.warning.main, 0.2)}`,
    // infoTest: `0 0 0 2px ${alpha(Palette.info.main, 0.2)}`,
    successTest: `0 0 0 2px ${alpha(Palette.success.main, 0.2)}`,
    grey: `0 0 0 2px ${alpha(Palette.grey[500], 0.2)}`,
  };
};

export default function customShadows(mode: string) {
  return mode === "dark"
    ? createCustomShadow(Palette.dark.main)
    : createCustomShadow(Palette.grey[600]);
}
