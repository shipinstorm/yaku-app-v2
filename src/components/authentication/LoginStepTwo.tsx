import {
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WalletButton from "./WalletButton";

const LoginStepTwo = ({
  handleBack,
  handleSignup,
  handleUsername,
  username,
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
            <Stack alignItems="center" justifyContent="center" spacing={1}>
              <Typography variant="caption" fontSize="16px" textAlign="center">
                It appears to be your first time accessing the Yaku Hub.
                <br />
                <br />
                You are eligible to choose a username, this will be displayed
                around the site and used as your vanity url.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </div>

      <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6 mt-2">
        <TextField
          fullWidth
          label="Username (Optional)"
          value={username}
          onChange={(e) => handleUsername(e.target.value)}
        />
        <Stack direction="row" justifyContent="space-between">
          <WalletButton
            variant="outlined"
            color="primary"
            onClick={() => handleBack(2)}
            sx={{ mt: 2 }}
          >
            Go Back
          </WalletButton>

          <WalletButton
            variant="contained"
            color="secondary"
            onClick={handleSignup}
            sx={{ mt: 2 }}
          >
            Sign Up
          </WalletButton>
        </Stack>
      </div>
    </>
  );
};

export default LoginStepTwo;
