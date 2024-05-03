import { useSelector, useDispatch } from "react-redux";
import { ArrowBackIos } from "@mui/icons-material";
import type { RootState } from "@/store";
import { setSubpage } from "@/store/slices/subpageSlice";
import { map } from "lodash";
import LogoSection from "../LogoSection";

interface MobilePopoverProps {
  buttons: any[];
}
const MobileHeader = ({ buttons }: MobilePopoverProps) => {
  const { activePage, activeSubpage } = useSelector(
    (state: RootState) => state.subpage
  );
  const dispatch = useDispatch();

  return (
    <div className="h-12 px-4 flex items-center">
      <span className="xs:hidden md:flex items-center flex-grow">
        <LogoSection />
      </span>
      {activeSubpage !== "" && (
        <button
          type="button"
          className="bg-transparent"
          onClick={() => dispatch(setSubpage(""))}
        >
          <ArrowBackIos sx={{ fontSize: 20 }} />
        </button>
      )}
      <h3 className="text-white mr-auto text-lg font-bold">
        {activeSubpage || activePage}
      </h3>
      <div className="flex items-center gap-1">
        {buttons && map(buttons, (button: any) => button)}
      </div>
    </div>
  );
};

export default MobileHeader;
