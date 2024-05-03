/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js';
import * as beetSolana from '@metaplex-foundation/beet-solana';
import * as beet from '@metaplex-foundation/beet';

/**
 * @category Instructions
 * @category AddMemberAndChangeThreshold
 * @category generated
 */
export type AddMemberAndChangeThresholdInstructionArgs = {
    newMember: web3.PublicKey;
    newThreshold: number;
};
/**
 * @category Instructions
 * @category AddMemberAndChangeThreshold
 * @category generated
 */
export const addMemberAndChangeThresholdStruct = new beet.BeetArgsStruct<
    AddMemberAndChangeThresholdInstructionArgs & {
        instructionDiscriminator: number[] /* size: 8 */;
    }
>(
    [
        ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
        ['newMember', beetSolana.publicKey],
        ['newThreshold', beet.u16]
    ],
    'AddMemberAndChangeThresholdInstructionArgs'
);
/**
 * Accounts required by the _addMemberAndChangeThreshold_ instruction
 *
 * @property [_writable_] multisig
 * @property [_writable_, **signer**] multisigAuth
 * @property [_writable_, **signer**] member
 * @category Instructions
 * @category AddMemberAndChangeThreshold
 * @category generated
 */
export type AddMemberAndChangeThresholdInstructionAccounts = {
    multisig: web3.PublicKey;
    multisigAuth: web3.PublicKey;
    member: web3.PublicKey;
    rent?: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};

export const addMemberAndChangeThresholdInstructionDiscriminator = [114, 213, 59, 47, 214, 157, 150, 170];

/**
 * Creates a _AddMemberAndChangeThreshold_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category AddMemberAndChangeThreshold
 * @category generated
 */
export function createAddMemberAndChangeThresholdInstruction(
    accounts: AddMemberAndChangeThresholdInstructionAccounts,
    args: AddMemberAndChangeThresholdInstructionArgs,
    programId = new web3.PublicKey('SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu')
) {
    const [data] = addMemberAndChangeThresholdStruct.serialize({
        instructionDiscriminator: addMemberAndChangeThresholdInstructionDiscriminator,
        ...args
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
        },
        {
            pubkey: accounts.member,
            isWritable: true,
            isSigner: true
        },
        {
            pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
            isWritable: false,
            isSigner: false
        },
        {
            pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
            isWritable: false,
            isSigner: false
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
