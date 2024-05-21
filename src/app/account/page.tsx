"use client";

/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { filter, flatten, isEmpty, map, round } from "lodash";
import { IconWallet } from "@tabler/icons-react";
import dynamic from "next/dynamic";

import { InfoCircleOutlined } from "@ant-design/icons";

import { Tooltip } from "@material-tailwind/react";

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

      <div className="grid gap-2 mt-1 md:mt-[-80px]">
        <div className="col-span-12 lg:col-span-7 xl:col-span-6">
          <MainCard sx={{ border: "none", mt: 2 }} divider={false}>
            <p className="flex items-center justify-end gap-1 text-lg font-bold">
              <IconWallet /> Wallet Overview
            </p>
            <div className="mt-2 flex justify-between">
              <div className="mb-2 flex justify-between items-center bg-primary-light dark:bg-gray-900 rounded-lg p-2">
                <p>Wallet</p>
                <p className="truncate">
                  {wallet && shortenAddress(wallet, 7)}
                </p>
              </div>
              <div className="mb-2 flex justify-between items-center bg-primary-light dark:bg-gray-900 rounded-lg p-2 w-[19rem]">
                <p>Balance</p>
                <div className="flex gap-1">
                  <img
                    src="/images/blockchains/solana-icon.svg"
                    className="w-4.5 h-4.5 object-contain border-none bg-transparent"
                    alt="Solana Icon"
                  />
                  <p className="truncate">
                    {round(Number(balance || 0), 2).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mb-2 flex justify-between items-center bg-primary-light dark:bg-gray-900 rounded-lg p-2 sm:w-5/6">
                <p>$YAKU Balance</p>
                <div className="flex gap-1">
                  <img
                    src={YAKU_TOKEN_ICON}
                    className="w-4.5 h-4.5 object-contain border-none bg-transparent"
                    alt="YAKU Token Icon"
                  />
                  <p className="truncate">
                    {round(Number(tokenBalance || 0), 2).toLocaleString()}
                  </p>
                </div>
              </div>
              <Tooltip title="NFT Portfolio Value is based on FP calculation.">
                <div className="mb-2 flex justify-between items-center bg-primary-light dark:bg-gray-900 rounded-lg p-2 sm:w-5/6">
                  <p>
                    NFT Portfolio Value <InfoCircleOutlined />
                  </p>
                  <div className="flex gap-1">
                    <img
                      src="/images/blockchains/solana-icon.svg"
                      className="w-4.5 h-4.5 object-contain border-none bg-transparent"
                      alt="Solana Icon"
                    />
                    <p className="truncate">
                      {round(netWorth, 2).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Tooltip>
              <div className="mb-2 flex justify-between items-center bg-primary-light dark:bg-gray-900 rounded-lg p-2 sm:w-[5.75rem]">
                <p>Owned NFT</p>
                <p className="truncate">
                  {Number(ownedNftCount).toLocaleString()}
                </p>
              </div>
              <div className="mb-2 flex justify-between items-center bg-primary-light dark:bg-gray-900 rounded-lg p-2 sm:w-[5.75rem]">
                <p>Total Volume Bought</p>
                <div className="flex gap-1">
                  <img
                    src="/images/blockchains/solana-icon.svg"
                    className="w-4.5 h-4.5 object-contain border-none bg-transparent"
                  />
                  <p className="truncate">
                    {!isEmpty(walletStats) ? (
                      `${round(
                        Number(walletStats?.volume_bought || 0),
                        2
                      ).toLocaleString()}`
                    ) : (
                      <div className="w-12 h-4 rounded bg-gray-200"></div>
                    )}
                  </p>
                </div>
              </div>
              <div className="mb-2 flex justify-between items-center bg-primary-light dark:bg-gray-900 rounded-lg p-2 sm:w-[5.75rem]">
                <p>Total Volume Sold</p>
                <div className="flex gap-1">
                  <img
                    src="/images/blockchains/solana-icon.svg"
                    className="w-4.5 h-4.5 object-contain border-none bg-transparent"
                  />
                  <p className="truncate">
                    {!isEmpty(walletStats) ? (
                      `${round(
                        Number(walletStats?.volume_sold || 0),
                        2
                      ).toLocaleString()}`
                    ) : (
                      <div className="w-12 h-4 rounded bg-gray-200"></div>
                    )}
                  </p>
                </div>
              </div>
              {(wallet !== mainWallet.publicKey?.toBase58()
                ? walletUser?.user?.ethAddress
                : auth?.user?.ethAddress) && (
                <>
                  <div className="mb-2 flex justify-between items-center bg-primary-light rounded-xl p-2">
                    <p>ETH Wallet</p>
                    <p className="truncate">
                      {shortenAddress(
                        wallet !== mainWallet.publicKey?.toBase58()
                          ? walletUser?.user?.ethAddress
                          : auth?.user?.ethAddress,
                        7
                      )}
                    </p>
                  </div>
                  <div className="mb-2 flex justify-between items-center bg-primary-light rounded-xl p-2">
                    <p>Balance</p>
                    <div className="flex gap-1">
                      <img
                        src="/images/blockchains/ethereum-icon.svg"
                        className="w-4.5 h-4.5 object-contain border-none bg-transparent"
                      />
                      <p className="truncate">
                        {round(
                          Number(ethBalance || 0) / ETH_WEI,
                          4
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </MainCard>
          <div>
            <MainCard sx={{ border: "none", mt: 2 }} divider={false}>
              <PortfolioChartNoSSR wallet={wallet || ""} />
            </MainCard>
          </div>
        </div>
        <div className="lg:col-span-5 xl:col-span-6">
          <NFTCollectionsViewNoSSR
            wallet={wallet || ""}
            nfts={nfts}
            ethNfts={ethNfts}
            setOwnedNftCount={setOwnedNftCount}
            setNetWorth={setNetWorth}
            setOwnedCollections={setCollections}
          />
        </div>
      </div>

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
