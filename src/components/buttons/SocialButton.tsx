const SocialButton = ({ title, link, icon, label }: any) => (
  <div className="relative inline-block">
    <div className="text-primary cursor-pointer inline-block">
      <button
        className={`text-secondary bg-elevation1 hover:bg-elevation1-hover hover:text-terciary rounded-xl text-sm font-medium w-full transition-all duration-200 ease-in-out flex items-center`}
        onClick={() => window.open(link)}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <p className="text-base">{label}</p>
      </button>
    </div>
    <div className="absolute z-10 px-2 py-1 bg-black text-white text-xs whitespace-nowrap opacity-0 invisible transition-opacity duration-300 -top-8 left-1/2 transform -translate-x-1/2">
      {title}
    </div>
  </div>
);

export default SocialButton;
