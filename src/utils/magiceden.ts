import { TransactionInstruction } from '@solana/web3.js';

const removeMESigner = (ixs: TransactionInstruction[]): TransactionInstruction[] =>
    ixs.map((ix) => {
        const curKeys = ix.keys;
        const changedKeys = curKeys.map((ixKey, keyInd) => {
            if (keyInd === 0) {
                return ixKey;
            }
            return {
                pubkey: ixKey.pubkey,
                isSigner: false,
                isWritable: ixKey.isWritable
            };
        });
        ix.keys = changedKeys;
        return ix;
    });

export default removeMESigner;
