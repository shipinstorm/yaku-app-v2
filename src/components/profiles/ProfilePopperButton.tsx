import { Avatar, Stack, Typography, useTheme } from '@mui/material';

const ProfilePopperButton = ({ onClick, icon, label }: any) => {
    const theme = useTheme();
    return (
        <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="flex-start"
            onClick={onClick}
            sx={{
                p: 0.5,
                mb: 1,
                borderRadius: '4px',
                '&:hover': {
                    cursor: 'pointer',
                    transition: 'all .1s ease-in-out',
                    background: theme.palette.primary.dark
                }
            }}
        >
            <Avatar
                sx={{
                    ...theme.typography.mediumAvatar,
                    cursor: 'pointer'
                }}
                color="inherit"
            >
                {icon}
            </Avatar>
            <Stack direction="column" alignItems="flex-start" justifyContent="flex-start">
                <Typography variant="body1" fontWeight="800" sx={{ ml: 1 }}>
                    {label}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default ProfilePopperButton;
