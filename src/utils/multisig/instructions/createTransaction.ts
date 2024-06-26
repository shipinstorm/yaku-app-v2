/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";

/**
 * @category Instructions
 * @category CreateTransaction
 * @category generated
 */
export type CreateTransactionInstructionArgs = {
  authorityIndex: number;
};
/**
 * @category Instructions
 * @category CreateTransaction
 * @category generated
 */
export const createTransactionStruct = new beet.BeetArgsStruct<
  CreateTransactionInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["instructionDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["authorityIndex", beet.u32],
  ],
  "CreateTransactionInstructionArgs"
);
/**
 * Accounts required by the _createTransaction_ instruction
 *
 * @property [_writable_] multisig
 * @property [_writable_] transaction
 * @property [_writable_, **signer**] creator
 * @category Instructions
 * @category CreateTransaction
 * @category generated
 */
export type CreateTransactionInstructionAccounts = {
  multisig: web3.PublicKey;
  transaction: web3.PublicKey;
  creator: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const createTransactionInstructionDiscriminator = [
  227, 193, 53, 239, 55, 126, 112, 105,
];

/**
 * Creates a _CreateTransaction_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateTransaction
 * @category generated
 */
export function createCreateTransactionInstruction(
  accounts: CreateTransactionInstructionAccounts,
  args: CreateTransactionInstructionArgs,
  programId = new web3.PublicKey("SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu")
) {
  const [data] = createTransactionStruct.serialize({
    instructionDiscriminator: createTransactionInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.multisig,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.transaction,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.creator,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ];

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
