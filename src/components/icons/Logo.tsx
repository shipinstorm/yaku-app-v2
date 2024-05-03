// material-ui
import { useTheme } from '@mui/material/styles';
import { IMAGE_PROXY_LOGO, LOGO } from '@/config/config';

const LOGO_DARK = `https://s3.amazonaws.com/img.yaku.ai/logos/X-YAKU.png`;
const LOGO_LIGHT = `https://s3.amazonaws.com/img.yaku.ai/logos/X-YAKU.png`;

// ==============================|| LOGO SVG ||============================== //

const Logo = ({ withoutText = false }: any) => {
    const theme = useTheme();

    if (withoutText) {
        return <img width={170} src={LOGO} className="m-auto pt-5 md:pt-0" alt="logo" />;
    }

    return (
        <img
            src={`${IMAGE_PROXY_LOGO}${theme.palette.mode === 'dark' ? LOGO_LIGHT : LOGO_DARK}`}
            alt="Yaku Labs"
            width="160"
            style={{ verticalAlign: 'middle', paddingTop: '2px' }}
        />
    );
};

export default Logo;
