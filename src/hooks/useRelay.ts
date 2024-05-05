/* eslint-disable react-hooks/exhaustive-deps */
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEthcontext } from "@/contexts/EthWalletProvider";
import { isEmpty } from "lodash";
import { useCallback } from "react";
import useAuth from "./useAuth";
import useConnections from "./useConnetions";
import { useToasts } from "./useToasts";
import useWallets from "./useWallets";

export default function useRelay() {
  const EXTENSION_ID = "mgboafcknbnggjjdkjeenlbceealhmlh";
  const { connection } = useConnections();
  const { showLoginDialog } = useWallets();
  const wallet = useWallet();
  const { ethAddress, ethConnected, signMessage, getBlockNumber } =
    useEthcontext();
  const { showErrorToast, showInfoToast } = useToasts();
  const { hasExtension, setHasExtension } = useAuth();

  const processWalletConnection = useCallback(async () => {
    const command = localStorage.getItem("relay-command");

    const requestSolanaSign = async () => {
      showInfoToast(`Please sign message for verification...`);

      let latestBlockDetails;
      let latestSlotId;

      /* eslint-disable-next-line */
      while (true) {
        try {
          // eslint-disable-next-line
          const latestBlockDetailsLocal =
            await connection.getLatestBlockhashAndContext("confirmed");
          latestSlotId = latestBlockDetailsLocal?.context?.slot;
          latestBlockDetails = latestBlockDetailsLocal?.value;
          console.debug(latestSlotId, latestBlockDetails);
          if (latestBlockDetails && latestSlotId) {
            break;
          }
        } catch (error) {
          console.error({ error });
        }
      }

      const encodedMessage = new TextEncoder().encode(
        `Yaku: ${latestBlockDetails?.blockhash}`
      );

      try {
        let signature;

        try {
          signature = await wallet.signMessage!(encodedMessage);
        } catch (e) {
          showErrorToast(
            `Error: Something went wrong during signing the verification message.`
          );
          return {};
        }

        showInfoToast(`Signing in to desktop application...`);
        const pub = wallet.publicKey?.toBase58();

        return {
          command: "get_wallet_address",
          message: "success",
          data: {
            network: "mainnet-beta",
            slotId: latestSlotId,
            signature: bs58.encode(signature),
            publicKey: pub,
          },
        };
      } catch (error) {
        return { command: "get_wallet_address", message: "fail" };
      }
    };

    const requestEthSign = async () => {
      try {
        const blockNumber = await getBlockNumber();
        console.debug(blockNumber);
        const encodedMessage = new TextEncoder().encode(`Yaku: ${blockNumber}`);
        console.debug(encodedMessage);
        const signature = await signMessage(encodedMessage);
        console.debug(signature);
        return {
          command: "get_wallet_address",
          message: "success",
          data: {
            network: "eth-mainnet",
            slotId: blockNumber,
            signature,
            publicKey: ethAddress,
          },
        };
      } catch (error) {
        return { command: "get_wallet_address", message: "fail" };
      }
    };

    if (command === "get_wallet_address") {
      if (!wallet.connected && !ethConnected) {
        console.log("Relay: Not connected");
        showLoginDialog(false, true);
        return;
      }

      if (command) {
        localStorage.removeItem("relay-command");
      }

      console.log("Relay: Connected");
      let result;
      if (wallet.connected) {
        result = await requestSolanaSign();
      } else if (ethConnected) {
        result = await requestEthSign();
      }
      if (!isEmpty(result)) {
        // @ts-ignore
        chrome.runtime.sendMessage(EXTENSION_ID, result, (response: any) => {
          console.debug({ response });
        });
      }
    }
  }, [wallet.connected, ethConnected]);

  return {
    EXTENSION_ID,
    processWalletConnection,
    hasExtension,
    setHasExtension,
  };
}
