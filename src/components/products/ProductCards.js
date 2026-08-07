import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";

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
    minHeight: 46,
    flexDirection: "row",
    borderBottom: "1px dashed",
    borderColor: "divider",
    alignItems: "center",
    justifyContent: "space-between"
  },
  typo1: {
    fontWeight: 600,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
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
  chip: {
    width: "auto",
    height: 19,
    borderRadius: 10,
    color: "common.success",
    bgcolor: "background.success"
  },
  icon: {
    fontSize: "20px",
    color: "text.secondary"
  }
};

const ProductCards = ({ products, handleEditProduct, handleDelete, loading = false }) => {
  if (!products.length) return null;

  // Sort Products in Alphabetical order
  const sortedList = [...products].sort((a, b) => a.label - b.label);

  return (
    <Stack gap={2} pt={2} sx={styles.cardList}>
      {sortedList.map((product) => (
        <Box sx={styles.card} key={product.id}>
          <Stack sx={styles.stack1}>
            <Typography sx={styles.typo1}>{product?.label}</Typography>{" "}
            {product?.isOwn ? <Chip label="Ours" sx={styles.chip} /> : ""}
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
