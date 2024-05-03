/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import { Button, Avatar, Typography, Box, Grid, TextField } from '@mui/material';
import { IconX } from '@tabler/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import { Message, PublicKey, Transaction } from '@solana/web3.js';
import { DEFAULT_BUYER_BROKER } from 'config/config';
import { useToasts } from 'hooks/useToasts';
import useConnections from 'hooks/useConnetions';
import { maxCartItems } from 'store/constant';
import { useCartItems } from 'contexts/CartContext';
import { useEthcontext } from 'contexts/EthWalletProvider';
import { useMeta } from 'contexts/meta/meta';
import MainCard from 'components/cards/MainCard';
import SwitchList from 'components/lists/SwitchList';
import { useParams } from 'react-router-dom';
import SelectedTab from './SelectedTab';
import Sell from './Sell';
import { useRequests } from 'hooks/useRequests';

export interface SelectedItemType {
    tokenAddress: string;
    metaDataImg: string;
    name: string;
    price: number;
    brokerReferralAddress: string;
    marketplaceProgramId: string;
    contractAddress: any;
    chain: string;
}

export default function Cart() {
    const { connection } = useConnections();
    const wallet = useWallet();
    const { publicKey } = wallet;
    const { ethAddress, ethConnect, ethConnected, ethBalance, sendTransaction } = useEthcontext();
    const { chain, projectId, mint } = useParams();
    const { getMETransactionInstructions, createBuyTx } = useRequests();
    const {
        cartItems,
        setCartItems,
        setOpen,
        temp,
        setTemp,
        sweepCount,
        setSweepCount,
        sweepValue,
        setSweepValue,
        multiTabIdx,
        setMultiTabIdx
    } = useCartItems();

    const { fetchBalance, startLoading, stopLoading } = useMeta();
    const { showSuccessToast, showErrorToast, showTxErrorToast } = useToasts();

    const [solBalance, setSolBalance] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [collectionPage, setCollectionPage] = useState(false);

    /** currently stop the Bid */
    const cartTabList = ['Buy', 'Sell', 'Sweep'];

    const buyNowMulti = async (tokens: SelectedItemType[]) => {
        if (tokens && tokens.length > 0) {
            const [solTokens, ethTokens] = tokens.reduce(
                (result: any, item: SelectedItemType) => {
                    result[item.chain === 'SOL' ? 0 : 1].push(item);
                    return result;
                },
                [[], []]
            );

            if (solTokens && solTokens.length > 0) {
                await buyNowMultiInSOL(solTokens);
            }
            if (ethTokens && ethTokens.length > 0) {
                await buyNowMultiInETH(ethTokens);
            }
            updateView();
        }
    };

    const buyNowMultiInSOL = async (tokens: SelectedItemType[]) => {
        if (!wallet || !wallet.publicKey) {
            return;
        }
        try {
            startLoading();

            const transactions: Transaction[] = [];
            if (tokens && tokens.length !== 0) {
                for (const item of tokens) {
                    const transaction = await getBuyNowTx(
                        item.name,
                        item.tokenAddress,
                        item.price,
                        item.brokerReferralAddress,
                        item.marketplaceProgramId
                    );
                    if (transaction) {
                        transactions.push(transaction);
                    }
                }
            }
            const { blockhash } = await connection.getLatestBlockhash('confirmed');

            transactions.forEach((transaction) => {
                transaction.feePayer = wallet.publicKey as PublicKey;
                transaction.recentBlockhash = blockhash;
            });

            if (wallet.signAllTransactions !== undefined) {
                const signedTransactions = await wallet.signAllTransactions(transactions);

                const signatures = await Promise.all(
                    signedTransactions.map((transaction) =>
                        connection.sendRawTransaction(transaction.serialize(), {
                            skipPreflight: true,
                            maxRetries: 3,
                            preflightCommitment: 'confirmed'
                        })
                    )
                );

                await Promise.all(signatures.map((signature) => connection.confirmTransaction(signature, 'finalized')));
            }
        } catch (error: any) {
            console.error(error);
            showTxErrorToast(error);
        } finally {
            stopLoading();
        }
    };

    const getBuyNowTx = async (
        name: string,
        token_address: string,
        price: number,
        broker_referral_address: string,
        marketplace_program_id: string
    ) => {
        if (!wallet || !wallet.publicKey) {
            return undefined;
        }
        let response;
        let isME = false;
        if (marketplace_program_id === 'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K') {
            response = await getMETransactionInstructions({
                buyer: wallet.publicKey.toBase58(),
                tokenMint: token_address
            });
            isME = true;
        } else {
            response = await createBuyTx({
                buyerAddress: wallet.publicKey.toBase58(),
                price,
                tokenAddress: token_address,
                buyerBroker: broker_referral_address || DEFAULT_BUYER_BROKER || process.env.SOLANA_FEE_ACCOUNT
            });
        }

        let transaction;
        if ((response && response.data) || Object.keys(response).length > 0) {
            if (isME) {
                transaction = Transaction.from(Buffer.from(response.data || response.txSigned));
            } else {
                transaction = Transaction.populate(Message.from(Buffer.from(response.data)));
            }
        }
        return transaction;
    };

    const buyNowMultiInETH = async (tokensInfo: SelectedItemType[]) => {
        if (!ethConnected || !ethAddress) {
            ethConnect();
        } else {
            try {
                startLoading();
                const tokens = tokensInfo.map((token) => `${token.contractAddress}:${token.tokenAddress}`);

                let totalPrice = 0;
                for (let i = 0; i < tokensInfo.length; i += 1) {
                    totalPrice += tokensInfo[i].price;
                }

                if (ethBalance < totalPrice) {
                    showErrorToast('You have insufficient funds to buy this token.');
                    return;
                }

                const response = await createBuyTx({
                    buyerAddress: ethAddress, // required field
                    tokens, // required field
                    chain: 'ETH', // required field
                    price: totalPrice,
                    tokenAddress: '',
                    buyerBroker: ''
                });
                if ((response && response.data) || Object.keys(response).length > 0) {
                    if (response.error) {
                        showErrorToast(response.error);
                        return;
                    }
                    const result = await sendTransaction(response?.txObj);
                    if (result.success) {
                        showSuccessToast(result.message);
                    } else {
                        showErrorToast(result.message);
                    }
                }
            } catch (error: any) {
                console.error(error);
                showTxErrorToast(error);
            } finally {
                stopLoading();
            }
        }
    };

    const onDeSelect = (tokenAddress: string, contractAddress: string) => {
        const selected = cartItems;
        if (selected && selected.length !== 0) {
            let index = -1;
            for (let i = 0; i < selected.length; i += 1) {
                if (selected[i].tokenAddress === tokenAddress && selected[i].contractAddress === contractAddress) {
                    index = i;
                }
            }
            if (index !== -1) {
                selected.splice(index, 1);
            }
        }

        // After calling setCartItems(), should call the setTemp(!temp)
        // to update the cart items immediately
        // It's because useContext, we will need to update it later in a better way
        setCartItems([...selected]);
        setTemp(!temp);
    };

    const updateView = async () => {
        if (publicKey) {
            const bal = await fetchBalance(new PublicKey(publicKey?.toBase58()), connection);
            setSolBalance(bal);
        }
    };

    const handleMultiTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setMultiTabIdx(newValue);
        if (newValue === 'sweep') {
            setCartItems([]);
        }
    };

    const handleItemsChange = (value: any) => {
        setSweepCount(value as number);
        setCartItems([]);
    };

    const handleSweepPriceChange = (value: any) => {
        setSweepValue(parseFloat(value));
        setCartItems([]);
    };

    useEffect(() => {
        updateView();
    }, [wallet, publicKey]);

    useEffect(() => {
        if (chain && projectId && !mint) {
            setCollectionPage(true);
        } else {
            setCollectionPage(false);
        }
    }, [chain, projectId, mint]);

    return (
        <MainCard
            border={false}
            content={false}
            sx={{
                backgroundColor: 'transparent',
                width: '352px',
                right: '0px',
                zIndex: '9997',
                position: 'fixed',
                top: '138px',
                height: 'calc(100vh - 150px)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%'
                }}
                className="bg-surface border border-line rounded-3xl"
            >
                <Grid container sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px 16px 16px' }}>
                    <SwitchList handleTabChange={handleMultiTabChange} matchUpMd tabIdx={multiTabIdx} tabList={cartTabList} />
                    <Avatar
                        className="button-small"
                        sx={{
                            transition: 'all .2s ease-in-out',
                            alignItems: 'center',
                            padding: '0px'
                        }}
                        color="inherit"
                        aria-haspopup="true"
                        onClick={() => setOpen(false)}
                    >
                        <IconX stroke={1.5} size="1.3rem" />
                    </Avatar>
                </Grid>
                {multiTabIdx === 'Buy' && (
                    <>
                        <Grid
                            container
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '4px',
                                paddingRight: '16px',
                                paddingBottom: '12px',
                                paddingLeft: '16px'
                            }}
                        >
                            <Grid item sx={{ alignItems: 'center', display: 'flex' }}>
                                <Typography className="text-primary text-lg font-bold">My Cart</Typography>
                                <Typography
                                    fontSize={14}
                                    fontWeight={500}
                                    sx={{
                                        borderRadius: '32px',
                                        padding: '4px 8px',
                                        marginLeft: '12px'
                                    }}
                                    className="bg-elevation1 text-secondary"
                                >
                                    {cartItems.length}/{maxCartItems}
                                </Typography>
                            </Grid>
                            <Button
                                variant="text"
                                size="small"
                                sx={{ padding: '0px', minWidth: '0', color: '#DDE7FE' }}
                                onClick={() => setCartItems([])}
                            >
                                Clear
                            </Button>
                        </Grid>
                        <SelectedTab
                            buyNowMulti={buyNowMulti}
                            selectedNfts={cartItems}
                            onDeSelect={onDeSelect}
                            type="buy"
                            solBalance={solBalance}
                            ethBalance={ethBalance}
                        />
                    </>
                )}
                {multiTabIdx === 'Sell' && <Sell />}
                {multiTabIdx === 'Sweep' && (
                    <>
                        <div
                            className="sweep-panel"
                            style={{ marginLeft: '16px', marginRight: '16px', marginBottom: '12px', display: 'flex', gap: '8px' }}
                        >
                            <div style={{ width: '50%' }}>
                                <Typography component="h4" fontSize={12} fontWeight={500}>
                                    Max price per item
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label={chain}
                                    value={sweepValue}
                                    size="small"
                                    sx={{ mt: 2 }}
                                    onChange={(e: any) => handleSweepPriceChange(e.target.value)}
                                    fullWidth
                                />
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography component="h4" fontSize={12} fontWeight={500}>
                                    Number of items
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    label="Items"
                                    value={sweepCount}
                                    type="number"
                                    size="small"
                                    onChange={(e: any) => handleItemsChange(e.target.value)}
                                    sx={{ mt: 2 }}
                                    fullWidth
                                />
                            </div>
                        </div>
                        <SelectedTab
                            buyNowMulti={buyNowMulti}
                            selectedNfts={cartItems}
                            onDeSelect={onDeSelect}
                            type="sweep"
                            solBalance={solBalance}
                            ethBalance={ethBalance}
                        />
                    </>
                )}
            </Box>
        </MainCard>
    );
}
