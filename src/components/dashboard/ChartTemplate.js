import React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const styles = {
  paper: {
    p: 2
  }
};

const ChartTemplate = ({ title, children }) => (
  <Paper elevation={2} sx={styles.paper}>
    <Stack>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Stack>
  </Paper>
);

export default ChartTemplate;
