import React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

import { indianCurrencyFormatter } from "utils/utilites";

const styles = {
  paper: {
    p: 2,
    height: "100%"
  },
  avatar: {
    bgcolor: "success.main"
  },
  subtitle: {
    color: "grey.600"
  },
  amount: {
    color: "primary.main"
  }
};

const SalesStats = ({ currentMonthSales = 0, currentFySales = 0 }) => (
  <Paper elevation={2} sx={styles.paper}>
    <Stack direction="row" justifyContent="space-between" mb={1}>
      <Typography variant="h6">Sales</Typography>
      <Avatar sx={styles.avatar}>
        <CurrencyRupeeOutlinedIcon />
      </Avatar>
    </Stack>
    <Stack gap={2}>
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
  </Paper>
);

export default SalesStats;
