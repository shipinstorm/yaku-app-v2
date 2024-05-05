/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { TabContext, TabPanel } from "@mui/lab";
import { filter, map } from "lodash";

interface FolderCardProps {
  tabIdx: string;
  handleTabChange: Function;
  tabList: any;
  sx?: {};
  contentSX?: {};
}

const FolderCard = ({
  tabIdx,
  handleTabChange,
  tabList,
  sx,
  contentSX,
}: FolderCardProps) => (
  <TabContext value={tabIdx}>
    <div className="tabbed round">
      <ul>
        {map(
          filter(tabList, ({ hidden }) => !hidden),
          (tab) => (
            <li
              id="tokensTab"
              value={tab.name}
              className={`${tabIdx === tab.name && "active"}`}
              onClick={(e) => handleTabChange(e, tab.name)}
            >
              {tab.name}
            </li>
          )
        )}
      </ul>
    </div>
    <div className="bg-surface p-6 pt-5 rounded-tr-3xl rounded-b-3xl">
      {map(
        filter(tabList, ({ hidden }) => !hidden),
        (tab) => (
          <TabPanel value={tab.name} sx={{ p: 0 }}>
            {tab.component}
          </TabPanel>
        )
      )}
    </div>
  </TabContext>
);

export default FolderCard;
