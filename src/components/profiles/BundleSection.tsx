/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { map } from "lodash";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { IconX } from "@tabler/icons-react";
import { EyeOutlined } from "@ant-design/icons";
import { LockOutlined } from "@mui/icons-material";

import useAuth from "@/hooks/useAuth";
import { useToasts } from "@/hooks/useToasts";
import { useRequests } from "@/hooks/useRequests";

import MainCard from "../MainCard";
import SearchBox from "../inputs/SearchBox";

const BundleSection = ({ open, onClose }: any) => {
  const router = useRouter();
  const wallet = useWallet();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [dstAddress, setDstAddress] = useState("");
  const [bundleWallets, setBundleWallets] = useState<any[]>([]);
  const { getSubwallet, linkWallet, unlinkWallet } = useRequests();

  const { showErrorToast } = useToasts();

  const isPublicKey = (str: string) =>
    new Promise((resolve, reject) => {
      try {
        const result = PublicKey.isOnCurve(str);
        resolve(result);
      } catch (err) {
        resolve(false);
      }
    });
  const searchForAddress = async (addr: string) => {
    setDstAddress(addr);
    const isKey = await isPublicKey(addr);
    if (
      isKey &&
      !auth.user?.wallets?.includes(addr) &&
      addr !== auth.user.wallet
    ) {
      await handleLinkWallet(addr);
    } else {
      showErrorToast(`Address ${addr} is not valid to be linked.`);
      setDstAddress("");
    }
  };
  const handleLinkWallet = async (addr: string) => {
    if (!addr) {
      return;
    }

    try {
      if (wallet.publicKey && addr) {
        setIsLoading(true);
        await linkWallet({
          user: auth.user?.id,
          wallet: addr,
        });
        setDstAddress("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      updateSubWallets();
    }
  };

  const handleUnlinkWallet = async (addr: string) => {
    if (!addr) {
      return;
    }
    try {
      setIsUnlinking(true);
      await unlinkWallet({
        user: auth.user?.id,
        wallet: addr,
      });
    } catch (error) {
      console.error(error);
    } finally {
      await updateSubWallets();
      setIsUnlinking(false);
    }
  };

  const updateSubWallets = async () => {
    if (auth.user.id) {
      const subwallets = await getSubwallet({ user: auth.user.id });
      if (subwallets) {
        auth.setUserData({
          ...auth.user,
          wallets: map(subwallets, ({ wallet: address }: any) => address),
        });
        setBundleWallets([
          auth.user.wallet,
          ...map(subwallets, ({ wallet: address }: any) => address),
        ]);
      }
    }
  };

  useEffect(() => {
    updateSubWallets();
  }, [auth.user?.id]);

  return (
    <Dialog
      sx={{
        width: "100%",
        p: 2,
      }}
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        <DialogTitle>
          <Typography fontSize={18} fontWeight={700}>
            Manage Bundle
          </Typography>
          <Typography
            fontSize={14}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            Your bundle is private <LockOutlined sx={{ width: 16 }} />
          </Typography>
        </DialogTitle>
        <SearchBox
          sx={{ ml: 0, mb: 2 }}
          placeholder="Search for address"
          value={dstAddress}
          params={{ onChange: (e: any) => searchForAddress(e.target.value) }}
        />
        <Box sx={{ display: "flex", gap: 1, alignitems: "center", my: 2 }}>
          {isLoading && <Typography>Processing...</Typography>}
          {isUnlinking && <Typography>Unlinking...</Typography>}
          {(isLoading || isUnlinking) && <CircularProgress color="secondary" />}
        </Box>
        <MainCard border={false} sx={{ p: 1, backgroundColor: "#09080d" }}>
          <Typography fontSize={16} fontWeight={700}>
            Linked Wallet
          </Typography>
          <List>
            {map(bundleWallets, (w, i) => (
              <ListItem
                key={i}
                sx={{ justifyContent: "space-between", p: 0, width: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Tooltip title="View Wallet">
                    <IconButton onClick={() => router.push(`/account/${w}`)}>
                      <EyeOutlined />
                    </IconButton>
                  </Tooltip>
                  {w}
                </Box>
                {i > 0 && (
                  <IconButton onClick={() => handleUnlinkWallet(w)}>
                    <IconX />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </MainCard>
      </DialogContent>
    </Dialog>
  );
};

export default BundleSection;
