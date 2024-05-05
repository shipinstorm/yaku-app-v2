import { IconButton, useTheme } from '@mui/material';
import ProfileIcon from './ProfileIcon';

const ProfileAvatarIconButton = ({ ref, controls, onClick, hasPopup }: any) => {
    const theme = useTheme();
    return (
        <IconButton
            sx={{
                height: '34px',
                ml: 1.5,
                p: 0,
                alignItems: 'center',
                borderRadius: 30000,
                transition: 'all .2s ease-in-out'
            }}
            ref={ref}
            aria-controls={controls}
            aria-haspopup={hasPopup}
            onClick={onClick}
        >
            <ProfileIcon
                sx={{
                    ...theme.typography.mediumAvatar,
                    margin: '0 !important',
                    cursor: 'pointer',
                    backgroundColor: 'transparent'
                }}
                ref={ref}
                controls={controls}
                hasPopup={hasPopup}
            />
        </IconButton>
    );
};

export default ProfileAvatarIconButton;
