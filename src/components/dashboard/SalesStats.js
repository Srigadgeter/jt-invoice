import React from "react";
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
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Sales</Typography>
        <Avatar sx={styles.avatar}>
          <CurrencyRupeeOutlinedIcon />
        </Avatar>
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
