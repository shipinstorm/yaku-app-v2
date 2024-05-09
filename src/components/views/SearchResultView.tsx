import { Avatar, Chip, Grid, Typography } from "@mui/material";
import { IMAGE_PROXY } from "@/config/config";
import { toUpper } from "lodash";

const SearchResultView = ({
  project,
  index: idx,
  navigate = (v: any) => {},
}: any) => (
  <div
    key={idx}
    className="box-border m-0 flex-grow max-w-full pl-6 pt-6 bg-elevation1 hover:bg-elevation1-hover p-2 rounded-2xl mx-2"
  >
    <Grid
      container
      gap={1}
      sx={{ cursor: "pointer" }}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="nowrap"
      onClick={() => navigate(project)}
    >
      <Grid
        item
        xs={7}
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Avatar
          src={`${IMAGE_PROXY}${project.img_url}`}
          sx={{
            width: 24,
            height: 24,
            objectFit: "cover",
            backgroundColor: "transparent",
          }}
        />

        <Typography sx={{ ml: 1 }} component="h6" fontWeight={700} noWrap>
          {project.display_name}
        </Typography>
      </Grid>
      <Grid
        item
        xs={5}
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Chip size="small" label={toUpper(project?.type)} />
      </Grid>
    </Grid>
  </div>
);

export default SearchResultView;
