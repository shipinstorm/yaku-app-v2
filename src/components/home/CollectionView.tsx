import { Grid, Skeleton, Typography } from "@mui/material";
import { round } from "lodash";
import { numberFormatter } from "utils/utils";

const CollectionView = ({ holders, floorPrice, loading }: any) => {
  if (loading) {
    return (
      <Grid container spacing={2} sx={{ my: 1 }}>
        <Grid item xs={6}>
          <Skeleton variant="rounded" width="100%" height={16} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rounded" width="100%" height={16} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rounded" width="100%" height={16} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rounded" width="100%" height={16} />
        </Grid>
      </Grid>
    );
  }
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
            Holders
          </Typography>
          <p className="text-lg font-bold">{`${numberFormatter(
            holders,
            0,
            "K"
          )}`}</p>
        </Grid>
      </Grid>
    </>
  );
};

export default CollectionView;
