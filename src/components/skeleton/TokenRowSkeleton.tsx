import { Grid, Skeleton, Typography } from "@mui/material";

const TokenRowSkeleton = ({ index }: any) => (
  <div className="box-border m-0 flex-grow max-w-full p-2 pt-2 md:p-0 md:!pt-0">
    <div className="bg-elevation1 hover:bg-elevation1-hover rounded-2xl shadow-none w-full px-0 mt-2 !border-none">
      <Grid
        container
        className="items-center justify-between flex-wrap lg:flex-nowrap"
      >
        <Grid item className="text-center p-2 md:w-20 sm:w-10">
          <Typography component="p" className="text-xs md:hidden" noWrap>
            Rank
          </Typography>
          {index}
        </Grid>
        <Grid item className="p-2 w-12">
          <Skeleton variant="rounded" width={40} height={40} />
        </Grid>
        <Grid item xs={4} sm={2} lg={2} className="p-2">
          <Skeleton variant="rounded" width="100%" height={24} />
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          lg={1.5}
          className="p-2 text-end sm:text-start"
        >
          <Typography component="p" className="text-xs md:hidden" noWrap>
            Price
          </Typography>

          <Skeleton variant="rounded" width="100%" height={24} />
        </Grid>
        <Grid item xs={6} sm={2} lg={1.5} className="text-center p-2">
          <Typography component="p" className="text-xs md:hidden" noWrap>
            Price 1h %
          </Typography>
          <Skeleton variant="rounded" width="100%" height={24} />
        </Grid>
        <Grid item xs={3} sm={2} lg={1.5} className="text-center p-2">
          <Typography component="p" className="text-xs md:hidden" noWrap>
            Price 24h %
          </Typography>
          <Skeleton variant="rounded" width="100%" height={24} />
        </Grid>
        <Grid
          item
          xs={4}
          sm={2}
          lg={1.5}
          className="text-end md:text-center p-2"
        >
          <Typography component="p" className="text-xs md:hidden" noWrap>
            Price 7D %
          </Typography>
          <Skeleton variant="rounded" width="100%" height={24} />
        </Grid>
        <Grid
          item
          xs={3}
          sm={6}
          lg={1.5}
          className="text-start sm:text-center lg:text-end p-2"
        >
          <Typography component="p" className="text-xs md:hidden" noWrap>
            Market Cap.
          </Typography>
          <Skeleton variant="rounded" width="100%" height={24} />
        </Grid>
        <Grid
          item
          xs={3}
          sm={6}
          lg={1.5}
          className="text-end sm:text-center lg:text-end p-2"
        >
          <Typography component="p" className="text-xs md:hidden" noWrap>
            Volume 24h
          </Typography>
          <Skeleton variant="rounded" width="100%" height={24} />
        </Grid>
      </Grid>
    </div>
  </div>
);

export default TokenRowSkeleton;
