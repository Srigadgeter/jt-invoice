import React, { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate, useOutletContext } from "react-router-dom";

import routes from "routes/routes";
import Loader from "components/common/Loader";
import commonStyles from "utils/commonStyles";
import ClickNew from "components/common/ClickNew";
import TitleBanner from "components/common/TitleBanner";
import { MODES, FIREBASE_COLLECTIONS } from "utils/constants";
import { deleteDocFromFirestore } from "integrations/firestoreHelpers";
import { deleteInvoice, setInvoice } from "store/slices/invoicesSlice";
import { formatDate, getDaysDiff, indianCurrencyFormatter, isMobile } from "utils/utilites";

const styles = {
  box: {
    display: "flex",
    justifyContent: "flex-end"
  },
  dataGrid: commonStyles?.dataGrid ?? {},
  chip: (value) => ({
    width: "70px",
    height: "auto",
    borderRadius: 1,
    color: value === "paid" ? "common.success" : "common.error",
    bgcolor: value === "paid" ? "background.success" : "background.error",
    ".MuiChip-label": {
      px: 0.75,
      py: 0.5
    }
  })
};

const Invoices = () => {
  const [isLoading, setLoader] = useState(false);

  const { loading = false } = useOutletContext();
  const { INVOICE_NEW, INVOICE_VIEW, INVOICE_EDIT } = routes;
  const { VIEW, EDIT } = MODES;
  const { INVOICES } = FIREBASE_COLLECTIONS;
  const { invoices = [] } = useSelector((state) => state?.invoices);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = (type, startYear, endYear, id) => {
    navigate(
      type === VIEW
        ? INVOICE_VIEW.to(startYear, endYear, id)
        : INVOICE_EDIT.to(startYear, endYear, id)
    );
  };

  const handleDownload = () => {};

  const handleNew = () => {
    navigate(INVOICE_NEW.to());
  };

  const columns = [
    {
      field: "invoiceNumber",
      headerName: "Invoice Number",
      width: 180
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1,
      valueFormatter: ({ value }) => value?.label
    },
    {
      field: "invoiceDate",
      headerName: "Invoice Date",
      width: 130,
      valueFormatter: ({ value }) => formatDate(value)
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value?.toLowerCase() === "paid" ? "Paid" : "Unpaid"}
          sx={styles.chip(value?.toLowerCase())}
        />
      )
    },
    {
      field: "paymentDate",
      headerName: "Payment Date",
      width: 120,
      valueFormatter: ({ value }) => (value ? formatDate(value) : null)
    },
    {
      field: "daysTaken",
      headerName: "Invoiced",
      width: 120,
      renderCell: ({ row }) =>
        row?.paymentStatus === "paid" && row?.paymentDate
          ? null
          : getDaysDiff(row?.invoiceDate, null, true)
    },
    {
      field: "totalAmount",
      headerName: "Amount",
      type: "number",
      width: 150,
      renderCell: ({ value }) => (
        <Typography fontSize={16} fontWeight={600} color="primary.main">
          {indianCurrencyFormatter(value || 0)}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton
              size="large"
              aria-label={VIEW}
              disabled={loading || isLoading}
              onClick={() => {
                dispatch(setInvoice(params?.row?.id));
                handleOpen(VIEW, params?.row?.startYear, params?.row?.endYear, params?.row?.id);
              }}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="large"
              aria-label={EDIT}
              disabled={loading || isLoading}
              onClick={() => {
                dispatch(setInvoice(params?.row?.id));
                handleOpen(EDIT, params?.row?.startYear, params?.row?.endYear, params?.row?.id);
              }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="large"
              aria-label="delete"
              disabled={loading || isLoading}
              onClick={() =>
                deleteDocFromFirestore(params?.row, INVOICES, setLoader, dispatch, deleteInvoice)
              }>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton
              size="large"
              disabled={loading || isLoading}
              aria-label="download invoice"
              onClick={() => handleDownload(params?.row?.id)}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (isMobile()) {
    columns.splice(1, 1, { field: "customerName", headerName: "Customer Name", width: 300 });
  }

  return (
    <Box px={3} mt={1}>
      {(loading || isLoading) && <Loader height="calc(100vh - 50px)" />}

      <TitleBanner page="INVOICES" Icon={ReceiptLongIcon} />

      <Box sx={styles.box}>
        <Button
          variant="contained"
          disabled={loading || isLoading}
          startIcon={<AddIcon />}
          onClick={() => handleNew()}>
          New
        </Button>
      </Box>

      {invoices && Array.isArray(invoices) && invoices.length > 0 ? (
        <DataGrid
          sx={styles.dataGrid}
          rows={invoices}
          columns={columns}
          pageSizeOptions={[10]}
          initialState={{
            sorting: {
              sortModel: [{ field: "invoiceDate", sort: "desc" }]
            },
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          disableColumnMenu
        />
      ) : (
        <ClickNew prefixMessage="Click here to create your" hightlightedText="invoices" />
      )}
    </Box>
  );
};

export default Invoices;
