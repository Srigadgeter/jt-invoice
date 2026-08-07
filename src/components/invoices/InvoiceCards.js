import React, { Fragment } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";

import { formatDate, indianCurrencyFormatter } from "utils/utilites";
import { MODES } from "utils/constants";
import { setInvoice } from "store/slices/invoicesSlice";

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
  status: (isPaid) => ({
    fontWeight: 500,
    color: isPaid ? "success.main" : "error.main"
  }),
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
  chip: (isPaid) => ({
    width: "auto",
    height: "auto",
    borderRadius: 10,
    color: isPaid ? "common.success" : "common.error",
    bgcolor: isPaid ? "background.success" : "background.error"
  }),
  icon: {
    fontSize: "20px",
    color: "text.secondary"
  }
};

const InvoiceCards = ({
  invoices,
  handleOpen,
  isCurrentFY,
  handleViewPDF,
  handleDelete,
  loading = false
}) => {
  const { VIEW, EDIT } = MODES;

  const dispatch = useDispatch();

  if (!invoices.length) return null;

  // Sort Invoices in Descending order
  const sortedList = [...invoices].sort((a, b) => b.invoiceNumber - a.invoiceNumber);

  return (
    <Stack gap={2} pt={2} sx={styles.cardList}>
      {sortedList.map((invoice) => {
        const isPaid = invoice?.paymentStatus === "paid";

        return (
          <Box sx={styles.card} key={invoice.id}>
            <Stack sx={styles.stack1}>
              <Typography sx={styles.typo1}>{invoice?.customerName?.label}</Typography>
              <Stack sx={styles.stack2}>
                <Typography variant="body2" color="text.secondary">
                  #{invoice?.invoiceNumber}&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  {formatDate(invoice?.invoiceDate)}&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <Chip label={isPaid ? "Paid" : "Unpaid"} sx={styles.chip(isPaid)} />
                </Typography>
                <Typography fontWeight={600} color="primary.main">
                  {indianCurrencyFormatter(invoice?.totalAmount || 0)}
                </Typography>
              </Stack>
            </Stack>
            <Stack sx={styles.stack3}>
              <IconButton
                size="small"
                aria-label={VIEW}
                disabled={loading}
                onClick={() => {
                  dispatch(setInvoice(invoice?.id));
                  handleOpen(VIEW, invoice?.startYear, invoice?.endYear, invoice?.id);
                }}>
                <VisibilityIcon sx={styles.icon} />
              </IconButton>
              {isCurrentFY ? (
                <Fragment>
                  <IconButton
                    size="small"
                    aria-label={EDIT}
                    disabled={loading}
                    onClick={() => {
                      dispatch(setInvoice(invoice?.id));
                      handleOpen(EDIT, invoice?.startYear, invoice?.endYear, invoice?.id);
                    }}>
                    <EditIcon sx={styles.icon} />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="delete"
                    disabled={loading}
                    onClick={() => handleDelete({ row: invoice })}>
                    <DeleteIcon sx={styles.icon} />
                  </IconButton>
                </Fragment>
              ) : null}
              <IconButton
                size="small"
                aria-label="view invoice as pdf"
                disabled={loading}
                onClick={() => handleViewPDF(invoice)}>
                <DescriptionIcon sx={styles.icon} />
              </IconButton>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
};

export default InvoiceCards;
