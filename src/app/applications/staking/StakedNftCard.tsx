import { Box, CardContent, CardMedia, Chip, Grid, Button, Typography, Divider } from '@mui/material';
import { Image } from 'mui-image';
import dayjs from 'dayjs';

// web3
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// project imports
import MainCard from '@/components/MainCard';
import { StakedNftCardProps } from '@/types/staking';
import { roleRewards } from '@/utils/utils';
import { claimReward, withdrawNft } from '@/actions/stake';
import { useToasts } from '@/hooks/useToasts';

// third-party
import { FormattedMessage } from 'react-intl';
import { IMAGE_PROXY } from '@/config/config';
import Loading from '@/components/loaders/Loading';
import useConnections from '@/hooks/useConnetions';

const StakeNftCard = ({ mint, name, image, role, lockTime, stakedTime, startLoading, stopLoading, updatePage }: StakedNftCardProps) => {
    const reward = roleRewards.find((rRole) => rRole.roles.includes(role));
    const rewardString = `${reward?.dailyReward} $COSMIC / DAY`;
    const { connection } = useConnections();
    const wallet = useWallet();
    const { showInfoToast } = useToasts();

    const onUnstake = async () => {
        try {
            startLoading();
            await withdrawNft(connection, wallet, new PublicKey(mint));
            showInfoToast('You have successfully unstaked your NFT.');
        } catch (error) {
            console.error(error);
        } finally {
            updatePage();
            stopLoading();
        }
    };

    // Claiming
    const tryClaimRewards = async () => {
        try {
            startLoading();
            await claimReward(connection, wallet, new PublicKey(mint));
            showInfoToast('You have successfully claimed your NFTs reward.');
        } catch (error) {
            console.error(error);
        } finally {
            updatePage();
            stopLoading();
        }
    };

    const onClaim = async () => {
        if (wallet?.publicKey === null) return;

        try {
            await tryClaimRewards();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <MainCard
                content={false}
                boxShadow
                useBackdropFilter={false}
                sx={{
                    background: '#09080d',
                    '&:hover': {
                        transform: 'scale3d(1.03, 1.03, 1)',
                        transition: '.15s'
                    }
                }}
            >
                <CardMedia sx={{ minHeight: 200, display: 'flex', alignItems: 'center' }}>
                    <Image src={`${IMAGE_PROXY}${image}`} alt={name} showLoading={<Loading />} style={{ aspectRatio: '1 / 1' }} />
                </CardMedia>
                <CardContent sx={{ p: 2, pb: '16px !important' }}>
                    {/* name */}
                    <Box display="flex" alignItems="center">
                        <Typography
                            fontWeight="800"
                            color="secondary"
                            sx={{ fontSize: '1.175rem', display: 'block', textDecoration: 'none', mr: 'auto' }}
                        >
                            {name}
                        </Typography>
                    </Box>

                    {/* Role/Token Amount */}
                    <Grid item xs={12} sx={{ mb: '10px', mt: '5px' }}>
                        <Chip label={role} size="small" color="secondary" sx={{ mr: '5px' }} />
                        <Chip label={rewardString} size="small" />
                    </Grid>

                    <Divider sx={{ mb: '10px' }} />

                    {/* Staking Stats */}
                    <Grid item xs={12} sx={{ mb: '15px' }}>
                        <Typography variant="h5" fontWeight="500">
                            Staked Duration:
                            <Typography component="span" variant="h4" fontWeight="700" sx={{ ml: '5px' }}>
                                {/* {dayjs(stakedTime * 1000).diff(Date.now(), 'hours')} hours */}
                                {dayjs(Date.now()).diff(stakedTime * 1000, 'hours')} hours
                            </Typography>
                        </Typography>
                        {/* <Typography variant="h5" fontWeight="500">
                            Current Rewards:
                            <Typography component="span" variant="h4" fontWeight="700" sx={{ ml: '5px' }}>
                                test
                            </Typography>
                        </Typography> */}
                    </Grid>

                    {/* Management Buttons */}
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Button onClick={() => onClaim()} variant="contained" fullWidth>
                                    <FormattedMessage id="claim" />
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button onClick={() => onUnstake()} variant="outlined" color="error" fullWidth>
                                    <FormattedMessage id="unstake" />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Staking End Time */}
                    <Grid item xs={12} sx={{ mt: '8px', mb: '0px !important', textAlign: 'center' }}>
                        <Typography variant="caption">
                            Staking Penalty Ends:
                            <Typography component="span" variant="caption" fontWeight="700" sx={{ ml: '5px' }}>
                                {dayjs(lockTime * 1000).format('MMMM DD, yyyy')}
                            </Typography>
                        </Typography>
                    </Grid>
                </CardContent>
            </MainCard>
        </>
    );
};

export default StakeNftCard;
