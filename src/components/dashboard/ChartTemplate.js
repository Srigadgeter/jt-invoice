import React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

const styles = {
  paper: {
    p: 3
  }
};

const skeletonContent = <Skeleton animation="wave" variant="rounded" height={400} />;

const ChartTemplate = ({ title, children, loader = false }) => (
  <Paper elevation={2} sx={styles.paper}>
    <Stack gap={1}>
      <Typography variant="h6">{title}</Typography>
      {loader ? skeletonContent : children}
    </Stack>
  </Paper>
);

export default ChartTemplate;
