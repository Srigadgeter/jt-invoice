import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { useFormik } from "formik";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import routes from "routes/routes";
import commonStyles from "utils/commonStyles";
import invoiceSchema from "validationSchemas/invoiceSchema";
import { generateKeyValuePair, indianCurrencyFormatter, isMobile, NowInUTC } from "utils/utilites";
import { MODES, PAGE_INFO, INVOICE_STATUS, GST_PERCENTAGE } from "utils/constants";
import {
  addInvoice,
  editInvoice,
  removeExtra,
  removeProduct,
  setInvoice,
  setPageMode
} from "store/slices/invoicesSlice";
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
  },
  ...commonStyles
};

const customerList = [
  { value: "abcd-pvt-ltd", label: "ABCD Pvt Ltd" },
  { value: "abc-&-co", label: "ABC & Co" },
  { value: "sriniwas-&-co", label: "Sriniwas & Co" }
];

const logisticsList = [
  { value: "mss", label: "MSS" },
  { value: "velan", label: "Velan" }
];

const transportDestinationList = [
  { value: "namakkal", label: "Namakkal" },
  { value: "vellore", label: "Vellore" }
];

const INITIAL_VALUES = {
  invoiceDate: NowInUTC,
  baleCount: 0,
  paymentStatus: INVOICE_STATUS.UNPAID,
  paymentDate: "",
  lrNum: "",
  lrDate: NowInUTC,
  logistics: { value: "", label: "" },
  newLogistics: "",
  transportDestination: { value: "", label: "" },
  newTransportDestination: "",
  customerName: "",
  newCustomerName: "",
  newCustomerGSTNumber: "",
  newCustomerPhoneNumber: "",
  newCustomerAddress: ""
};

const Invoice = () => {
  const { HOME, INVOICE_EDIT } = routes;
  const { INVOICE } = PAGE_INFO;
  const {
    pageMode = "",
    newInvoice = {},
    selectedInvoice = {},
    selectedInvoiceInitialValue = {}
  } = useSelector((state) => state.invoices);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [selectedExtraIndex, setSelectedExtraIndex] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { invoiceNumber = "" } = useParams();
  const { NEW, VIEW, EDIT } = MODES;

  const { pathname } = location;
  const currentPageData = pathname.includes(NEW) ? newInvoice : selectedInvoice;

  const isViewMode = pageMode === MODES.VIEW;
  const isNewMode = pageMode === MODES.NEW;
  const isEditMode = pageMode === MODES.EDIT;

  const handleBack = () => navigate(HOME.to());

  const {
    dirty,
    values,
    errors,
    touched,
    isValid,
    resetForm,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useFormik({
    enableReinitialize: true,
    initialValues: isNewMode ? INITIAL_VALUES : currentPageData,
    validationSchema: invoiceSchema,
    onSubmit: async (val) => {
      try {
        // trim & frame the form values
        const formValues = {};
        Object.entries(val).forEach(([key, value]) => {
          if (value) formValues[key] = value;
        });

        if (val?.newLogistics) formValues.logistics = generateKeyValuePair(val?.newLogistics);
        else formValues.logistics = val?.logistics;
        if (val?.newTransportDestination)
          formValues.transportDestination = generateKeyValuePair(val?.newTransportDestination);
        else formValues.transportDestination = val?.transportDestination;
        if (val?.newCustomerName)
          formValues.customerName = generateKeyValuePair(val?.newCustomerName);
        else formValues.customerName = val?.customerName;

        formValues.products = currentPageData?.products;
        if (!!currentPageData?.extras && currentPageData?.extras?.length > 0)
          formValues.extras = currentPageData?.extras;
        formValues.totalAmount = currentPageData?.totalAmount || 0;

        // add or update data to the store
        if (isNewMode) {
          formValues.createdAt = NowInUTC;
          await dispatch(addInvoice(formValues));
        }
        if (isEditMode) {
          formValues.updatedAt = [...(currentPageData?.updatedAt || []), NowInUTC];
          await dispatch(editInvoice(formValues));
        }

        // reset the form
        resetForm();

        // navigate back to invoices page
        handleBack();
      } catch (error) {
        console.error("error >>", error);
      }
    }
  });

  useEffect(() => {
    if (pathname.includes(NEW)) dispatch(setPageMode(NEW));
    else if (pathname.includes(EDIT)) dispatch(setPageMode(EDIT));
    else dispatch(setPageMode(VIEW));

    return () => {
      dispatch(setPageMode(""));
    };
  }, []);

  useEffect(() => {
    if (invoiceNumber) dispatch(setInvoice(invoiceNumber));
  }, [invoiceNumber]);

  const handleSwitchChange = ({ target: { name, checked } }) => {
    setValues({
      ...values,
      [name]: checked ? INVOICE_STATUS.PAID : INVOICE_STATUS.UNPAID,
      paymentDate: checked ? NowInUTC : ""
    });
  };

  const handleSelectChange = ({ target: { name, value } }, list) => {
    if (value === "") {
      setFieldValue(name, { label: "None", value: "" });
    } else if (value === "new") {
      setFieldValue(name, { label: "New", value: "new" });
    } else {
      const selectedOption = list.find((option) => option.value === value);
      setFieldValue(name, { label: selectedOption?.label, value: selectedOption?.value });
    }
  };

  const handleChangePageMode = (selectedMode) => {
    dispatch(setPageMode(selectedMode));
    navigate(INVOICE_EDIT.to(invoiceNumber));
  };

  // ----------------------------------------
  const [openAddEditProductModal, setOpenAddEditProductModal] = useState(false);

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
  const [openAddEditExtraModal, setOpenAddEditExtraModal] = useState(false);

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
    }
  ];

  if (!isViewMode) {
    productTableColumns.push({
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
    });

    extraTableColumns.push({
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
    });
  }

  const isPaid = values?.paymentStatus === INVOICE_STATUS.PAID;

  const areProductsUpdated =
    JSON.stringify(selectedInvoiceInitialValue?.products || []) !==
    JSON.stringify(currentPageData?.products || []);
  const areExtrasUpdated =
    JSON.stringify(selectedInvoiceInitialValue?.extras || []) !==
    JSON.stringify(currentPageData?.extras || []);

  const isSubmitEnabled =
    ((dirty && isValid) ||
      (isEditMode && !dirty && isValid && (areProductsUpdated || areExtrasUpdated)) ||
      (isEditMode && dirty && isValid && (areProductsUpdated || areExtrasUpdated))) &&
    !!currentPageData?.products &&
    currentPageData?.products?.length > 0;

  return (
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
          <Stack mb={3}>
            <Stack direction="row" alignItems="center" gap={1} mb={1}>
              <ReceiptLongIcon sx={styles.subHeading} />
              <Typography variant="h5" sx={styles.subHeading}>
                {INVOICE.invoiceDetails}
              </Typography>
            </Stack>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  id="invoiceDate"
                  name="invoiceDate"
                  label="Invoice Date"
                  margin="dense"
                  size="small"
                  type="date"
                  InputProps={{
                    startAdornment: " "
                  }}
                  disabled={isViewMode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.invoiceDate ?? ""}
                  helperText={touched?.invoiceDate && errors?.invoiceDate}
                  error={touched?.invoiceDate && Boolean(errors?.invoiceDate)}
                />
                <TextField
                  fullWidth
                  id="baleCount"
                  name="baleCount"
                  label="Number of Bales"
                  margin="dense"
                  size="small"
                  type="number"
                  disabled={isViewMode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.baleCount ?? 0}
                  helperText={touched?.baleCount && errors?.baleCount}
                  error={touched?.baleCount && Boolean(errors?.baleCount)}
                />
                {isPaid && (
                  <TextField
                    fullWidth
                    id="paymentDate"
                    name="paymentDate"
                    label="Payment Date"
                    margin="dense"
                    size="small"
                    type="date"
                    InputProps={{
                      startAdornment: " "
                    }}
                    disabled={isViewMode}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.paymentDate ?? ""}
                    helperText={touched?.paymentDate && errors?.paymentDate}
                    error={touched?.paymentDate && Boolean(errors?.paymentDate)}
                  />
                )}
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <Typography>Unpaid</Typography>
                  <Switch
                    id="paymentStatus"
                    name="paymentStatus"
                    disabled={isViewMode}
                    onChange={handleSwitchChange}
                    inputProps={{ "aria-label": "payment status" }}
                    checked={isPaid}
                  />
                  <Typography>Paid</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  id="lrNumber"
                  name="lrNumber"
                  label="LR Number"
                  margin="dense"
                  size="small"
                  disabled={isViewMode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.lrNumber?.toUpperCase() ?? ""}
                  helperText={touched?.lrNumber && errors?.lrNumber}
                  error={touched?.lrNumber && Boolean(errors?.lrNumber)}
                />
                <TextField
                  fullWidth
                  id="lrDate"
                  name="lrDate"
                  label="LR Date"
                  margin="dense"
                  size="small"
                  type="date"
                  InputProps={{
                    startAdornment: " "
                  }}
                  disabled={isViewMode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.lrDate ?? ""}
                  helperText={touched?.lrDate && errors?.lrDate}
                  error={touched?.lrDate && Boolean(errors?.lrDate)}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl
                  fullWidth
                  size="small"
                  margin="dense"
                  error={touched?.logistics && Boolean(errors?.logistics?.value)}>
                  <InputLabel id="logistics">Logistics</InputLabel>
                  <Select
                    id="logistics"
                    name="logistics"
                    label="Logistics"
                    onBlur={handleBlur}
                    disabled={isViewMode}
                    value={values?.logistics?.value ?? ""}
                    MenuProps={{ sx: styles.selectDropdownMenuStyle }}
                    onChange={(e) => handleSelectChange(e, logisticsList)}>
                    <MenuItem value="" sx={styles.selectDropdownNoneMenuItem}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="new" sx={styles.selectDropdownNewMenuItem}>
                      <em>New</em>
                    </MenuItem>
                    {logisticsList &&
                      Array.isArray(logisticsList) &&
                      logisticsList.map((item) => (
                        <MenuItem key={item?.value} value={item?.value}>
                          {item?.label}
                        </MenuItem>
                      ))}
                  </Select>
                  {touched?.logistics && Boolean(errors?.logistics?.value) && (
                    <FormHelperText
                      htmlFor="form-selector"
                      error={touched?.logistics && Boolean(errors?.logistics?.value)}>
                      {errors?.logistics?.value}
                    </FormHelperText>
                  )}
                </FormControl>
                {values?.logistics?.value === "new" && !isViewMode && (
                  <TextField
                    fullWidth
                    id="newLogistics"
                    name="newLogistics"
                    label="New Logistics"
                    margin="dense"
                    size="small"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.newLogistics ?? ""}
                    helperText={touched?.newLogistics && errors?.newLogistics}
                    error={touched?.newLogistics && Boolean(errors?.newLogistics)}
                  />
                )}
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl
                  fullWidth
                  size="small"
                  margin="dense"
                  error={
                    touched?.transportDestination && Boolean(errors?.transportDestination?.value)
                  }>
                  <InputLabel id="transportDestination">Transport Destination</InputLabel>
                  <Select
                    id="transportDestination"
                    name="transportDestination"
                    label="Transport Destination"
                    onBlur={handleBlur}
                    disabled={isViewMode}
                    value={values?.transportDestination?.value ?? ""}
                    MenuProps={{ sx: styles.selectDropdownMenuStyle }}
                    onChange={(e) => handleSelectChange(e, transportDestinationList)}>
                    <MenuItem value="" sx={styles.selectDropdownNoneMenuItem}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="new" sx={styles.selectDropdownNewMenuItem}>
                      <em>New</em>
                    </MenuItem>
                    {transportDestinationList &&
                      Array.isArray(transportDestinationList) &&
                      transportDestinationList.map((item) => (
                        <MenuItem key={item?.value} value={item?.value}>
                          {item?.label}
                        </MenuItem>
                      ))}
                  </Select>
                  {touched?.transportDestination &&
                    Boolean(errors?.transportDestination?.value) && (
                      <FormHelperText
                        htmlFor="form-selector"
                        error={
                          touched?.transportDestination &&
                          Boolean(errors?.transportDestination?.value)
                        }>
                        {errors?.transportDestination?.value}
                      </FormHelperText>
                    )}
                </FormControl>
                {values?.transportDestination?.value === "new" && !isViewMode && (
                  <TextField
                    fullWidth
                    id="newTransportDestination"
                    name="newTransportDestination"
                    label="New Transport Destination"
                    margin="dense"
                    size="small"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.newTransportDestination ?? ""}
                    helperText={touched?.newTransportDestination && errors?.newTransportDestination}
                    error={
                      touched?.newTransportDestination && Boolean(errors?.newTransportDestination)
                    }
                  />
                )}
              </Stack>
            </Stack>
          </Stack>

          <Stack mb={3}>
            <Stack direction="row" alignItems="center" gap={1} mb={1}>
              <PersonIcon sx={styles.subHeading} />
              <Typography variant="h5" sx={styles.subHeading}>
                {INVOICE.customerDetails}
              </Typography>
            </Stack>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" spacing={2}>
                <FormControl
                  fullWidth
                  size="small"
                  margin="dense"
                  error={touched?.customerName && Boolean(errors?.customerName?.value)}>
                  <InputLabel id="customerName">Customer Name</InputLabel>
                  <Select
                    id="customerName"
                    name="customerName"
                    label="Customer Name"
                    onBlur={handleBlur}
                    disabled={isViewMode}
                    value={values?.customerName?.value ?? ""}
                    MenuProps={{ sx: styles.selectDropdownMenuStyle }}
                    onChange={(e) => handleSelectChange(e, customerList)}>
                    <MenuItem value="" sx={styles.selectDropdownNoneMenuItem}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="new" sx={styles.selectDropdownNewMenuItem}>
                      <em>New</em>
                    </MenuItem>
                    {customerList &&
                      Array.isArray(customerList) &&
                      customerList.map((item) => (
                        <MenuItem key={item?.value} value={item?.value}>
                          {item?.label}
                        </MenuItem>
                      ))}
                  </Select>
                  {touched?.customerName && Boolean(errors?.customerName?.value) && (
                    <FormHelperText
                      htmlFor="form-selector"
                      error={touched?.customerName && Boolean(errors?.customerName?.value)}>
                      {errors?.customerName?.value}
                    </FormHelperText>
                  )}
                </FormControl>
                {values?.customerName?.value === "new" && !isViewMode && (
                  <TextField
                    fullWidth
                    id="newCustomerName"
                    name="newCustomerName"
                    label="New Customer Name"
                    margin="dense"
                    size="small"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.newCustomerName ?? ""}
                    helperText={touched?.newCustomerName && errors?.newCustomerName}
                    error={touched?.newCustomerName && Boolean(errors?.newCustomerName)}
                  />
                )}
              </Stack>
              {values?.customerName?.value === "new" && !isViewMode && (
                <>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      id="newCustomerGSTNumber"
                      name="newCustomerGSTNumber"
                      label="GST Number of New Customer"
                      margin="dense"
                      size="small"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values?.newCustomerGSTNumber?.toUpperCase() ?? ""}
                      helperText={touched?.newCustomerGSTNumber && errors?.newCustomerGSTNumber}
                      error={touched?.newCustomerGSTNumber && Boolean(errors?.newCustomerGSTNumber)}
                    />
                    <TextField
                      fullWidth
                      type="tel"
                      id="newCustomerPhoneNumber"
                      name="newCustomerPhoneNumber"
                      label="Phone Number of New Customer"
                      margin="dense"
                      size="small"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values?.newCustomerPhoneNumber ?? ""}
                      helperText={touched?.newCustomerPhoneNumber && errors?.newCustomerPhoneNumber}
                      error={
                        touched?.newCustomerPhoneNumber && Boolean(errors?.newCustomerPhoneNumber)
                      }
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    id="newCustomerAddress"
                    name="newCustomerAddress"
                    label="Address of New Customer"
                    margin="dense"
                    size="small"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.newCustomerAddress ?? ""}
                    helperText={touched?.newCustomerAddress && errors?.newCustomerAddress}
                    error={touched?.newCustomerAddress && Boolean(errors?.newCustomerAddress)}
                  />
                </>
              )}
            </Stack>
          </Stack>

          <Stack mb={3}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Stack direction="row" alignItems="center" gap={1} mb={1}>
                <ShoppingBagIcon sx={styles.subHeading} />
                <Typography variant="h5" sx={styles.subHeading}>
                  {INVOICE.products}
                </Typography>
              </Stack>
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
              columns={productTableColumns}
              rows={currentPageData?.products || []}
              getRowId={(row) => row?.productName?.value}
            />
          </Stack>

          <Stack>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Stack direction="row" alignItems="center" gap={1} mb={1}>
                <ControlPointIcon sx={styles.subHeading} />
                <Typography variant="h5" sx={styles.subHeading}>
                  {INVOICE.extras}
                </Typography>
              </Stack>

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
              columns={extraTableColumns}
              rows={currentPageData?.extras || []}
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
            {indianCurrencyFormatter(currentPageData?.totalAmount || 0)}
          </Typography>
        </Stack>
        {!isViewMode && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            size={isMobile() ? "small" : "medium"}
            disabled={!isSubmitEnabled}>
            {isNewMode ? "Submit" : "Save"}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Invoice;
