import React, { Ref, ExoticComponent, ReactElement } from "react";

// material-ui
import { Collapse, Fade, Box, Grow, Slide, Zoom } from "@mui/material";

// ==============================|| TRANSITIONS ||============================== //

type TransitionTypes = "grow" | "collapse" | "fade" | "slide" | "zoom";
interface TSProps {
  children?: ReactElement;
  position?: string;
  sx?: React.CSSProperties;
  in?: boolean;
  type?: TransitionTypes;
  direction?: "up" | "right" | "left" | "down";
  [others: string]: any;
}

const Transitions = React.forwardRef(
  (
    { children, position, sx, type, direction, ...others }: TSProps,
    ref: Ref<ExoticComponent>
  ) => {
    const transformOriginMap: any = {
      bottom: "bottom",
      "bottom-left": "bottom left",
      "bottom-right": "bottom right",
      top: "top",
      "top-left": "0 0 0",
      "top-right": "top right",
    };
    const positionSX = {
      transformOrigin: transformOriginMap[position || ""] || "0 0 0",
    };

    const transitionsByType = (transitionType?: TransitionTypes) => {
      switch (transitionType) {
        case "grow":
          return (
            <Grow {...others}>
              <Box sx={positionSX}>{children}</Box>
            </Grow>
          );
        case "collapse":
          return (
            <Collapse {...others} sx={positionSX}>
              {children}
            </Collapse>
          );
        case "fade":
          return (
            <Fade
              {...others}
              timeout={{
                appear: 500,
                enter: 600,
                exit: 400,
              }}
            >
              <Box sx={positionSX}>{children}</Box>
            </Fade>
          );
        case "slide":
          return (
            <Slide
              {...others}
              timeout={{
                appear: 0,
                enter: 400,
                exit: 200,
              }}
              direction={direction}
            >
              <Box sx={positionSX}>{children}</Box>
            </Slide>
          );
        case "zoom":
          return (
            <Zoom {...others}>
              <Box sx={positionSX}>{children}</Box>
            </Zoom>
          );
        default:
          return <></>;
      }
    };

    return <Box ref={ref}>{transitionsByType(type)}</Box>;
  }
);

Transitions.defaultProps = {
  type: "grow",
  position: "top-left",
  direction: "up",
};

Transitions.displayName = "Transitions";

export default Transitions;
