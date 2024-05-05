/* eslint-disable no-await-in-loop */

import { BN, utils } from "@project-serum/anchor";
import { NATIVE_MINT } from "@solana/spl-token";
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import {
  AccountMeta,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { AssetChoice } from "@/types/ms";
import {
  createActivateTransactionInstruction,
  createAddInstructionInstruction,
  createAddMemberInstruction,
  createApproveTransactionInstruction,
  createCancelTransactionInstruction,
  createChangeThresholdInstruction,
  createCreateTransactionInstruction,
  createExecuteTransactionInstruction,
  createRejectTransactionInstruction,
  createRemoveMemberInstruction,
  MsInstruction,
  MsInstructionArgs,
  PROGRAM_ID,
} from "./multisig";
import { buildTransaction } from "./transactions";
import { createSolTransferInstruction, getATA } from "./web3";

export const getMsPDA = (createKey: PublicKey): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("squad"), createKey.toBuffer(), Buffer.from("multisig")],
    PROGRAM_ID
  );

export const getTxPDA = (msPDA: PublicKey, txIndex: BN): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from("squad"),
      msPDA.toBuffer(),
      txIndex.toArrayLike(Buffer, "le", 4),
      Buffer.from("transaction"),
    ],
    PROGRAM_ID
  );

export const getIxPDA = (txPDA: PublicKey, IxIndex: BN): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from("squad"),
      txPDA.toBuffer(),
      IxIndex.toArrayLike(Buffer, "le", 1),
      Buffer.from("instruction"),
    ],
    PROGRAM_ID
  );

export const getAuthorityPDA = (
  multisig: PublicKey,
  authorityIndex: BN
): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from("squad"),
      multisig.toBuffer(),
      authorityIndex.toArrayLike(Buffer, "le", 4),
      Buffer.from("authority"),
    ],
    PROGRAM_ID
  );

export const getTxPDAFromString = (
  multisig: string,
  txIndex: number
): string => {
  const [txPDA] = getTxPDA(new PublicKey(multisig), new BN(txIndex));
  return txPDA.toBase58();
};

export const getMsTxInstructions = ({
  creator,
  msPDA,
  txIndex,
  incomingIxs,
  authorityIndex = 1,
}: {
  creator: PublicKey;
  msPDA: PublicKey;
  txIndex: number;
  incomingIxs: TransactionInstruction[];
  authorityIndex: number;
}): TransactionInstruction[] => {
  const instructions: TransactionInstruction[] = [];

  // Create MsTransaction
  const [transactionPDA] = getTxPDA(msPDA, new BN(txIndex));
  instructions.push(
    createCreateTransactionInstruction(
      {
        multisig: msPDA,
        transaction: transactionPDA,
        creator,
      },
      { authorityIndex }
    )
  );

  // Add Instructions
  let ixIndex = 0;
  for (const ix of incomingIxs) {
    ixIndex += 1;
    const [instructionPDA] = getIxPDA(transactionPDA, new BN(ixIndex));
    instructions.push(
      createAddInstructionInstruction(
        {
          multisig: msPDA,
          transaction: transactionPDA,
          instruction: instructionPDA,
          creator,
        },
        {
          incomingInstruction: ix,
        }
      )
    );
  }

  // Activate transaction
  instructions.push(
    createActivateTransactionInstruction({
      multisig: msPDA,
      transaction: transactionPDA,
      creator,
    })
  );

  // Approve transaction
  instructions.push(
    createApproveTransactionInstruction({
      multisig: msPDA,
      transaction: transactionPDA,
      member: creator,
    })
  );

  return instructions;
};

export const getMsTxs = async ({
  connection,
  creator,
  msPDA,
  txIndex,
  incomingIxs,
  authorityIndex = 1,
}: {
  connection: Connection;
  creator: PublicKey;
  msPDA: PublicKey;
  txIndex: number;
  incomingIxs: TransactionInstruction[];
  authorityIndex?: number;
}): Promise<Transaction[]> => {
  const allTxs: Transaction[] = [];
  const latestBlockHash = await connection.getLatestBlockhash();
  const [transactionPDA] = getTxPDA(msPDA, new BN(txIndex));

  // create tx for creating MsTx
  const instructions = [
    createCreateTransactionInstruction(
      {
        multisig: msPDA,
        transaction: transactionPDA,
        creator,
      },
      { authorityIndex }
    ),
  ];

  allTxs.push(
    await buildTransaction({
      connection,
      instructions,
      feePayer: creator,
      recentBlockhash: latestBlockHash.blockhash,
      recentBlockHeight: latestBlockHash.lastValidBlockHeight,
    })
  );

  // create tx for adding instructions
  let ixIndex = 0;
  for (const incomingIx of incomingIxs) {
    ixIndex += 1;
    const [instructionPDA] = getIxPDA(transactionPDA, new BN(ixIndex));

    const tempIxs = [
      createAddInstructionInstruction(
        {
          multisig: msPDA,
          transaction: transactionPDA,
          instruction: instructionPDA,
          creator,
        },
        {
          incomingInstruction: incomingIx,
        }
      ),
    ];

    allTxs.push(
      await buildTransaction({
        connection,
        instructions: tempIxs,
        feePayer: creator,
        recentBlockhash: latestBlockHash.blockhash,
        recentBlockHeight: latestBlockHash.lastValidBlockHeight,
      })
    );
  }

  // create tx for activating transaction
  allTxs.push(
    await buildTransaction({
      connection,
      instructions: [
        createActivateTransactionInstruction({
          multisig: msPDA,
          transaction: transactionPDA,
          creator,
        }),
      ],
      feePayer: creator,
      recentBlockhash: latestBlockHash.blockhash,
      recentBlockHeight: latestBlockHash.lastValidBlockHeight,
    })
  );

  // create tx for approving transaction
  allTxs.push(
    await buildTransaction({
      connection,
      instructions: [
        createApproveTransactionInstruction({
          multisig: msPDA,
          transaction: transactionPDA,
          member: creator,
        }),
      ],
      feePayer: creator,
      recentBlockhash: latestBlockHash.blockhash,
      recentBlockHeight: latestBlockHash.lastValidBlockHeight,
    })
  );

  return allTxs;
};

export const getSendNFTInstructions = async ({
  connection,
  payer,
  msPDA,
  txIndex,
  vault,
  recipient,
  assets,
}: {
  connection: Connection;
  payer: PublicKey;
  msPDA: PublicKey;
  txIndex: number;
  vault: PublicKey;
  recipient: PublicKey;
  assets: AssetChoice[];
}): Promise<TransactionInstruction[]> => {
  const instructions: TransactionInstruction[] = [];

  for (const asset of assets) {
    const mint = new PublicKey(asset.value);
    const vaultTA = asset.ta;

    if (vaultTA) {
      // Create ATA if necessary
      let recipientTA: PublicKey;
      const recipientTAs = (
        await connection.getParsedTokenAccountsByOwner(recipient, { mint })
      ).value;
      if (recipientTAs.length === 0) {
        recipientTA = getATA(recipient, mint);
        instructions.push(
          createAssociatedTokenAccountInstruction(
            payer,
            recipientTA,
            recipient,
            mint
          )
        );
      } else {
        recipientTA = recipientTAs[0].pubkey;
      }

      instructions.push(
        createTransferInstruction(
          vaultTA.pubkey,
          recipientTA,
          vault,
          vaultTA.account.data.parsed.info.tokenAmount.amount
        )
      );
    }
  }

  return getMsTxInstructions({
    creator: payer,
    msPDA,
    txIndex,
    incomingIxs: instructions,
    authorityIndex: 1,
  });
};

export const getSendInstructions = async ({
  connection,
  payer,
  msPDA,
  txIndex,
  vault,
  recipient,
  mint,
  vaultTA,
  amount,
  decimals,
  authorityIndex = 1,
}: {
  connection: Connection;
  payer: PublicKey;
  msPDA: PublicKey;
  txIndex: number;
  vault: PublicKey;
  recipient: PublicKey;
  mint: PublicKey;
  vaultTA: PublicKey | undefined;
  amount: number;
  decimals: number;
  authorityIndex?: number;
}): Promise<TransactionInstruction[]> => {
  const instructions = [];

  // Create ATA if necessary
  let recipientTA: PublicKey;
  const recipientTAs = (
    await connection.getParsedTokenAccountsByOwner(recipient, { mint })
  ).value;
  if (recipientTAs.length === 0) {
    recipientTA = getATA(recipient, mint);
    instructions.push(
      createAssociatedTokenAccountInstruction(
        payer,
        recipientTA,
        recipient,
        mint
      )
    );
  } else {
    recipientTA = recipientTAs[0].pubkey;
  }

  let incomingIx: TransactionInstruction;

  if (mint.toString() === NATIVE_MINT.toString()) {
    incomingIx = createSolTransferInstruction(
      vault,
      recipient,
      amount * LAMPORTS_PER_SOL
    );
  } else {
    incomingIx = createTransferCheckedInstruction(
      vaultTA!,
      mint,
      recipientTA,
      vault,
      amount * 10 ** decimals,
      decimals
    );
  }
  instructions.push(
    ...getMsTxInstructions({
      creator: payer,
      msPDA,
      txIndex,
      incomingIxs: [incomingIx],
      authorityIndex,
    })
  );

  return instructions;
};

export const getCancelInstructions = ({
  payer,
  msPDA,
  txIndex,
}: {
  payer: PublicKey;
  msPDA: PublicKey;
  txIndex: number;
}): TransactionInstruction[] => {
  const instructions = [];

  const [transactionPDA] = getTxPDA(msPDA, new BN(txIndex));
  instructions.push(
    createCancelTransactionInstruction({
      multisig: msPDA,
      transaction: transactionPDA,
      member: payer,
    })
  );

  return instructions;
};

export const getExecuteInstruction = async (
  connection: Connection,
  msPDA: PublicKey,
  ixIndex: number,
  transactionPDA: PublicKey,
  feePayer: PublicKey
): Promise<TransactionInstruction> => {
  const ixList = await Promise.all(
    [...new Array(ixIndex)].map(async (a, i) => {
      const ixIndexBN = new BN(i + 1, 10);
      const [ixKey] = getIxPDA(transactionPDA, ixIndexBN);

      const ixAccountInfo = await connection.getAccountInfo(ixKey, "confirmed");
      const ixAccount = MsInstruction.fromAccountInfo(
        ixAccountInfo!,
        0
      )[0] as MsInstructionArgs;
      return { pubkey: ixKey, ixItem: ixAccount };
    })
  );

  const ixKeysList: AccountMeta[] = ixList
    .map(({ pubkey, ixItem }) => {
      const ixKeys: AccountMeta[] = ixItem.keys as AccountMeta[];
      const addSig = utils.sha256.hash("global:add_member");
      const ixDiscriminator = Buffer.from(addSig, "hex");
      const addData = Buffer.concat([ixDiscriminator.subarray(0, 8)]);
      const addAndThreshSig = utils.sha256.hash(
        "global:add_member_and_change_threshold"
      );
      const ixAndThreshDiscriminator = Buffer.from(addAndThreshSig, "hex");
      const addAndThreshData = Buffer.concat([
        ixAndThreshDiscriminator.subarray(0, 8),
      ]);
      const ixData = Buffer.from(ixItem.data);

      const formattedKeys = ixKeys.map((ixKey, keyInd) => {
        if (
          (ixData.includes(addData) || ixData.includes(addAndThreshData)) &&
          keyInd === 2
        ) {
          return {
            pubkey: feePayer,
            isSigner: false,
            isWritable: ixKey.isWritable,
          };
        }
        return {
          pubkey: ixKey.pubkey,
          isSigner: false,
          isWritable: ixKey.isWritable,
        };
      });

      return [
        { pubkey, isSigner: false, isWritable: false },
        { pubkey: ixItem.programId, isSigner: false, isWritable: false },
        ...formattedKeys,
      ];
    })
    .reduce((p, c) => p.concat(c), []);

  //  [ix ix_account, ix program_id, key1, key2 ...]
  const keysUnique: AccountMeta[] = ixKeysList.reduce((prev, curr) => {
    const inList = prev.findIndex(
      (a) => a.pubkey.toBase58() === curr.pubkey.toBase58()
    );
    // if its already in the list, and has same write flag
    if (inList >= 0 && prev[inList].isWritable === curr.isWritable) {
      return prev;
    }
    prev.push({
      pubkey: curr.pubkey,
      isWritable: curr.isWritable,
      isSigner: curr.isSigner,
    });
    return prev;
  }, [] as AccountMeta[]);

  const keyIndexMap = ixKeysList.map((a) =>
    keysUnique.findIndex(
      (k) =>
        k.pubkey.toBase58() === a.pubkey.toBase58() &&
        k.isWritable === a.isWritable
    )
  );

  const executeIx = createExecuteTransactionInstruction(
    {
      multisig: msPDA,
      transaction: transactionPDA,
      member: feePayer,
    },
    {
      accountList: Buffer.from(keyIndexMap),
    }
  );

  executeIx.keys = executeIx.keys.concat(keysUnique);
  return executeIx;
};

export const getRejectInstructions = ({
  payer,
  msPDA,
  txIndex,
}: {
  payer: PublicKey;
  msPDA: PublicKey;
  txIndex: number;
}): TransactionInstruction[] => {
  const instructions = [];

  const [transactionPDA] = getTxPDA(msPDA, new BN(txIndex));
  instructions.push(
    createRejectTransactionInstruction({
      multisig: msPDA,
      transaction: transactionPDA,
      member: payer,
    })
  );

  return instructions;
};

export const getConfirmInstructions = ({
  payer,
  msPDA,
  txIndex,
}: {
  payer: PublicKey;
  msPDA: PublicKey;
  txIndex: number;
}): TransactionInstruction[] => {
  const instructions = [];

  const [transactionPDA] = getTxPDA(msPDA, new BN(txIndex));
  instructions.push(
    createApproveTransactionInstruction({
      multisig: msPDA,
      transaction: transactionPDA,
      member: payer,
    })
  );

  return instructions;
};

export const getAddMemberInstructions = async ({
  payer,
  msPDA,
  newMember,
  txIndex,
  authorityIndex = 0,
}: {
  payer: PublicKey;
  msPDA: PublicKey;
  newMember: PublicKey;
  txIndex: number;
  authorityIndex?: number;
}): Promise<TransactionInstruction[]> =>
  getMsTxInstructions({
    creator: payer,
    msPDA,
    txIndex,
    incomingIxs: [
      createAddMemberInstruction(
        {
          multisig: msPDA,
          multisigAuth: msPDA,
          member: payer,
        },
        {
          newMember,
        }
      ),
    ],
    authorityIndex,
  });

export const getRemoveMemberInstructions = ({
  payer,
  msPDA,
  oldMember,
  txIndex,
  authorityIndex = 0,
}: {
  payer: PublicKey;
  msPDA: PublicKey;
  oldMember: PublicKey;
  txIndex: number;
  authorityIndex?: number;
}): TransactionInstruction[] =>
  getMsTxInstructions({
    creator: payer,
    msPDA,
    txIndex,
    incomingIxs: [
      createRemoveMemberInstruction(
        {
          multisig: msPDA,
          multisigAuth: msPDA,
        },
        {
          oldMember,
        }
      ),
    ],
    authorityIndex,
  });

export const getChangeThresholdInstructions = ({
  payer,
  msPDA,
  newThreshold,
  txIndex,
  authorityIndex = 0,
}: {
  payer: PublicKey;
  msPDA: PublicKey;
  newThreshold: number;
  txIndex: number;
  authorityIndex?: number;
}): TransactionInstruction[] =>
  getMsTxInstructions({
    creator: payer,
    msPDA,
    txIndex,
    incomingIxs: [
      createChangeThresholdInstruction(
        {
          multisig: msPDA,
          multisigAuth: msPDA,
        },
        {
          newThreshold,
        }
      ),
    ],
    authorityIndex,
  });
export const getMEInstructions = ({
  payer,
  msPDA,
  txIndex,
  incomingIxs,
  authorityIndex = 1,
}: {
  payer: PublicKey;
  msPDA: PublicKey;
  txIndex: number;
  incomingIxs: TransactionInstruction[];
  authorityIndex?: number;
}): TransactionInstruction[] =>
  getMsTxInstructions({
    creator: payer,
    msPDA,
    txIndex,
    incomingIxs,
    authorityIndex,
  });
