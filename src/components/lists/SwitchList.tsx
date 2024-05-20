import { Button, Tab, Typography } from "@mui/material";
import { TabList } from "@mui/lab";
import { map } from "lodash";

interface SwitchListProps {
  handleTabChange: Function;
  matchUpMd: boolean;
  tabIdx: string;
  tabList: any;
  icon?: any;
  sx?: {};
  contentSX?: {};
  bgcolor?: string;
  selectedBg?: string;
}

const SwitchList = ({
  handleTabChange,
  matchUpMd,
  tabIdx,
  tabList,
  icon,
  sx,
  contentSX,
  bgcolor,
  selectedBg,
}: SwitchListProps) => (
  <>
    {!matchUpMd && (
      <TabList
        onChange={() => handleTabChange()}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          ...sx,
          width: "100%",
          ".MuiTabs-root": {
            width: "100%",
          },
          ".MuiTabs-flexContainer": { borderBottom: "none" },
        }}
        textColor="secondary"
        indicatorColor="secondary"
      >
        {map(tabList, (tab) => (
          <Tab
            label={tab}
            id={`${tab}-tab`}
            value={tab}
            sx={{ minWidth: "auto" }}
          />
        ))}
      </TabList>
    )}
    {matchUpMd && (
      <div className="nft-collection">
        <Typography
          className={`${
            bgcolor || "bg-surface"
          } p-1 border border-line flex rounded-full max-h-9`}
          sx={{
            ...sx,
            ".MuiButton-contained": {
              backgroundColor: selectedBg || "rgb(45, 47, 51)",
            },
          }}
        >
          {map(tabList, (tab) => (
            <Button
              key={tab}
              className="rounded-full font-thin"
              sx={{
                ...contentSX,
                p: "4px 18px",
                minWidth: "auto",
                lineHeight: "auto",
                color: "rgba(255, 255, 255, 0.87)",
                fontSize: "0.775rem",
                ".MuiButton-startIcon": { marginRight: "5px", marginLeft: 0 },
              }}
              variant={tabIdx === tab ? "contained" : "text"}
              color="secondary"
              onClick={(e) => handleTabChange(e, tab)}
              startIcon={icon && icon[tab]}
            >
              {tab}
            </Button>
          ))}
        </Typography>
      </div>
    )}
  </>
);

export default SwitchList;
