/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

/**
 * @category Instructions
 * @category AddAuthority
 * @category generated
 */
export const addAuthorityStruct = new beet.BeetArgsStruct<{
    instructionDiscriminator: number[] /* size: 8 */;
}>([['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]], 'AddAuthorityInstructionArgs');
/**
 * Accounts required by the _addAuthority_ instruction
 *
 * @property [_writable_] multisig
 * @property [_writable_, **signer**] multisigAuth
 * @category Instructions
 * @category AddAuthority
 * @category generated
 */
export type AddAuthorityInstructionAccounts = {
    multisig: web3.PublicKey;
    multisigAuth: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};

export const addAuthorityInstructionDiscriminator = [229, 9, 106, 73, 91, 213, 109, 183];

/**
 * Creates a _AddAuthority_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category AddAuthority
 * @category generated
 */
export function createAddAuthorityInstruction(
    accounts: AddAuthorityInstructionAccounts,
    programId = new web3.PublicKey('SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu')
) {
    const [data] = addAuthorityStruct.serialize({
        instructionDiscriminator: addAuthorityInstructionDiscriminator
    });
    const keys: web3.AccountMeta[] = [
        {
            pubkey: accounts.multisig,
            isWritable: true,
            isSigner: false
        },
        {
            pubkey: accounts.multisigAuth,
            isWritable: true,
            isSigner: true
        }
    ];

    if (accounts.anchorRemainingAccounts != null) {
        for (const acc of accounts.anchorRemainingAccounts) {
            keys.push(acc);
        }
    }

    const ix = new web3.TransactionInstruction({
        programId,
        keys,
        data
    });
    return ix;
}
