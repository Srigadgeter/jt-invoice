import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const styles = {
  box: (height) => ({
    top: 0,
    left: 0,
    zIndex: 1301,
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
