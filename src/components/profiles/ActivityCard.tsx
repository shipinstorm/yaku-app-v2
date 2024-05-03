/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-nested-ternary */
import { find, isPlainObject } from 'lodash';
import dayjs from 'dayjs';
import { IMAGE_PROXY } from 'config/config';
import YakuIcon from 'components/icons/YakuIcon';
import TxStatusLabel from 'utils/enum';
import { shortenAddress } from 'utils/utils';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tooltip } from '@mui/material';
import SolscanLogo from 'assets/images/icons/solscan.png';
import EtherScanLogo from 'assets/images/icons/etherscan-logo-circle.svg';
import { useNavigate } from 'react-router-dom';
import { useRequests } from 'hooks/useRequests';
import { useToasts } from 'hooks/useToasts';
import Big from 'big.js';

dayjs.extend(relativeTime);

const ActivityCard = (props: any) => {
    const { idx, name, img, type, price, time, buyer, seller, mint, wallet, signature, socialWallets, chain = 'SOL' } = props;
    const buyerSocialWallet = buyer && find(socialWallets, (social) => social.wallet === buyer);
    const sellerSocialWallet = seller && find(socialWallets, (social) => social.wallet === seller);
    const { showLoadingToast, dismissToast } = useToasts();

    const getTxTypeLabel = (txType: string) => {
        if ((txType === 'buyNow' || txType === 'TRANSACTION' || txType === 'sale') && buyer === wallet) {
            return { label: 'Bought from', value: 'seller' };
        }
        if ((txType === 'buyNow' || txType === 'TRANSACTION' || txType === 'sale') && buyer !== wallet) {
            return { label: 'Bought by', value: 'buyer' };
        }
        return {
            label: TxStatusLabel[txType] ? `${TxStatusLabel[txType]} by ` : txType,
            value: TxStatusLabel[txType]
                ? ['BID', 'bid_cancel', 'CANCELBID', 'ask_cancel', 'bid', 'ask', 'cancelBid', 'mint'].includes(txType)
                    ? 'buyer'
                    : 'seller'
                : ''
        };
    };

    const navigate = useNavigate();
    const { getToken } = useRequests();
    const gotoCollectionPage = async () => {
        if (mint) {
            showLoadingToast('Redirecting to NFT Collection Page...');
            const token = await getToken({ mint });
            const { collection } = token;
            navigate(`/explore/collection/SOL/${isPlainObject(collection) ? collection.name : collection}`);
            dismissToast();
        }
    };

    const gotoProfile = async (addr: string) => {
        navigate(`/account/${addr}`);
    };
    return (
        <div key={idx} className="activity-item bg-elevation2 mt-4 rounded-2xl shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    <YakuIcon icon={img ? `${IMAGE_PROXY}${img}` : undefined} />
                    <div>
                        <h3
                            className={`text-primary mb-1 text-sm font-bold ${mint ? 'clickable' : ''}`}
                            onClick={() => gotoCollectionPage()}
                        >
                            {name || ''}
                        </h3>
                        <div className="flex gap-1 items-center">
                            <p className="text-terciary text-sm font-medium whitespace-nowrap">{getTxTypeLabel(type).label}</p>
                            <>
                                {getTxTypeLabel(type).value === 'buyer' &&
                                    buyerSocialWallet?.twitterHandler &&
                                    buyerSocialWallet.avatar && (
                                        <img
                                            className="rounded-3xl w-6 h-6 object-cover"
                                            src={buyerSocialWallet.avatar}
                                            alt={buyerSocialWallet.twitterHandler}
                                        />
                                    )}
                                {getTxTypeLabel(type).value === 'seller' &&
                                    sellerSocialWallet?.twitterHandler &&
                                    sellerSocialWallet.avatar && (
                                        <img
                                            className="rounded-3xl w-6 h-6 object-cover"
                                            src={sellerSocialWallet.avatar}
                                            alt={sellerSocialWallet.twitterHandler}
                                        />
                                    )}
                                {getTxTypeLabel(type).value === 'buyer' && (
                                    <p
                                        className="text-terciary text-sm font-medium whitespace-nowrap clickable"
                                        onClick={() => gotoProfile(buyer)}
                                    >
                                        {buyerSocialWallet?.twitterHandler ? buyerSocialWallet.twitterHandler : shortenAddress(buyer)}
                                    </p>
                                )}
                                {getTxTypeLabel(type).value === 'seller' && (
                                    <p
                                        className="text-terciary text-sm font-medium whitespace-nowrap clickable"
                                        onClick={() => gotoProfile(seller)}
                                    >
                                        {sellerSocialWallet?.twitterHandler ? sellerSocialWallet.twitterHandler : shortenAddress(seller)}
                                    </p>
                                )}
                            </>
                        </div>
                    </div>
                </div>
                {signature && (
                    <Tooltip
                        title={chain === 'SOL' ? 'View on Solscan' : 'View on Etherscan'}
                        placement="top"
                        onClick={() =>
                            window.open(
                                chain === 'SOL' ? `https://solscan.io/tx/${signature}` : `https://etherscan.io/tx/${signature}`,
                                '_blank'
                            )
                        }
                        sx={{ cursor: 'pointer' }}
                        arrow
                    >
                        <img
                            src={chain === 'SOL' ? SolscanLogo : EtherScanLogo}
                            alt=""
                            width={16}
                            height={16}
                            style={{ cursor: 'pointer', objectFit: 'contain', backgroundColor: '#fff', borderRadius: '50%' }}
                        />
                    </Tooltip>
                )}
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 rounded-xl shadow-none">
                <h4 className="font-bold">{Number(price) > 0 ? `${Big(price).round(3).toLocaleString()} ◎` : ''}</h4>
                <p className="text-terciary">
                    <span>{dayjs.unix(time).fromNow() || ''}</span>
                </p>
            </div>
        </div>
    );
};

export default ActivityCard;
