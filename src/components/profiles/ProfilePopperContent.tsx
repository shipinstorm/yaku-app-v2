/* eslint-disable no-nested-ternary */
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { isEmpty, isObject, map } from "lodash";

// material-ui
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
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Transaction } from "@solana/web3.js";

import { useAccount } from "wagmi";

// project imports
import MainCard from "@/components/cards/MainCard";
import WalletValueSection from "@/components/profiles/WalletValueSection";

import EthLogo from "@/components/icons/EthLogo";
import DiscordLogo from "@/components/icons/DiscordLogo";
import TwitterLogo from "@/components/icons/TwitterLogo";
import PhantomLogo from "@/components/icons/PhantomLogo";
import MetamaskLogo from "@/components/icons/MetamaskLogo";

import { usePlayerView } from "@/contexts/PlayerWalletContext";
import { useEthcontext } from "@/contexts/EthWalletProvider";

import useAuth from "@/hooks/useAuth";
import useGame from "@/hooks/useGame";
import { useToasts } from "@/hooks/useToasts";
import useConnections from "@/hooks/useConnetions";
import { useRequests } from "@/hooks/useRequests";
import useLocalStorage from "@/hooks/useLocalStorage";
import useWallets from "@/hooks/useWallets";
import useStaked from "@/hooks/useStaked";

import { shortenAddress } from "@/utils/utils";

import ProfileIcon from "./ProfileIcon";
import ProfilePopperButton from "./ProfilePopperButton";

import { Palette } from "@/themes/palette";
import themeTypography from "@/themes/typography";

const ProfilePopperContext = ({ showProfile }: any) => {
  const { connection } = useConnections();
  const { ethAddress, ethConnected, ethBalance, ethConnect, ethDisconnect } =
    useEthcontext();
  const { setShowPlayerView } = usePlayerView();
  const auth = useAuth();
  const game = useGame();
  const router = useRouter();
  const mainWallet = useWallet();
  const { publicKey, wallet, select, disconnect } = mainWallet;
  const account = useAccount();
  const { playerAddress } = usePlayerView();

  const solConnect = useCallback(() => {
    const adapter = new PhantomWalletAdapter();
    select(adapter.name);
  }, [select]);

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

      await ethDisconnect();

      game.logout();
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
            <a
              href={`https://solscan.io/tx/${res}`}
              target="_blank"
              rel="noreferrer"
              className="text-white m-auto"
            >
              Successfully withdraw {escrowBal} SOL from bidding wallet.
            </a>
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

  const [isSolLinked, setIsSolLinked] = useState<boolean>(false);
  const [isEthLinked, setIsEthLinked] = useState<boolean>(false);

  useEffect(() => {
    setIsSolLinked(false);
    if (game.player.wallets && publicKey) {
      const address = publicKey.toBase58();
      game.player.wallets.map((wallet: any) => {
        if (wallet.address === address) setIsSolLinked(true);
      });
    }
  }, [game, publicKey]);

  useEffect(() => {
    setIsEthLinked(false);
    if (game.player.wallets && ethAddress) {
      game.player.wallets.map((wallet: any) => {
        if (wallet.address === ethAddress) setIsEthLinked(true);
      });
    }
  }, [game, ethAddress]);

  const Profile = (
    <>
      <MainCard
        border={false}
        content={false}
        style={{
          backgroundColor: "transparent",
        }}
      >
        {(mainWallet.connected || ethConnected || playerAddress) && (
          <div className="pb-0 p-4">
            <div
              onClick={() => router.push("/account")}
              className={`flex flex-row space-x-1.5 items-center justify-start rounded-2xl w-full p-2 cursor-pointer ${
                window.location.pathname.includes("workspaces")
                  ? "selected"
                  : "border-2 border-blue-main"
              } hover:bg-primary-dark hover:transition-all hover:duration-100 hover:ease-in-out`}
            >
              <ProfileIcon
                sx={{
                  ...themeTypography.largeAvatar,
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
                hasPopup="true"
              />
              <div className="flex flex-col items-start justify-start w-full">
                <div className="flex items-center cursor-pointer">
                  <div className="flex items-center min-h-6">
                    <h5 className="m-0 text-sm text-[#e4e8f7] font-medium leading-6 overflow-hidden text-ellipsis whitespace-nowrap">
                      {auth.user?.vanity ||
                        auth.user?.discord?.name ||
                        auth.user?.twitter?.name ||
                        ((publicKey || ethAddress || playerAddress) &&
                          shortenAddress(
                            publicKey?.toBase58() ||
                              ethAddress ||
                              playerAddress,
                            7
                          ))}
                    </h5>
                  </div>
                </div>
                <div className="flex items-center -ml-3">
                  {auth.user?.discord?.name &&
                    auth.user?.discord?.discriminator && (
                      <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
                        <p className="text-xs flex items-center gap-1">
                          <IconBrandDiscord style={{ height: 14 }} />{" "}
                          {`${auth.user?.discord?.name}#${auth.user?.discord?.discriminator}`}
                        </p>
                      </div>
                    )}
                  {auth.user?.twitter?.username && (
                    <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
                      <p className="text-xs flex items-center gap-1">
                        <IconBrandTwitter style={{ height: 14 }} /> @
                        {auth.user?.twitter?.username}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
          </div>
        )}
      </MainCard>
      <div className="flex flex-row items-center justify-center">
        {!isEmpty(auth.user?.discord) ? (
          <>
            {!auth.user?.discord?.membership && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded gap-1 flex items-center justify-center"
                onClick={() => handleDiscordConnect()}
              >
                <DiscordLogo size={18} />
                Verify
              </button>
            )}
          </>
        ) : (
          <>
            {auth.token && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded gap-1 flex items-center justify-center"
                onClick={() => handleDiscordConnect()}
              >
                <DiscordLogo size={18} />
                Connect
              </button>
            )}
          </>
        )}
        {!auth.user?.twitter?.username && auth.token && (
          <button
            className="bg-white hover:bg-[#1D9BF022] text-[#1D9BF0] font-bold py-2 px-4 rounded gap-1 flex items-center justify-center ml-4"
            onClick={() => handleTwitterConnect()}
          >
            <TwitterLogo size="18" />
            Connect
          </button>
        )}
      </div>
      {/* <div className="flex items-center justify-center space-x-2 mt-10 hidden">
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
      </div> */}
    </>
  );

  return (
    <div className="text-[#d5d9e9] transition-shadow duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-none bg-elevation1 rounded-3xl border border-line overflow-y-auto flex flex-col gap-3">
      {showProfile && Profile}
      <MainCard
        border={false}
        elevation={16}
        content={false}
        boxShadow
        sx={{ backgroundColor: "transparent" }}
      >
        {(mainWallet.connected || ethConnected || playerAddress) && (
          <div className="p-4 pt-4 w-full min-w-[260px] text-gray-400">
            {auth.user?.vanity && (
              <div className="flex items-center space-x-1 p-2 max-w-full">
                {/* <Tooltip title="View Wallet Portfolio"> */}
                <div className="mt-1 justify-between">
                  <div
                    className="w-full mb-4 flex justify-center items-center bg-[#09080d] rounded-[0.75rem] p-4 cursor-pointer gap-4"
                    onClick={() => router.push(`/account/${auth.user?.wallet}`)}
                  >
                    <IconEye />
                    <p className="whitespace-nowrap">
                      {shortenAddress(auth.user?.wallet, 7)}
                    </p>
                  </div>
                </div>
                {/* </Tooltip> */}
              </div>
            )}

            {wallet && publicKey ? (
              <>
                <WalletValueSection
                  title="Main Wallet"
                  wallet={publicKey?.toBase58()}
                  open={open}
                  handleWithdraw={handleWithdraw}
                  showEscrow
                  escrowBal={escrowBal}
                />
                {game.player.id && (
                  <div className="flex items-center justify-center">
                    {isSolLinked && (
                      <p className="whitespace-nowrap">
                        Linked To Blockus Account
                      </p>
                    )}
                    {!isSolLinked && (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded gap-1"
                        onClick={() =>
                          showLoginDialog(true, true, false, true, 2)
                        }
                      >
                        Link To Blockus Account
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-row space-x-8 items-center justify-center mb-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded gap-1 flex items-center justify-center"
                  onClick={() => solConnect()}
                >
                  <PhantomLogo size={18} />
                  <span style={{ whiteSpace: "nowrap" }}>Connect Phantom</span>
                </button>
              </div>
            )}

            <hr className="my-2 flex-shrink-0 border-t border-solid border-[#d5d9e9] opacity-20"></hr>
            {ethConnected ? (
              <>
                <div className="flex flex-row space-x-2 items-center justify-start p-1 w-full">
                  <div className="w-full my-1 flex justify-center items-center bg-[#09080d] rounded-[0.75rem] px-4 py-2">
                    <p className="whitespace-nowrap text-center">
                      {ethAddress && shortenAddress(ethAddress, 7)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row space-x-2 items-center justify-start p-1">
                  <EthLogo />
                  <div className="flex flex-col items-start justify-start">
                    <p className="text-base font-normal ml-1">Main Wallet</p>
                    {ethConnected && (
                      <p className="text-base font-bold ml-1">
                        {(ethBalance || 0).toLocaleString()} ETH
                      </p>
                    )}
                  </div>
                </div>
                {game.player.id && (
                  <div className="flex items-center justify-center">
                    {isEthLinked && <p>Linked To Blockus Account</p>}
                    {!isEthLinked && (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded gap-1"
                        onClick={() =>
                          showLoginDialog(true, true, false, false, 2)
                        }
                      >
                        Link To Blockus Account
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-row space-x-2 items-center justify-center mb-1">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded gap-1 flex items-center justify-center"
                  onClick={() => ethConnect()}
                >
                  <MetamaskLogo size={18} />
                  <span style={{ whiteSpace: "nowrap" }}>Connect Metamask</span>
                </button>
              </div>
            )}
            <hr className="my-2 flex-shrink-0 border-t border-solid border-[#d5d9e9] opacity-20"></hr>

            {game.player.id ? (
              <>
                <p className="whitespace-nowrap">Blockus Account</p>
                <div className="w-full mb-1 flex justify-center items-center bg-[#09080d] rounded-[0.75rem] px-4 py-2">
                  <p className="whitespace-nowrap">
                    {shortenAddress(game.playerAddress, 7)}
                  </p>
                </div>
              </>
            ) : (
              <ProfilePopperButton {...createGameWalletButton} />
            )}

            <hr className="my-2 flex-shrink-0 border-t border-solid border-[#d5d9e9] opacity-20"></hr>

            {/* {workspaces && workspaces?.length === 0 && (
              <ProfilePopperButton {...createWorkspaceButton} />
            )} */}

            {map(stackButtons, (row: any, idx: number) => (
              <ProfilePopperButton key={idx} {...row} />
            ))}
          </div>
        )}
      </MainCard>
    </div>
  );
};

export default ProfilePopperContext;
