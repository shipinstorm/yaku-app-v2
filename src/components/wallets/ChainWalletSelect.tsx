/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";

import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";

const ChainWalletSelect = ({
  setIsConnecting,
  handleClick,
  handleEtherLogin,
  hideEthButton = false,
  handleGameLogin,
}: any) => {
  const wallet = useWallet();
  const { wallets } = wallet;

  const [listWallets] = useMemo(() => {
    const detected: Wallet[] = [];

    for (const w of wallets) {
      if (
        (isMobile &&
          ["Solflare", "Slope", "Phantom"].includes(w?.adapter?.name)) ||
        (!isMobile && w.readyState === WalletReadyState.Installed)
      ) {
        detected.push(w);
      }
    }

    setTimeout(() => {
      setIsConnecting(false);
    }, 1500);

    return [detected];
  }, [wallets]);

  return (
    <>
      <div className="pl-4 pt-4 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full">
        <div
          className={
            "flex flex-col-reverse sm:flex-row items-center justify-center"
          }
        >
          <div className="flex">
            <div className="flex flex-col items-center justify-center space-y-1">
              <span className="text-xs md:text-base text-center text-[#D8DDF0]">
                Please connect your wallet which has access to the Yaku Hub
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pl-4 pt-4 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full">
        {/* SOL WALLETS */}
        <div className="box-border m-0 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full">
          <div className="flex items-center">
            <hr className="m-0 flex-shrink-0 border-t border-gray-300 border-solid opacity-20 flex-grow" />

            <button
              className="inline-flex items-center justify-center relative box-border bg-transparent outline-none select-none align-middle appearance-none capitalize font-inter text-sm font-semibold leading-7 min-w-[64px] px-14 py-1 text-gray-300 border-solid border border-[#D5D9E920] rounded-md cursor-default m-4"
              disabled
            >
              SOLANA
            </button>

            <hr className="m-0 flex-shrink-0 border-t border-gray-300 border-solid opacity-20 flex-grow" />
          </div>
        </div>

        {listWallets.map((wallet, index) => (
          <button
            key={index}
            className="button-main-pink inline-flex items-center justify-center relative box-border select-none align-middle text-decoration-none capitalize min-w-16 px-4 py-[6px] transition-all duration-250 ease-in-out gap-1 mb-2 !font-normal"
            tabIndex={0}
            type="button"
            onClick={() => handleClick(wallet.adapter)}
          >
            {/* eslint-disable-next-line */}
            <Image
              src={wallet.adapter.icon}
              alt="Wallet Image"
              width={24}
              height={24}
            />
            {wallet.adapter.name}
          </button>
        ))}

        {/* ETH WALLETS */}
        {!hideEthButton && (
          <div className="w-full">
            <div className="flex items-center">
              <hr className="m-0 flex-shrink-0 border-t border-gray-300 border-solid opacity-20 flex-grow" />

              <button
                className="inline-flex items-center justify-center relative box-border bg-transparent outline-none select-none align-middle appearance-none capitalize font-inter text-sm font-semibold leading-7 min-w-[64px] px-14 py-1 text-gray-300 border-solid border border-[#D5D9E920] rounded-md cursor-default m-4"
                disabled
              >
                ETHEREUM
              </button>

              <hr className="m-0 flex-shrink-0 border-t border-gray-300 border-solid opacity-20 flex-grow" />
            </div>
          </div>
        )}

        {!hideEthButton && (
          <button
            className="button-main-pink inline-flex items-center justify-center relative box-border select-none align-middle text-decoration-none capitalize min-w-16 px-4 py-[6px] transition-all duration-250 ease-in-out gap-1 mb-2 !font-normal"
            tabIndex={0}
            type="button"
            onClick={() => handleEtherLogin()}
          >
            <Image
              src="/images/icons/metamask.png"
              alt="MetaMask"
              width={24}
              height={24}
            />
            MetaMask
          </button>
        )}

        {/* GAMING ACCOUNT */}
        <div className="box-border m-0 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full">
          <div className="flex items-center">
            <hr className="m-0 flex-shrink-0 border-t border-gray-300 border-solid opacity-20 flex-grow" />

            <button
              className="inline-flex items-center justify-center relative box-border bg-transparent outline-none select-none align-middle appearance-none capitalize font-inter text-sm font-semibold leading-7 min-w-[64px] px-14 py-1 text-gray-300 border-solid border border-[#D5D9E920] rounded-md cursor-default m-4"
              disabled
            >
              GAMING ACCOUNT
            </button>

            <hr className="m-0 flex-shrink-0 border-t border-gray-300 border-solid opacity-20 flex-grow" />
          </div>
        </div>

        <button
          className="button-main-pink inline-flex items-center justify-center relative box-border select-none align-middle text-decoration-none capitalize min-w-16 px-4 py-[6px] transition-all duration-250 ease-in-out gap-1 mb-2 !font-normal"
          tabIndex={0}
          type="button"
          onClick={() => handleGameLogin()}
        >
          <Image
            src="/images/icons/blockus.ico"
            alt="MetaMask"
            width={24}
            height={24}
          />
          Create/Link a Gaming Account
        </button>
      </div>
    </>
  );
};

export default ChainWalletSelect;
