// material-ui
import { Box, Grid, Typography } from "@mui/material";

// project imports
import { gridSpacing } from "@/store/constant";

const StakeEmpty = () => (
  <Grid container spacing={gridSpacing}>
    <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
      <Box sx={{ m: "5 auto", textAlign: "center" }}>
        <Grid container justifyContent="center" spacing={gridSpacing}>
          <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
            <Grid container spacing={gridSpacing}>
              <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
                <div className="m-0 text-4xl font-bold font-inter leading-tight text-white">
                  You do not own any unstaked Yaku collections.
                </div>
              </div>
            </Grid>
          </div>
        </Grid>
      </Box>
    </div>
  </Grid>
);

export default StakeEmpty;
