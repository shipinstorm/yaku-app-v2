/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { map } from "lodash";
import { IconX } from "@tabler/icons-react";
import { isMobile } from "react-device-detect";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  Stack,
  useMediaQuery,
  CircularProgress,
  Avatar,
} from "@mui/material";

// web3 imports
import { WalletAdapter, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction } from "@solana/web3.js";

import { useDisconnect, useSignMessage } from "wagmi";

// project imports
import AuthWrapper from "./AuthWrapper";
import AuthCardWrapper from "./AuthCardWrapper";
import LoginStepOne from "./LoginStepOne";
import LoginStepTwo from "./LoginStepTwo";
import LoginStepThree from "./LoginStepThree";

import Logo from "@/components/icons/Logo";
import AuthFooter from "@/components/cards/AuthFooter";

import ChainWalletSelect from "@/components/wallets/ChainWalletSelect";
import { useEthcontext } from "@/contexts/EthWalletProvider";
import { usePlayerView } from "@/contexts/PlayerWalletContext";

import useGame from "@/hooks/useGame";
import useAuth from "@/hooks/useAuth";
import useWallets from "@/hooks/useWallets";
import { useToasts } from "@/hooks/useToasts";
import { useRequests } from "@/hooks/useRequests";
import useConnections from "@/hooks/useConnetions";

import { shortenAddress } from "@/utils/utils";
import { explorerLinkFor } from "@/utils/transactions";

export enum STEPS {
  SELECT_WALLET = 0,
  SIGN_MESSAGE = 1,
  CHOOSE_USERNAME = 2,
  LINK_DISCORD = 3,
}

const WalletLogin = ({
  open,
  dismiss,
  requireSign,
  hideEthButton = false,
  addressType,
  stepNumber,
}: any) => {
  const { connection } = useConnections();
  const { showLoginDialog } = useWallets();
  // Metamask context
  const { ethAddress, ethConnected, ethConnect } = useEthcontext();

  const { setShowPlayerView } = usePlayerView();

  const [step, setStep] = useState(STEPS.SELECT_WALLET);
  const [username, setUsername] = useState("");
  const [isLedger, setIsLedger] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // wallet init
  const wallet = useWallet();
  const { connected, connecting, publicKey, select, connect, signMessage } =
    wallet;

  const { signMessageAsync } = useSignMessage();

  // hooks
  const theme = useTheme();
  const auth = useAuth();
  const game = useGame();
  const { getPlayerInfo, requestAuthentication, linkWalletToPlayer } =
    useRequests();
  const { showInfoToast, showErrorToast, showTxErrorToast } = useToasts();

  const { playerAddress } = usePlayerView();

  // mutations / queries
  const { login, getSubwallet, signup } = useRequests();

  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (publicKey && connected) {
      if (!requireSign) {
        attemptLogin(publicKey.toBase58());
      } else {
        setStep(STEPS.SIGN_MESSAGE);
      }
    } else if (open) {
      setStep(STEPS.SELECT_WALLET);
    }

    if (!connecting && !connected && open) {
      connect().catch((error) => {
        console.debug(error?.name, { connecting, isConnecting });
        setIsConnecting(false);
        showLoginDialog(requireSign, !!dismiss, hideEthButton);
      });
    }
  }, [publicKey, connect, open]);

  useEffect(() => {
    if (stepNumber == 2) {
      setStep(STEPS.SIGN_MESSAGE);
    }
  }, [stepNumber]);

  const handleEtherLogin = useCallback(async () => {
    if (!isMobile) {
      try {
        setIsConnecting(true);
        const connectEth = await ethConnect();
        connectEth.wait();
        setIsConnecting(false);
      } catch (error) {
        setIsConnecting(false);
      }
    }
  }, [ethConnected]);

  const handleGameLogin = () => {
    setShowPlayerView(true);
  };

  useEffect(() => {
    if (playerAddress) {
      dismiss("");
    }
  }, [playerAddress]);

  // new functions
  const handleClick = useCallback(
    (adapter: WalletAdapter) => {
      if (
        wallet.wallet?.adapter?.readyState === WalletReadyState.Installed &&
        (!wallet?.publicKey || !adapter?.publicKey)
      ) {
        // Reload
        console.log("Reload page");
        window.location.reload();
        return;
      }
      if (adapter?.name !== wallet.wallet?.adapter?.name) {
        console.log("selecting", adapter.name);
        select(adapter.name);
      }
    },
    [select]
  );

  const attemptLogin = async (address: string) => {
    if (publicKey && address) {
      try {
        setIsConnecting(true);
        const data = await login({ wallet: address });
        if (data.token) {
          auth.signin(data.token, address);
          auth.setUserData(data.user);
          showInfoToast(`Connected to wallet ${shortenAddress(address)}`);

          const subwallets = await getSubwallet({ user: data.user.id });
          if (subwallets) {
            auth.setUserData({
              ...data.user,
              wallets: map(subwallets, ({ wallet: addr }: any) => addr),
            });
          }
          setIsConnecting(false);
          if (!data.registered) {
            setStep(STEPS.CHOOSE_USERNAME);
          } else {
            dismiss("attemptLogin");
          }
        }
      } catch (error) {
        showErrorToast(
          "An error occurred while contacting the database, please try again."
        );
      } finally {
        setIsConnecting(false);
      }
    } else {
      setStep(STEPS.SELECT_WALLET);
      setIsConnecting(false);
      showErrorToast(
        "There seems to be an issue with your connection, please try again."
      );
    }
  };

  const handleUsername = async (name: string) => {
    setUsername(name);
  };

  const handleSignTransaction = async () => {
    if (publicKey) {
      setIsConnecting(true);
      try {
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: publicKey,
            lamports: 1000,
          })
        );

        transaction.feePayer = publicKey;
        const blockHashObj = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockHashObj.blockhash;

        const signature = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, "processed");
        auth.sign();
        if (!auth.token) {
          attemptLogin(publicKey.toBase58());
        } else {
          dismiss("handleSignTransaction");
        }

        setIsConnecting(false);

        console.log(explorerLinkFor(signature, connection));
      } catch (err) {
        setStep(STEPS.SIGN_MESSAGE);
        setIsConnecting(false);
        showTxErrorToast(err);
        console.log(err);
      }
    } else {
      setStep(STEPS.SELECT_WALLET);
      showErrorToast(
        "There seems to be an issue with your connection, please try again."
      );
    }
  };

  const handleSignMessage = async () => {
    if (publicKey) {
      setIsConnecting(true);
      try {
        const walletAddress = addressType ? auth.user.wallet : ethAddress;
        const requestAuthenticationResponse = await requestAuthentication(
          "web3",
          walletAddress,
          ""
        );

        let encodedMessage, signature;
        if (addressType) {
          encodedMessage = new TextEncoder().encode(
            JSON.stringify({ message: requestAuthenticationResponse.data })
          );
          signature = await signMessage!(encodedMessage);
          signature = bs58.encode(signature);
        } else {
          signature = await signMessageAsync({
            message: JSON.stringify(requestAuthenticationResponse.data),
          });
        }
        if (!signature)
          showErrorToast(
            `An error occurred while confirming the signature, please try again.`
          );
        handleLinkWalletToPlayer(signature);
        auth.sign();
        if (!auth.token) {
          attemptLogin(publicKey.toBase58());
        } else {
          dismiss("handleSignMessage");
        }
      } catch (err: any) {
        console.log(err);
        setIsConnecting(false);
        showErrorToast(`The request was rejected, please try again.`);
      } finally {
        setStep(STEPS.SIGN_MESSAGE);
      }
    } else {
      setStep(STEPS.SELECT_WALLET);
      showErrorToast(
        "There seems to be an issue with your connection, please try again."
      );
    }
  };

  const handleLinkWalletToPlayer = async (signature: string | Uint8Array) => {
    try {
      const linkWalletToPlayerResponse = await linkWalletToPlayer(
        "web3",
        addressType ? auth.user.wallet : ethAddress,
        signature,
        addressType ? "solana" : "ethereum",
        game.player.id,
        game.accessToken
      );
      const getPlayerInfoResponse = await getPlayerInfo(game.accessToken);
      const player = getPlayerInfoResponse.data;
      game.setPlayer(player);
      showInfoToast("Wallet connected to Blockus Account");
    } catch (error) {
      showErrorToast("Wallet address already linked to another user");
    }
  };

  const handleSignup = async () => {
    const pubkey = publicKey?.toBase58();
    if (pubkey !== null) {
      try {
        setIsConnecting(true);
        const data = await signup({ wallet: pubkey, vanity: username });
        if (data.token && pubkey) {
          auth.signin(data.token, pubkey);
          auth.setUserData(data.user);
          setStep(STEPS.LINK_DISCORD);
          showInfoToast(
            "Congratulations! You are all set and ready to dive into the Yakuverse!"
          );

          dismiss("handleSignup");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setStep(STEPS.SELECT_WALLET);
      showErrorToast(
        "There seems to be an issue with your connection, please try again."
      );
    }
  };

  const handleProfileVisit = async () => {
    if (!publicKey || !connected) {
      setStep(STEPS.SELECT_WALLET);
      showErrorToast(
        "There seems to be an issue with your connection, please try again."
      );
      return;
    }
    dismiss("handleProfileVisit");
  };

  // TODO: PublicKey and wallet is not being reset, so clicking another button doesnt work.
  const handleReset = async () => {
    await wallet.disconnect().then(() => console.log("disconnect"));
    setIsLedger(false);
    setStep(STEPS.SELECT_WALLET);
  };

  const handleBack = async (step: number) => {
    if (step === 1) {
      handleReset();
      return;
    }
    setStep(step - 1);
  };

  const InProgress = () => (
    <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
      <Grid
        container
        direction={matchDownSM ? "column-reverse" : "row"}
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 1 }}
      >
        <Grid item>
          <Stack alignItems="center" justifyContent="center" spacing={1}>
            <CircularProgress color="secondary" />
          </Stack>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <AuthWrapper>
      <div className="box-border flex flex-col justify-end min-h-[70vh] card">
        <div className="box-border m-0">
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(70vh - 68px)" }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper className="bg-elevation1 rounded-3xl">
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  {step === 3 ? (
                    <Grid item>
                      <Link to="#">
                        <Image
                          src="/images/icons/confetti.png"
                          alt="Complete"
                          width={120}
                          height={120}
                        />
                      </Link>
                    </Grid>
                  ) : (
                    <Grid item className="flex justify-between w-full">
                      <p className="w-9" />
                      <Link to="#">
                        <Logo />
                      </Link>
                      <Avatar
                        className="button-small items-center p-0"
                        color="inherit"
                        aria-haspopup="true"
                        onClick={() => dismiss("step3")}
                      >
                        <IconX stroke={1.5} size="1.3rem" />
                      </Avatar>
                    </Grid>
                  )}
                  {connecting || isConnecting ? (
                    <InProgress />
                  ) : (
                    <>
                      {step === 0 && (
                        <ChainWalletSelect
                          setIsConnecting={setIsConnecting}
                          handleClick={handleClick}
                          handleEtherLogin={handleEtherLogin}
                          hideEthButton={hideEthButton}
                          handleGameLogin={handleGameLogin}
                        />
                      )}

                      {step === 1 && (
                        <LoginStepOne
                          publicKey={
                            addressType ? publicKey?.toBase58() : ethAddress
                          }
                          isLedger={isLedger}
                          setIsLedger={setIsLedger}
                          handleBack={handleBack}
                          attemptLogin={attemptLogin}
                          setIsConnecting={setIsConnecting}
                          handleSignTransaction={handleSignTransaction}
                          handleSignMessage={handleSignMessage}
                        />
                      )}

                      {step === 2 && (
                        <LoginStepTwo
                          handleBack={handleBack}
                          handleSignup={handleSignup}
                          handleUsername={handleUsername}
                          username={username}
                        />
                      )}

                      {step === 3 && (
                        <LoginStepThree
                          handleProfileVisit={handleProfileVisit}
                        />
                      )}
                    </>
                  )}
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </div>
        <div className="box-border flex-grow-0 flex-shrink-0 flex-basis-full m-6 mt-2">
          <AuthFooter />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default WalletLogin;
