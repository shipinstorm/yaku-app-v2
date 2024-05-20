"use client";

/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { filter, flatten, isEmpty, map, round } from "lodash";
import { IconWallet } from "@tabler/icons-react";
import dynamic from "next/dynamic";

import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Avatar,
  Box,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import Web3 from "web3";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import MainCard from "@/components/MainCard";

import { IMAGE_PROXY, YAKU_TOKEN_ICON } from "@/config/config";

import { useMeta } from "@/contexts/meta/meta";
import { ETH_WEI, useEthcontext } from "@/contexts/EthWalletProvider";

import { mutations, queries } from "@/graphql/graphql";

import useAuth from "@/hooks/useAuth";
import useAuthQuery from "@/hooks/useAuthQuery";
import useAuthMutation from "@/hooks/useAuthMutation";
import useConnections from "@/hooks/useConnetions";
import useStaked from "@/hooks/useStaked";
import { useRequests } from "@/hooks/useRequests";

import { shortenAddress } from "@/utils/utils";

const AvatarSectionNoSSR = dynamic(
  () => import("@/components/profile/AvatarSection"),
  {
    ssr: false,
  }
);

const NFTCollectionsViewNoSSR = dynamic(
  () => import("@/components/profile/NFTCollectionsView"),
  {
    ssr: false,
  }
);

const NFTsDialogNoSSR = dynamic(
  () => import("@/components/profile/NFTsDialog"),
  {
    ssr: false,
  }
);

const PortfolioChartNoSSR = dynamic(
  () => import("@/components/profile/PortfolioChart"),
  {
    ssr: false,
  }
);

const ProfileBannerNoSSR = dynamic(
  () => import("@/components/profile/ProfileBanner"),
  {
    ssr: false,
  }
);

const Profile = () => {
  const { connection } = useConnections();
  const { getWalletNfts } = useEthcontext();
  const theme = useTheme();
  const auth = useAuth();

  const { getStakedList, stakedYakuNfts: hookedYakuNfts } = useStaked();

  const mainWallet = useWallet();
  const { wallet = mainWallet.publicKey?.toBase58() } = useParams();
  const [nfts, setNfts] = useState<{ staked: any[]; nftsList: any[] }>({
    staked: [],
    nftsList: [],
  });
  const [ethNfts, setEthNfts] = useState<any[]>([]);
  const [walletStats, setWalletStats] = useState<any>({});
  const [balance, setBalance] = useState<any>(0);
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState<any>(0);
  const [profilePic, setProfilePic] = useState<any>();
  const [displayName, setDisplayName] = useState<any>("");
  const [ownedNftCount, setOwnedNftCount] = useState<number>(0);
  const [collections, setCollections] = useState<any[]>([]);
  const [netWorth, setNetWorth] = useState<number>(0);
  const { fetchBalance, fetchYakuBalance } = useMeta();
  const [showSelectNft, setShowSelectNft] = useState(false);
  const { getNFTsByOwner, getToken } = useRequests();
  const { data: walletUser } = useAuthQuery(queries.USER, {
    variables: {
      wallet,
    },
  });
  const { data: followed, refetch: fetchIsFollowed } = useAuthQuery(
    queries.IS_FOLLOWED,
    {
      skip: !auth?.user?.id,
      variables: {
        user: auth?.user?.id,
        wallet,
      },
    }
  );
  const { data: followers, refetch: fetchFollowers } = useAuthQuery(
    queries.GET_USER_FOLLOWERS,
    {
      variables: {
        wallet,
      },
    }
  );
  console.log("USER_FOLLOWERS: ", followers);
  const { data: followings, refetch: fetchFollowings } = useAuthQuery(
    queries.GET_USER_FOLLOWINGS,
    {
      variables: {
        wallet,
      },
    }
  );
  const { data: walletAvatar } = useAuthQuery(queries.GET_WALLET_AVATAR, {
    variables: {
      wallet,
    },
  });
  const { data } = useAuthQuery(queries.GET_WALLET_STATS, {
    variables: {
      condition: {
        searchAddress: wallet,
        timePeriod: "ALL",
        includeUserRank: false,
      },
    },
  });
  const [toggleFollow] = useAuthMutation(mutations.FOLLOW_WALLET_TOGGLE);

  const handleShowSelectNft = () => {
    setShowSelectNft(true);
    console.log(flatten(map(collections, ({ items }) => items)));
  };

  const handleFollow = async () => {
    await toggleFollow({
      variables: {
        user: auth?.user?.id,
        wallet,
      },
    });
    await fetchIsFollowed();
    await fetchFollowers();
    await fetchFollowings();
  };

  const fetchNFTs = async () => {
    if (!wallet) {
      return;
    }
    const nftData = await getNFTsByOwner({ wallet });

    const nftsList = map(nftData || [], ({ mint, metadata }) => ({
      ...metadata,
      ...(metadata.json || {}),
      mint,
    }));

    setOwnedNftCount(nftData?.getWallet?.length ?? 0);

    if (mainWallet.publicKey?.toBase58() !== wallet) {
      const staked = await getStakedList(false, wallet);
      setNfts({
        staked,
        nftsList,
      });
    } else {
      setNfts({ staked: hookedYakuNfts, nftsList });
    }
  };

  const getAvatar = (userProfile: any, proxy = IMAGE_PROXY) => {
    if (userProfile?.avatar) {
      setProfilePic(`${proxy}${userProfile?.avatar}`);
      return;
    }
    if (userProfile?.discord?.avatar) {
      setProfilePic(
        `${proxy}https://cdn.discordapp.com/avatars/${userProfile?.discord?.id}/${userProfile?.discord?.avatar}.png`
      );
      return;
    }
    setProfilePic("/images/profile-image.jpeg");
  };

  const fetchEth = async () => {
    const ethAddr =
      wallet !== mainWallet.publicKey?.toBase58()
        ? walletUser?.user?.ethAddress
        : auth.user?.ethAddress;
    console.log(ethAddr);
    if (ethAddr) {
      const web3 = new Web3(
        "https://mainnet.infura.io/v3/c28fffee6c304d49b717b001d24e795d"
      );
      const ethbal = await web3.eth.getBalance(ethAddr);
      setEthBalance("" + ethbal);
      const { data: ethNftData } = await getWalletNfts(ethAddr);
      const { result } = ethNftData;
      setEthNfts(
        map(
          result,
          ({
            token_address,
            token_id,
            token_uri,
            symbol,
            name: collection,
            metadata,
            contract_type,
          }: any) => {
            // eslint-disable-next-line prefer-const
            let { image, name } = JSON.parse(metadata) || {};
            if (image && image.includes("ipfs://")) {
              image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
            }
            if (image && image.includes("ipfs.infura.io")) {
              image = image.replace("ipfs.infura.io", "infura-ipfs.io");
            }
            return {
              mint: token_id,
              image,
              name,
              collection,
              collectionKey: token_address,
              contractType: contract_type,
              symbol,
              uri: token_uri,
            };
          }
        )
      );
    }
  };

  useEffect(() => {
    if (auth.token && wallet) {
      getAvatar(
        wallet !== mainWallet.publicKey?.toBase58()
          ? walletUser?.user
          : auth.user
      );
      fetchNFTs();
      fetchBalance(new PublicKey(wallet), connection).then((bal: number) =>
        setBalance(bal)
      );
      fetchYakuBalance(new PublicKey(wallet), connection, mainWallet).then(
        (yBal: number) => setTokenBalance(yBal)
      );
      fetchIsFollowed();
      fetchFollowers();
    }
  }, [wallet, mainWallet.publicKey, auth.token]);
  useEffect(() => {
    fetchEth();
  }, [auth.user, walletUser?.user]);
  useEffect(() => {
    if (data?.getWalletStats) {
      setWalletStats(data?.getWalletStats?.wallet_stats[0]);
    }
  }, [data]);

  useEffect(() => {
    if (walletUser?.user) {
      if (
        !walletUser?.user?.avatar &&
        !walletUser?.user?.discord?.avatar &&
        walletAvatar?.getWalletAvatar &&
        walletAvatar?.getWalletAvatar.avatar
      ) {
        getToken({ mint: walletAvatar?.getWalletAvatar.avatar }).then(
          (tokenData: any) => {
            if (tokenData?.image) {
              setProfilePic(tokenData?.image);
            }
            setDisplayName(tokenData?.name);
          }
        );
      } else if (
        walletUser?.user?.avatar ||
        walletUser?.user?.discord?.avatar
      ) {
        getAvatar(walletUser?.user);
      }
    } else if (wallet === mainWallet.publicKey?.toBase58()) {
      getAvatar(auth.user);
    }
  }, [walletUser, walletAvatar]);

  const isBrowser = typeof window !== "undefined";

  return (
    <>
      <ProfileBannerNoSSR />

      <AvatarSectionNoSSR
        src={profilePic}
        vanity={
          walletUser?.user?.vanity ||
          displayName ||
          (wallet && shortenAddress(wallet))
        }
        sol_name={walletStats?.sol_name}
        discord={walletUser?.user?.discord}
        twitter={walletUser?.user?.twitter}
        stakedYakuNfts={nfts?.staked}
        wallet={wallet}
        mainWallet={mainWallet}
        handleFollow={handleFollow}
        isFollowed={followed && followed.isFollowed}
        followers={followers?.getUserFollowers?.length}
        followings={followings?.getUserFollowings?.length}
        handleShowSelectNft={handleShowSelectNft}
      />

      <Grid container spacing={2} sx={{ mt: { xs: 1, md: "-80px" } }}>
        <Grid item xs={12} lg={7} xl={6}>
          <MainCard sx={{ border: "none", mt: 2 }} divider={false}>
            <Typography
              fontSize={18}
              fontWeight={700}
              sx={{
                justifyContent: "flex-end",
                alignItems: "center",
                display: "flex",
                gap: 1,
              }}
            >
              <IconWallet /> Wallet Overview
            </Typography>
            <Grid container sx={{ mt: 2, justifyContent: "space-between" }}>
              <Grid
                item
                xs={12}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#09080d" : "primary.light",
                  borderRadius: ".75rem",
                  p: 2,
                }}
              >
                <Typography>Wallet</Typography>
                <Typography noWrap>
                  {wallet && shortenAddress(wallet, 7)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={5.75}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#09080d" : "primary.light",
                  borderRadius: ".75rem",
                  p: 2,
                }}
              >
                <Typography>Balance</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Avatar
                    src="/images/blockchains/solana-icon.svg"
                    sx={{
                      width: 18,
                      height: 18,
                      objectFit: "contain",
                      border: "none",
                      background: "transparent",
                    }}
                    color="inherit"
                  />
                  <Typography noWrap>
                    {round(Number(balance || 0), 2).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={5.75}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#09080d" : "primary.light",
                  borderRadius: ".75rem",
                  p: 2,
                }}
              >
                <Typography>$YAKU Balance</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Avatar
                    src={YAKU_TOKEN_ICON}
                    sx={{
                      width: 18,
                      height: 18,
                      objectFit: "contain",
                      border: "none",
                      background: "transparent",
                    }}
                    color="inherit"
                  />
                  <Typography noWrap>
                    {round(Number(tokenBalance || 0), 2).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Tooltip title="NFT Portfolio Value is based on FP calculation.">
                <Grid
                  item
                  xs={12}
                  sm={5.75}
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "#09080d"
                        : "primary.light",
                    borderRadius: ".75rem",
                    p: 2,
                  }}
                >
                  <Typography>
                    NFT Portfolio Value <InfoCircleOutlined />
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Avatar
                      src="/images/blockchains/solana-icon.svg"
                      sx={{
                        width: 18,
                        height: 18,
                        objectFit: "contain",
                        border: "none",
                        background: "transparent",
                      }}
                      color="inherit"
                    />
                    <Typography noWrap>
                      {round(netWorth, 2).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Tooltip>
              <Grid
                item
                xs={12}
                sm={5.75}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#09080d" : "primary.light",
                  borderRadius: ".75rem",
                  p: 2,
                }}
              >
                <Typography>Owned NFT</Typography>
                <Typography noWrap>
                  {Number(ownedNftCount).toLocaleString()}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={5.75}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#09080d" : "primary.light",
                  borderRadius: ".75rem",
                  p: 2,
                }}
              >
                <Typography>Total Volume Bought</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Avatar
                    src="/images/blockchains/solana-icon.svg"
                    sx={{
                      width: 18,
                      height: 18,
                      objectFit: "contain",
                      border: "none",
                      background: "transparent",
                    }}
                    color="inherit"
                  />
                  <Typography noWrap>
                    {!isEmpty(walletStats) ? (
                      `${round(
                        Number(walletStats?.volume_bought || 0),
                        2
                      ).toLocaleString()}`
                    ) : (
                      <Skeleton width={50} height={16} variant="rounded" />
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={5.75}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#09080d" : "primary.light",
                  borderRadius: ".75rem",
                  p: 2,
                }}
              >
                <Typography>Total Volume Sold</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Avatar
                    src="/images/blockchains/solana-icon.svg"
                    sx={{
                      width: 18,
                      height: 18,
                      objectFit: "contain",
                      border: "none",
                      background: "transparent",
                    }}
                    color="inherit"
                  />
                  <Typography noWrap>
                    {!isEmpty(walletStats) ? (
                      `${round(
                        Number(walletStats?.volume_sold || 0),
                        2
                      ).toLocaleString()}`
                    ) : (
                      <Skeleton width={50} height={16} variant="rounded" />
                    )}
                  </Typography>
                </Box>
              </Grid>
              {(wallet !== mainWallet.publicKey?.toBase58()
                ? walletUser?.user?.ethAddress
                : auth?.user?.ethAddress) && (
                <>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "#09080d"
                          : "primary.light",
                      borderRadius: ".75rem",
                      p: 2,
                    }}
                  >
                    <Typography>ETH Wallet</Typography>
                    <Typography noWrap>
                      {shortenAddress(
                        wallet !== mainWallet.publicKey?.toBase58()
                          ? walletUser?.user?.ethAddress
                          : auth?.user?.ethAddress,
                        7
                      )}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "#09080d"
                          : "primary.light",
                      borderRadius: ".75rem",
                      p: 2,
                    }}
                  >
                    <Typography>Balance</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Avatar
                        src="/images/blockchains/ethereum-icon.svg"
                        sx={{
                          width: 18,
                          height: 18,
                          objectFit: "contain",
                          border: "none",
                          background: "transparent",
                        }}
                        color="inherit"
                      />
                      <Typography noWrap>
                        {round(
                          Number(ethBalance || 0) / ETH_WEI,
                          4
                        ).toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </MainCard>
          <Box>
            <MainCard sx={{ border: "none", mt: 2 }} divider={false}>
              <PortfolioChartNoSSR wallet={wallet || ""} />
            </MainCard>
          </Box>
        </Grid>
        <Grid item xs={12} lg={5} xl={6}>
          <NFTCollectionsViewNoSSR
            wallet={wallet || ""}
            nfts={nfts}
            ethNfts={ethNfts}
            setOwnedNftCount={setOwnedNftCount}
            setNetWorth={setNetWorth}
            setOwnedCollections={setCollections}
          />
        </Grid>
      </Grid>

      <NFTsDialogNoSSR
        showItems={showSelectNft}
        setShowItems={setShowSelectNft}
        cItem={{
          items:
            collections && collections.length > 0
              ? filter(
                  flatten(map(collections, ({ items }) => items)),
                  ({ listed }) => !listed
                )
              : [],
        }}
        canView={false}
        hideTitle
        noListing
        showSendAndBurnButton={false}
        cols={6}
      />
    </>
  );
};
export default Profile;
