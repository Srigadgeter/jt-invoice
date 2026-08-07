import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";

import { formatDate } from "utils/utilites";

const styles = {
  cardList: {
    overflowY: "overlay",
    height: "calc(100vh - 200px)"
  },
  card: {
    flexShrink: 0,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)"
  },
  stack1: {
    px: 2,
    py: 1,
    borderBottom: "1px dashed",
    borderColor: "divider"
  },
  typo1: {
    fontWeight: 600,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  stack2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  stack3: {
    px: 2,
    py: 1,
    alignItems: "center",
    flexDirection: "row",
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    justifyContent: "space-around"
  },
  icon: {
    fontSize: "20px",
    color: "text.secondary"
  }
};

const ProductCards = ({ products, handleEditProduct, handleDelete, loading = false }) => {
  if (!products.length) return null;

  return (
    <Stack gap={2} pt={2} sx={styles.cardList}>
      {products.map((product) => (
        <Box sx={styles.card} key={product.id}>
          <Stack sx={styles.stack1}>
            <Typography sx={styles.typo1}>{product?.label}</Typography>
            <Stack sx={styles.stack2}>
              <Typography variant="body2" color="text.secondary">
                Ours: {product?.isOwn ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @ {formatDate(product?.createdAt)}
              </Typography>
            </Stack>
          </Stack>
          <Stack sx={styles.stack3}>
            <IconButton
              size="small"
              aria-label="edit"
              disabled={loading}
              onClick={() => handleEditProduct(product)}>
              <EditIcon sx={styles.icon} />
            </IconButton>
            <IconButton
              size="small"
              aria-label="delete"
              disabled={loading}
              onClick={() => handleDelete({ row: product })}>
              <DeleteIcon sx={styles.icon} />
            </IconButton>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default ProductCards;
