import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

import { indianCurrencyFormatter } from "utils/utilites";

const styles = {
  paper: {
    p: 3,
    height: "100%",
    borderRadius: 4,
    position: "relative",
    borderBottom: "5px solid",
    borderColor: "success.main"
  },
  box: {
    right: 25,
    position: "absolute",
    borderRadius: "50%",
    border: "8px solid transparent",
    background: "radial-gradient(circle, #2e7d3280, #2e7d320a) border-box"
  },
  avatar: {
    bgcolor: "success.main"
  },
  subtitle: {
    color: "grey.600"
  },
  amount: {
    color: "primary.main"
  },
  s2: {
    fontSize: "26px"
  },
  s1: {
    fontSize: "18px"
  }
};

const skeletonContent = (
  <Stack>
    <Skeleton animation="wave" variant="text" sx={styles.s2} />
    <Skeleton animation="wave" variant="text" sx={styles.s1} />
  </Stack>
);

const SalesStats = ({ loader = false, currentMonthSales = 0, currentFySales = 0 }) => (
  <Paper elevation={2} sx={styles.paper}>
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Sales
        </Typography>
        <Box sx={styles.box}>
          <Avatar sx={styles.avatar}>
            <CurrencyRupeeOutlinedIcon />
          </Avatar>
        </Box>
      </Stack>
      {loader ? (
        <Stack gap={3}>
          {skeletonContent}
          {skeletonContent}
        </Stack>
      ) : (
        <Stack gap={3}>
          <Stack>
            <Typography variant="h5" sx={styles.amount}>
              {indianCurrencyFormatter(currentFySales)}
            </Typography>
            <Typography variant="subtitle1" sx={styles.subtitle}>
              Current FY
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h5" sx={styles.amount}>
              {indianCurrencyFormatter(currentMonthSales)}
            </Typography>
            <Typography variant="subtitle1" sx={styles.subtitle}>
              Current Month
            </Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  </Paper>
);

export default SalesStats;
