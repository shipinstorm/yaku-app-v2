import { Box } from "@mui/material";

export default function Loading(props: { size?: number }) {
  const { size = 400 } = props;
  return (
    <Box sx={{ width: size }}>
      <img
        src="/images/x-loader.gif"
        alt="loader"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </Box>
  );
}
