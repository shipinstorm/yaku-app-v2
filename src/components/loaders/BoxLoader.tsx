import { FC } from "react";

// material-ui
import { styled } from "@mui/material/styles";

// project imports
import { useMeta } from "@/contexts/meta/meta";

// styles
const LoaderWrapper = styled("div")({
  display: "flex",
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100vh",
  zIndex: 9999,
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  background: "rgba(9, 8, 13, 0.6)",
});

// ==============================|| BOX LOADER ||============================== //

export const LoaderProvider: FC = ({ children }) => {
  const { isLoading } = useMeta();

  return (
    <>
      {isLoading && <BoxLoader />}
      {children}
    </>
  );
};

const BoxLoader = () => (
  <LoaderWrapper>
    <img src="/images/x-loader.gif" alt="loader" />
  </LoaderWrapper>
);

export default BoxLoader;
