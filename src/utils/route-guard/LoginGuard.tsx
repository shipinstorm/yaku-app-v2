/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

// project imports
import { GuardProps } from "@/types";
import useWallets from "@/hooks/useWallets";
import useAuth from "@/hooks/useAuth";
import { isEmpty } from "lodash";

/**
 * Yaku collection guard for routes having a Yaku NFT required to visit
 * @param {PropTypes.node} children children element/node
 */
const LoginGuard = ({ children }: GuardProps) => {
  const auth = useAuth();
  const { showLoginDialog } = useWallets();

  useEffect(() => {
    if (!auth.user || isEmpty(auth.user)) {
      showLoginDialog(false, true, false);
    }
  }, []);

  return <>{auth.user && children}</>;
};

export default LoginGuard;
