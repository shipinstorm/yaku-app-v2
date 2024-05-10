import { Palette } from "./palette";

export default function componentStyleOverrides(borderRadius: number) {
  const mode = Palette.mode;
  const bgColor = mode === "dark" ? Palette.dark[800] : Palette.grey[50];
  const menuSelectedBack =
    mode === "dark" ? Palette.secondary.main + 15 : Palette.secondary.light;
  const menuSelected =
    mode === "dark" ? Palette.secondary.main : Palette.secondary.dark;

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: "4px",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: `${borderRadius}px`,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: Palette.text.dark,
          padding: "24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          alignItems: "center",
        },
        outlined: {
          border: "1px dashed",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: Palette.text.primary,
          paddingTop: "10px",
          paddingBottom: "10px",
          "&.Mui-selected": {
            color: menuSelected,
            backgroundColor: menuSelectedBack,
            "&:hover": {
              backgroundColor: menuSelectedBack,
            },
            "& .MuiListItemIcon-root": {
              color: menuSelected,
            },
          },
          "&:hover": {
            backgroundColor: menuSelectedBack,
            color: menuSelected,
            "& .MuiListItemIcon-root": {
              color: menuSelected,
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: Palette.text.primary,
          minWidth: "36px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: Palette.text.dark,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: Palette.text.dark,
          "&::placeholder": {
            color: Palette.text.secondary,
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: bgColor,
          borderRadius: `${borderRadius}px`,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor:
              mode === "dark" ? Palette.text.primary + 28 : Palette.grey[400],
          },
          "&:hover $notchedOutline": {
            borderColor: Palette.primary.light,
          },
          "&.MuiInputBase-multiline": {
            padding: 1,
          },
        },
        input: {
          fontWeight: 500,
          background: bgColor,
          padding: "15.5px 14px",
          borderRadius: `${borderRadius}px`,
          "&.MuiInputBase-inputSizeSmall": {
            padding: "10px 14px",
            "&.MuiInputBase-inputAdornedStart": {
              paddingLeft: 0,
            },
          },
        },
        inputAdornedStart: {
          paddingLeft: 4,
        },
        notchedOutline: {
          borderRadius: `${borderRadius}px`,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color:
              mode === "dark" ? Palette.text.primary + 50 : Palette.grey[300],
          },
        },
        mark: {
          backgroundColor: Palette.background.paper,
          width: "4px",
        },
        valueLabel: {
          color: mode === "dark" ? Palette.primary.main : Palette.primary.light,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiAutocomplete-tag": {
            background:
              mode === "dark"
                ? Palette.text.primary + 20
                : Palette.secondary.light,
            borderRadius: 4,
            color: Palette.text.dark,
            ".MuiChip-deleteIcon": {
              color:
                mode === "dark"
                  ? Palette.text.primary + 80
                  : Palette.secondary[200],
            },
          },
        },
        popper: {
          borderRadius: `${borderRadius}px`,
          boxShadow:
            "0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: Palette.divider,
          opacity: mode === "dark" ? 0.2 : 1,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: mode === "dark" ? Palette.dark.main : Palette.primary.dark,
          background:
            mode === "dark" ? Palette.text.primary : Palette.primary[200],
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-deletable .MuiChip-deleteIcon": {
            color: "inherit",
          },
        },
      },
    },
    MuiTimelineContent: {
      styleOverrides: {
        root: {
          color: Palette.text.dark,
          fontSize: "16px",
        },
      },
    },
    MuiTreeItem: {
      styleOverrides: {
        label: {
          marginTop: 14,
          marginBottom: 14,
        },
      },
    },
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiInternalDateTimePickerTabs: {
      styleOverrides: {
        tabs: {
          backgroundColor:
            mode === "dark" ? Palette.dark[900] : Palette.primary.light,
          "& .MuiTabs-flexContainer": {
            borderColor:
              mode === "dark"
                ? Palette.text.primary + 20
                : Palette.primary[200],
          },
          "& .MuiTab-root": {
            color: mode === "dark" ? Palette.text.secondary : Palette.grey[900],
          },
          "& .MuiTabs-indicator": {
            backgroundColor: Palette.primary.dark,
          },
          "& .Mui-selected": {
            color: Palette.primary.dark,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        flexContainer: {
          borderBottom: "1px solid",
          borderColor:
            mode === "dark" ? Palette.text.primary + 20 : Palette.grey[200],
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: "12px 0 12px 0",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor:
            mode === "dark" ? Palette.text.primary + 15 : Palette.grey[200],
          "&.MuiTableCell-head": {
            fontSize: "0.875rem",
            color: Palette.grey[600],
            fontWeight: 500,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: Palette.background.paper,
          background: Palette.text.primary,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
        },
      },
    },
  };
}
