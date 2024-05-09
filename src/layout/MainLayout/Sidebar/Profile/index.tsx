/* eslint-disable no-nested-ternary */
import { useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";
import { useRouter } from "next/navigation";

import { isEmpty } from "lodash";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Popper,
  Stack,
  Typography,
  Grid,
  Button,
  Badge,
} from "@mui/material";
import {
  IconChevronDown,
  IconAward,
  IconBook,
  IconBrandDiscord,
  IconBrandTwitter,
} from "@tabler/icons-react";

// web3 imports
import { useWallet } from "@solana/wallet-adapter-react";

// project imports
import useAuth from "@/hooks/useAuth";
import { useDispatch, useSelector } from "@/store";
import { activeItem, openDrawer } from "@/store/slices/menu";
import { shortenAddress } from "@/utils/utils";
import { useToasts } from "@/hooks/useToasts";
import { useRequests } from "@/hooks/useRequests";
import MainCard from "@/components/cards/MainCard";
import ProfilePopperContext from "../../../../components/profiles/ProfilePopperContent";

import { IMAGE_PROXY, DEFAULT_IMAGE_URL } from "@/config/config";
import DiscordLogo from "@/components/icons/DiscordLogo";
import TwitterLogo from "@/components/icons/TwitterLogo";
import { setPage } from "@/store/slices/subpageSlice";
import { useEthcontext } from "@/contexts/EthWalletProvider";
// ==============================|| SIDEBAR MENU LIST ||============================== //

const Profile = ({ noPopper, asButton = false }: any) => {
  const theme = useTheme();
  const auth = useAuth();
  const router = useRouter();
  const mainWallet = useWallet();
  const { ethAddress, ethConnected } = useEthcontext();
  const { publicKey } = mainWallet;
  const { showInfoToast } = useToasts();
  const { getDiscordAuthLink, getTwitterAuthLink } = useRequests();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<any>(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }

    prevOpen.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleToggle = () => {
    if (noPopper) {
      return;
    }
    setOpen((prev) => !prev);
  };

  const handleDiscordConnect = async () => {
    showInfoToast("Redirect to discord authentication site...");
    const url = await getDiscordAuthLink({
      redirectUri: window.location.origin,
    });
    window.open(url);
  };

  const handleTwitterConnect = async () => {
    showInfoToast("Redirect to twitter authentication site...");
    const url = await getTwitterAuthLink({
      address: mainWallet.publicKey?.toBase58()!,
      redirectUri: window.location.origin,
    });
    window.open(url);
  };

  const handleClose = (
    event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent
  ) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const getAvatar = (proxy = IMAGE_PROXY) => {
    if (auth.user?.avatar) {
      return `${proxy}${auth.user?.avatar}`;
    }
    if (auth.user?.discord?.avatar) {
      return `${proxy}https://cdn.discordapp.com/avatars/${auth.user?.discord?.id}/${auth.user?.discord?.avatar}.png`;
    }
    return `${proxy}${DEFAULT_IMAGE_URL}`;
  };

  const dispatch = useDispatch();
  const { openItem } = useSelector<any>((state: any) => state.menu);

  const handleClick = () => {
    dispatch(setPage("Profile"));
    dispatch(activeItem(["profile"]));
    dispatch(openDrawer(true));
    router.push("/account");
  };

  return (
    <>
      {!noPopper ? (
        <>
          <MainCard
            border={false}
            content={false}
            style={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.dark[200]
                  : "transparent",
            }}
          >
            {mainWallet.publicKey && (
              <Box sx={{ m: 1, mb: 0 }}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  justifyContent="flex-start"
                  sx={{ width: "100%" }}
                >
                  <Avatar
                    src={getAvatar()}
                    sx={{
                      ...theme.typography.largeAvatar,
                      margin: "8px 8px 8px 4px !important",
                      cursor: noPopper ? "inherit" : "pointer",
                      backgroundColor: "transparent",
                    }}
                    aria-controls={open ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    color="inherit"
                    onClick={() => router.push(`/bundle`)}
                  />
                  <Stack
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    sx={{ width: "100%" }}
                  >
                    <Grid
                      container
                      onClick={handleToggle}
                      sx={{
                        cursor: noPopper ? "inherit" : "pointer",
                        alignItems: "center",
                      }}
                    >
                      <Grid
                        item
                        xs={noPopper ? 12 : 10}
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
                            (publicKey &&
                              shortenAddress(publicKey?.toBase58(), 7))}
                        </Typography>
                      </Grid>
                      {!noPopper && (
                        <Grid
                          item
                          xs={2}
                          sx={{
                            minHeight: 24,
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <IconChevronDown
                            aria-controls={open ? "menu-list-grow" : undefined}
                            aria-haspopup="true"
                          />
                        </Grid>
                      )}
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
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <IconBrandTwitter style={{ height: 14 }} /> @
                            {auth.user?.twitter?.username}
                          </Typography>
                        </div>
                      )}
                    </Grid>
                  </Stack>
                </Stack>
              </Box>
            )}
          </MainCard>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 1 }}
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
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<IconBook />}
                >
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
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<IconAward />}
                >
                  Rewards
                </Button>
              </Link>
            </Badge>
          </Stack>
        </>
      ) : (
        (publicKey || ethConnected) && (
          <Typography
            variant="caption"
            sx={{
              ...theme.typography.menuCaption,
              my: "10px",
              py: "12px",
              borderRadius: "8px",
              color:
                openItem.findIndex((el: any) => el === "profile") > -1
                  ? "#f38aff"
                  : "",
              backgroundColor:
                openItem.findIndex((el: any) => el === "profile") > -1
                  ? "#f38aff15"
                  : "",
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                color: "#f38aff",
              },
            }}
            className={asButton ? "!bg-elevation1 !rounded-xl" : ""}
            display="block"
            gutterBottom
            onClick={handleClick}
          >
            <Grid
              container
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={getAvatar()}
                  sx={{
                    width: "24px",
                    height: "24px",
                    marginLeft: "4px",
                    objectFit: "cover",
                    cursor: noPopper ? "inherit" : "pointer",
                    backgroundColor: "transparent",
                  }}
                  aria-controls={open ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  color="inherit"
                />
              </Grid>
              <Grid
                item
                xs={9}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ fontWeight: 500 }} noWrap>
                  My Profile
                </Typography>
              </Grid>
            </Grid>
          </Typography>
        )
      )}
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{
          zIndex: 3000,
          position: "absolute",
          transform:
            auth.user?.twitter?.username && auth.user?.discord?.id
              ? "translate(0px, 80px)"
              : "translate(0px, 60px)",
          inset: "0px auto auto 0px",
        }}
      >
        {({ TransitionProps }) => (
          <ProfilePopperContext
            open={open}
            handleClose={handleClose}
            TransitionProps={TransitionProps}
          />
        )}
      </Popper>
    </>
  );
};

export default memo(Profile);
