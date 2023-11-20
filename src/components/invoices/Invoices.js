import React from "react";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { PAGE_INFO } from "utils/constants";

const styles = {
  titleCard: {
    p: 4,
    color: "common.white",
    borderRadius: "15px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    backgroundImage:
      "linear-gradient( 64.5deg,  rgba(245,116,185,1) 14.7%, rgba(89,97,223,1) 88.7% )"
  },
  titleIcon: {
    fontSize: 70
  },
  dataGrid: {
    mt: 3,
    ".MuiDataGrid-virtualScroller": {
      overflowX: "hidden",
      height: "calc(100vh - 345px)",
      "&::-webkit-scrollbar": {
        display: "block"
      }
    }
  }
};

const Invoices = () => {
  const invoices = [
    {
      invoiceNumber: "JT20232024TX00001",
      customerName: "SRINIWAS & CO",
      createdDate: "10/11/2023",
      status: "paid",
      amount: 30000
    },
    {
      invoiceNumber: "JT20232024TX00002",
      customerName: "SIVANANDA TEXTILES & READYMADES",
      createdDate: "11/11/2023",
      status: "unpaid",
      amount: 13000
    },
    {
      invoiceNumber: "JT20232024TX00003",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdDate: "12/11/2023",
      status: "unpaid",
      amount: 25000
    },
    {
      invoiceNumber: "JT20232024TX00004",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdDate: "13/11/2023",
      status: "unpaid",
      amount: 10000
    },
    {
      invoiceNumber: "JT20232024TX00005",
      customerName: "SRI BHAVANI HANDLOOM STORES",
      createdDate: "14/11/2023",
      status: "paid",
      amount: 16500
    },
    {
      invoiceNumber: "JT20232024TX00012",
      customerName:
        "SRI BHAVANI HANDLOOM STORES SRI BHAVANI HANDLOOM STORES SRI BHAVANI HANDLOOM STORES",
      createdDate: "14/11/2023",
      status: "paid",
      amount: 16500
    },
    {
      invoiceNumber: "JT20232024TX00011",
      customerName: "RANJANAAS READYMADES & SAREES",
      createdDate: "15/11/2023",
      status: "unpaid",
      amount: 21500
    },
    {
      invoiceNumber: "JT20232024TX00006",
      customerName: "RANJANAAS READYMADES & SAREES",
      createdDate: "15/11/2023",
      status: "unpaid",
      amount: 21500
    },
    {
      invoiceNumber: "JT20232024TX00007",
      customerName: "SRINIWAS & CO",
      createdDate: "10/11/2023",
      status: "paid",
      amount: 30000
    },
    {
      invoiceNumber: "JT20232024TX00008",
      customerName: "SIVANANDA TEXTILES & READYMADES",
      createdDate: "11/11/2023",
      status: "unpaid",
      amount: 13000
    },
    {
      invoiceNumber: "JT20232024TX00009",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdDate: "12/11/2023",
      status: "unpaid",
      amount: 25000
    },
    {
      invoiceNumber: "JT20232024TX00010",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdDate: "13/11/2023",
      status: "unpaid",
      amount: 10000
    }
  ];

  const columns = [
    {
      field: "invoiceNumber",
      headerName: "Invoice Number",
      width: 180
    },
    { field: "customerName", headerName: "Customer Name", flex: 1 },
    { field: "createdDate", headerName: "Invoice Date", width: 130 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value.toLowerCase() === "paid" ? "Paid" : "Unpaid"}
          color={params.value.toLowerCase() === "paid" ? "success" : "error"}
        />
      )
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 130,
      renderCell: (params) => (
        <Typography fontSize={18} fontWeight="bold">
          &#8377;{params.value}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: () => (
        <Box>
          <Tooltip title="View">
            <IconButton aria-label="view" size="large">
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton aria-label="edit" size="large">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton aria-label="download invoice" size="large">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box px={3}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={styles.titleCard}>
        <Stack>
          <Typography variant="h3">{PAGE_INFO.INVOICES.title}</Typography>
          <Typography variant="caption" pl={0.25}>
            {PAGE_INFO.INVOICES.description}
          </Typography>
        </Stack>
        <ReceiptLongIcon sx={styles.titleIcon} />
      </Stack>

      <DataGrid
        sx={styles.dataGrid}
        rows={invoices}
        columns={columns}
        getRowId={(row) => row.invoiceNumber}
        initialState={{
          sorting: {
            sortModel: [{ field: "invoiceNumber", sort: "asc" }]
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
