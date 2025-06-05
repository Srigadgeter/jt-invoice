/* eslint-disable no-console */
import React, { Fragment } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";

import { formatDate, indianCurrencyFormatter } from "utils/utilites";
import { FIREBASE_COLLECTIONS, MODES } from "utils/constants";
import { deleteDocFromFirestore } from "integrations/firestoreHelpers";
import { deleteInvoice, setInvoice } from "store/slices/invoicesSlice";

const styles = {
  card: {
    boxShadow: 2,
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
    color: "common.blue6"
  },
  stack1: {
    px: 2,
    py: 1,
    bgcolor: (theme) => (theme.palette.mode === "dark" ? "common.blue4" : "common.blue2"),
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px"
  },
  typo1: {
    fontWeight: 600,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },

  stack2: {
    flexDirection: "row",
    alignItems: "flex-end",
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
    bgcolor: (theme) => (theme.palette.mode === "dark" ? "common.blue2" : "common.blue1"),
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    justifyContent: "space-around"
  },
  icon: {
    fontSize: "20px",
    color: (theme) => (theme.palette.mode === "dark" ? "common.blue5" : "common.blue3")
  }
};

const InvoiceCards = ({
  invoices,
  setLoader,
  handleOpen,
  isCurrentFY,
  handleViewPDF,
  loading = false
}) => {
  const { VIEW, EDIT } = MODES;
  const { INVOICES } = FIREBASE_COLLECTIONS;

  const dispatch = useDispatch();

  if (!invoices.length) return null;

  const reversedList = [...invoices].reverse();

  return (
    <Stack gap={2} pt={2}>
      {reversedList.map((invoice) => {
        const isPaid = invoice?.paymentStatus === "paid";

        return (
          <Box sx={styles.card} key={invoice.id}>
            <Stack sx={styles.stack1}>
              <Typography sx={styles.typo1}>{invoice?.customerName?.label}</Typography>
              <Stack sx={styles.stack2}>
                <Typography variant="body2" color="common.blue5">
                  #{invoice?.invoiceNumber}&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  {formatDate(invoice?.invoiceDate)}&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <Typography variant="body2" component="span" sx={styles.status(isPaid)}>
                    {isPaid ? "Paid" : "Unpaid"}
                  </Typography>
                </Typography>
                <Typography fontWeight={600} color="common.black">
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
                    onClick={() =>
                      deleteDocFromFirestore(
                        invoice,
                        INVOICES,
                        setLoader,
                        dispatch,
                        deleteInvoice,
                        `Successfully deleted invoice '${invoice?.invoiceNumber}'`,
                        "There is an issue with deleting the invoice"
                      )
                    }>
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
