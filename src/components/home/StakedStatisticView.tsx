import { Box, Chip, Grid, Typography, useTheme } from '@mui/material';
import MainCard from 'components/MainCard';
import useStaked from 'hooks/useStaked';
import { round, sumBy } from 'lodash';
import { useNavigate } from 'react-router-dom';
import StakedPieChart from './StakedPieChart';

const StakedStatisticView = ({ project_stats = [] }: any) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { totalStaked, valueLocked, tokenDistributed } = useStaked();
    return (
        <MainCard
            border={false}
            className="card shadow-none h-[490px] clickable relative flex flex-col justify-center items-center"
            content={false}
            sx={{
                color: theme.palette.primary.light
            }}
            onClick={() => navigate('/applications/staking')}
        >
            <StakedPieChart totalStaked={totalStaked} total={sumBy(project_stats, 'project.supply')} />

            <Grid container columnSpacing={1} rowSpacing={1} sx={{ my: 1, p: 2 }} justifyContent="space-between" alignItems="center">
                <Grid item xs={12} display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                    <Typography className="text-secondary text-lg" sx={{ mb: 1 }}>
                        Statistics
                    </Typography>
                </Grid>
                <Grid item xs={12} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography component="p" fontSize={14} className="text-terciary" fontWeight="bold">
                        Total Staked:
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Chip
                            sx={{ ml: 1, fontSize: 14 }}
                            size="small"
                            label={`${(totalStaked || 0).toLocaleString()}`}
                            className="bg-elevation1"
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography component="p" fontSize={14} fontWeight="bold" className="text-terciary">
                        Minimum value locked:
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Chip
                            sx={{ ml: 1, fontWeight: 'bold', fontSize: 14 }}
                            size="small"
                            label={`$${round(valueLocked || 0, 2).toLocaleString()}`}
                            className="bg-elevation1"
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography component="p" fontSize={14} fontWeight="bold" className="text-terciary">
                        Distributed in total:
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Chip
                            sx={{ ml: 1, fontWeight: 'bold', fontSize: 14 }}
                            size="small"
                            label={`${round(tokenDistributed || 0, 2).toLocaleString()} YAKU`}
                            className="bg-elevation1"
                        />
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default StakedStatisticView;
