import { Typography } from "@mui/material";
import { round } from "lodash";

const PercentText = ({ percent }: { percent: number }) => {
  if (percent > 0) {
    return (
      <Typography component="p" noWrap color="rgb(34 197 94)">
        {`+ ${Number(Math.abs(round(percent * 100, 1))).toLocaleString()}%`}
      </Typography>
    );
  }
  if (percent < 0) {
    return (
      <Typography component="p" noWrap color="rgb(239 68 68)">
        {`- ${Number(Math.abs(round(percent * 100, 1))).toLocaleString()}%`}
      </Typography>
    );
  }
  return (
    <Typography component="p" noWrap>
      0%
    </Typography>
  );
};
export default PercentText;
