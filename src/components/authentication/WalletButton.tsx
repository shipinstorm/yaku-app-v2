const WalletButton = ({ children, ...props }: any) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded gap-5"
      {...props}
    >
      {children}
    </button>
  );
};

export default WalletButton;