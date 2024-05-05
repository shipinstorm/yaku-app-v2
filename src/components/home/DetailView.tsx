import { Box, Chip, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import { find, round } from 'lodash';

const DetailView = ({ projectStats = [], projectId, solPrice, loading }: any) => {
    const theme = useTheme();
    if (loading) {
        return (
            <Grid container spacing={2} sx={{ my: 1 }}>
                <Grid item xs={6}>
                    <Skeleton variant="rounded" width="100%" height={16} />
                </Grid>
                <Grid item xs={6}>
                    <Skeleton variant="rounded" width="100%" height={16} />
                </Grid>
                {/* <Grid item xs={6}>
                    <Skeleton variant="rounded" width="100%" height={16} />
                </Grid>
                <Grid item xs={6}>
                    <Skeleton variant="rounded" width="100%" height={16} />
                </Grid>
                <Grid item xs={6}>
                    <Skeleton variant="rounded" width="100%" height={16} />
                </Grid>
                <Grid item xs={6}>
                    <Skeleton variant="rounded" width="100%" height={16} />
                </Grid> */}
            </Grid>
        );
    }
    const {
        volume_1day = 0,
        volume_1day_change = 0,
        floor_price = 0,
        floor_price_1day_change = 0,
        average_price = 0,
        average_price_1day_change = 0,
        num_of_token_listed = 0,
        project: { supply }
    } = find(projectStats || [], ({ project_id }: any) => project_id === projectId) || { project: { supply: 0 } };

    return (
        <>
            {/* <Grid container columnSpacing={1} rowSpacing={1} sx={{ my: 1 }} justifyContent="space-between" alignItems="center">
                <Grid item xs={7} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" sx={{ width: '100%' }}>
                        <Typography
                            component="p"
                            fontSize={14}
                            fontWeight="bold"
                            style={{ color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[900] }}
                            noWrap
                        >
                            24h Vol: {round(Number(volume_1day / solPrice), 2).toLocaleString()} ◎
                        </Typography>
                        <Typography
                            component="p"
                            fontSize={14}
                            fontWeight="bold"
                            sx={{ color: volume_1day_change > 0 ? 'success.dark' : 'error.dark' }}
                            noWrap
                        >
                            {volume_1day_change > 0 ? '+' : ''}
                            {round(Number(volume_1day_change * 100), 2).toLocaleString()}%
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={5} display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-end" sx={{ width: '100%' }}>
                        <Typography
                            component="p"
                            fontSize={14}
                            fontWeight="bold"
                            sx={{ textAlign: 'end' }}
                            style={{ color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[900] }}
                        >
                            Listed
                            <br />
                            {num_of_token_listed} / {supply}
                        </Typography>
                    </Box>
                </Grid>
                {/* <Grid item xs={12} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography
                        component="p"
                        fontSize={14}
                        fontWeight="bold"
                        style={{ color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[900] }}
                    >
                        Floor Price (FP):
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Chip
                            sx={{ ml: 1, fontWeight: 'bold', fontSize: 14 }}
                            size="small"
                            label={`${Number(floor_price).toLocaleString()} ◎`}
                        />
                        <Chip
                            sx={{ ml: 1, fontWeight: 'bold', fontSize: 14 }}
                            size="small"
                            color={floor_price_1day_change > 0 ? 'success' : 'error'}
                            label={`${floor_price_1day_change > 0 ? '+' : ''}${round(
                                Number(floor_price_1day_change * 100),
                                2
                            ).toLocaleString()}%`}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography
                        component="p"
                        fontSize={14}
                        fontWeight="bold"
                        style={{ color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[900] }}
                    >
                        Avg Floor Price:
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Chip
                            sx={{ ml: 1, fontWeight: 'bold', fontSize: 14 }}
                            size="small"
                            label={`${Number(average_price).toLocaleString()} ◎`}
                        />
                        <Chip
                            sx={{ ml: 1, fontWeight: 'bold', fontSize: 14 }}
                            size="small"
                            color={average_price_1day_change > 0 ? 'success' : 'error'}
                            label={`${average_price_1day_change > 0 ? '+' : ''}${round(
                                Number(average_price_1day_change * 100),
                                2
                            ).toLocaleString()}%`}
                        />
                    </Box>
                </Grid>
            </Grid> */}
            <Grid container columnSpacing={1} rowSpacing={1} sx={{ my: 1 }} justifyContent="space-between" alignItems="center">
                <Grid item xs={12} className="!p-0" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Typography component="p" className="text-terciary font-bold text-[14px]">
                        Listed
                    </Typography>
                    <p className="text-lg font-bold">
                        {num_of_token_listed} / {supply}
                    </p>
                </Grid>
            </Grid>
        </>
    );
};

export default DetailView;
