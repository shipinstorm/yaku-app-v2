/* eslint-disable @typescript-eslint/no-unused-vars */
// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { AccountBalanceOutlined } from '@mui/icons-material';

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const vault = {
    id: 'vault',
    title: <FormattedMessage id="vault" />,
    type: 'item',
    showInCollapsed: true,
    url: '/workspaces/vault',
    icon: AccountBalanceOutlined,
    breadcrumbs: false
};

export default vault;
