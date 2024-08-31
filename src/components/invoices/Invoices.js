import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";
import { collection, getDocs } from "firebase/firestore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import {
  firebaseDateToISOString,
  formatDate,
  getDaysDiff,
  indianCurrencyFormatter,
  isMobile
} from "utils/utilites";
import routes from "routes/routes";
import { db } from "integrations/firebase";
import Loader from "components/common/Loader";
import ClickNew from "components/common/ClickNew";
import TitleBanner from "components/common/TitleBanner";
import { setProducts } from "store/slices/productsSlice";
import { setCustomers } from "store/slices/customersSlice";
import { MODES, FIREBASE_COLLECTIONS } from "utils/constants";
import { deleteDocFromFirestore } from "integrations/firestoreHelpers";
import { deleteInvoice, setInvoice, setInvoices } from "store/slices/invoicesSlice";
import commonStyles from "utils/commonStyles";

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

  const { INVOICE_NEW, INVOICE_VIEW, INVOICE_EDIT } = routes;
  const { VIEW, EDIT } = MODES;
  const { INVOICES, PRODUCTS, CUSTOMERS } = FIREBASE_COLLECTIONS;
  const { invoices = [] } = useSelector((state) => state?.invoices);
  const { products = [] } = useSelector((state) => state?.products);
  const { customers = [] } = useSelector((state) => state?.customers);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const invoicesCollectionRef = collection(db, INVOICES);
  const productsCollectionRef = collection(db, PRODUCTS);
  const customersCollectionRef = collection(db, CUSTOMERS);

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

  // Serialize the TimeStamp data
  const serializeTimeStampData = (value) => {
    if (value && (value instanceof Date || typeof value.toDate === "function"))
      return firebaseDateToISOString(value);
    return value;
  };

  // Serialize the data
  const serializeData = (obj) => {
    const modifiedData = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (key === "updatedAt")
        modifiedData.updatedAt = value?.map((timeStamp) => serializeTimeStampData(timeStamp));
      // Serialize firebase timestamp data otherwise return value
      else modifiedData[key] = serializeTimeStampData(value);
    });
    return modifiedData;
  };

  // Serialize the Invoice data
  const serializeInvoiceData = (productArray, customerArray, invoiceArray) => {
    const serializedInvoices = [];

    invoiceArray.forEach((invoice) => {
      const modifiedData = {};
      Object.entries(invoice).forEach(([key, value]) => {
        // Serialize firebase products reference data
        if (key === "products") {
          const modifiedProducts = value?.map((product) => ({
            ...product,
            productName: productArray.filter((p) => p?.id === product?.productName?.id)?.[0]
          }));
          modifiedData.products = modifiedProducts;
        }
        // Serialize firebase customers reference data
        else if (key === "customer") {
          const customer = customerArray.filter((c) => c?.id === value?.id)?.[0];
          modifiedData.customer = customer;
          modifiedData.customerName = { id: customer?.id, ...customer?.name };
        } else if (key === "updatedAt")
          modifiedData.updatedAt = value?.map((timeStamp) => serializeTimeStampData(timeStamp));
        // Serialize firebase timestamp data otherwise return value
        else modifiedData[key] = serializeTimeStampData(value);
      });
      serializedInvoices.push(modifiedData);
    });

    dispatch(setInvoices(serializedInvoices));
    setLoader(false);
  };

  // fetch data
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const fetchData = async () => {
      try {
        // Function to get all products
        const fetchedProducts = [...products];

        if (!(fetchedProducts && Array.isArray(fetchedProducts) && fetchedProducts.length > 0)) {
          console.warn("<< fetching products >>");
          setLoader(true);
          await getDocs(productsCollectionRef)
            .then((querySnapshot) => querySnapshot.docs)
            .then((docs) => {
              docs.forEach((d) => fetchedProducts.push({ ...serializeData(d.data()), id: d?.id }));
              dispatch(setProducts(fetchedProducts));
              setLoader(false);
            });
        }

        // Function to get all customers
        const fetchedCustomers = [...customers];

        if (!(fetchedCustomers && Array.isArray(fetchedCustomers) && fetchedCustomers.length > 0)) {
          console.warn("<< fetching customers >>");
          setLoader(true);
          await getDocs(customersCollectionRef)
            .then((querySnapshot) => querySnapshot.docs)
            .then((docs) => {
              docs.forEach((d) => fetchedCustomers.push({ ...serializeData(d.data()), id: d?.id }));
              dispatch(setCustomers(fetchedCustomers));
              setLoader(false);
            });
        }

        // Function to get all invoices
        if (
          !(invoices && Array.isArray(invoices) && invoices.length > 0) &&
          fetchedProducts &&
          Array.isArray(fetchedProducts) &&
          fetchedProducts.length > 0 &&
          fetchedCustomers &&
          Array.isArray(fetchedCustomers) &&
          fetchedCustomers.length > 0
        ) {
          setLoader(true);
          console.warn("<< fetching invoices >>");
          await getDocs(invoicesCollectionRef)
            .then((querySnapshot) => querySnapshot.docs)
            .then((docs) => {
              const fetchedInvoices = docs.map((d) => ({ ...d.data(), id: d?.id }));
              serializeInvoiceData(fetchedProducts, fetchedCustomers, fetchedInvoices);
            });
        }
      } catch (err) {
        console.error(err);
        setLoader(false);
      }
    };

    fetchData();
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
              onClick={() =>
                deleteDocFromFirestore(params?.row, INVOICES, setLoader, dispatch, deleteInvoice)
              }>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton
              size="large"
              disabled={isLoading}
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
      {isLoading && <Loader height="calc(100vh - 50px)" />}

      <TitleBanner page="INVOICES" Icon={ReceiptLongIcon} />

      <Box sx={styles.box}>
        <Button
          variant="contained"
          disabled={isLoading}
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
