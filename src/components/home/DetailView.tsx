import { Grid, Skeleton, Typography, useTheme } from "@mui/material";
import { find } from "lodash";

const DetailView = ({
  projectStats = [],
  projectId,
  solPrice,
  loading,
}: any) => {
  const theme = useTheme();
  if (loading) {
    return (
      <Grid container spacing={2} sx={{ my: 1 }}>
        <Grid item xs={6}>
          <Skeleton variant="rounded" width="100%" height={16} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rounded" width="100%" height={16} />
        </Grid>
      </Grid>
    );
  }
  const {
    volume_1day = 0,
    volume_1day_change = 0,
    floor_price = 0,
    floor_price_1day_change = 0,
    average_price = 0,
    average_price_1day_change = 0,
    num_of_token_listed = 0,
    project: { supply },
  } = find(
    projectStats || [],
    ({ project_id }: any) => project_id === projectId
  ) || { project: { supply: 0 } };

  return (
    <>
      <Grid
        container
        columnSpacing={1}
        rowSpacing={1}
        sx={{ my: 1 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid
          item
          xs={12}
          className="!p-0"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            component="p"
            className="text-terciary font-bold text-[14px]"
          >
            Listed
          </Typography>
          <p className="text-lg font-bold">
            {num_of_token_listed} / {supply}
          </p>
        </Grid>
      </Grid>
    </>
  );
};

export default DetailView;
