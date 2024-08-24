import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const styles = {
  box: (height) => ({
    zIndex: 1,
    width: "100%",
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: height ?? "100%"
  })
};

const Loader = ({ height = null }) => (
  <Box sx={styles.box(height)}>
    <CircularProgress />
  </Box>
);

export default Loader;
