/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-await-in-loop */
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { useRecoilState } from 'recoil';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { useToasts } from 'hooks/useToasts';
import { gridSpacing } from 'store/constant';
import { snipedIdentifierAtom } from './recoil/atom/HaloLabsAtom';
import Sniper from 'components/sniper/Sniper';
import { cloneDeep, map, omit, set } from 'lodash';
import { web3 } from '@project-serum/anchor';
import { DEFAULT_RPC_WS, RPC_LIST } from 'config/config';
import { Promise } from 'bluebird';
import axios from 'axios';

const SniperHome = () => {
    const wallet = useWallet();
    const { showInfoToast, showErrorToast } = useToasts();
    const [snipedIdentifier, setSnipedIdentifier] = useRecoilState(snipedIdentifierAtom);

    const delay = (ms?: number) => new Promise((res) => setTimeout(res, ms));

    const getSnipeTx = async (MEData: any, walletAddress: string) => {
        try {
            const {
                tokenMint,
                price,
                expiry,
                pdaAddress,
                auctionHouse,
                tokenAddress,
                seller,
                sellerReferral,
                buyerCreatorRoyaltyPercent = 0
            } = MEData;
            const { data } = await axios.post(`https://proxy.yaku.ai/api/me/tx/snipe`, {
                mint: tokenMint,
                buyer: walletAddress,
                seller,
                auctionHouse,
                tokenAddress,
                price,
                expiry,
                pdaAddress,
                sellerReferral,
                buyerCreatorRoyaltyPercent
            });
            return data;
        } catch (error) {
            console.error(error);
        }
        return {};
    };
    const getBuyInstructions = async (MEData: any, walletAddress: string) => {
        let tries = 0;
        const { tokenMint, price, expiry, pdaAddress, auctionHouse, tokenAddress, seller, sellerReferral } = MEData;
        let result = await getSnipeTx(MEData, walletAddress);
        if (result) {
            return result;
        }
        while (Object.keys(result).length === 0 && tries <= 30) {
            if (tries === 0) {
                await delay(100);
            } else {
                await delay(100 + 35 * tries);
            }
            // ('retrying buy instruction ' + String(tries));
            try {
                result = await getSnipeTx(MEData, walletAddress);
                return result;
            } catch (error) {
                console.error(error);
            }
            tries += 1;
        }

        return result;
    };

    const getTransactionWithRetries = async (conn: web3.Connection, res: any) => {
        let signature = null;
        let tries = 0;
        while (tries < 100 && signature === null) {
            tries += 1;
            // console.log('Got null. In while loop. Tries: ', tries);
            await delay(100);
            try {
                const getTransResp = await conn.getTransaction(res, { commitment: 'confirmed' });
                if (getTransResp === null) {
                    // console.log('got null getTransaction');
                    signature = null;
                    // eslint-disable-next-line no-continue
                    continue;
                }
                if (typeof getTransResp === 'object' && getTransResp?.meta?.err === null) {
                    showInfoToast(
                        <a href={`https://solscan.io/tx/${res}`} target="_blank" rel="noreferrer" className="m-auto">
                            Sniped, Congrats!
                        </a>
                    );
                    signature = res;
                    // eslint-disable-next-line no-continue
                    continue;
                }
                showErrorToast('Unsuccessful!');
                signature = -1;
            } catch (error) {
                showErrorToast('Unsuccessful!');
                signature = -1;
            }
        }
        return signature;
    };
    const buyNow = async (MEData: any, identifier: never, tryOnRpc = true) => {
        if (wallet.publicKey && !snipedIdentifier.includes(identifier)) {
            showInfoToast('Sniping...');
            // goes through each NFT in cart, gets the ME transaction detail,
            // and makes a transaction object from it
            try {
                let response;
                response = await getBuyInstructions(MEData, wallet.publicKey.toBase58());
                if (response && response.getMETransactionInstructionsForSnipe) {
                    ({ getMETransactionInstructionsForSnipe: response } = response);
                }
                if (Object.keys(response).length > 0) {
                    // console.log('got proper response');
                    const transaction = Transaction.from(Buffer.from(response.txSigned));
                    if (tryOnRpc) {
                        const conns = map(
                            RPC_LIST,
                            (rpcEndpoint) =>
                                new web3.Connection(rpcEndpoint, {
                                    confirmTransactionInitialTimeout: 10 * 1000, // 10 Seconds
                                    commitment: 'confirmed',
                                    wsEndpoint: DEFAULT_RPC_WS,
                                    httpHeaders: {
                                        origin: 'https://www.yaku.ai'
                                    },
                                    fetchMiddleware: (url, options, fetch) => {
                                        if (options) {
                                            set(options, 'headers', omit(options.headers!, ['solana-client']));
                                            fetch(url, options);
                                        }
                                    }
                                })
                        );
                        const sigantures = await Promise.map(conns, (con) =>
                            wallet.sendTransaction(transaction, con, { maxRetries: 2 }).then(async (res) => {
                                await con.confirmTransaction(res);
                                const signature = await getTransactionWithRetries(con, res);
                                if (signature !== -1) {
                                    setSnipedIdentifier([identifier].concat(cloneDeep(snipedIdentifier)));
                                }
                                return signature;
                            })
                        );
                        return sigantures;
                    }
                    const conn = new web3.Connection(RPC_LIST[0], {
                        confirmTransactionInitialTimeout: 10 * 1000, // 10 Seconds
                        commitment: 'confirmed',
                        wsEndpoint: DEFAULT_RPC_WS,
                        httpHeaders: {
                            origin: 'https://www.yaku.ai'
                        },
                        fetchMiddleware: (url, options, fetch) => {
                            if (options) {
                                set(options, 'headers', omit(options.headers!, ['solana-client']));
                                fetch(url, options);
                            }
                        }
                    });
                    const sigantures = await Promise.map([conn], (con) =>
                        wallet.sendTransaction(transaction, con, { maxRetries: 2 }).then(async (res) => {
                            await con.confirmTransaction(res);
                            const signature = await getTransactionWithRetries(con, res);
                            if (signature !== -1) {
                                setSnipedIdentifier([identifier].concat(cloneDeep(snipedIdentifier)));
                            }
                            return signature;
                        })
                    );
                    return sigantures;
                }
            } catch (error) {
                console.error(error);
            }
            return -1;
        }
        return -1;
    };
    return (
        <Grid
            container
            sx={{
                marginTop: 0,
                marginLeft: 0,
                width: '100%'
            }}
            spacing={gridSpacing}
        >
            <Sniper buyNow={buyNow} />
        </Grid>
    );
};

export default SniperHome;
