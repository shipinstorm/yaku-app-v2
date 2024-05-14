import { IconWallet } from "@tabler/icons-react";

import useWallets from "@/hooks/useWallets";

const ConnectWalletButton = () => {
  const { showLoginDialog } = useWallets();

  return (
    <button
      className="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex md:flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2 ml-1 z-50"
      onClick={() => showLoginDialog()}
    >
      <IconWallet className="mr-1" stroke={1.5} size="1.3rem" />
      Register/Login
    </button>
  );
};
export default ConnectWalletButton;
