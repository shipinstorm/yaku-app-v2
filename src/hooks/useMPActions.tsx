import { Typography } from "@mui/material";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Message, Transaction } from "@solana/web3.js";
import {
  DEFAULT_BUYER_BROKER,
  USE_ME_API_FOR_COLLECTION_BUY,
} from "@/config/config";
import { useEthcontext } from "@/contexts/EthWalletProvider";
import { useMeta } from "@/contexts/meta/meta";
import { isObject } from "lodash";
import useConnections from "./useConnetions";
import { useRequests } from "./useRequests";
import { useToasts } from "./useToasts";

export default function useMPActions() {
  const { startLoading, stopLoading } = useMeta();

  const { connection } = useConnections();
  const { getMETransactionInstructions, createBuyTx } = useRequests();
  const { showSuccessToast, showErrorToast, showTxErrorToast } = useToasts();
  const { ethAddress, ethConnect, ethConnected, ethBalance, sendTransaction } =
    useEthcontext();

  const buyNowInSOL = async (
    wallet: WalletContextState,
    { name, token_address, lowest_listing_mpa, event }: any
  ) => {
    // prevent any propagation of the NFT to the cart
    event.stopPropagation();

    if (!wallet || !wallet.publicKey) {
      return;
    }
    try {
      startLoading();
      let response;
      const { price, broker_referral_address, marketplace_program_id } =
        lowest_listing_mpa;
      const isME =
        marketplace_program_id ===
        "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K";
      if (isME && USE_ME_API_FOR_COLLECTION_BUY) {
        response = await getMETransactionInstructions({
          buyer: wallet.publicKey.toBase58(),
          tokenMint: token_address,
        });
      } else {
        response = await createBuyTx({
          buyerAddress: wallet.publicKey.toBase58(),
          price,
          tokenAddress: token_address,
          buyerBroker:
            broker_referral_address ||
            DEFAULT_BUYER_BROKER ||
            process.env.SOLANA_FEE_ACCOUNT,
          chain: "SOL",
        });
      }

      if ((response && response.data) || Object.keys(response).length > 0) {
        let transaction;
        if (isME) {
          transaction = Transaction.from(
            Buffer.from(response.data || response.txSigned)
          );
        } else {
          transaction = Transaction.populate(
            Message.from(Buffer.from(response.data))
          );
        }
        const res = await wallet.sendTransaction(transaction, connection);
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
              Successfully bought {name}.
            </Typography>
          );
        } else {
          showErrorToast("Fail to purchase.");
        }
      }
    } catch (error) {
      console.error(error);
      showTxErrorToast(error);
    } finally {
      stopLoading();
    }
  };

  const buyNowInETH = async ({
    name,
    token_address,
    project_id,
    attributes,
    lowest_listing_mpa,
    event,
  }: any) => {
    // prevent any propagation of the NFT to the cart
    event.stopPropagation();

    if (!ethConnected || !ethAddress) {
      ethConnect();
    } else {
      try {
        startLoading();
        const { price } = lowest_listing_mpa;

        if (ethBalance < price) {
          showErrorToast("You have insufficient funds to buy this token.");
          return;
        }

        const { data: instructions } = await createBuyTx({
          buyerAddress: ethAddress, // required field
          tokens: [`${project_id}:${token_address}`], // required field
          chain: "ETH", // required field
          price,
          tokenAddress: project_id,
          buyerBroker: "",
        });

        const { createBuyTx: response } = instructions;

        if ((response && response.data) || Object.keys(response).length > 0) {
          if (response.error) {
            showErrorToast(response.error);
            return;
          }
          const result = await sendTransaction(response?.txObj);
          if (result.success) {
            showSuccessToast(result.message);
          } else {
            showErrorToast(result.message);
          }
        }
      } catch (error) {
        console.error(error);
        showTxErrorToast(error);
      } finally {
        stopLoading();
      }
    }
  };
  return { buyNowInSOL, buyNowInETH };
}
