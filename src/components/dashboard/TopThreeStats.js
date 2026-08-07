import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

import { indianCurrencyFormatter } from "utils/utilites";

const styles = {
  paper: (borderColor) => ({
    p: 3,
    height: "100%",
    borderRadius: 4,
    position: "relative",
    borderBottom: "5px solid",
    borderColor
  }),
  stack1: {
    minHeight: "152px"
  },
  stack2: {
    width: "calc(100% - 50px)"
  },
  avatar: (avatarBgColor) => ({
    bgcolor: avatarBgColor
  }),
  box: (borderColor) => ({
    right: 25,
    position: "absolute",
    borderRadius: "50%",
    border: "8px solid transparent",
    background: `radial-gradient(circle, ${borderColor}80, ${borderColor}0a) border-box`
  }),
  avatar2: {
    color: "grey.600",
    bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.300")
  },
  name: {
    color: "grey.600",
    overflow: "hidden",
    lineHeight: "20px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  amount: {
    fontWeight: 600,
    fontSize: "18px",
    lineHeight: "20px",
    color: "primary.main"
  },
  s2: {
    fontSize: "20px"
  },
  s1: {
    fontSize: "18px"
  }
};

const skeletonContent = (
  <Stack direction="row" gap={1} alignItems="center">
    <Skeleton animation="wave" variant="circular" width={40} height={40} />
    <Stack sx={styles.stack2} justifyContent="center">
      <Skeleton animation="wave" variant="text" sx={styles.s2} />
      <Skeleton animation="wave" variant="text" sx={styles.s1} />
    </Stack>
  </Stack>
);

const TopThreeStats = ({
  title,
  icon,
  avatarBgColor,
  list = [],
  loader = false,
  showAmount = false,
  noDataContent = null
}) => (
  <Paper elevation={2} sx={styles.paper(avatarBgColor)}>
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Top 3 {title}
        </Typography>
        <Box sx={styles.box(avatarBgColor === "warning.main" ? "#ed6c02" : "#9c27b0")}>
          <Avatar sx={styles.avatar(avatarBgColor)}>{icon}</Avatar>
        </Box>
      </Stack>
      {loader ? (
        <Stack gap={1}>
          {skeletonContent}
          {skeletonContent}
          {skeletonContent}
        </Stack>
      ) : (
        <Stack gap={2} sx={styles.stack1}>
          {list.length > 0
            ? list.map((item, index) => (
                <Stack
                  gap={1}
                  direction="row"
                  alignItems="center"
                  key={`${item.name}-${item.amount}`}>
                  <Avatar sx={styles.avatar2}>{index + 1}</Avatar>
                  <Stack sx={styles.stack2} justifyContent="center">
                    <Typography sx={styles.amount}>
                      {showAmount ? indianCurrencyFormatter(item.total || 0) : `${item.pcs} pcs`}
                    </Typography>
                    <Tooltip title={item.name}>
                      <Typography variant="subtitle1" sx={styles.name}>
                        {item.name}
                      </Typography>
                    </Tooltip>
                  </Stack>
                </Stack>
              ))
            : noDataContent}
        </Stack>
      )}
    </Stack>
  </Paper>
);

export default TopThreeStats;
