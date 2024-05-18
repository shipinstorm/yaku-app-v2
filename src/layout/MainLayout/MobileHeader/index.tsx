import Image from "next/image";

import LogoSection from "../LogoSection";

interface MobilePopoverProps {
  buttons: any[];
  toggleMobileSidebar: () => void;
  showMobileSidebar: boolean;
}
const MobileHeader = ({
  buttons,
  toggleMobileSidebar,
  showMobileSidebar,
}: MobilePopoverProps) => {
  return (
    <div className="h-12 px-4 flex items-center">
      <div
        onClick={() => toggleMobileSidebar()}
        className="block cursor-pointer group relative z-[10001]"
      >
        <Image
          src={
            showMobileSidebar
              ? "./images/icons/menu-cross.svg"
              : "./images/icons/hamburger.svg"
          }
          alt="hamburger"
          width={32}
          height={32}
          id="navToggleIcon"
        />
      </div>

      <span className="xs:hidden md:flex items-center flex-grow">
        <LogoSection />
      </span>
    </div>
  );
};

export default MobileHeader;
