const ProfilePopperButton = ({ onClick, icon, label }: any) => {
  return (
    <div
      className="flex items-center justify-start p-1 mb-2 rounded hover:bg-primary-dark cursor-pointer transition-all duration-100 ease-in-out"
      onClick={onClick}
    >
      <div className="flex items-center justify-center cursor-pointer">
        {icon}
      </div>
      <div className="flex flex-col items-start justify-start ml-1">
        <p className="font-bold text-base">{label}</p>
      </div>
    </div>
  );
};

export default ProfilePopperButton;
