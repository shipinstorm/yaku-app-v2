import {
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WalletButton from "./WalletButton";

const LoginStepThree = ({ handleProfileVisit }: any) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      <Grid item xs={12}>
        <Grid
          container
          direction={matchDownSM ? "column-reverse" : "row"}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Stack alignItems="center" justifyContent="center" spacing={1}>
              {/* <img src={Confetti} alt="Complete" width={120} height={120} /> */}
              <Typography variant="h1" fontSize="16px" textAlign="center">
                Congratulations!
              </Typography>

              <Typography variant="caption" fontSize="16px" textAlign="center">
                Your account has been successfully created.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Stack direction="column" justifyContent="center">
          <WalletButton
            variant="outlined"
            color="secondary"
            onClick={() => handleProfileVisit()}
            sx={{ mt: 2 }}
          >
            Visit Hub
          </WalletButton>
        </Stack>
      </Grid>
    </>
  );
};

export default LoginStepThree;
