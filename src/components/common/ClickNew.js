import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ArrowSvg from "./ArrowSvg";

const styles = {
  container: {
    display: "flex",
    position: "relative",
    height: "calc(100vh - 255px)"
  },
  text: {
    top: "59%",
    right: "38%",
    fontSize: "18px",
    position: "absolute"
  },
  name: {
    fontStyle: "italic",
    fontWeight: 500,
    color: (theme) => theme.palette.primary.main
  },
  arrow: {
    top: 0,
    right: 95,
    position: "absolute"
  }
};

const ClickNew = ({ name }) => (
  <Box sx={styles.container}>
    <Typography sx={styles.text}>
      Click here to create new{" "}
      <Box component="span" sx={styles.name}>
        {name}
      </Box>
    </Typography>
    <ArrowSvg style={styles.arrow} />
  </Box>
);

export default ClickNew;
