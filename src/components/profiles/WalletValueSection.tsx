/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import SolanaIcon from "@/components/icons/SolanaIcon";

import { YAKU_TOKEN_ICON } from "@/config/config";

import { useMeta } from "@/contexts/meta/meta";

import useConnections from "@/hooks/useConnetions";

import themeTypography from "@/themes/typography";

const WalletValueSection = ({
  title,
  wallet,
  open,
  handleWithdraw,
  showEscrow,
  escrowBal,
}: any) => {
  const { connection } = useConnections();
  const mainWallet = useWallet();
  const { fetchBalance, fetchYakuBalance } = useMeta();

  const [balance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);

  const updateView = async () => {
    const bal = await fetchBalance(new PublicKey(wallet), connection);
    setBalance(bal);
    const ybal = await fetchYakuBalance(
      new PublicKey(wallet),
      connection,
      mainWallet
    );
    setTokenBalance(ybal);
  };

  useEffect(() => {
    updateView();
  }, [wallet]);
  return (
    <>
      <div className="flex items-center justify-start p-1">
        <SolanaIcon />
        <div className="flex flex-col items-start justify-start ml-1">
          <p className="text-base font-normal">{title}</p>
          {wallet && (
            <p className="text-base font-bold ml-1">
              {(balance || 0).toLocaleString()} ◎
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-start p-1">
        <img
          src={YAKU_TOKEN_ICON}
          className="cursor-pointer w-6 h-6"
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          alt="Yaku Token Icon"
        />
        <div className="flex flex-col items-start justify-start ml-1">
          {wallet && (
            <p className="text-base font-bold">
              {(tokenBalance || 0).toLocaleString()} ◎
            </p>
          )}
        </div>
      </div>
      <hr className="my-2 flex-shrink-0 border-t border-solid border-[#d5d9e9] opacity-20" />
      {showEscrow && (
        <div className="flex items-center justify-between p-1 mt-1">
          <div className="flex gap-1">
            <SolanaIcon />
            <div className="flex flex-col items-start justify-start">
              <p className="text-base font-normal ml-1 whitespace-nowrap">
                Bidding Wallet
              </p>
              {escrowBal !== undefined && (
                <p className="text-base font-bold ml-1">
                  {(escrowBal || 0).toLocaleString()} ◎
                </p>
              )}
            </div>
            <button
              className="inline-flex items-center justify-center relative box-border bg-transparent outline-none border-0 user-select-none align-middle text-capitalize font-inter text-xs leading-7 min-w-16 px-1 py-1.5 transition-colors duration-250 ease-in-out font-medium rounded-md hover:bg-gray-100 hover:shadow-md hover:border-gray-300 hover:text-gray-700 disabled:text-white disabled:text-opacity-30 disabled:hover:bg-inherit"
              onClick={() => handleWithdraw()}
              disabled={(escrowBal?.getMEEscrowBalance?.balance || 0) === 0}
            >
              Withdraw
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletValueSection;
