import { Avatar, useTheme } from '@mui/material';
import { DEFAULT_IMAGE_URL, IMAGE_PROXY } from '@/config/config';
import useAuth from '@/hooks/useAuth';

const ProfileIcon = ({
    ref,
    hasPopup,
    controls,
    sx = {
        cursor: 'pointer',
        backgroundColor: 'transparent'
    }
}: any) => {
    const discordImagePath = 'https://cdn.discordapp.com/avatars';
    const theme = useTheme();
    const auth = useAuth();
    const getAvatar = (proxy = IMAGE_PROXY) => {
        if (auth.user?.avatar) {
            return `${proxy}${auth.user?.avatar}`;
        }
        if (auth.user?.discord?.avatar) {
            return `${proxy}${discordImagePath}/${auth.user?.discord?.id}/${auth.user?.discord?.avatar}.png`;
        }
        return `${proxy}${DEFAULT_IMAGE_URL}`;
    };
    return (
        <Avatar
            src={getAvatar()}
            ref={ref}
            sx={{
                ...theme.typography.largeAvatar,
                ...sx
            }}
            aria-controls={controls}
            aria-haspopup={hasPopup}
            color="inherit"
        />
    );
};

export default ProfileIcon;
