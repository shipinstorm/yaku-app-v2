/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

// project imports
import { GuardProps } from 'types';
import useWallets from 'hooks/useWallets';
import useAuth from 'hooks/useAuth';

/**
 * Yaku collection guard for routes having a Yaku NFT required to visit
 * @param {PropTypes.node} children children element/node
 */
const SolanaGuard = ({ children }: GuardProps) => {
    const auth = useAuth();
    const { showLoginDialog } = useWallets();

    useEffect(() => {
        if (!auth.user?.wallet) {
            showLoginDialog(false, true, true);
        }
    }, []);

    return <>{auth.user?.wallet && children}</>;
};

export default SolanaGuard;
