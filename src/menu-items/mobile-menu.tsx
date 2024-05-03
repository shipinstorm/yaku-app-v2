import { NavItemType } from 'types';
import { IconApps, IconCoinBitcoin, IconHome, IconPackage } from '@tabler/icons';

const mobileMenu: { items: NavItemType[] } = {
    items: [
        {
            id: 'home',
            type: 'item',
            url: '/home',
            title: '',
            icon: IconHome
        },
        // {
        //     id: 'collection',
        //     type: 'item',
        //     title: 'NFTs',
        //     url: '/explore/collection/All',
        //     icon: IconPackage
        // },
        /* {
            id: 'token',
            type: 'item',
            title: 'Tokens',
            url: '/explore/token',
            icon: IconCoinBitcoin
        }, */
        {
            id: 'applications',
            type: 'item',
            title: 'Apps',
            url: '/applications',
            icon: IconApps
        }
    ]
};

export default mobileMenu;
