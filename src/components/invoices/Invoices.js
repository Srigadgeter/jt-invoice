import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

import { PAGE_INFO, MODES } from "utils/constants";
import { formatDate, getDaysDiff, indianCurrencyFormatter, isMobile } from "utils/utilites";
import routes from "routes/routes";

const styles = {
  titleCard: {
    p: 4,
    mb: 1,
    color: (theme) => (theme.palette.mode === "dark" ? "common.black" : "common.white"),
    borderRadius: "15px",
    boxShadow: (theme) => (theme.palette.mode === "dark" ? "#c0bfbf59" : "#00000059"),
    backgroundImage: (theme) =>
      `linear-gradient( 64.5deg, ${theme.palette.common.pink} 14.7%, ${theme.palette.primary.main} 88.7% )`
  },
  titleIcon: {
    fontSize: 70
  },
  box: {
    display: "flex",
    justifyContent: "flex-end"
  },
  dataGrid: {
    mt: 1,
    ".MuiDataGrid-virtualScroller": {
      overflowX: "hidden",
      height: "calc(100vh - 370px)",
      scrollbarWidth: "7px",
      ":hover": {
        "::-webkit-scrollbar": {
          display: "block"
        }
      }
    }
  },
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
  const { INVOICE_NEW, INVOICE_VIEW, INVOICE_EDIT } = routes;
  const { VIEW, EDIT } = MODES;
  const { invoices } = useSelector((state) => state.invoices);
  const navigate = useNavigate();

  const handleOpen = (type, invoiceNumber) => {
    navigate(type === VIEW ? INVOICE_VIEW.to(invoiceNumber) : INVOICE_EDIT.to(invoiceNumber));
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
    { field: "customerName", headerName: "Customer Name", flex: 1 },
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
          label={value.toLowerCase() === "paid" ? "Paid" : "Unpaid"}
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
      headerName: "Invoiced before",
      width: 120,
      renderCell: ({ row }) =>
        row?.paymentStatus === "paid" ? null : getDaysDiff(row?.invoiceDate)
    },
    {
      field: "totalAmount",
      headerName: "Amount",
      type: "number",
      width: 150,
      renderCell: ({ value }) => (
        <Typography fontSize={16} fontWeight={600} color="primary.main">
          {indianCurrencyFormatter(value)}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton
              aria-label={VIEW}
              size="large"
              onClick={() => handleOpen(VIEW, params?.row?.invoiceNumber)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              aria-label={EDIT}
              size="large"
              onClick={() => handleOpen(EDIT, params?.row?.invoiceNumber)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton
              aria-label="download invoice"
              size="large"
              onClick={() => handleDownload(params?.row?.invoiceNumber)}>
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={styles.titleCard}>
        <Stack>
          <Typography variant="h3">{PAGE_INFO?.INVOICES?.title}</Typography>
          <Typography variant="body1" pl={0.25}>
            {PAGE_INFO?.INVOICES?.description}
          </Typography>
        </Stack>
        <ReceiptLongIcon sx={styles.titleIcon} />
      </Stack>

      <Box sx={styles.box}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleNew()}>
          New
        </Button>
      </Box>

      <DataGrid
        sx={styles.dataGrid}
        rows={invoices}
        columns={columns}
        getRowId={(row) => row?.invoiceNumber}
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
    </Box>
  );
};

export default Invoices;
