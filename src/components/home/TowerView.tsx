import { Grid, Skeleton, Typography } from "@mui/material";

const TowerView = ({ height, type, surface, loading }: any) => {
  if (loading) {
    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
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
            {type === "Tower" ? "Height" : "Surface"}
          </Typography>
          <p className="text-lg font-bold">
            {`${type === "Tower" ? height : surface}`}
            {type === "Tower" ? (
              "m"
            ) : (
              <>
                m<sup>2</sup>
              </>
            )}
          </p>
        </Grid>
      </Grid>
    </>
  );
};

export default TowerView;
