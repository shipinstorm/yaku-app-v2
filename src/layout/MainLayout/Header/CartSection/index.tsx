/* eslint-disable react-hooks/exhaustive-deps */

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Badge, Tooltip } from '@mui/material';

// assets
import { IconShoppingCart } from '@tabler/icons';
import { useCartItems } from 'contexts/CartContext';

// ==============================|| NOTIFICATION ||============================== //

const CartSection = () => {
    const theme = useTheme();
    const { isOpen, setOpen, cartItems } = useCartItems();

    return (
        <>
            <Box sx={{ ml: 1.5 }}>
                <Badge color="secondary" badgeContent={cartItems.length}>
                    <Tooltip title="Cart">
                        <Avatar
                            className="button-small"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out'
                            }}
                            aria-haspopup="true"
                            onClick={() => setOpen(!isOpen)}
                            color="inherit"
                        >
                            <IconShoppingCart stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </Tooltip>
                </Badge>
            </Box>
        </>
    );
};

export default CartSection;
