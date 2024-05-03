/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// web3 imports
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import { useAccess } from 'hooks/useAccess';
import { useToasts } from 'hooks/useToasts';
import defaultConfig from 'config';
import { GuardProps } from 'types';
import Loader from 'components/loaders/Loader';
import useAuth from 'hooks/useAuth';
import useWallets from 'hooks/useWallets';
import useStaked from 'hooks/useStaked';

/**
 * Yaku collection guard for routes having a Yaku NFT required to visit
 * @param {PropTypes.node} children children element/node
 */
const YakuGuard = ({ children }: GuardProps) => {
    const { showErrorToast } = useToasts();
    const { checkAccess } = useAccess();
    const { pass, signed } = useAuth();
    const { publicKey } = useWallet();
    const { showLoginDialog } = useWallets();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { isLoading: isLoadingStake, isInited } = useStaked();

    async function waitUntil(condition: () => boolean, time = 100) {
        while (!condition()) {
            // eslint-disable-next-line no-await-in-loop
            await new Promise((resolve) => setTimeout(resolve, time));
        }
    }
    async function findYakuAuth() {
        if (!publicKey) return false;
        await waitUntil(() => isInited && isLoadingStake === false);
        const hasAccess = await checkAccess(publicKey);
        return hasAccess;
    }

    const handleAccess = (hasAccess: boolean) => {
        if (!hasAccess) {
            showErrorToast('You do not have access to these routes, purchase a Yaku collection to gain access.');
            navigate(defaultConfig.defaultPath, { replace: true });
        } else {
            pass();
        }
        // if (!signed) {
        //     showLoginDialog(true, true, true);
        // }
        setIsLoading(false);
    };

    const handlePublicKeyNotFound = () => {
        console.debug('YakuGuard: showLoginDialog');
        // showLoginDialog(true, true, true);
        showLoginDialog(false, false, true);
        setIsLoading(false);
    };

    useEffect(() => {
        if (publicKey) {
            // findYakuAuth().then((hasAccess) => {
            //     handleAccess(hasAccess);
            // });
            handleAccess(true);
        } else {
            handlePublicKeyNotFound();
        }
    }, [publicKey, isLoadingStake, isInited]);

    useEffect(() => {
        if (!publicKey) {
            handlePublicKeyNotFound();
        }
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return <>{(signed || publicKey) && children}</>;
};

export default YakuGuard;
