/* eslint-disable */
import { PublicKey } from "@solana/web3.js";

import useStaked from "./useStaked";

export const useAccess = () => {
  const { stakedYakuNfts, nftList } = useStaked();

  const checkAccess = async (publicKey: PublicKey) => {
    if (!publicKey) return false;
    let totalNumOfStaked = 0;
    totalNumOfStaked += stakedYakuNfts.length;
    if (
      totalNumOfStaked !== 0 &&
      totalNumOfStaked !== null &&
      totalNumOfStaked !== undefined
    ) {
      return true;
    }
    return nftList.length > 0;
  };

  return { checkAccess };
};

export default useAccess;
