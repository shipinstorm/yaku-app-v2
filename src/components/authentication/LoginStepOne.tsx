import { shortenAddress } from "@/utils/utils";
import WalletButton from "./WalletButton";

const LoginStepOne = ({
  publicKey,
  isLedger,
  setIsLedger,
  handleBack,
  handleSignTransaction,
  handleSignMessage,
}: any) => {
  return (
    <>
      <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center">
          <p className="text-lg text-center text-white">
            You are required to prove ownership of this wallet by signing this
            message.
          </p>

          <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-800 text-white">
            {publicKey && shortenAddress(publicKey, 5)}
          </div>
        </div>
      </div>

      <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6 mt-2">
        <div className="flex flex-col justify-center">
          <WalletButton
            variant="contained"
            color="secondary"
            onClick={isLedger ? handleSignTransaction : handleSignMessage}
          >
            {!isLedger ? "Sign Message" : "Sign Transaction"}
          </WalletButton>

          <WalletButton
            variant="outlined"
            color="primary"
            onClick={() => handleBack(1)}
            sx={{ mt: 2 }}
          >
            Go Back
          </WalletButton>
        </div>
      </div>
    </>
  );
};
export default LoginStepOne;
