/* eslint-disable react-hooks/exhaustive-deps */
import {
  Avatar,
  Stack,
  Typography,
  useTheme,
  Divider,
  Box,
} from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import SolanaIcon from "@/components/icons/SolanaIcon";
import { YAKU_TOKEN_ICON } from "@/config/config";
import { useMeta } from "@/contexts/meta/meta";
import useConnections from "@/hooks/useConnetions";
import { useEffect, useState } from "react";

const WalletValueSection = ({
  title,
  wallet,
  open,
  handleWithdraw,
  showEscrow,
  escrowBal,
}: any) => {
  const theme = useTheme();
  const { connection } = useConnections();
  const mainWallet = useWallet();
  const { fetchBalance, fetchYakuBalance } = useMeta();

  const [balance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);

  const updateView = async () => {
    const bal = await fetchBalance(new PublicKey(wallet), connection);
    setBalance(bal);
    const ybal = await fetchYakuBalance(
      new PublicKey(wallet),
      connection,
      mainWallet
    );
    setTokenBalance(ybal);
  };

  useEffect(() => {
    updateView();
  }, [wallet]);
  return (
    <>
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        justifyContent="flex-start"
        sx={{ p: 0.5 }}
      >
        <SolanaIcon />
        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Typography variant="body1" fontWeight="400" sx={{ ml: 1 }}>
            {title}
          </Typography>
          {wallet && (
            <Typography variant="body1" fontWeight="800" sx={{ ml: 1 }}>
              {(balance || 0).toLocaleString()} ◎
            </Typography>
          )}
        </Stack>
      </Stack>
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        justifyContent="flex-start"
        sx={{ p: 0.5 }}
      >
        <Avatar
          src={YAKU_TOKEN_ICON}
          sx={{
            ...theme.typography.mediumAvatar,
            cursor: "pointer",
            width: 24,
            height: 24,
          }}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          color="inherit"
        />
        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          {wallet && (
            <Typography variant="body1" fontWeight="800" sx={{ ml: 1 }}>
              {(tokenBalance || 0).toLocaleString()} ◎
            </Typography>
          )}
        </Stack>
      </Stack>
      <Divider />
      {showEscrow && (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 0.5, mt: 1 }}
        >
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <SolanaIcon />
            <Stack
              direction="column"
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              <Typography
                variant="body1"
                fontWeight="400"
                sx={{ ml: 1 }}
                noWrap
              >
                Bidding Wallet
              </Typography>
              {escrowBal !== undefined && (
                <Typography variant="body1" fontWeight="800" sx={{ ml: 1 }}>
                  {(escrowBal || 0).toLocaleString()} ◎
                </Typography>
              )}
            </Stack>
          </Box>
          {/* <Tooltip title="Withdraw"> */}
          <button
            className="inline-flex items-center justify-center relative box-border bg-transparent outline-none border-0 user-select-none align-middle text-capitalize font-inter text-xs leading-7 min-w-16 px-1 py-1.5 transition-colors duration-250 ease-in-out font-medium rounded-md hover:bg-gray-100 hover:shadow-md hover:border-gray-300 hover:text-gray-700 disabled:text-white disabled:text-opacity-30 disabled:hover:bg-inherit"
            onClick={() => handleWithdraw()}
            disabled={(escrowBal?.getMEEscrowBalance?.balance || 0) === 0}
          >
            Withdraw
          </button>
          {/* </Tooltip> */}
        </Stack>
      )}
    </>
  );
};

export default WalletValueSection;
