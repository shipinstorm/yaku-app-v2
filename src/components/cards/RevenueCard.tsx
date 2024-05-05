// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Grid, Typography, useMediaQuery } from '@mui/material';

// types
import { GenericCardProps } from '@/types';

// =============================|| REVENUE CARD ||============================= //

interface RevenueCardProps extends GenericCardProps {
    primary: any;
    secondary: string;
    content: any;
    iconPrimary: any;
    iconSx?: any;
    color: any;
}

const RevenueCard = ({ primary, secondary, content, iconPrimary, iconSx, color }: RevenueCardProps) => {
    const theme = useTheme();
    const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

    const IconPrimary = iconPrimary!;
    const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;
    let iconContentSx = iconSx;
    if (!iconContentSx) {
        iconContentSx = {
            '&> svg': { width: 100, height: 100, opacity: '0.5' },
            [theme.breakpoints.down('sm')]: {
                top: 13,
                '&> svg': { width: 80, height: 80 }
            }
        };
    }
    return (
        <Card sx={{ background: color, position: 'relative', color: '#fff' }}>
            <CardContent>
                <Typography
                    variant="body2"
                    sx={{
                        position: 'absolute',
                        right: 13,
                        top: 14,
                        color: '#fff',
                        ...iconContentSx
                    }}
                >
                    {primaryIcon}
                </Typography>
                <Grid container direction={matchDownXs ? 'column' : 'row'} spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h5" color="inherit">
                            {primary}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3" color="inherit">
                            {secondary}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="inherit">
                            {content}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default RevenueCard;
