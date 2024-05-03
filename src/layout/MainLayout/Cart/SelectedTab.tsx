import { Button, Divider, IconButton, Typography, Box, Grid, Select, MenuItem } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { round } from 'lodash';
import { IMAGE_PROXY } from 'config/config';
import { SelectedItemType } from './index';
import { useRequest } from 'ahooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useMemo, useState } from 'react';
import { WalletType } from 'types/config';
import { useRequests } from 'hooks/useRequests';
import { buyNowME, getMultisig } from 'utils/ms';
import { Message, PublicKey, Transaction } from '@solana/web3.js';
import { getAuthorityPDA, getTxPDAFromString } from 'utils/msInstructions';
import { BN } from '@project-serum/anchor';
import removeMESigner from 'utils/magiceden';
import { shortenAddress } from 'utils/utils';
import useMsTx from 'hooks/useMsTx';
import { useToasts } from 'hooks/useToasts';
import useConnections from 'hooks/useConnetions';
import { MS_REFRESH_TIMEOUT } from 'types/ms';
import LoadingSpinner from 'components/loaders/LoadingSpinner';
import SolanaIcon from 'components/icons/SolanaIcon';
import EthereumIcon from 'components/icons/EthereumIcon';

const SelectedTab = (props: {
    selectedNfts: SelectedItemType[];
    buyNowMulti: Function;
    onDeSelect: Function;
    // eslint-disable-next-line react/no-unused-prop-types
    type: string;
    solBalance: number;
    ethBalance: number;
}) => {
    const wallet = useWallet();
    const { connection } = useConnections();
    const { selectedNfts, buyNowMulti, onDeSelect, solBalance, ethBalance } = props;

    let totalSolPrice = 0;
    let totalEthPrice = 0;
    selectedNfts.forEach((item) => {
        if (item.chain === 'SOL') {
            totalSolPrice += item.price;
        } else {
            totalEthPrice += item.price;
        }
    });

    // workspace integration
    const solTokens = useMemo(
        () =>
            selectedNfts.reduce((result: SelectedItemType[], item: SelectedItemType) => {
                if (item.chain === 'SOL') {
                    result.push(item);
                }
                return result;
            }, [] as SelectedItemType[]),
        [selectedNfts]
    );
    const { getAllWorkspacesByUser } = useRequests();
    const { loading: wsLoading, data: workspaces } = useRequest(() => getAllWorkspacesByUser({ user: wallet?.publicKey?.toBase58()! }), {
        ready: !!wallet.publicKey,
        refreshDeps: [wallet.publicKey?.toBase58()],
        retryCount: 5
    });

    const msWorkspaces: any[] = useMemo(() => workspaces?.filter((workspace: any) => !!workspace.multisig) ?? [], [workspaces]);
    const walletTypes = useMemo(() => {
        const types = [WalletType.PERSONAL];
        if (!!workspaces && msWorkspaces.length > 0) {
            types.push(WalletType.MULTISIG);
        }
        return types;
    }, [msWorkspaces.length, workspaces]);

    const [walletType, setWalletType] = useState<WalletType>(WalletType.PERSONAL);
    const [workspaceId, setWorkspaceId] = useState<string>('');
    const workspaceOwner: string = useMemo(() => {
        if (msWorkspaces.length > 0 && workspaceId !== '') {
            /* eslint-disable-next-line no-underscore-dangle */
            const msWsIndex = msWorkspaces.findIndex((msWs) => msWs._id === workspaceId);
            if (msWsIndex > -1) {
                return msWorkspaces[msWsIndex].owner as string;
            }
        }
        return '';
    }, [msWorkspaces, workspaceId]);
    const [multisig, setMultisig] = useState<string>('');
    const {
        data: msData,
        loading: msLoading,
        refresh: refreshMs
    } = useRequest(() => getMultisig(connection, multisig), {
        ready: multisig !== '',
        refreshDeps: [multisig]
    });
    const { createMsTx } = useMsTx();
    const { showSuccessToast, showErrorToast } = useToasts();
    const { getMETransactionInstructions } = useRequests();
    const [buyNowLoading, setBuyNowLoading] = useState<boolean>(false);

    useEffect(() => {
        if (msWorkspaces.length > 0 && workspaceId !== '') {
            /* eslint-disable-next-line no-underscore-dangle */
            const msWsIndex = msWorkspaces.findIndex((msWs) => msWs._id === workspaceId);
            if (msWsIndex > -1) {
                setMultisig(msWorkspaces[msWsIndex].multisig);
            }
        }
    }, [msWorkspaces, workspaceId]);

    const buyNowHandler = async () => {
        if (wsLoading) {
            showErrorToast('Please try again a little bit later');
            return;
        }
        setBuyNowLoading(true);
        if (solTokens.length > 0 && walletType === WalletType.MULTISIG) {
            // Execute multisig transaction for each SOL token
            for (const solNFT of solTokens) {
                try {
                    // eslint-disable-next-line no-await-in-loop
                    if (await handleBuyNFT(solNFT.tokenAddress)) {
                        showSuccessToast(`Successfully created a multisig transaction to buy '${solNFT.name}`);
                        msData!.transactionIndex += 1;
                        onDeSelect(solNFT.tokenAddress, solNFT.contractAddress);
                    } else {
                        showErrorToast(`Failed to create a multisig transaction to buy '${solNFT.name}`);
                    }
                } catch (e) {
                    console.error(e);
                    showErrorToast(`Failed to create a transaction to buy '${solNFT.name}'`);
                }
            }

            setTimeout(() => {
                refreshMs();
            }, MS_REFRESH_TIMEOUT);

            // buy ethereum NFTs
            await buyNowMulti(selectedNfts.filter((item) => item.chain !== 'SOL'));
        } else {
            await buyNowMulti(selectedNfts);
        }
        setBuyNowLoading(false);
    };

    // buy NFT From MagicEden
    const handleBuyNFT = async (mint: string): Promise<boolean> => {
        if (!msLoading && !!msData && workspaceOwner !== '' && workspaceId !== '') {
            const msPDA = new PublicKey(multisig);
            const [vaultPDA] = getAuthorityPDA(msPDA!, new BN(1));
            const pubkey = getTxPDAFromString(multisig, msData.transactionIndex + 1);
            const result = await createMsTx(
                {
                    msPDA: multisig,
                    creator: wallet.publicKey!.toBase58(),
                    owner: workspaceOwner,
                    workspace: workspaceId,
                    type: 'Buy From ME',
                    description: `NFT: ${shortenAddress(mint)}`,
                    pubkey
                },
                async (): Promise<boolean> => {
                    const { tx } = await getMETransactionInstructions({
                        buyer: vaultPDA.toBase58(),
                        tokenMint: mint
                    });
                    const transaction = Transaction.populate(Message.from(tx.data));
                    return buyNowME({
                        connection,
                        wallet,
                        msPDA,
                        txIndex: msData?.transactionIndex + 1,
                        buyIxs: removeMESigner(transaction.instructions)
                    });
                }
            );
            return result;
        }
        return false;
    };

    return (
        <>
            <Divider />
            <div
                style={{
                    height: '100vh',
                    overflow: 'auto',
                    padding: '8px 16px'
                }}
            >
                {selectedNfts.length !== 0 &&
                    selectedNfts.map((item: any, key: any) => (
                        <div className="selected-nft" key={key}>
                            <div className="nft-name">
                                <img src={`${item.chain === 'SOL' ? IMAGE_PROXY : ''}${item.metaDataImg}`} alt={item.name} />
                                <Typography component="h5" fontWeight={500} fontSize={14}>
                                    {`${item.name.split('#')[0].length > 8 ? `${item.name.slice(0, 7)}...` : item.name.split('#')[0]}#${
                                        item.name.split('#')[1]
                                    }`}
                                </Typography>
                            </div>
                            <div className="nft-price">
                                {item.chain === 'SOL' ? <SolanaIcon /> : <EthereumIcon />}
                                <Typography component="h4" fontSize={12} fontWeight={700} sx={{ marginLeft: '2px' }}>
                                    {round(item.price, 2).toLocaleString()}
                                </Typography>

                                <IconButton
                                    onClick={() => onDeSelect(item.tokenAddress, item.contractAddress)}
                                    style={{
                                        position: 'absolute',
                                        left: 22,
                                        top: -6
                                    }}
                                    size="small"
                                >
                                    <Cancel style={{ fontSize: 16 }} />
                                </IconButton>
                            </div>
                        </div>
                    ))}
            </div>
            <Divider />
            <Grid container className="selected-group-control">
                {solTokens.length > 0 && (
                    <Box className="w-full mb-3">
                        <div className="w-full">
                            <Typography component="h3" fontSize={20} fontWeight={600}>
                                Type
                            </Typography>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={walletType}
                                onChange={(e: any) => {
                                    setWalletType(e.target.value as WalletType);
                                    if ((e.target.value as WalletType) === WalletType.MULTISIG) {
                                        /* eslint-disable-next-line no-underscore-dangle */
                                        setWorkspaceId(msWorkspaces.length > 0 ? msWorkspaces[0]._id : '');
                                    }
                                }}
                                label="Age"
                                className="text-white rounded-xl w-full asset-select border-0 mt-[8px]"
                            >
                                {walletTypes!.map((category, index) => (
                                    <MenuItem key={`wallet-category-item-${index}`} value={category as string} className="flex">
                                        {category as string}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        {walletType.toLowerCase() === 'multisig' && (
                            <div className="squad-input mt-4">
                                <Typography component="h3" fontSize={20} fontWeight={600}>
                                    Workspace
                                </Typography>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={workspaceId}
                                    onChange={(e: any) => setWorkspaceId(e.target.value)}
                                    label="Age"
                                    className="text-white rounded-xl w-full asset-select border-0 mt-[8px]"
                                >
                                    {workspaces!.map((workspace: any, index: number) => (
                                        /* eslint-disable-next-line no-underscore-dangle */
                                        <MenuItem key={`workspace-item-${index}`} value={workspace._id} className="flex">
                                            {workspace.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </Box>
                )}
                <Box className="total-values">
                    <Typography component="h1" fontSize={20} fontWeight={600}>
                        Your total
                    </Typography>
                    {totalSolPrice === 0 && totalEthPrice === 0 && <span>-</span>}
                    {totalSolPrice > 0 && (
                        <span>
                            <SolanaIcon />
                            <Typography component="h4" fontSize={12} fontWeight={700} sx={{ marginLeft: '2px' }}>
                                {round(totalSolPrice, 2).toLocaleString()}
                            </Typography>
                        </span>
                    )}
                    {totalEthPrice > 0 && (
                        <span>
                            <EthereumIcon />
                            <Typography component="h4" fontSize={12} fontWeight={700} sx={{ marginLeft: '2px' }}>
                                {round(totalEthPrice, 2).toLocaleString()}
                            </Typography>
                        </span>
                    )}
                </Box>
                <Button
                    variant="contained"
                    onClick={buyNowHandler}
                    sx={{ width: '100%', gap: 1, mt: 1, borderRadius: '50px' }}
                    className="button-main-pink !text-semibold"
                    disabled={selectedNfts.length === 0}
                >
                    <Typography variant="body1" noWrap fontSize="16px">
                        {buyNowLoading ? <LoadingSpinner /> : 'Buy now'}
                    </Typography>
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1.5, gap: '8px', width: '100%' }}>
                    <Typography component="h2" fontSize={16} fontWeight={400} className="text-secondary">
                        Available Balance:
                    </Typography>
                    <div>
                        {solBalance > 0 && (
                            <Typography component="h2" fontSize={16} fontWeight={700} sx={{ color: '#F5F8FF' }}>
                                {round(solBalance, 3).toLocaleString()} SOL
                            </Typography>
                        )}
                        {ethBalance > 0 && (
                            <Typography component="h2" fontSize={16} fontWeight={700} sx={{ color: '#F5F8FF' }}>
                                {round(ethBalance, 3).toLocaleString()} ETH
                            </Typography>
                        )}
                    </div>
                </Box>
            </Grid>
        </>
    );
};

export default SelectedTab;
