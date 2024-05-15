import ProfileIcon from "./ProfileIcon";

import themeTypography from "@/themes/typography";

const ProfileAvatarIconButton = ({ ref, controls, onClick, hasPopup }: any) => {
  return (
    <button
      className="inline-flex justify-center relative box-border bg-transparent outline-none border-0 m-0 ml-3 cursor-pointer select-none align-middle text-center text-white text-3xl h-8.5 p-0 items-center rounded-full transition-all duration-200 ease-in-out"
      tabIndex={0}
      type="button"
      ref={ref}
      aria-controls={controls}
      aria-haspopup={hasPopup}
      onClick={onClick}
    >
      <ProfileIcon
        sx={{
          ...themeTypography.mediumAvatar,
          margin: "0 !important",
          cursor: "pointer",
          backgroundColor: "transparent",
        }}
        ref={ref}
        controls={controls}
        hasPopup={hasPopup}
      />
    </button>
  );
};

export default ProfileAvatarIconButton;
