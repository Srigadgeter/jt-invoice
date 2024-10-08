import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
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
