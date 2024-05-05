import { Grid } from "@mui/material";
import { map } from "lodash";

const StatsGridCard = ({
  title,
  stats,
  component,
  placeholder,
  count,
  loading,
}: any) => (
  <div className="card p-4">
    <Grid container alignItems="center" justifyContent="space-between">
      <div className="text-base flex items-center gap-2">{title}</div>
    </Grid>
    <div style={{ height: "224px" }}>
      <Grid container>
        {!loading
          ? map(stats, (item, idx) => component(item, idx))
          : map(Array(count), (key) => (
              <Grid item xs={12} sx={{ display: "flex", my: 1 }} key={key}>
                {placeholder}
              </Grid>
            ))}
      </Grid>
    </div>
  </div>
);

export default StatsGridCard;
