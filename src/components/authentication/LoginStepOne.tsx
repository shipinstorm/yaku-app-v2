import { Chip, Grid, Stack, Switch, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { shortenAddress } from '@/utils/utils';
import WalletButton from './WalletButton';

const LoginStepOne = ({ isLedger, setIsLedger, handleBack, handleSignTransaction, handleSignMessage }: any) => {
    const theme = useTheme();
    const wallet = useWallet();
    const { publicKey } = wallet;
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Grid item xs={12}>
                <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                    <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={3}>
                            <Typography variant="caption" fontSize="16px" textAlign="center">
                                You are required to prove ownership of this wallet by signing this message.
                            </Typography>

                            <Chip label={publicKey && shortenAddress(publicKey.toBase58(), 5)} size="medium" variant="filled" />

                            <Typography variant="caption" fontSize="16px" textAlign="center">
                                Using Ledger?
                            </Typography>
                            <Switch
                                sx={{ mt: '0px !important' }}
                                color="secondary"
                                checked={isLedger}
                                onChange={(e) => setIsLedger(e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
                <Stack direction="column" justifyContent="center">
                    <WalletButton variant="contained" color="secondary" onClick={isLedger ? handleSignTransaction : handleSignMessage}>
                        {!isLedger ? 'Sign Message' : 'Sign Transaction'}
                    </WalletButton>

                    <WalletButton variant="outlined" color="primary" onClick={() => handleBack(1)} sx={{ mt: 2 }}>
                        Go Back
                    </WalletButton>
                </Stack>
            </Grid>
        </>
    );
};
export default LoginStepOne;
