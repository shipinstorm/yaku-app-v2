/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Chip, ClickAwayListener, Divider, Grid, Paper, Popper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

import Transitions from '@/components/Transitions';
import MainCard from '@/components/MainCard';
import useNotifications from '@/hooks/useNotifications';
import { useToasts } from '@/hooks/useToasts';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import NotificationList from './NotificationList';
import useAuth from '@/hooks/useAuth';
import { NotificationStatus } from '@/types/notifications';

const NotificationPopper = ({ open, anchorRef, handleClose }: any) => {
    const auth = useAuth();
    const theme = useTheme();
    const { notifications, reloadNotifications, updateAllStatus } = useNotifications();
    // notification status options
    const status = [
        {
            value: NotificationStatus.ALL,
            label: 'All'
        },
        {
            value: NotificationStatus.UNREAD,
            label: 'Unread'
        },
        {
            value: NotificationStatus.READ,
            label: 'Read'
        }
    ];
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const { showSuccessToast } = useToasts();
    const [value, setValue] = useState<typeof NotificationStatus | string>(NotificationStatus.UNREAD);

    const handleChange = (event: any) => {
        event?.target.value && setValue(event?.target.value);
    };
    const handleMarkAllRead = async () => {
        await updateAllStatus({ variables: { status: NotificationStatus.READ } });
        showSuccessToast(`Marked all notifications as read.`);
        await reloadNotifications();
    };

    useEffect(() => {
        if (auth.token) {
            reloadNotifications();
        }
    }, [auth.token, value]);
    return (
        <Popper
            placement={matchesXs ? 'bottom' : 'bottom-end'}
            open={open}
            anchorEl={anchorRef?.current}
            role={undefined}
            transition
            disablePortal
            sx={{
                zIndex: 9998,
                maxWidth: 330,
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                }
            }}
            popperOptions={{
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [matchesXs ? 5 : 0, 20]
                        }
                    }
                ]
            }}
        >
            {({ TransitionProps }) => (
                <ClickAwayListener onClickAway={handleClose}>
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper className="bg-transparent !rounded-3xl">
                            {open && (
                                <MainCard
                                    border={false}
                                    className="!bg-elevation1 !rounded-3xl"
                                    elevation={16}
                                    content={false}
                                    boxShadow
                                    shadow={theme.shadows[16]}
                                >
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                alignItems="center"
                                                justifyContent="space-between"
                                                spacing={0.5}
                                                sx={{ pt: 2, px: 2 }}
                                            >
                                                <Grid item>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="subtitle1" sx={{ mr: 2 }}>
                                                            {status.find((k: any) => k.value === value)?.label} Notifications
                                                        </Typography>

                                                        <Chip
                                                            size="small"
                                                            label={
                                                                value === NotificationStatus.ALL
                                                                    ? notifications.length
                                                                    : filter(notifications, (k: any) => k.status === value).length
                                                            }
                                                            sx={{
                                                                color: theme.palette.background.default,
                                                                bgcolor: '#f38aff'
                                                            }}
                                                        />
                                                    </Stack>
                                                </Grid>
                                                <Grid item>
                                                    <Typography
                                                        component={Link}
                                                        to="#"
                                                        variant="subtitle2"
                                                        color="primary"
                                                        onClick={handleMarkAllRead}
                                                    >
                                                        Mark all as read
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container direction="column" spacing={2}>
                                                <Grid item xs={12}>
                                                    <Box sx={{ px: 2, pt: 0.25 }}>
                                                        <select
                                                            id="outlined-select-currency-native"
                                                            value={value as string}
                                                            onChange={handleChange}
                                                            className="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:pink-main focus:border-pink-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-pink-main dark:focus:border-pink-main"
                                                        >
                                                            {status.map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <NotificationList
                                                        notifications={
                                                            value === NotificationStatus.ALL
                                                                ? notifications
                                                                : filter(notifications, (k: any) => k.status === value)
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                </MainCard>
                            )}
                        </Paper>
                    </Transitions>
                </ClickAwayListener>
            )}
        </Popper>
    );
};

export default NotificationPopper;
