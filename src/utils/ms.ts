/* eslint-disable no-await-in-loop */
import { BN } from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { AssetChoice, AssetInfo, MsTx, VaultInfo } from "@/types/ms";
import {
  createCreateInstruction,
  Ms,
  MsArgs,
  MsInstruction,
  MsInstructionArgs,
  MsTransaction,
  MsTransactionArgs,
  PROGRAM_ID,
} from "./multisig";
import {
  sendSignedTransaction,
  sendTransactionWithRetry,
} from "./transactions";
import {
  createSolTransferInstruction,
  getATA,
  getLamportsByAddress,
  getTokensOfOwner,
  TokenData,
} from "./web3";
import {
  NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import {
  getAddMemberInstructions,
  getAuthorityPDA,
  getCancelInstructions,
  getChangeThresholdInstructions,
  getConfirmInstructions,
  getExecuteInstruction,
  getIxPDA,
  getMEInstructions,
  getMsPDA,
  getMsTxs,
  getRejectInstructions,
  getRemoveMemberInstructions,
  getSendInstructions,
  getSendNFTInstructions,
  getTxPDA,
} from "./msInstructions";
import axios from "axios";
import { filter } from "lodash";

export const MS_TRANSACTION_REFRESH_TIMEOUT = 20000;

export const createMultisig = async ({
  connection,
  wallet,
  meta,
}: {
  connection: Connection;
  wallet: WalletContextState;
  meta: string;
}): Promise<PublicKey | null> => {
  if (!wallet.publicKey) {
    throw new Error("Please connect your wallet first");
  }

  const randomKey = Keypair.generate();
  const randomCreateKey = randomKey.publicKey;

  const members = [wallet.publicKey!];
  const [msPDA] = getMsPDA(randomCreateKey);

  const txIns: TransactionInstruction[] = [];

  // create squad transaction instruction
  const accounts = {
    multisig: msPDA,
    creator: wallet.publicKey!,
  };

  const args = {
    threshold: 1,
    createKey: randomCreateKey,
    members,
    meta,
  };

  const createSquadInstruction = createCreateInstruction(accounts, args);
  txIns.push(createSquadInstruction);

  // create authority vault instruction
  const [vaultPDA] = getAuthorityPDA(msPDA, new BN(1));
  const transferInstruction = createSolTransferInstruction(
    wallet.publicKey!,
    vaultPDA,
    1000000
  );
  txIns.push(transferInstruction);

  const { txid } = await sendTransactionWithRetry(
    connection,
    wallet,
    txIns,
    []
  );
  console.debug("Create multisig transaction signature:", txid);

  return msPDA;
};

export const getMultisig = async (
  connection: Connection,
  msId: string
): Promise<MsArgs> => {
  const msPDAInfo = await connection.getAccountInfo(new PublicKey(msId));
  const msPDAData = Ms.fromAccountInfo(msPDAInfo!, 0)[0] as MsArgs;
  return msPDAData;
};

export const getVault = async (
  connection: Connection,
  multisig: string,
  mode = "metaplex",
  authorityIndex = 1
): Promise<VaultInfo> => {
  const msPubkey = new PublicKey(multisig);
  const [vaultPDA] = getAuthorityPDA(msPubkey!, new BN(authorityIndex));
  const lamports =
    (await getLamportsByAddress(connection, vaultPDA)) / LAMPORTS_PER_SOL;
  let nftList = await getTokensOfOwner(connection, vaultPDA);
  if (mode === "metaplex") {
    nftList = nftList.filter((item) => item.metaplexData);
  }

  return {
    pubkey: vaultPDA,
    lamports,
    nftList,
  };
};

export const getMsTransaction = async (
  connection: Connection,
  multisig: string
): Promise<MsTransactionArgs[]> => {
  const transactionAccounts = await connection.getProgramAccounts(PROGRAM_ID, {
    filters: [
      {
        memcmp: {
          offset: 8 + 32,
          bytes: bs58.encode(new PublicKey(multisig).toBytes()),
        },
      },
    ],
  });
  const txs = transactionAccounts.map(
    (item) =>
      MsTransaction.deserialize(
        item.account.data as Buffer,
        0
      )[0] as MsTransactionArgs
  );

  return txs;
};

export const getRecentTxs = async (
  pubkey: PublicKey | null
): Promise<any[]> => {
  try {
    if (!pubkey) {
      return [];
    }
    const { data: executedTxs } = await axios.post(
      "https://nft.yaku.ai/api/tx/wallet",
      {
        wallet: pubkey.toBase58(),
        limit: 5,
      }
    );
    return executedTxs;
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const getMsTxInstructions = async (
  connection: Connection,
  tx: PublicKey
): Promise<MsInstructionArgs[]> => {
  const txAccountInfo = await connection.getAccountInfo(tx, "confirmed");
  if (txAccountInfo) {
    const txData = MsTransaction.deserialize(
      txAccountInfo.data as Buffer,
      0
    )[0] as MsTransactionArgs;
    if (txData.instructionIndex === 0) {
      return [];
    }
    const ixList = await Promise.all(
      Array.from(Array(txData.instructionIndex).keys()).map(async (ixIndex) => {
        const [ix] = getIxPDA(tx, new BN(ixIndex + 1));
        const ixAccountInfo = await connection.getAccountInfo(ix, "confirmed");
        if (ixAccountInfo) {
          const ixData = MsInstruction.deserialize(
            ixAccountInfo.data as Buffer,
            0
          )[0] as MsInstructionArgs;
          return ixData;
        }
        return null;
      })
    );

    return ixList.filter((ixItem) => ixItem !== null) as MsInstructionArgs[];
  }
  return [];
};

export const getMultipleMsTxInstructions = async (
  connection: Connection,
  txs: PublicKey[]
): Promise<Map<string, MsInstructionArgs[]>> => {
  const multiTxInstructions = new Map<string, MsInstructionArgs[]>();
  await Promise.all(
    txs.map(async (tx) => {
      const ixs = await getMsTxInstructions(connection, tx);
      multiTxInstructions.set(tx.toBase58(), ixs);
    })
  );
  return multiTxInstructions;
};

export const getAssetChoice = async (
  nftItem: TokenData
): Promise<AssetChoice> => {
  const dataURI = nftItem?.metaplexData?.data.data.uri;
  let tokenIcon = "/images/empty-nft.png";
  let tokenLabel = "Unknown";
  if (dataURI) {
    const tokenInfo = (await (await fetch(dataURI)).json()) as AssetInfo;
    if (tokenInfo.image) {
      tokenIcon = tokenInfo.image;
    }
    tokenLabel = tokenInfo.name;
  }
  return {
    label: tokenLabel,
    icon: tokenIcon,
    ta: nftItem.tokenAccount,
    value: nftItem.tokenAccount?.account.data.parsed.info.mint ?? "",
    decimals:
      nftItem.tokenAccount?.account.data.parsed.info.tokenAmount.decimals,
  } as AssetChoice;
};

export const getVaultAssets = async (
  vault: VaultInfo | undefined,
  isSOLIncluded = true
): Promise<AssetChoice[]> => {
  let assetList: AssetChoice[] = [];
  if (isSOLIncluded) {
    assetList = [
      {
        label: "SOL",
        icon: "/images/solana-icon.png",
        value: NATIVE_MINT.toString(),
        decimals: 9,
      },
    ];
  }
  if (vault && vault.nftList.length > 0) {
    const vaultAssets = await Promise.all(
      vault.nftList.map(async (nftItem) => getAssetChoice(nftItem))
    );
    return assetList.concat(vaultAssets);
  }
  return assetList;
};

export const getVaultNFTInfo = async (
  vault: VaultInfo | undefined
): Promise<AssetInfo[]> => {
  if (vault && vault.nftList.length > 0) {
    const nftInfos = await Promise.all(
      vault.nftList.map(async (nftItem) => {
        if (nftItem.metaplexData?.data) {
          const dataURI = nftItem.metaplexData?.data?.data?.uri;
          if (dataURI) {
            const tokenInfo = (await (
              await fetch(dataURI)
            ).json()) as AssetInfo;
            tokenInfo.pubkey =
              nftItem.tokenAccount?.account.data.parsed.info.mint;
            return tokenInfo;
          }
        }
        return null;
      })
    );
    return nftInfos.filter((nftInfo) => nftInfo !== null) as AssetInfo[];
  }
  return [];
};

export const getWalletAssets = async (
  connection: Connection,
  pubkey: PublicKey | null,
  mode = "metaplex",
  isSOLIncluded = true
): Promise<AssetChoice[]> => {
  const assetList: AssetChoice[] = [];

  if (isSOLIncluded) {
    assetList.push({
      label: "SOL",
      icon: "/images/solana-icon.png",
      value: NATIVE_MINT.toString(),
      decimals: 9,
    });
  }

  if (pubkey) {
    let nftList = await getTokensOfOwner(connection, pubkey);
    if (mode === "metaplex") {
      nftList = nftList.filter((item) => item.metaplexData);
    }
    if (nftList.length > 0) {
      const vaultAssets = await Promise.all(
        nftList.map(async (nftItem) =>
          getAssetChoice(nftItem).catch((err: any) => {
            console.error(err);
            return undefined;
          })
        )
      );
      return assetList.concat(
        filter(vaultAssets, (asset) => !!asset) as AssetChoice[]
      );
    }
  }
  return assetList;
};

export const getVaultBalance = (
  vault: VaultInfo | undefined,
  solPrice: number
): string => (vault ? (vault.lamports * solPrice).toFixed(2) : "0");

export const depositNFTs = async ({
  connection,
  wallet,
  vault,
  assets,
}: {
  connection: Connection;
  wallet: WalletContextState;
  vault: VaultInfo;
  assets: AssetChoice[];
}): Promise<boolean> => {
  if (!wallet.publicKey) {
    throw new Error("Please connect your wallet first");
  }

  const instructions: TransactionInstruction[] = [];
  for (const asset of assets) {
    const mint = new PublicKey(asset.value);

    // find token account of wallet
    let walletTA: PublicKey;
    const walletTAs = (
      await connection.getParsedTokenAccountsByOwner(wallet.publicKey!, {
        mint,
      })
    ).value;
    if (walletTAs.length === 0) {
      throw new Error("The wallet does not have the NFT");
    }
    const walletTAIndex = walletTAs.findIndex(
      (walletTAItem) =>
        walletTAItem.account.data.parsed.info.tokenAmount.amount > 0
    );
    if (walletTAIndex > -1) {
      walletTA = walletTAs[walletTAIndex].pubkey;
    } else {
      throw new Error("The wallet does not have the NFT");
    }

    // create token account if needed
    let vaultTA: PublicKey;
    const vaultTAs = (
      await connection.getParsedTokenAccountsByOwner(vault.pubkey, { mint })
    ).value;
    if (vaultTAs.length === 0) {
      vaultTA = getATA(vault.pubkey, mint);
      instructions.push(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey!,
          vaultTA,
          vault.pubkey,
          mint
        )
      );
    } else {
      vaultTA = vaultTAs[0].pubkey;
    }

    // transfer
    instructions.push(
      createTransferInstruction(
        walletTA,
        vaultTA,
        wallet.publicKey!,
        walletTAs[walletTAIndex].account.data.parsed.info.tokenAmount.amount
      )
    );
  }

  const { txid } = await sendTransactionWithRetry(
    connection,
    wallet,
    instructions,
    []
  );
  console.debug("Deposit Assets signature: ", txid);

  return true;
};

export const depositAsset = async ({
  connection,
  wallet,
  vault,
  asset,
  amount,
  decimals = 9,
}: {
  connection: Connection;
  wallet: WalletContextState;
  vault: VaultInfo;
  asset: string;
  amount: number;
  decimals: number;
}): Promise<boolean> => {
  if (!wallet.publicKey) {
    throw new Error("Please connect your wallet first");
  }

  let instructions: TransactionInstruction[] = [];
  const mint = new PublicKey(asset);

  if (asset === NATIVE_MINT.toString()) {
    instructions = [
      createSolTransferInstruction(
        wallet.publicKey,
        vault.pubkey,
        amount * LAMPORTS_PER_SOL
      ),
    ];
  } else {
    // find token account of wallet
    let walletTA: PublicKey;
    const walletTAs = (
      await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { mint })
    ).value;
    if (walletTAs.length === 0) {
      throw new Error("The wallet does not have the NFT");
    }
    const walletTAIndex = walletTAs.findIndex(
      (walletTAItem) =>
        walletTAItem.account.data.parsed.info.tokenAmount.amount > 0
    );
    if (walletTAIndex > -1) {
      walletTA = walletTAs[walletTAIndex].pubkey;
    } else {
      throw new Error("The wallet does not have the NFT");
    }

    // create token account if needed
    let vaultTA: PublicKey;
    const vaultTAs = (
      await connection.getParsedTokenAccountsByOwner(vault.pubkey, { mint })
    ).value;
    if (vaultTAs.length === 0) {
      vaultTA = getATA(vault.pubkey, mint);
      instructions.push(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          vaultTA,
          vault.pubkey,
          mint
        )
      );
    } else {
      vaultTA = vaultTAs[0].pubkey;
    }

    // transfer
    instructions.push(
      createTransferCheckedInstruction(
        walletTA,
        mint,
        vaultTA,
        wallet.publicKey,
        amount * 10 ** decimals,
        decimals
      )
    );
  }

  const { txid } = await sendTransactionWithRetry(
    connection,
    wallet,
    instructions,
    []
  );
  console.debug("Cancel transaction signature: ", txid);

  return true;
};

export const sendAssets = async ({
  connection,
  wallet,
  msPDA,
  txIndex,
  vault,
  recipient,
  assets,
}: {
  connection: Connection;
  wallet: WalletContextState;
  msPDA: PublicKey;
  txIndex: number;
  vault: PublicKey;
  recipient: string;
  assets: AssetChoice[];
}): Promise<boolean> => {
  if (!wallet.publicKey) {
    throw new Error("Please connect your wallet first");
  }

  // validate recipient address
  try {
    await connection.getAccountInfo(new PublicKey(recipient));
  } catch (e) {
    throw new Error("Please input the valid recipient");
  }

  const receiver = new PublicKey(recipient);
  const ixs = await getSendNFTInstructions({
    connection,
    payer: wallet.publicKey,
    msPDA,
    txIndex,
    vault,
    recipient: receiver,
    assets,
  });

  const { txid } = await sendTransactionWithRetry(connection, wallet, ixs, []);
  console.debug("Send assets signature: ", txid);

  return true;
};

export const sendAsset = async ({
  connection,
  wallet,
  msPDA,
  txIndex,
  vault,
  vaultTA,
  recipient,
  asset,
  amount,
  decimals = 9,
}: {
  connection: Connection;
  wallet: WalletContextState;
  msPDA: PublicKey;
  txIndex: number;
  vault: PublicKey;
  vaultTA: PublicKey | undefined;
  recipient: string;
  asset: string;
  amount: number;
  decimals: number;
}): Promise<boolean> => {
  if (!wallet.publicKey) {
    throw new Error("Please connect your wallet first");
  }

  // validate recipient address
  try {
    await connection.getAccountInfo(new PublicKey(recipient));
  } catch (e) {
    throw new Error("Please input the valid recipient");
  }

  const receiver = new PublicKey(recipient);
  const mint = new PublicKey(asset);

  if (mint.toString() !== NATIVE_MINT.toString() && !vaultTA) {
    throw new Error("Vault token account can not be found");
  }

  // get token transfer instructions
  const ixs = await getSendInstructions({
    connection,
    payer: wallet.publicKey,
    msPDA,
    txIndex,
    vault,
    recipient: receiver,
    mint,
    vaultTA,
    amount,
    decimals,
  });

  const { txid } = await sendTransactionWithRetry(connection, wallet, ixs, []);
  console.debug("Send asset signature: ", txid);

  return true;
};

export const cancelMsTx = async ({
  connection,
  wallet,
  tx,
}: {
  connection: Connection;
  wallet: WalletContextState;
  tx: MsTx;
}): Promise<boolean> => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }
  const msPDA = new PublicKey(tx.ms);

  const txIns = getCancelInstructions({
    payer: wallet.publicKey,
    msPDA,
    txIndex: tx.transactionIndex,
  });

  const { txid } = await sendTransactionWithRetry(
    connection,
    wallet,
    txIns,
    []
  );
  console.debug("Cancel multisig transaction signature: ", txid);

  return true;
};

export const executeMsTx = async ({
  connection,
  wallet,
  tx,
}: {
  connection: Connection;
  wallet: WalletContextState;
  tx: MsTx;
}): Promise<string | null> => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }
  const msPDA = new PublicKey(tx.ms);

  const [transactionPDA] = getTxPDA(msPDA, new BN(tx.transactionIndex));
  const instruction = await getExecuteInstruction(
    connection,
    msPDA,
    tx.instructionIndex,
    transactionPDA,
    wallet.publicKey
  );

  const { txid } = await sendTransactionWithRetry(
    connection,
    wallet,
    [instruction],
    [],
    1400000
  );
  console.debug("Execute multisig transaction signature: ", txid);

  return txid;
};

export const rejectMsTx = async ({
  connection,
  wallet,
  tx,
}: {
  connection: Connection;
  wallet: WalletContextState;
  tx: MsTx;
}): Promise<boolean> => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }
  const msPDA = new PublicKey(tx.ms);

  const txIns = getRejectInstructions({
    payer: wallet.publicKey,
    msPDA,
    txIndex: tx.transactionIndex,
  });

  const { txid } = await sendTransactionWithRetry(
    connection,
    wallet,
    txIns,
    []
  );

  console.debug("Reject multisig transaction signature: ", txid);

  return true;
};

export const confirmMsTx = async ({
  connection,
  wallet,
  tx,
}: {
  connection: Connection;
  wallet: WalletContextState;
  tx: MsTx;
}): Promise<boolean> => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }
  const msPDA = new PublicKey(tx.ms);

  const txIns = getConfirmInstructions({
    payer: wallet.publicKey,
    msPDA,
    txIndex: tx.transactionIndex,
  });

  const { txid } = await sendTransactionWithRetry(
    connection,
    wallet,
    txIns,
    []
  );

  console.debug("Confirm multisig transaction signature: ", txid);

  return true;
};

export const addMember = async ({
  connection,
  wallet,
  msPDA,
  txIndex,
  newMember,
}: {
  connection: Connection;
  wallet: WalletContextState;
  msPDA: PublicKey;
  txIndex: number;
  newMember: PublicKey;
}): Promise<boolean> => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }

  const ixs = await getAddMemberInstructions({
    payer: wallet.publicKey,
    msPDA,
    newMember,
    txIndex,
  });

  const { txid } = await sendTransactionWithRetry(connection, wallet, ixs, []);

  console.debug("Add member transaction signature: ", txid);

  return true;
};

export const removeMember = async ({
  connection,
  wallet,
  msPDA,
  txIndex,
  oldMember,
}: {
  connection: Connection;
  wallet: WalletContextState;
  msPDA: PublicKey;
  txIndex: number;
  oldMember: PublicKey;
}): Promise<boolean> => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }

  const ixs = getRemoveMemberInstructions({
    payer: wallet.publicKey,
    msPDA,
    oldMember,
    txIndex,
  });

  const { txid } = await sendTransactionWithRetry(connection, wallet, ixs, []);

  console.debug("Remove member transaction signature: ", txid);

  return true;
};

export const changeThreshold = async ({
  connection,
  wallet,
  msPDA,
  txIndex,
  newThreshold,
}: {
  connection: Connection;
  wallet: WalletContextState;
  msPDA: PublicKey;
  txIndex: number;
  newThreshold: number;
}): Promise<boolean> => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }
  const ixs = getChangeThresholdInstructions({
    payer: wallet.publicKey,
    msPDA,
    newThreshold,
    txIndex,
  });

  const { txid } = await sendTransactionWithRetry(connection, wallet, ixs, []);

  console.debug("Change threshold transaction signature: ", txid);

  return true;
};

export const buyNowME = async ({
  connection,
  wallet,
  msPDA,
  txIndex,
  buyIxs,
}: {
  connection: Connection;
  wallet: WalletContextState;
  msPDA: PublicKey;
  txIndex: number;
  buyIxs: TransactionInstruction[];
}): Promise<boolean> => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }

  try {
    // create transactions
    const txs = await getMsTxs({
      connection,
      creator: wallet.publicKey,
      msPDA,
      txIndex,
      incomingIxs: buyIxs,
    });

    // sign all transactions
    const signedTxs = await wallet.signAllTransactions!(txs);

    // execute transactions one by one
    let executedTxIndex = 0;
    for (const signedTransaction of signedTxs) {
      // eslint-disable-next-line no-await-in-loop
      const signature = await sendSignedTransaction({
        signedTransaction,
        connection,
      });
      console.debug(
        `Signature of the ${executedTxIndex + 1}th transaction: ${
          signature.txid
        }`
      );
      executedTxIndex += 1;
    }
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get the transactions from magiceden");
  }

  return true;
};

export const takeIxsME = async ({
  connection,
  wallet,
  msPDA,
  txIndex,
  listIxs,
}: {
  connection: Connection;
  wallet: WalletContextState;
  msPDA: PublicKey;
  txIndex: number;
  listIxs: TransactionInstruction[];
}): Promise<boolean> => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }

  try {
    // get transaction instructions
    const ixs = await getMEInstructions({
      payer: wallet.publicKey,
      msPDA,
      txIndex,
      incomingIxs: listIxs,
    });

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      ixs,
      []
    );

    console.debug("Change threshold transaction signature: ", txid);
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get the transactions from magiceden");
  }

  return true;
};
