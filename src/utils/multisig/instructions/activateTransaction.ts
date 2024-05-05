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
 * @category ActivateTransaction
 * @category generated
 */
export const activateTransactionStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */;
}>(
  [["instructionDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)]],
  "ActivateTransactionInstructionArgs"
);
/**
 * Accounts required by the _activateTransaction_ instruction
 *
 * @property [] multisig
 * @property [_writable_] transaction
 * @property [_writable_, **signer**] creator
 * @category Instructions
 * @category ActivateTransaction
 * @category generated
 */
export type ActivateTransactionInstructionAccounts = {
  multisig: web3.PublicKey;
  transaction: web3.PublicKey;
  creator: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const activateTransactionInstructionDiscriminator = [
  56, 17, 0, 163, 135, 11, 135, 32,
];

/**
 * Creates a _ActivateTransaction_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category ActivateTransaction
 * @category generated
 */
export function createActivateTransactionInstruction(
  accounts: ActivateTransactionInstructionAccounts,
  programId = new web3.PublicKey("SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu")
) {
  const [data] = activateTransactionStruct.serialize({
    instructionDiscriminator: activateTransactionInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.multisig,
      isWritable: false,
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
