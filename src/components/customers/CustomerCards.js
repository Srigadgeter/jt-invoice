import React from "react";
import Box from "@mui/material/Box";
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
    borderBottom: "1px dashed",
    borderColor: "divider"
  },
  name: {
    fontWeight: 600,
    fontSize: "1.05rem",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: "text.primary"
  },
  addressText: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "capitalize",
    fontSize: "0.85rem",
    lineHeight: 1.4,
    color: "text.secondary",
    mb: 0.5
  },
  infoText: {
    fontSize: "0.85rem",
    color: "text.secondary"
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

const CustomerCards = ({ customers, handleEditCustomer, handleDelete, loading = false }) => {
  if (!customers.length) return null;

  // Sort Customers in Alphabetical order
  const sortedList = [...customers].sort((a, b) => a.name.label - b.name.label);

  return (
    <Stack gap={2} pt={2} sx={styles.cardList}>
      {sortedList.map((customer) => (
        <Box sx={styles.card} key={customer.id}>
          <Stack sx={styles.stack1} spacing={0.5}>
            <Typography sx={styles.name}>{customer?.name?.label}</Typography>
            {customer?.address ? (
              <Typography sx={styles.addressText}>{customer?.address?.toLowerCase()}</Typography>
            ) : (
              ""
            )}
            <Typography sx={styles.infoText}>
              {customer?.gstNumber || ""}
              {customer?.gstNumber && customer?.phoneNumber ? (
                <>&nbsp;&nbsp;&middot;&nbsp;&nbsp;</>
              ) : (
                ""
              )}
              {customer?.phoneNumber || ""}
            </Typography>
          </Stack>
          <Stack sx={styles.stack3}>
            <IconButton
              size="small"
              aria-label="edit"
              disabled={loading}
              onClick={() => handleEditCustomer(customer)}>
              <EditIcon sx={styles.icon} />
            </IconButton>
            <IconButton
              size="small"
              aria-label="delete"
              disabled={loading}
              onClick={() => handleDelete({ row: customer })}>
              <DeleteIcon sx={styles.icon} />
            </IconButton>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default CustomerCards;
