import { useMemo, ReactNode } from "react";

// material-ui
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider,
  Theme,
} from "@mui/material/styles";

// project import
import useConfig from "@/hooks/useConfig";
import Typography from "./typography";

import componentStyleOverrides from "./compStyleOverride";
import customShadows from "./shadows";

// types
import { CustomShadowProps } from "@/types/default-theme";
import { TypographyOptions } from "@mui/material/styles/createTypography";

interface Props {
  children: ReactNode;
}

export default function ThemeCustomization({ children }: Props) {
  const { borderRadius, fontFamily, mode, presetColor } = useConfig();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeTypography: TypographyOptions = useMemo<TypographyOptions>(
    () => Typography(borderRadius, fontFamily),
    [borderRadius, fontFamily]
  );
  const themeCustomShadows: CustomShadowProps = useMemo<CustomShadowProps>(
    () => customShadows(mode),
    [mode]
  );

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      direction: "ltr",
      mixins: {
        toolbar: {
          minHeight: "48px",
          padding: "16px",
          "@media (min-width: 600px)": {
            minHeight: "48px",
          },
        },
      },
      typography: themeTypography,
      customShadows: themeCustomShadows,
    }),
    [themeCustomShadows, themeTypography]
  );

  const themes: Theme = createTheme(themeOptions);
  themes.components = useMemo(
    () => componentStyleOverrides(borderRadius),
    [borderRadius]
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
