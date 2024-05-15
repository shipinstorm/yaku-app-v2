import {
  Chip,
  Grid,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
        <Grid
          container
          direction={matchDownSM ? "column-reverse" : "row"}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Stack alignItems="center" justifyContent="center" spacing={3}>
              <p className="text-lg text-center text-white">
                You are required to prove ownership of this wallet by signing
                this message.
              </p>

              <Chip
                label={publicKey && shortenAddress(publicKey, 5)}
                size="medium"
                variant="filled"
                className="text-white bg-[#2D2F33]"
              />

              {/* <Typography variant="caption" fontSize="16px" textAlign="center">
                Using Ledger?
              </Typography>
              <Switch
                sx={{ mt: "0px !important" }}
                color="secondary"
                checked={isLedger}
                onChange={(e) => setIsLedger(e.target.checked)}
                inputProps={{ "aria-label": "controlled" }}
              /> */}
            </Stack>
          </Grid>
        </Grid>
      </div>

      <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6 mt-2">
        <Stack direction="column" justifyContent="center">
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
        </Stack>
      </div>
    </>
  );
};
export default LoginStepOne;
