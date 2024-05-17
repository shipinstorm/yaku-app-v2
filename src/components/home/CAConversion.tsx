/* eslint-disable react-hooks/exhaustive-deps */
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getATokenAddrFungible } from "@/actions/shared";
import { withdrawAllNft } from "@/actions/stake";
import { loadYakuProgram, stakeNftV2Multiple } from "@/actions/yakuStake";
import { COSMIC_TOKEN_MINT } from "@/config";
import useConnections from "@/hooks/useConnetions";
import { useToasts } from "@/hooks/useToasts";
import { map } from "lodash";
import { useEffect, useState } from "react";
import {
  getTokenBalance,
  getUserPoolData,
} from "@/app/applications/staking/fetchData";
import TopAlert from "./TopAlert";

const CAConversion = () => {
  const { connection } = useConnections();
  const mainWallet: any = useWallet();
  const wallet: any = useAnchorWallet();
  const { showInfoToast, showSuccessToast } = useToasts();
  const [oldStaked, setOldStaked] = useState<any>({});
  const [loading, setLoading] = useState<any>(false);

  const handleConvertStake = async () => {
    if (oldStaked && oldStaked.staked && oldStaked.staked.length > 0) {
      try {
        setLoading(true);
        await withdrawAllNft(
          connection,
          mainWallet,
          map(oldStaked.staked, ({ mint }) => new PublicKey(mint))
        );
        const program = loadYakuProgram(connection, wallet);
        const mintList = map(
          oldStaked.staked,
          ({ mint }) => new PublicKey(mint)
        );
        await stakeNftV2Multiple(connection, program, wallet, mintList);
        showSuccessToast(
          "You have converted all of your NFTs to new staking contract."
        );
      } catch (error) {
        console.error(error);
        showInfoToast(
          "There may be congestion in Solana Network, you may try again or check in Stake Page."
        );
      } finally {
        await getOldStaked();
        setLoading(false);
      }
    }
  };

  const getOldStaked = async () => {
    const { staked = [], claimReward = 0 } = await getUserPoolData({
      connection,
      wallet,
    });

    const tokenAccountAddress = await getATokenAddrFungible(
      connection,
      wallet.publicKey,
      COSMIC_TOKEN_MINT
    );
    let cosmicBal = 0;
    if (tokenAccountAddress) {
      cosmicBal =
        (await getTokenBalance(
          connection,
          tokenAccountAddress,
          mainWallet,
          false
        )) || 0;
    }
    setOldStaked({ staked, claimReward, cosmicBal });
  };

  useEffect(() => {
    if (mainWallet && mainWallet.publicKey) {
      getOldStaked();
    }
  }, [mainWallet.connected]);
  return (
    <>
      {oldStaked && oldStaked.staked && oldStaked.staked.length > 0 && (
        <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
          <TopAlert
            severity="warning"
            description="Cosmic Astronauts original staking contract will be tapped out soon. Please click the button to convert them
                                to Yaku staking contract."
            buttons={
              <button
                disabled={loading}
                onClick={handleConvertStake}
                className={`min-w-[120px] ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 text-white font-semibold rounded-lg py-2 px-4 transition duration-300 ease-in-out"
                }`}
              >
                <p className="whitespace-nowrap">Convert All</p>
              </button>
            }
          />
        </div>
      )}
    </>
  );
};

export default CAConversion;
