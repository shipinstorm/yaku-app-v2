const WalletButton = ({ children, ...props }: any) => {
  return (
    <button
      className="button-main-pink text-white font-bold py-2 px-4 rounded gap-5"
      {...props}
    >
      {children}
    </button>
  );
};

export default WalletButton;