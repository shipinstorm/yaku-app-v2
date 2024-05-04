import { Grid, Skeleton, Typography } from "@mui/material";
import { numberFormatter } from "@/utils/utils";

const PersonView = ({ followersCount, nftCount, loading }: any) => {
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
          xs={nftCount ? 6 : 12}
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
            Followers
          </Typography>
          <p className="text-lg font-bold">
            {numberFormatter(followersCount, 0)}
          </p>
        </Grid>
        {nftCount && (
          <Grid
            item
            xs={6}
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
              NFT count
            </Typography>
            <p className="text-lg font-bold">{numberFormatter(nftCount, 0)}</p>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default PersonView;
