/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Formik } from "formik";

import { removeExtra, removeProduct, setInvoice, setPageMode } from "store/slices/invoicesSlice";
import { MODES, PAGE_INFO, INVOICE_STATUS, GST_PERCENTAGE } from "utils/constants";
import routes from "routes/routes";
import { indianCurrencyFormatter, isMobile } from "utils/utilites";
import invoiceSchema from "validationSchemas/invoiceSchema";
import AddEditProductModal from "./AddEditProductModal";
import AddEditExtraModal from "./AddEditExtraModal";

const styles = {
  invoiceForm: {
    height: "calc(100vh - 155px)",
    overflowX: "hidden",
    overflowY: "overlay",
    scrollbarWidth: "7px",
    "::-webkit-scrollbar": {
      display: "block"
    }
  },
  headerStack: {
    py: 1,
    px: 3,
    zIndex: 2,
    top: "50px",
    position: "sticky",
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.background.custom : theme.palette.common.white
  },
  paper: {
    px: 2,
    pb: 2.5,
    mt: 3,
    mb: 2
  },
  subHeading: (theme) => ({
    color: theme.palette.grey[500]
  }),
  product: (theme) => ({
    p: 1,
    my: 0.5,
    borderRadius: 2,
    minWidth: "20%",
    width: "fit-content",
    border: `1px solid ${theme.palette.grey[500]}`
  }),
  box: {
    my: 1,
    gap: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  dataGrid: {
    ".MuiDataGrid-virtualScroller": {
      minHeight: "50px"
    }
  },
  footer: {
    py: 1,
    px: 3,
    zIndex: 2,
    bottom: 0,
    position: "sticky",
    boxShadow: (theme) =>
      `${
        theme.palette.mode === "dark" ? "rgb(231 231 249 / 60%)" : "rgba(100, 100, 111, 0.2)"
      } 0px 7px 29px 0px`,
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.background.custom : theme.palette.common.white
  }
};

const Invoice = () => {
  const { INVOICE } = PAGE_INFO;
  const {
    selectedInvoice = {},
    newInvoice = {},
    pageMode = ""
  } = useSelector((state) => state.invoices);

  const initialValues = {
    noOfBales: 0,
    lrNum: "",
    lrDate: ""
  };

  const [currentProducts, setCurrentProducts] = useState([]);
  const [currentExtras, setCurrentExtras] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [selectedLogistics, setSelectedLogistics] = useState("");
  const [newLogistics, setNewLogistics] = useState("");
  const [selectedTransportDestination, setSelectedTransportDestination] = useState("");
  const [newTransportDestination, setNewTransportDestination] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerGSTNumber, setNewCustomerGSTNumber] = useState("");
  const [newCustomerPhoneNumber, setNewCustomerPhoneNumber] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [selectedExtraIndex, setSelectedExtraIndex] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(INVOICE_STATUS.UNPAID);
  const [totalAmount, setTotalAmount] = useState(0);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { invoiceNumber = "" } = useParams();
  const { NEW, VIEW, EDIT } = MODES;

  useEffect(() => {
    console.log("invoiceNo >>", invoiceNumber);
    if (invoiceNumber) dispatch(setInvoice(invoiceNumber));

    const { pathname } = location;

    if (pathname.includes(NEW)) dispatch(setPageMode(NEW));
    else if (pathname.includes(EDIT)) dispatch(setPageMode(EDIT));
    else dispatch(setPageMode(VIEW));

    return () => {
      dispatch(setPageMode(""));
    };
  }, []);

  useEffect(() => {
    console.log("selectedInvoice >>", selectedInvoice);
    console.log("newInvoice >>", newInvoice);
    const {
      products = [],
      extras = [],
      invoiceNumber: invoiceNum = "",
      createdAt = "",
      customerName = "",
      status = "",
      noOfBales: baleCount = 0,
      lrNumber = "",
      lrDate: lrd = "",
      totalAmount: tAmount = 0
    } = newInvoice || selectedInvoice;
    console.log("products >>", products);
    if (invoiceNum) setInvoiceNo(invoiceNum);
    if (createdAt) setInvoiceDate(createdAt);
    if (customerName) setSelectedCustomerName(customerName);
    if (status) setCurrentStatus(status);
    // if (baleCount) setNoOfBales(baleCount);
    // if (lrNumber) setLrNum(lrNumber);
    // if (lrd) setLrDate(lrd);
    if (tAmount >= 0) setTotalAmount(tAmount);
    if (products && Array.isArray(products)) setCurrentProducts(products);
    if (extras && Array.isArray(extras)) setCurrentExtras(extras);
  }, [selectedInvoice, newInvoice]);

  console.log("currentProducts >>", currentProducts);

  const handleTextFieldChange = ({ target: { id, value } }) => {
    console.log("textfield >>", id, value);
    if (id === "createdAt") setInvoiceDate(value);
    // if (id === "noOfBales") setNoOfBales(value);
    // if (id === "lrNumber") setLrNum(value);
    // if (id === "lrDate") setLrDate(value);
  };

  const handleDropdownChange = () => {
    // console.log("select >>", id, value);
  };

  const handleSwitchChange = ({ target: { id, checked } }) => {
    console.log("switch >>", id, checked);
    setCurrentStatus(checked ? INVOICE_STATUS.PAID : INVOICE_STATUS.UNPAID);
  };

  const handleChangePageMode = (selectedMode) => {
    dispatch(setPageMode(selectedMode));
    navigate(routes.INVOICE_EDIT.to(invoiceNumber));
  };

  const handleBack = () => navigate(routes.HOME.to());

  useEffect(() => {
    // TODO: set total & totalincl.gst
  }, [currentProducts, currentExtras]);

  const isViewMode = pageMode === MODES.VIEW;
  const isNewMode = pageMode === MODES.NEW;

  // ----------------------------------------
  const [openAddEditProductModal, setOpenAddEditProductModal] = React.useState(false);

  const handleOpenAddEditProductModal = () => setOpenAddEditProductModal(true);

  const handleCloseAddEditProductModal = () => {
    setSelectedProduct(null);
    setSelectedProductIndex(null);
    setOpenAddEditProductModal(false);
  };

  const handleEditProduct = (product, itemIndex) => {
    setSelectedProduct(product);
    setSelectedProductIndex(itemIndex);
    handleOpenAddEditProductModal();
  };
  // ----------------------------------------
  // ----------------------------------------
  const [openAddEditExtraModal, setOpenAddEditExtraModal] = React.useState(false);

  const handleOpenAddEditExtraModal = () => setOpenAddEditExtraModal(true);

  const handleCloseAddEditExtraModal = () => {
    setSelectedExtra(null);
    setSelectedExtraIndex(null);
    setOpenAddEditExtraModal(false);
  };

  const handleEditExtra = (extra, itemIndex) => {
    setSelectedExtra(extra);
    setSelectedExtraIndex(itemIndex);
    handleOpenAddEditExtraModal();
  };
  // ----------------------------------------

  const productTableColumns = [
    {
      field: "sNo",
      headerName: "S No",
      sortable: false,
      width: 50,
      renderCell: (params) =>
        params.api.state.rows.dataRowIds.findIndex((id) => id === params.id) + 1
    },
    {
      field: "productName",
      headerName: "Product Name",
      sortable: false,
      flex: 1,
      valueFormatter: ({ value }) => value?.label
    },
    {
      field: "productQuantityPieces",
      headerName: "Quantity (Pcs)",
      sortable: false,
      type: "number",
      width: 120
    },
    {
      field: "productQuantityMeters",
      headerName: "Quantity (Mtrs)",
      sortable: false,
      type: "number",
      width: 120
    },
    {
      field: "productRate",
      headerName: "Rate",
      sortable: false,
      type: "number",
      width: 120,
      valueFormatter: ({ value }) => indianCurrencyFormatter(value)
    },
    {
      field: "productAmount",
      headerName: "Amount",
      sortable: false,
      type: "number",
      width: 120,
      valueFormatter: ({ value }) => indianCurrencyFormatter(value)
    },
    {
      field: "producGstAmount",
      headerName: `GST (${GST_PERCENTAGE}%)`,
      sortable: false,
      type: "number",
      width: 120,
      valueFormatter: ({ value }) => indianCurrencyFormatter(value)
    },
    {
      field: "productAmountInclGST",
      headerName: "Amount (Incl. GST)",
      sortable: false,
      type: "number",
      width: 190,
      renderCell: ({ value }) => (
        <Typography fontSize={15} fontWeight={600} color="primary.main">
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
          &nbsp; &nbsp; &nbsp;
          <Tooltip title="Edit">
            <IconButton
              aria-label={EDIT}
              size="large"
              onClick={() =>
                handleEditProduct(
                  params.row,
                  params.api.state.rows.dataRowIds.findIndex((id) => id === params.id)
                )
              }>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove">
            <IconButton
              aria-label="remove"
              size="large"
              onClick={() => dispatch(removeProduct(params.row))}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const extraTableColumns = [
    {
      field: "id",
      headerName: "S No",
      sortable: false,
      width: 50,
      renderCell: (params) =>
        params.api.state.rows.dataRowIds.findIndex((id) => id === params.id) + 1
    },
    {
      field: "reason",
      headerName: "Reason",
      sortable: false,
      flex: 1,
      valueFormatter: ({ value }) => value?.label
    },
    {
      field: "amount",
      headerName: "Amount",
      sortable: false,
      type: "number",
      width: 190,
      renderCell: ({ value }) => (
        <Typography fontSize={15} fontWeight={600} color="primary.main">
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
          &nbsp; &nbsp; &nbsp;
          <Tooltip title="Edit">
            <IconButton
              aria-label={EDIT}
              size="large"
              onClick={() =>
                handleEditExtra(
                  params.row,
                  params.api.state.rows.dataRowIds.findIndex((id) => id === params.id)
                )
              }>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove">
            <IconButton
              aria-label="remove"
              size="large"
              onClick={() => dispatch(removeExtra(params.row))}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={invoiceSchema}
      onSubmit={(values) => {
        console.log(values);
      }}>
      {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty }) => (
        <Box>
          <AddEditProductModal
            open={openAddEditProductModal}
            initialValues={selectedProduct}
            itemIndex={selectedProductIndex}
            handleClose={handleCloseAddEditProductModal}
          />
          <AddEditExtraModal
            open={openAddEditExtraModal}
            initialValues={selectedExtra}
            itemIndex={selectedExtraIndex}
            handleClose={handleCloseAddEditExtraModal}
          />
          <Stack direction="row" justifyContent="space-between" sx={styles.headerStack}>
            <Typography variant="h5" fontWeight="500">
              {isNewMode ? INVOICE.titleNew : isViewMode ? INVOICE.title : INVOICE.titleEdit}
            </Typography>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              {isViewMode && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => handleChangePageMode(EDIT)}
                  size={isMobile() ? "small" : "medium"}>
                  Edit
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={() => handleBack()}
                startIcon={<ArrowBackIosNewIcon />}
                size={isMobile() ? "small" : "medium"}>
                Back
              </Button>
            </Stack>
          </Stack>

          <Box sx={styles.invoiceForm}>
            <Box px={3} pb={5}>
              <Typography variant="h5" sx={styles.subHeading}>
                {INVOICE.invoiceDetails}
              </Typography>
              <Paper elevation={2} sx={styles.paper}>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      value={invoiceNo}
                      id="invoiceNumber"
                      label="Invoice Number"
                      margin="dense"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ReceiptLongIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      id="createdAt"
                      label="Invoice Date"
                      margin="dense"
                      size="small"
                      type="date"
                      InputProps={{
                        startAdornment: " "
                      }}
                      value={invoiceDate}
                      onChange={handleTextFieldChange}
                      disabled={isViewMode}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      id="noOfBales"
                      label="Nof of Bales"
                      margin="dense"
                      size="small"
                      type="number"
                      value={values?.noOfBales}
                      onChange={handleTextFieldChange}
                      disabled={isViewMode}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      id="lrNumber"
                      label="LR Number"
                      margin="dense"
                      size="small"
                      value={values?.lrNum}
                      onChange={handleTextFieldChange}
                      disabled={isViewMode}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      id="lrDate"
                      label="LR Date"
                      margin="dense"
                      size="small"
                      type="date"
                      InputProps={{
                        startAdornment: " "
                      }}
                      value={values?.lrDate}
                      onChange={handleTextFieldChange}
                      disabled={isViewMode}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    {/* switch for payment status (paid/unpaid) */}
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                      <Typography>Unpaid</Typography>
                      <Switch
                        onChange={handleSwitchChange}
                        inputProps={{ "aria-label": "status" }}
                        checked={currentStatus === INVOICE_STATUS.PAID}
                        disabled={isViewMode}
                      />
                      <Typography>Paid</Typography>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <FormControl fullWidth size="small" margin="dense">
                      <InputLabel id="logistics">Logistics</InputLabel>
                      <Select
                        id="logistics"
                        labelId="logistics"
                        value=""
                        label="Logistics"
                        //   onChange={handleChange}
                        disabled={isViewMode}>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="ten">Ten</MenuItem>
                        <MenuItem value="new">New</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {!isViewMode && (
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        id="newLogistics"
                        label="New Logistics"
                        margin="dense"
                        size="small"
                        disabled={isViewMode}
                      />
                    </Grid>
                  )}
                  <Grid item md={3} xs={12}>
                    <FormControl fullWidth size="small" margin="dense">
                      <InputLabel id="transportDestination">Transport Destination</InputLabel>
                      <Select
                        id="transportDestination"
                        labelId="transportDestination"
                        value=""
                        label="Transport Destination"
                        //   onChange={handleChange}
                        disabled={isViewMode}>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="ten">Ten</MenuItem>
                        <MenuItem value="new">New</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {!isViewMode && (
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        id="newTransportDestination"
                        label="New Transport Destination"
                        margin="dense"
                        size="small"
                        disabled={isViewMode}
                      />
                    </Grid>
                  )}
                </Grid>
              </Paper>
              <Typography variant="h5" sx={styles.subHeading}>
                {INVOICE.customerDetails}
              </Typography>
              <Paper elevation={2} sx={styles.paper}>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <FormControl fullWidth size="small" margin="dense">
                      <InputLabel id="customerName">Customer Name</InputLabel>
                      <Select
                        id="customerName"
                        labelId="customerName"
                        value=""
                        label="Customer Name"
                        //   onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="ten">Ten</MenuItem>
                        <MenuItem value="new">New</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {!isViewMode && (
                    <>
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          id="newCustomerName"
                          label="New Customer Name"
                          margin="dense"
                          size="small"
                        />
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          id="newCustomerGSTNumber"
                          label="New Customer GST Number"
                          margin="dense"
                          size="small"
                        />
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          id="newCustomerPhoneNumber"
                          label="New Customer Phone Number"
                          margin="dense"
                          size="small"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                {!isViewMode && (
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        id="newCustomerAddress"
                        label="New Customer Address"
                        margin="dense"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                )}
              </Paper>
              <Stack mb={2}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="h5" sx={styles.subHeading}>
                    {INVOICE.products}
                  </Typography>

                  {!isViewMode && (
                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      size={isMobile() ? "small" : "medium"}
                      onClick={() => handleOpenAddEditProductModal()}>
                      Add &nbsp; Product
                    </Button>
                  )}
                </Stack>
                <DataGrid
                  hideFooter
                  disableColumnMenu
                  sx={styles.dataGrid}
                  rows={currentProducts}
                  columns={productTableColumns}
                  getRowId={(row) => row?.productName?.value}
                />
              </Stack>
              <Stack>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="h5" sx={styles.subHeading}>
                    {INVOICE.extras}
                  </Typography>

                  {!isViewMode && (
                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      size={isMobile() ? "small" : "medium"}
                      onClick={() => handleOpenAddEditExtraModal()}>
                      Add &nbsp; Extra
                    </Button>
                  )}
                </Stack>
                <DataGrid
                  hideFooter
                  disableColumnMenu
                  sx={styles.dataGrid}
                  rows={currentExtras}
                  columns={extraTableColumns}
                  getRowId={(row) => row?.reason?.value}
                />
              </Stack>
            </Box>
          </Box>

          <Stack
            gap={5}
            direction="row"
            sx={styles.footer}
            alignItems="center"
            justifyContent="flex-end">
            <Stack gap={2} direction="row" alignItems="center">
              <Typography variant="h6">Total Amount</Typography>
              <Typography fontSize={24} fontWeight={700}>
                {indianCurrencyFormatter(totalAmount)}
              </Typography>
            </Stack>
            {!isViewMode && (
              <Button
                variant="contained"
                onClick={handleSubmit}
                size={isMobile() ? "small" : "medium"}>
                {isNewMode ? "Submit" : "Save"}
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Formik>
  );
};

export default Invoice;
