/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { Button, styled, useMediaQuery, useTheme } from "@mui/material";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import useConfig from "@/hooks/useConfig";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";

const WalletButton = styled(Button)({
  gap: "5px",
});

const ChainWalletSelect = ({
  setIsConnecting,
  handleClick,
  handleEtherLogin,
  hideEthButton = false,
}: any) => {
  const theme = useTheme();
  const wallet = useWallet();
  const { wallets } = wallet;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const { borderRadius } = useConfig();

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
          className={`flex ${
            matchDownSM ? "flex-col-reverse" : "flex-row"
          } items-center justify-center`}
        >
          <div className="flex">
            <div className="flex flex-col items-center justify-center space-y-1">
              <p className="text-xs md:text-base text-center">
                Please connect your wallet which has access to the Yaku Hub
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pl-4 pt-4 flex-none flex-grow-0 flex-shrink-0 w-full max-w-full">
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
          <WalletButton
            key={index}
            sx={{ mb: 1 }}
            className="button-main-pink"
            variant="contained"
            onClick={() => handleClick(wallet.adapter)}
            fullWidth
          >
            {/* eslint-disable-next-line */}
            <Image
              src={wallet.adapter.icon}
              alt="Wallet Image"
              width={24}
              height={24}
            />
            {wallet.adapter.name}
          </WalletButton>
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
          <WalletButton
            variant="contained"
            sx={{ mb: 1 }}
            className="button-main-pink"
            onClick={() => handleEtherLogin()}
            fullWidth
          >
            <Image
              src="/images/icons/metamask.png"
              alt="MetaMask"
              width={24}
              height={24}
            />
            MetaMask
          </WalletButton>
        )}
      </div>
    </>
  );
};

export default ChainWalletSelect;
