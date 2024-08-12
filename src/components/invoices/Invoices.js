import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { collection, getDocs } from "firebase/firestore";

import routes from "routes/routes";
import { db } from "integrations/firebase";
import { PAGE_INFO, MODES } from "utils/constants";
import { setProducts } from "store/slices/productsSlice";
import { setInvoice, setInvoices } from "store/slices/invoicesSlice";
import { formatDate, getDaysDiff, indianCurrencyFormatter, isMobile } from "utils/utilites";

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
  const { invoices = [], products = [] } = useSelector((state) => state.invoices);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const invoicesCollectionRef = collection(db, "invoices");
  const productCollectionRef = collection(db, "products");

  const handleOpen = (type, invoiceNumber) => {
    navigate(type === VIEW ? INVOICE_VIEW.to(invoiceNumber) : INVOICE_EDIT.to(invoiceNumber));
  };

  const handleDownload = () => {};

  const handleNew = () => {
    navigate(INVOICE_NEW.to());
  };

  // Serialize the Invoice data
  const serializeData = (productArray, invoiceArray) => {
    const serializedInvoices = [];

    invoiceArray.forEach((invoice) => {
      const modifiedData = {};
      Object.entries(invoice).forEach(([key, value]) => {
        // Serialize firebase reference data
        if (key === "products") {
          const modifiedProducts = value?.map((product) => ({
            ...product,
            productName: productArray.filter((p) => p?.id === product?.productName?.id)?.[0]
          }));
          modifiedData.products = modifiedProducts;
        }
        // Serialize firebase timestamp data
        else if (value && (value instanceof Date || typeof value.toDate === "function"))
          modifiedData[key] = value.toDate().toString();
        else modifiedData[key] = value;
      });
      serializedInvoices.push(modifiedData);
    });

    dispatch(setInvoices(serializedInvoices));
  };

  // get data
  useEffect(() => {
    const getInvoices = async () => {
      try {
        // Function for get all products
        const fetchedProducts = [...products];

        if (!(fetchedProducts && Array.isArray(fetchedProducts) && fetchedProducts.length > 0)) {
          await getDocs(productCollectionRef)
            .then((querySnapshot) => querySnapshot.docs)
            .then((docs) => {
              docs.forEach((doc) => fetchedProducts.push({ ...doc.data(), id: doc?.id }));
              dispatch(setProducts(fetchedProducts));
            });
        }

        // Function for get all invoices
        if (fetchedProducts && Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
          await getDocs(invoicesCollectionRef)
            .then((querySnapshot) => querySnapshot.docs)
            .then((docs) => {
              const fetchedInvoices = docs.map((doc) => ({ ...doc.data(), id: doc?.id }));
              serializeData(fetchedProducts, fetchedInvoices);
            });
        }
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch all invoices
    getInvoices();
  }, []);

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
      headerName: "Invoiced before",
      width: 120,
      renderCell: ({ row }) =>
        row?.paymentStatus === "paid" && row?.paymentDate ? null : getDaysDiff(row?.invoiceDate)
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
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton
              aria-label={VIEW}
              size="large"
              onClick={() => {
                dispatch(setInvoice(params?.row?.id));
                handleOpen(VIEW, params?.row?.id);
              }}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              aria-label={EDIT}
              size="large"
              onClick={() => {
                dispatch(setInvoice(params?.row?.id));
                handleOpen(EDIT, params?.row?.id);
              }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton
              aria-label="download invoice"
              size="large"
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
