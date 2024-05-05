import { useWallet } from "@solana/wallet-adapter-react";
import {
  SystemProgram,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@/actions/project";
import { createTransferInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { DEFAULT_RPC, DEFAULT_RPC_WS, USDCMINT } from "@/config/config";
import useConnections from "./useConnetions";
import { omit, set } from "lodash";

// eslint-disable-next-line import/prefer-default-export
export function useTransactions() {
  const wallet = useWallet();
  const { connection } = useConnections();

  const sendAndConfirmTx = async (transaction: Transaction) => {
    const anyTransaction: any = transaction;
    const conn = new Connection(DEFAULT_RPC, {
      confirmTransactionInitialTimeout: 10 * 1000, // 60 Seconds
      commitment: "confirmed",
      wsEndpoint: DEFAULT_RPC_WS,
      httpHeaders: {
        origin: "https://www.yaku.ai",
      },
      fetchMiddleware: (url, options, fetch) => {
        if (options) {
          set(options, "headers", omit(options.headers!, ["solana-client"]));
          fetch(url, options);
        }
      },
    });
    const latestBlockHash = await conn.getLatestBlockhash();
    anyTransaction.recentBlockhash = latestBlockHash.blockhash;
    // Sign transaction, broadcast, and confirm
    const signature = await wallet.sendTransaction(transaction, conn, {});
    await conn.confirmTransaction(
      {
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature,
      },
      "processed"
    );
    return signature;
  };

  const transferSol = async (
    source: string,
    destination: string,
    amount: number
  ) => {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(source),
        toPubkey: new PublicKey(destination),
        lamports: LAMPORTS_PER_SOL * amount,
      })
    );
    transaction.feePayer = new PublicKey(source);
    const signature = await sendAndConfirmTx(transaction);
    return signature;
  };

  const transferSPLToken = async (
    source: string,
    destination: string,
    amount: number,
    tokenMint: string
  ) => {
    if (!wallet) {
      throw new Error("Please connect wallet.");
    }
    if (!wallet.signTransaction) {
      throw new Error("Wallet does not support transaction.");
    }
    const USDCTokenMintPk = new PublicKey(tokenMint);
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      new PublicKey(source),
      USDCTokenMintPk,
      new PublicKey(source),
      wallet.signTransaction
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      new PublicKey(source),
      USDCTokenMintPk,
      new PublicKey(destination),
      wallet.signTransaction
    );

    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        new PublicKey(source),
        amount * 1_000_000,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    const signature = await sendAndConfirmTx(transaction);

    return signature;
  };

  const getBalance = async (pubkey: string) => {
    const fromWindowsWallet = new PublicKey(pubkey);
    const getBal = await connection.getBalance(fromWindowsWallet);
    const tokenAccount = await connection.getParsedTokenAccountsByOwner(
      fromWindowsWallet,
      {
        mint: new PublicKey(USDCMINT),
      }
    );
    const usdcBal =
      tokenAccount?.value[0]?.account?.data?.parsed?.info?.tokenAmount
        ?.uiAmount ?? 0;

    return {
      solana: getBal / LAMPORTS_PER_SOL,
      usdc: usdcBal,
    };
  };
  return { transferSol, transferSPLToken, getBalance };
}
