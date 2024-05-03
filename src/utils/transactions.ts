import { WalletContextState } from '@solana/wallet-adapter-react';
import {
    TransactionSignature,
    Connection,
    TransactionInstruction,
    Keypair,
    Commitment,
    Transaction,
    ComputeBudgetProgram,
    RpcResponseAndContext,
    SimulatedTransactionResponse,
    SignatureStatus,
    PublicKey,
    Blockhash
} from '@solana/web3.js';
import { NETWORK } from '@/config';
import { sleep } from './utils';

/* eslint-disable no-underscore-dangle */

export const DEFAULT_TIMEOUT = 15000;

export const ERROR_MAP = {
    MISSING_WALLET: 'You do not have a wallet of this type.',
    SIG_FAILED: 'Signing message failed. Make sure you are not connected to a hardware wallet.',
    REQUEST_REJECTED: 'User denied transaction signature.',
    UNAUTHORIZED: 'The requested method and/or account has not been authorized by the user.',
    UNSUPPORTED_METHOD: 'The Provider does not support the requested method.',
    DISCONNECTED: 'The wallet is disconnected from the network.',
    CHAIN_DISCONNECTED: 'The Provider is not connected to the requested chain.',
    INVALID_INPUT: 'Missing or invalid parameters. Make sure you used the correct parameters.',
    RESOURCE_NOT_FOUND: 'Requested resource not found. Please contact with team.',
    RESOURCE_NOT_AVAILABLE: 'Requested resource not available. Make sure the wallet dialog is already open.',
    TX_REJECTED: 'Transaction creation failed. Please try again later.',
    METHOD_NOT_SUPPORTED: 'Method is not implemented. Please contact with team.',
    TX_TIMEOUT: 'Transaction timed out. This may be an issue with the Network.',
    JSON_RPC_NOT_SUPPORT: 'Version of JSON-RPC protocol is not supported. Please contact with team.',
    INVALID_REQUEST: 'JSON is not a valid request object.',
    METHOD_NOT_FOUND: 'Method does not exist.',
    INVALID_PARAMS: 'Invalid method parameters. Make sure you used the correct method parameters.',
    INTERNAL_ERROR: 'Internal JSON_RPC error.',
    PARSE_ERROR: 'Invalid JSON.'
};

export const getUnixTs = () => new Date().getTime() / 1000;

export const envFor = (connection: Connection): string => {
    const endpoint = (connection as any).rpcEndpoint;
    console.log(connection);
    const regex = /https:\/\/api.([^.]*).solana.com/;
    const match = endpoint.match(regex);

    if (match?.length > 0) {
        return match[1];
    }
    return NETWORK;
};

export const explorerLinkFor = (txid: TransactionSignature, connection: Connection): string =>
    `https://explorer.solana.com/tx/${txid}?cluster=${envFor(connection)}`;

export const sendTransactionWithRetry = async (
    connection: Connection,
    wallet: WalletContextState,
    instructions: TransactionInstruction[],
    signers: Keypair[],
    computeUnits = 0,
    commitment: Commitment = 'singleGossip',
    includesFeePayer: boolean = false,
    beforeSend?: () => void
) => {
    if (!wallet.publicKey) throw new Error('Wallet not connected');

    let transaction = new Transaction();
    if (computeUnits > 0) {
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: computeUnits
        });
        transaction.add(modifyComputeUnits);
    }
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash = (await connection.getLatestBlockhash(commitment)).blockhash;
    transaction.feePayer = wallet.publicKey;

    if (signers.length > 0) {
        transaction.partialSign(...signers);
    }
    if (!includesFeePayer) {
        transaction = await wallet.signTransaction!(transaction);
    }

    if (beforeSend) {
        beforeSend();
    }

    const { txid, slot } = await sendSignedTransaction({
        connection,
        signedTransaction: transaction
    });

    return { txid, slot };
};

export interface Txn {
    txid: string | null;
    slot: number | null;
}

export async function sendSignedTransaction({
    signedTransaction,
    connection,
    timeout = DEFAULT_TIMEOUT
}: {
    signedTransaction: Transaction;
    connection: Connection;
    sendingMessage?: string;
    sentMessage?: string;
    successMessage?: string;
    timeout?: number;
}): Promise<Txn> {
    const rawTransaction = signedTransaction.serialize();
    const startTime = getUnixTs();
    let slot = 0;
    const txid: TransactionSignature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true
    });

    console.log('Started awaiting confirmation for', txid);

    let done = false;
    (async () => {
        while (!done && getUnixTs() - startTime < timeout) {
            connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true
            });
            // eslint-disable-next-line no-await-in-loop
            await sleep(500);
        }
    })();
    try {
        const confirmation = await awaitTransactionSignatureConfirmation(txid, timeout, connection);
        console.log('🚀 ~ file: connection.ts ~ line 388 ~ confirmation', confirmation);

        if (!confirmation) throw new Error('Timed out awaiting confirmation on transaction');

        if (confirmation.err) {
            console.error(confirmation.err);
            throw new Error('Transaction failed: Custom instruction error');
        }

        slot = confirmation?.slot || 0;
    } catch (err: any) {
        console.error('Transaction Error caught', err);
        if ((err as string) === 'timeout') {
            throw new Error('Timed out awaiting confirmation on transaction');
        }
        let simulateResult: SimulatedTransactionResponse | null = null;
        try {
            simulateResult = (await simulateTransaction(connection, signedTransaction, 'single')).value;
        } catch (e) {
            console.error('Simulation error');
        }
        if (simulateResult && simulateResult.err) {
            if (simulateResult.logs) {
                for (let i = simulateResult.logs.length - 1; i >= 0; i -= 1) {
                    const line = simulateResult.logs[i];
                    if (line.startsWith('Program log: ')) {
                        throw new Error(`Transaction failed: ${line.slice('Program log: '.length)}`);
                    }
                }
            }
            throw new Error(JSON.stringify(simulateResult.err));
        }
        throw new Error('Transaction failed');
    } finally {
        done = true;
    }

    console.log('Latency', txid, getUnixTs() - startTime);
    return { txid, slot };
}

async function simulateTransaction(
    connection: Connection,
    transaction: Transaction,
    commitment: Commitment
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
    // @ts-ignore
    transaction.recentBlockhash = await connection._recentBlockhash(
        // @ts-ignore
        connection._disableBlockhashCaching
    );

    const signData = transaction.serializeMessage();
    // @ts-ignore
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString('base64');
    const config: any = { encoding: 'base64', commitment };
    const args = [encodedTransaction, config];

    // @ts-ignore
    const res = await connection._rpcRequest('simulateTransaction', args);
    if (res.error) {
        throw new Error(`failed to simulate transaction: ${res.error.message}`);
    }
    return res.result;
}

async function awaitTransactionSignatureConfirmation(
    txid: TransactionSignature,
    timeout: number,
    connection: Connection,
    commitment: Commitment = 'recent',
    queryStatus = false
) {
    let done = false;
    let status: SignatureStatus | null = {
        slot: 0,
        confirmations: 0,
        err: null
    };
    let subId = 0;
    await new Promise((resolve, reject) => {
        (async () => {
            setTimeout(() => {
                if (done) {
                    return;
                }
                done = true;
                reject(new Error('timeout'));
            }, timeout);
            try {
                subId = connection.onSignature(
                    txid,
                    (result, context) => {
                        done = true;
                        status = {
                            err: result.err,
                            slot: context.slot,
                            confirmations: 0
                        };
                        if (result.err) {
                            console.log('Rejected via websocket', result.err);
                            if (result.err === null) {
                                resolve(result.err);
                            } else {
                                reject(result.err);
                            }
                        } else {
                            console.log('Resolved via websocket', result);
                            resolve(result);
                        }
                    },
                    commitment
                );
            } catch (e) {
                done = true;
                console.error('WS error in setup', txid, e);
            }
            while (!done && queryStatus) {
                /* eslint-disable */
                (async () => {
                    try {
                        const signatureStatuses = await connection.getSignatureStatuses([txid]);
                        status = signatureStatuses && signatureStatuses.value[0];
                        if (!done) {
                            if (!status) {
                                console.log('REST null result for', txid, status);
                            } else if (status.err) {
                                console.log('REST error for', txid, status);
                                done = true;
                                reject(status.err);
                            } else if (!status.confirmations) {
                                console.log('REST no confirmations for', txid, status);
                            } else {
                                console.log('REST confirmation for', txid, status);
                                done = true;
                                resolve(status);
                            }
                        }
                    } catch (e) {
                        if (!done) {
                            console.log('REST connection error: txid', txid, e);
                        }
                    }
                })();
                /* eslint-enable */

                // eslint-disable-next-line no-await-in-loop
                await sleep(2000);
            }
        })();
    })
        .catch((err) => {
            if (err.timeout && status) {
                status.err = { timeout: true };
            }
            connection.removeSignatureListener(subId);
        })
        .then((_) => {
            connection.removeSignatureListener(subId);
        });
    done = true;
    return status;
}

export const buildTransaction = async ({
    connection,
    instructions,
    feePayer,
    recentBlockhash,
    recentBlockHeight
}: {
    connection: Connection;
    instructions: TransactionInstruction[];
    feePayer?: PublicKey;
    recentBlockhash?: Blockhash;
    recentBlockHeight?: number;
}): Promise<Transaction> => {
    recentBlockhash = recentBlockhash || (await connection.getLatestBlockhash().then((b) => b.blockhash));
    const transaction = new Transaction();
    transaction.add(...instructions);
    transaction.feePayer = feePayer;
    transaction.recentBlockhash = recentBlockhash;
    transaction.lastValidBlockHeight = recentBlockHeight;
    return transaction;
};
