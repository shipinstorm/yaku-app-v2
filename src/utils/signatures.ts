import { NATIVE_MINT } from '@solana/spl-token';
import { Connection, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import getMintInformation from './mint';
import { PROGRAM_ID } from './multisig';

export enum TransactionType {
    STAKE = 'Stake',
    MINT = 'Mint',
    BUY = 'Buy',
    SWAP = 'Swap',
    TRANSFER = 'Transfer',
    APPROVE = 'Approve Transaction',
    CANCEL = 'Cancel Transaction',
    REJECT = 'Reject Transaction',
    EXECUTE = 'Execute Transaction',
    CREATE = 'Create',
    UNKNOWN = 'Unknown'
}

export const deduceTxType = (logMessages: string[], message: { instructions: any[] }) => {
    const logs = logMessages.join(';');
    if (logs.includes('Stake')) {
        return TransactionType.STAKE;
    }
    if (logs.includes('Mint')) {
        return TransactionType.MINT;
    }
    if (logs.includes('Buy')) {
        return TransactionType.BUY;
    }
    if (logs.includes('Swap')) {
        return TransactionType.SWAP;
    }
    if (
        logs.includes('Transfer') ||
        includeType(message.instructions, 'transfer') ||
        includeType(message.instructions, 'transferChecked')
    ) {
        return TransactionType.TRANSFER;
    }
    if (logs.includes('ApproveTransaction')) {
        return TransactionType.APPROVE;
    }
    if (logs.includes('CancelTransaction')) {
        return TransactionType.CANCEL;
    }
    if (logs.includes('RejectTransaction')) {
        return TransactionType.REJECT;
    }
    if (logs.includes('Create') || message.instructions[0]?.parsed?.type === 'create') {
        return TransactionType.CREATE;
    }
    return TransactionType.UNKNOWN;
};

export const includeType = (ixs: any[], type: string): boolean => ixs.findIndex((idx: any) => idx.parsed?.type === type) > -1;

export const isFailed = (message: any): boolean => !!message.err;

export const isExecuted = (logMessages: any[]) => logMessages.join(',').includes('ExecuteTransaction');

export const parseTransferSignature = async (connection: Connection, tx: any, txType: string, pubkey: string) => {
    let isSent = false;
    if (txType.toLowerCase() === 'transfer') {
        let ixIndex = tx.message.instructions.findIndex(
            (ix: any) => ix.parsed?.type === 'transfer' || ix.parsed?.type === 'transferChecked'
        );

        // normal case
        if (ixIndex > -1) {
            const curIx = tx.message.instructions[ixIndex];

            // if it's sol transfer
            if (curIx.programId === SystemProgram.programId.toBase58()) {
                const mint = NATIVE_MINT.toBase58();
                const { source, destination, lamports } = curIx.parsed.info;
                isSent = source === pubkey;
                const { name, symbol, image } = await getMintInformation(connection, mint);

                return {
                    isSent,
                    mint,
                    amount: lamports / LAMPORTS_PER_SOL,
                    name,
                    symbol,
                    image,
                    source,
                    destination
                };
            }
            const { authority, source, destination, tokenAmount, mint } = curIx.parsed.info;
            isSent = authority === pubkey;

            // get token information
            const { name, symbol, image } = await getMintInformation(connection, mint);

            return {
                isSent,
                mint,
                amount: tokenAmount.uiAmount,
                name,
                symbol,
                image,
                source,
                destination
            };
        }

        // transfer using multisig
        ixIndex = tx.message.instructions.findIndex((ix: any) => ix.programId === PROGRAM_ID.toBase58());
        if (ixIndex > -1) {
            const mint = tx.message.instructions[ixIndex].accounts[6];
            const destination = tx.message.instructions[ixIndex].accounts[7];

            // get token information
            const { name, symbol, image } = await getMintInformation(connection, mint);

            return {
                isSent: true,
                mint,
                destination,
                name,
                symbol,
                image
            };
        }
    }

    if (txType.toLowerCase() === 'mint') {
        if (isExecuted(tx.logMessages)) {
            // find mint address
            const ixIndex = tx.message.instructions.findIndex((ix: any) => ix.programId === PROGRAM_ID.toBase58());
            if (ixIndex > -1) {
                const mint = tx.message.instructions[ixIndex].accounts[5];
                const destination = tx.message.instructions[ixIndex].accounts[6];

                const { name, symbol, image } = await getMintInformation(connection, mint);

                return {
                    isSent: true,
                    mint,
                    name,
                    symbol,
                    image,
                    destination
                };
            }
        }
    }

    return {};
};
