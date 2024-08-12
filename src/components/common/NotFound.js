import React from "react";
import { Box, Button, Typography } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const styles = {
  box: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  sadIcon: {
    fontSize: 150
  }
};

const NotFound = () => (
  <Box sx={styles.box}>
    <SentimentVeryDissatisfiedIcon sx={styles.sadIcon} />
    <Typography variant="h2">Oops! Page not found</Typography>
    {/* TODO: button navigation to be configured */}
    <Button>Go Back</Button>
  </Box>
);

export default NotFound;
