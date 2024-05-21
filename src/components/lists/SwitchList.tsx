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
      <div
        className="flex overflow-x-auto scrollbar-hidden w-full"
        onChange={() => handleTabChange()}
      >
        {map(tabList, (tab) => (
          <button
            id="{tab}-tab"
            value="{tab}"
            className="px-4 py-2 min-w-auto"
            onClick={() => handleTabChange()}
          >
            {tab}
          </button>
        ))}
      </div>
    )}
    {matchUpMd && (
      <div className="nft-collection">
        <div
          className={`${
            bgcolor || "bg-surface"
          } p-1 border border-line flex rounded-full max-h-9`}
          // style={{
          //   ...sx,
          //   backgroundColor: selectedBg || "rgb(45, 47, 51)",
          // }}
        >
          {map(tabList, (tab) => (
            <button
              className={`rounded-full font-thin p-[4px_18px] min-w-auto leading-none text-[rgba(255,255,255,0.87)] text-[0.775rem] flex items-center justify-center ${
                tabIdx === tab ? "bg-secondary" : "bg-transparent"
              }`}
              onClick={(e) => handleTabChange(e, tab)}
            >
              {icon && icon[tab] && (
                <span className="mr-1 ml-0">{icon[tab]}</span>
              )}
              {tab}
            </button>
          ))}
        </div>
      </div>
    )}
  </>
);

export default SwitchList;
