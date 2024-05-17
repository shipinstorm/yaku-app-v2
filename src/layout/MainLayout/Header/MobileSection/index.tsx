import { useEffect, useRef, useState } from "react";

// project imports
// import LocalizationSection from "../LocalizationSection";

// assets
import { IconDotsVertical } from "@tabler/icons-react";

import { Palette } from "@/themes/palette";

// ==============================|| MOBILE HEADER ||============================== //

const MobileSection = () => {
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<any>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <span className="mt-1 ml-1">
        <button
          className={`text-${
            Palette.mode === "dark" ? "primary" : "inherit"
          } ml-0.5 cursor-pointer`}
          onClick={handleToggle}
        >
          <IconDotsVertical
            stroke={1.5}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            style={{ fontSize: "1.5rem" }}
          />
        </button>
      </span>

      {/* <div className="bg-white">
        {open && (
          <header className="bg-white">
            <div className="py-11">
              <div className="container mx-auto">
                <div className="flex justify-between items-center">
                  <LocalizationSection />
                </div>
              </div>
            </div>
          </header>
        )}
      </div> */}
    </>
  );
};

export default MobileSection;
