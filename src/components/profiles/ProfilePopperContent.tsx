/* eslint-disable no-nested-ternary */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRouter } from "next/navigation";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  ClickAwayListener,
  Divider,
  Paper,
  Stack,
  Typography,
  Grid,
  Button,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  IconPower,
  IconBook,
  IconBrandDiscord,
  IconBrandTwitter,
  IconBookUpload,
  IconEye,
  IconAward,
  IconPlus,
  IconBriefcase,
} from "@tabler/icons-react";

// web3 imports
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";

// project imports
import MainCard from "@/components/cards/MainCard";
import { shortenAddress } from "@/utils/utils";
import Transitions from "@/components/Transitions";

// third party
import Cookies from "js-cookie";
import useAuth from "@/hooks/useAuth";
import { isEmpty, isObject, map } from "lodash";
import { useToasts } from "@/hooks/useToasts";
import useConnections from "@/hooks/useConnetions";
import { useBundleView } from "@/contexts/BundleWalletContext";
import { usePlayerView } from "@/contexts/PlayerWalletContext";
import WalletValueSection from "@/components/profiles/WalletValueSection";
import { useEthcontext } from "@/contexts/EthWalletProvider";
import { useRequests } from "@/hooks/useRequests";
import DiscordLogo from "@/components/icons/DiscordLogo";
import TwitterLogo from "@/components/icons/TwitterLogo";
import MetamaskLogo from "@/components/icons/MetamaskLogo";
import ProfileIcon from "./ProfileIcon";
import EthLogo from "@/components/icons/EthLogo";
import ProfilePopperButton from "./ProfilePopperButton";
import useLocalStorage from "@/hooks/useLocalStorage";
import useWallets from "@/hooks/useWallets";
import useStaked from "@/hooks/useStaked";

import { Palette } from "@/themes/palette";
import useGame from "@/hooks/useGame";

const ProfilePopperContext = ({
  showProfile,
  open,
  handleClose,
  TransitionProps,
}: any) => {
  const { connection } = useConnections();
  const { ethAddress, ethConnected, ethConnect, ethBalance } = useEthcontext();
  const { setShowBundleView } = useBundleView();
  const { setShowPlayerView } = usePlayerView();
  const theme = useTheme();
  const auth = useAuth();
  const game = useGame();
  const router = useRouter();
  const mainWallet = useWallet();
  const { publicKey, wallet, disconnect } = mainWallet;
  const { showInfoToast } = useToasts();
  const {
    getDiscordAuthLink,
    getTwitterAuthLink,
    getWithdrawTx,
    getMEEscrowBalance,
  } = useRequests();
  const { showSuccessToast, showErrorToast, showTxErrorToast } = useToasts();
  const [escrowBal, setEscrowBal] = useState(0);
  const { setIsInited, setStakedYakuNfts, setNftList } = useStaked();

  const handleDiscordConnect = async () => {
    showInfoToast("Redirect to discord authentication site...");
    const url = await getDiscordAuthLink({
      redirectUri: window.location.origin,
    });
    window.open(url);
  };

  const handleTwitterConnect = async () => {
    if (!mainWallet.publicKey) return;
    showInfoToast("Redirect to twitter authentication site...");
    const url = await getTwitterAuthLink({
      address: mainWallet.publicKey?.toBase58(),
      redirectUri: window.location.origin,
    });
    window.open(url);
  };

  const handleLogout = async () => {
    try {
      await disconnect()
        .then(() => {
          Cookies.remove("auth-nonce");
          setIsInited(false);
          setStakedYakuNfts([]);
          setNftList([]);
          router.push("/home");
        })
        .catch(() => {
          // silent catch
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async () => {
    if (!escrowBal) {
      return;
    }
    if (!mainWallet.publicKey) {
      return;
    }
    try {
      const response = await getWithdrawTx({
        buyer: mainWallet.publicKey?.toBase58(),
        amount: escrowBal,
      });
      if ((response && response.data) || Object.keys(response).length > 0) {
        const transaction = Transaction.from(Buffer.from(response.txSigned));
        const res = await mainWallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(res);
        const getTransResp = await connection.getTransaction(res, {
          commitment: "confirmed",
        });
        if (isObject(getTransResp) && getTransResp?.meta?.err === null) {
          showSuccessToast(
            <Typography
              component="a"
              sx={{ color: "#fff" }}
              href={`https://solscan.io/tx/${res}`}
              target="_blank"
              rel="noreferrer"
              className="m-auto"
            >
              Successfully withdraw {escrowBal} SOL from bidding wallet.
            </Typography>
          );
        } else {
          showErrorToast("Fail to withdraw.");
        }
      }
    } catch (error) {
      showTxErrorToast(error);
    } finally {
      getMEEscrowBalance({
        wallet: mainWallet?.publicKey?.toBase58(),
      }).then((data: any) => setEscrowBal(data?.balance ?? 0));
    }
  };

  useEffect(() => {
    console.debug("eth connected", ethConnected);
    // eslint-disable-next-line
  }, [ethConnected, ethAddress]);

  const { showLoginDialog } = useWallets();

  const createGameWalletButton = {
    onClick: () => setShowPlayerView(true),
    icon: <IconPlus stroke={1.5} size="1.3rem" />,
    label: "Create Game Wallet",
  };

  /* ----------------- Fetch WorkSpaces ----------------- */
  const { workspaces } = useWallets();
  const [workspace, setWorkspace] = useLocalStorage("workspace", "");
  const createWorkspaceButton = {
    onClick: () => router.push("/workspaces/create"),
    icon: <IconPlus stroke={1.5} size="1.3rem" />,
    label: "Create Workspace",
  };
  const myWorkspaceButton = {
    onClick: () => router.push("/workspaces"),
    icon: <IconBriefcase stroke={1.5} size="1.3rem" />,
    label: "Other Workspace",
  };
  const stackButtons = [
    // {
    //   onClick: () => router.push("/bundle"),
    //   icon: <IconBook stroke={1.5} size="1.3rem" />,
    //   label: "View Bundle",
    // },
    // {
    //   onClick: () => setShowBundleView(true),
    //   icon: <IconBookUpload stroke={1.5} size="1.3rem" />,
    //   label: "Add Wallet to Bundle",
    // },
    {
      onClick: handleLogout,
      icon: <IconPower stroke={1.5} size="1.3rem" />,
      label: "Sign Out",
    },
  ];

  const [isConnected, setIsConnected] = useState<boolean>(false);
  useEffect(() => {
    setIsConnected(false);
    if (game.player.wallets) {
      game.player.wallets.map((wallet: any) => {
        if (wallet.address === auth.user.wallet) setIsConnected(true);
      });
    }
  }, [game, auth]);

  const Profile = (
    <>
      <MainCard
        border={false}
        content={false}
        style={{
          backgroundColor: "transparent",
        }}
      >
        {(mainWallet.connected || ethConnected) && (
          <Box className="pb-0 p-4">
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              justifyContent="flex-start"
              onClick={() => router.push("/account")}
              className={`${
                window.location.pathname.includes("workspaces")
                  ? "selected"
                  : "border-2 border-blue-main"
              } rounded-2xl w-full p-2 cursor-pointer`}
              sx={{
                "&:hover": {
                  transition: "all .1s ease-in-out",
                  background: Palette.primary.dark,
                },
              }}
            >
              <ProfileIcon
                sx={{
                  ...theme.typography.largeAvatar,
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
                controls={open ? "menu-list-grow" : undefined}
                hasPopup="true"
              />
              <Stack
                direction="column"
                alignItems="flex-start"
                justifyContent="flex-start"
                sx={{ width: "100%" }}
              >
                <Grid
                  container
                  sx={{ cursor: "pointer", alignItems: "center" }}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      minHeight: 24,
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Typography variant="h5" noWrap>
                      {auth.user?.vanity ||
                        auth.user?.discord?.name ||
                        auth.user?.twitter?.name ||
                        ((publicKey || ethAddress) &&
                          shortenAddress(
                            publicKey?.toBase58() || ethAddress,
                            7
                          ))}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ alignItems: "center", ml: -0.875 }}>
                  {auth.user?.discord?.name &&
                    auth.user?.discord?.discriminator && (
                      <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            alignItems: "center",
                          }}
                        >
                          <IconBrandDiscord style={{ height: 14 }} />{" "}
                          {`${auth.user?.discord?.name}#${auth.user?.discord?.discriminator}`}
                        </Typography>
                      </div>
                    )}
                  {auth.user?.twitter?.username && (
                    <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                      >
                        <IconBrandTwitter style={{ height: 14 }} /> @
                        {auth.user?.twitter?.username}
                      </Typography>
                    </div>
                  )}
                </Grid>
              </Stack>
            </Stack>
            {workspaces && workspaces.length > 0 && (
              <div className="py-2 flex-col gap-1 hidden md:flex">
                <h3 className="font-bold">WorkSpaces</h3>
                {map(
                  workspaces.length > 2 ? workspaces.slice(0, 2) : workspaces,
                  (workspaceItem: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${
                        window.location.pathname.includes("workspaces")
                          ? "border-2 border-blue-main"
                          : "selected"
                      } flex items-center gap-2 rounded-2xl w-full py-2 px-1 cursor-pointer duration-100 bg-transparent`}
                      onClick={() => {
                        setWorkspace(workspaceItem);
                        router.push("/workspaces/home");
                      }}
                    >
                      <div className="avatar-img !w-8 !h-8 flex-shrink-0">
                        {workspaceItem?.image && (
                          <img
                            src={workspaceItem?.image}
                            alt={workspaceItem?.name}
                          />
                        )}
                      </div>
                      <h4 className="font-semibold pl-1">
                        {workspaceItem?.name}
                      </h4>
                    </button>
                  )
                )}
                {workspaces.length > 2 && (
                  <ProfilePopperButton {...myWorkspaceButton} />
                )}
              </div>
            )}
          </Box>
        )}
      </MainCard>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        {!isEmpty(auth.user?.discord) ? (
          <>
            {!auth.user?.discord?.membership && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleDiscordConnect}
                sx={{
                  backgroundColor: "#5865F2",
                  "&:hover": {
                    backgroundColor:
                      "hsl(235,calc(var(--saturation-factor, 1)*86.1%),71.8%)",
                  },
                  gap: 1,
                }}
              >
                <DiscordLogo size={18} />
                Verify
              </Button>
            )}
          </>
        ) : (
          <>
            {auth.token && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleDiscordConnect}
                sx={{
                  backgroundColor: "#5865F2",
                  "&:hover": {
                    backgroundColor:
                      "hsl(235,calc(var(--saturation-factor, 1)*86.1%),71.8%)",
                  },
                  gap: 1,
                }}
              >
                <DiscordLogo size={18} />
                Connect
              </Button>
            )}
          </>
        )}
        {!auth.user?.twitter?.username && auth.token && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleTwitterConnect}
            sx={{
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#1D9BF022",
              },
              gap: 1,
              color: "#1D9BF0",
            }}
          >
            <TwitterLogo size="18" />
            Connect
          </Button>
        )}
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ marginTop: 10, display: "none" }}
      >
        <Badge variant="dot" color="secondary">
          <Link
            to={{
              pathname: `/quests`,
            }}
            style={{
              textDecoration: "none",
            }}
          >
            <Button variant="contained" size="small" startIcon={<IconBook />}>
              Quests
            </Button>
          </Link>
        </Badge>
        <Badge variant="dot" color="secondary">
          <Link
            to={{
              pathname: `/rewards`,
            }}
            style={{
              textDecoration: "none",
            }}
          >
            <Button variant="contained" size="small" startIcon={<IconAward />}>
              Rewards
            </Button>
          </Link>
        </Badge>
      </Stack>
    </>
  );

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Transitions in={open} {...TransitionProps}>
        <Paper className="bg-elevation1 rounded-3xl border border-line overflow-y-auto flex flex-col gap-3">
          {open && (
            <>
              {showProfile && Profile}
              <MainCard
                border={false}
                elevation={16}
                content={false}
                boxShadow
                shadow={theme.shadows[16]}
                sx={{ backgroundColor: "transparent" }}
              >
                {(mainWallet.connected || ethConnected) && (
                  <Box
                    sx={{
                      p: 2,
                      pt: 0,
                      width: "100%",
                      minWidth: 260,
                      [theme.breakpoints.down("md")]: {
                        minWidth: "100%",
                      },
                      color: "#D5D9E9",
                    }}
                  >
                    {auth.user?.vanity && (
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="flex-start"
                        sx={{ p: 0.5, maxWidth: "100%" }}
                      >
                        <Tooltip title="View Wallet Portfolio">
                          <Grid
                            container
                            sx={{ mt: 1, justifyContent: "space-between" }}
                          >
                            <Grid
                              item
                              xs={12}
                              sx={{
                                mb: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor:
                                  Palette.mode === "dark"
                                    ? "#09080d"
                                    : "primary.light",
                                borderRadius: ".75rem",
                                p: 1,
                                cursor: "pointer",
                                gap: 1,
                              }}
                              onClick={() =>
                                router.push(`/account/${auth.user?.wallet}`)
                              }
                            >
                              <IconEye />
                              <Typography noWrap>
                                {shortenAddress(auth.user?.wallet, 7)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Tooltip>
                      </Stack>
                    )}

                    {wallet && publicKey && (
                      <WalletValueSection
                        title="Main Wallet"
                        wallet={publicKey?.toBase58()}
                        open={open}
                        handleWithdraw={handleWithdraw}
                        showEscrow
                        escrowBal={escrowBal}
                      />
                    )}

                    <Divider sx={{ mt: 1, mb: 1 }} />
                    {ethConnected ? (
                      <>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          justifyContent="flex-start"
                          sx={{ p: 0.5, maxWidth: "100%" }}
                        >
                          <Grid
                            container
                            sx={{ mt: 1, justifyContent: "space-between" }}
                          >
                            <Grid
                              item
                              xs={12}
                              sx={{
                                mb: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor:
                                  Palette.mode === "dark"
                                    ? "#09080d"
                                    : "primary.light",
                                borderRadius: ".75rem",
                                p: 1,
                              }}
                            >
                              <Typography noWrap>
                                {ethAddress && shortenAddress(ethAddress, 7)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          justifyContent="flex-start"
                          sx={{ p: 0.5 }}
                        >
                          <EthLogo />
                          <Stack
                            direction="column"
                            alignItems="flex-start"
                            justifyContent="flex-start"
                          >
                            <Typography
                              variant="body1"
                              fontWeight="400"
                              sx={{ ml: 1 }}
                            >
                              Main Wallet
                            </Typography>
                            {ethConnected && (
                              <Typography
                                variant="body1"
                                fontWeight="800"
                                sx={{ ml: 1 }}
                              >
                                {(ethBalance || 0).toLocaleString()} ETH
                              </Typography>
                            )}
                          </Stack>
                        </Stack>
                      </>
                    ) : (
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mb: 1 }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => ethConnect()}
                          sx={{
                            backgroundColor: "#5865F2",
                            "&:hover": {
                              backgroundColor:
                                "hsl(235,calc(var(--saturation-factor, 1)*86.1%),71.8%)",
                            },
                            gap: 1,
                          }}
                        >
                          <MetamaskLogo size={18} />
                          <span style={{ whiteSpace: "nowrap" }}>
                            Connect Metamask
                          </span>
                        </Button>
                      </Stack>
                    )}
                    <Divider sx={{ mt: 1, mb: 1 }} />

                    {game.player.id ? (
                      <>
                        <Typography noWrap>Blockus Account</Typography>
                        <Grid
                          item
                          xs={12}
                          sx={{
                            mb: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor:
                              Palette.mode === "dark"
                                ? "#09080d"
                                : "primary.light",
                            borderRadius: ".75rem",
                            p: 1,
                          }}
                        >
                          <Typography noWrap>
                            {shortenAddress(
                              game.player.wallets[
                                game.player.wallets.length - 1
                              ].address,
                              7
                            )}
                          </Typography>
                        </Grid>
                        <div className="flex items-center justify-center">
                          {isConnected && (
                            <Typography noWrap>
                              Linked To Blockus Account
                            </Typography>
                          )}
                          {!isConnected && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => showLoginDialog()}
                              sx={{
                                backgroundColor: "#5865F2",
                                "&:hover": {
                                  backgroundColor:
                                    "hsl(235,calc(var(--saturation-factor, 1)*86.1%),71.8%)",
                                },
                                gap: 1,
                              }}
                            >
                              Link To Blockus Account
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <ProfilePopperButton {...createGameWalletButton} />
                    )}

                    <Divider sx={{ mt: 1, mb: 1 }} />

                    {/* {workspaces && workspaces?.length === 0 && (
                        <ProfilePopperButton {...createWorkspaceButton} />
                      )} */}
                    {map(stackButtons, (row: any, idx: number) => (
                      <ProfilePopperButton key={idx} {...row} />
                    ))}
                  </Box>
                )}
              </MainCard>
            </>
          )}
        </Paper>
      </Transitions>
    </ClickAwayListener>
  );
};

export default ProfilePopperContext;
