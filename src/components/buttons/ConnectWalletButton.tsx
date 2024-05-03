import { Button } from "@mui/material";
import useWallets from "@/hooks/useWallets";
import { IconWallet } from "@tabler/icons-react";

const ConnectWalletButton = () => {
  const { showLoginDialog } = useWallets();
  return (
    <Button
      className="hidden md:flex text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2"
      sx={{ marginLeft: 1 }}
      color="secondary"
      variant="contained"
      onClick={() => showLoginDialog()}
    >
      <IconWallet className="mr-1" stroke={1.5} size="1.3rem" />
      Register/Login
    </Button>
  );
};
export default ConnectWalletButton;
