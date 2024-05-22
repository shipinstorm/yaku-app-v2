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
        <div className="flex flex-col justify-center items-center gap-5">
          <p className="text-lg text-center text-white">
            You are required to prove ownership of this wallet by signing this
            message.
          </p>

          <span className="px-5 py-2 rounded-md text-sm font-medium bg-gray-800 text-white">
            {publicKey && shortenAddress(publicKey, 5)}
          </span>
        </div>
      </div>

      <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6 mt-2">
        <div className="flex flex-col justify-center gap-5">
          <WalletButton
            variant="contained"
            color="secondary"
            onClick={isLedger ? handleSignTransaction : handleSignMessage}
          >
            {!isLedger ? "Sign Message" : "Sign Transaction"}
          </WalletButton>

          {/* <WalletButton
            variant="outlined"
            color="primary"
            onClick={() => handleBack(1)}
            sx={{ mt: 2 }}
          >
            Go Back
          </WalletButton> */}
        </div>
      </div>
    </>
  );
};
export default LoginStepOne;
