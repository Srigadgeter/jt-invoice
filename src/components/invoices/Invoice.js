import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import FormHelperText from "@mui/material/FormHelperText";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { collection, doc, writeBatch } from "firebase/firestore";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  formatDateForInputField,
  formatDateToISOString,
  generateKeyValuePair,
  getFY,
  getNewInvoiceNumber,
  getNow,
  indianCurrencyFormatter,
  isMobile,
  sortByStringProperty
} from "utils/utilites";
import {
  MODES,
  PAGE_INFO,
  INVOICE_STATUS,
  GST_PERCENTAGE,
  FIREBASE_COLLECTIONS,
  RECORDS_LIMIT_COUNT
} from "utils/constants";
import routes from "routes/routes";
import {
  addInvoice,
  editInvoice,
  removeExtra,
  removeProduct,
  resetInvoiceValues,
  setInvoice,
  setPageMode
} from "store/slices/invoicesSlice";
import { db } from "integrations/firebase";
import Loader from "components/common/Loader";
import commonStyles from "utils/commonStyles";
import { addProduct } from "store/slices/productsSlice";
import { addCustomer } from "store/slices/customersSlice";
import invoiceSchema from "validationSchemas/invoiceSchema";
import { addNotification } from "store/slices/notificationsSlice";
import CustomDataGridFooter from "components/common/CustomDataGridFooter";
import { addDocToFirestore, editDocInFirestore } from "integrations/firestoreHelpers";

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
    ...(commonStyles?.dataGridHeader || {}),
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
  selectDropdownMenuStyle: commonStyles?.selectDropdownMenuStyle || {},
  selectDropdownNoneMenuItem: commonStyles?.selectDropdownNoneMenuItem || {},
  selectDropdownNewMenuItem: commonStyles?.selectDropdownNewMenuItem || {}
};

const Invoice = () => {
  const { INVOICES: INVOICE_ROUTE, INVOICE_EDIT } = routes;
  const { INVOICE } = PAGE_INFO;
  const {
    pageMode = "",
    invoices = [],
    newInvoice = {},
    logisticsList = [],
    selectedInvoice = {},
    transportDestinationList = [],
    selectedInvoiceInitialValue = {}
  } = useSelector((state) => state?.invoices);
  const { customers } = useSelector((state) => state?.customers);

  // INITIAL_VALUES constant placed here in order to get new datatime value for invoiceDate & lrDate fields
  // when user frequently creates multiple invoice
  const INITIAL_VALUES = {
    invoiceDate: getNow(),
    baleCount: 0,
    paymentStatus: INVOICE_STATUS.UNPAID,
    paymentDate: null,
    lrNum: "",
    lrDate: getNow(),
    logistics: { value: "", label: "" },
    newLogistics: "",
    transportDestination: { value: "", label: "" },
    newTransportDestination: "",
    customerName: { value: "", label: "" },
    newCustomerName: "",
    newCustomerGSTNumber: "",
    newCustomerPhoneNumber: "",
    newCustomerAddress: ""
  };

  // Storing the formik initial value & using as state value in order to avoid the form becomes unresponsive or inaccessible
  const [initialValues, setInitialValues] = useState(INITIAL_VALUES);
  const [isLoading, setLoader] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [selectedExtraIndex, setSelectedExtraIndex] = useState(null);

  const initialValuesRef = useRef(false);

  const { INVOICES, PRODUCTS, CUSTOMERS } = FIREBASE_COLLECTIONS;
  const invoicesCollectionRef = collection(db, INVOICES);
  const productsCollectionRef = collection(db, PRODUCTS);
  const customersCollectionRef = collection(db, CUSTOMERS);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { startYear = "", endYear = "", invoiceId = "" } = useParams();
  const { NEW, VIEW, EDIT } = MODES;

  const { pathname } = location;
  const currentPageData = pathname.includes(NEW) ? newInvoice : selectedInvoice;

  const isViewMode = pageMode === MODES.VIEW;
  const isNewMode = pageMode === MODES.NEW;
  const isEditMode = pageMode === MODES.EDIT;

  const tempCustomerList = customers.map((item) => ({ ...item?.name, address: item?.address }));
  const customerList = sortByStringProperty(tempCustomerList, "value");

  const handleBack = () =>
    navigate(
      INVOICE_ROUTE.to(currentPageData?.startYear || startYear, currentPageData?.endYear || endYear)
    );

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
    initialValues,
    enableReinitialize: true,
    validationSchema: invoiceSchema,
    onSubmit: async (val, { setErrors }) => {
      // setting loader true
      setLoader(true);

      try {
        // frame the form values
        const formValues = {};
        const customerFormValues = {};
        Object.entries(val).forEach(([key, value]) => {
          if (
            value &&
            !key.toLowerCase().includes("new") &&
            !key.toLowerCase().includes("customer")
          ) {
            if (!isEditMode && key.toLowerCase().includes("date"))
              formValues[key] = formatDateToISOString(value);
            else formValues[key] = value;
          }
        });

        if (val?.logistics?.value === "new" && val?.newLogistics) {
          const logisticsData = generateKeyValuePair(val?.newLogistics);
          const isLogisticsAlreadyPresent = logisticsList.some(
            (item) => item?.value === logisticsData?.value
          );
          if (isLogisticsAlreadyPresent)
            throw new Error("newLogistics:This logistics name already exists");
          else formValues.logistics = logisticsData;
        } else formValues.logistics = val?.logistics;

        if (val?.transportDestination?.value === "new" && val?.newTransportDestination) {
          const transportDestinationData = generateKeyValuePair(val?.newTransportDestination);
          const isTransportDestinationAlreadyPresent = transportDestinationList.some(
            (item) => item?.value === transportDestinationData?.value
          );
          if (isTransportDestinationAlreadyPresent)
            throw new Error(
              "newTransportDestination:This transport destination name already exists"
            );
          else formValues.transportDestination = transportDestinationData;
        } else formValues.transportDestination = val?.transportDestination;

        let customerDocRef = null;
        if (val?.customerName?.value === "new" && val?.newCustomerName) {
          const customerNameData = generateKeyValuePair(val?.newCustomerName);
          const isCustomerNameAlreadyPresent = customerList.some(
            (item) =>
              item?.value === customerNameData?.value && item?.address === val?.newCustomerAddress
          );
          if (isCustomerNameAlreadyPresent)
            throw new Error(
              "newCustomerName:This customer name already exists with the same address"
            );
          else {
            customerFormValues.name = customerNameData;
            customerFormValues.address = val?.newCustomerAddress || null;
            customerFormValues.gstNumber = val?.newCustomerGSTNumber || null;
            customerFormValues.phoneNumber = val?.newCustomerPhoneNumber || null;
            customerFormValues.createdAt = getNow();
            customerFormValues.updatedAt = [];
          }
        } else {
          const existingCustomerData = customers.filter(
            (item) => item?.name?.value === val?.customerName?.value
          )?.[0];
          // fetching doc ref by id
          customerDocRef = doc(db, CUSTOMERS, existingCustomerData?.id);
          formValues.customer = existingCustomerData;
        }

        if (customerFormValues?.name) {
          const { docRef, id: customerId } = await addDocToFirestore(
            customersCollectionRef,
            customerFormValues,
            dispatch,
            `Successfully added a new customer, '${customerFormValues?.name?.label}'`,
            "There is an issue with adding the new customer"
          );

          if (customerId) {
            customerDocRef = docRef;
            const newCustomerObj = {
              ...customerFormValues,
              id: customerId
            };
            formValues.customer = newCustomerObj;
            await dispatch(addCustomer(newCustomerObj));
          }
        }

        const currentProducts = [];
        const currentProductsRef = [];
        const batch = writeBatch(db);
        let newFlag = false;

        currentPageData?.products.forEach(async (product) => {
          if (product?.productName?.id === "new") {
            newFlag = true;

            // creating the doc ref
            const docRef = doc(productsCollectionRef);

            const { id, ...payload } = product.productName;

            // mapping the ref with the data
            batch.set(docRef, payload);

            const productId = docRef?.id;
            if (productId) {
              currentProductsRef.push({
                ...product,
                productName: docRef
              });
              const newProductObj = {
                ...product,
                productName: {
                  ...payload,
                  id: productId
                }
              };
              currentProducts.push(newProductObj);
              await dispatch(addProduct(newProductObj?.productName));
            } else {
              const message = `There is an issue fetching id for the new product(s)`;
              dispatch(
                addNotification({
                  message
                })
              );
            }
          } else {
            // fetching doc ref by id
            const docRef = doc(db, PRODUCTS, product?.productName?.id);
            currentProductsRef.push({
              ...product,
              productName: docRef
            });
            currentProducts.push(product);
          }
        });

        if (newFlag) {
          try {
            // committing the batch of write operation
            await batch.commit();
            const message = `Successfully added new product(s)`;
            dispatch(
              addNotification({
                message,
                variant: "success"
              })
            );
          } catch (error) {
            console.error(error);
            const message = `There is an issue with adding the new product(s)`;
            dispatch(
              addNotification({
                message
              })
            );
          }
        }

        formValues.products = [...currentProducts];

        formValues.extras = [];
        if (!!currentPageData?.extras && currentPageData?.extras?.length > 0)
          formValues.extras = currentPageData?.extras;
        formValues.totalAmount = currentPageData?.totalAmount || 0;

        formValues.invoiceNumber = isEditMode
          ? currentPageData?.invoiceNumber
          : getNewInvoiceNumber(invoices);

        const { startYear: sYear, endYear: eYear } = getFY();
        formValues.startYear = isEditMode ? currentPageData?.startYear : sYear;
        formValues.endYear = isEditMode ? currentPageData?.endYear : eYear;

        formValues.createdAt = isEditMode ? currentPageData?.createdAt : getNow();
        formValues.updatedAt = isEditMode ? [...(currentPageData?.updatedAt || []), getNow()] : [];

        if (
          formValues?.products?.length > 0 &&
          formValues?.customer?.id &&
          currentProductsRef.length &&
          customerDocRef
        ) {
          const invoiceFirebasePayload = {
            ...formValues,
            products: [...currentProductsRef],
            customer: customerDocRef
          };

          formValues.customerName = {
            ...formValues?.customer?.name,
            id: formValues?.customer?.id
          };

          if (isNewMode) {
            // add or update data to the store
            const { id: invoiceDocId } = await addDocToFirestore(
              invoicesCollectionRef,
              invoiceFirebasePayload,
              dispatch,
              `Successfully added invoice '${formValues?.invoiceNumber}'`,
              "There is an issue with adding the new invoice"
            );

            if (invoiceDocId) {
              formValues.id = invoiceDocId;
            }

            await dispatch(addInvoice(formValues));
          }
          if (isEditMode) {
            await editDocInFirestore(
              INVOICES,
              invoiceFirebasePayload,
              dispatch,
              `Successfully updated invoice '${formValues?.invoiceNumber}'`,
              "There is an issue with updating the invoice"
            );

            await dispatch(editInvoice(formValues));
          }

          // setting loader false
          setLoader(false);

          // reset the form
          resetForm();

          // navigate back to invoices page
          handleBack();
        }
      } catch (error) {
        console.error(error);
        if (error?.message?.includes(":")) {
          const [key, value] = error.message.split(":");
          setErrors({
            [key]: value
          });
        }
      } finally {
        // setting loader false
        setLoader(false);
      }
    }
  });

  useEffect(() => {
    if (pathname.includes(NEW)) dispatch(setPageMode(NEW));
    else if (pathname.includes(EDIT)) dispatch(setPageMode(EDIT));
    else dispatch(setPageMode(VIEW));

    return () => {
      resetForm();
      dispatch(setPageMode(""));
      dispatch(resetInvoiceValues());
    };
  }, []);

  useEffect(() => {
    if (invoiceId) dispatch(setInvoice(invoiceId));
  }, [invoiceId]);

  useEffect(() => {
    if (!initialValuesRef.current) {
      if ((isViewMode || isEditMode) && selectedInvoice) {
        setInitialValues(selectedInvoice);
        initialValuesRef.current = true;
      } else if (isNewMode) {
        setInitialValues(INITIAL_VALUES);
        initialValuesRef.current = true;
      }
    }
  }, [isEditMode, isViewMode, isNewMode, selectedInvoice]);

  const handleSwitchChange = ({ target: { name, checked } }) => {
    setValues({
      ...values,
      [name]: checked ? INVOICE_STATUS.PAID : INVOICE_STATUS.UNPAID,
      paymentDate: checked ? getNow() : null
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
    navigate(INVOICE_EDIT.to(startYear, endYear, invoiceId));
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
        params.api.state.rows.dataRowIds.findIndex((id) => id === params?.id) + 1
    },
    {
      field: "productName",
      headerName: "Product Name",
      sortable: false,
      flex: 1,
      minWidth: 200,
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
        params.api.state.rows.dataRowIds.findIndex((id) => id === params?.id) + 1
    },
    {
      field: "reason",
      headerName: "Reason",
      sortable: false,
      flex: 1,
      minWidth: 200,
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
              size="large"
              aria-label={EDIT}
              disabled={isLoading}
              onClick={() =>
                handleEditProduct(
                  params?.row,
                  params?.api?.state?.rows?.dataRowIds.findIndex((id) => id === params?.id)
                )
              }>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove">
            <IconButton
              size="large"
              aria-label="remove"
              disabled={isLoading}
              onClick={() => dispatch(removeProduct(params?.row))}>
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
              size="large"
              aria-label={EDIT}
              disabled={isLoading}
              onClick={() =>
                handleEditExtra(
                  params?.row,
                  params?.api?.state?.rows?.dataRowIds.findIndex((id) => id === params?.id)
                )
              }>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove">
            <IconButton
              size="large"
              aria-label="remove"
              disabled={isLoading}
              onClick={() => dispatch(removeExtra(params?.row))}>
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
    currentPageData?.products?.length > 0 &&
    !isLoading;

  const totalEntriesCount =
    (currentPageData?.products?.length ?? 0) + (currentPageData?.extras?.length ?? 0);
  const disableAddProductExtraBtns = isLoading || totalEntriesCount >= RECORDS_LIMIT_COUNT;

  const { startYear: currentSY } = getFY();
  const isCurrentFY = Number(currentPageData.startYear) === Number(currentSY);

  return (
    <Box>
      {isLoading && <Loader height="100vh" />}
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
          {isNewMode ? INVOICE.titleNew : isViewMode ? INVOICE.title : INVOICE.titleEdit}{" "}
          {isNewMode ? null : `#${selectedInvoice?.invoiceNumber}`}
        </Typography>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          {isViewMode && isCurrentFY && (
            <Button
              variant="contained"
              disabled={isLoading}
              startIcon={<EditIcon />}
              size={isMobile() ? "small" : "medium"}
              onClick={() => handleChangePageMode(EDIT)}>
              Edit
            </Button>
          )}
          <Button
            variant="outlined"
            disabled={isLoading}
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
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={isViewMode || isLoading}
                  helperText={touched?.invoiceDate && errors?.invoiceDate}
                  error={touched?.invoiceDate && Boolean(errors?.invoiceDate)}
                  value={values?.invoiceDate ? formatDateForInputField(values?.invoiceDate) : ""}
                />
                <TextField
                  fullWidth
                  id="baleCount"
                  name="baleCount"
                  label="Number of Bales"
                  margin="dense"
                  size="small"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.baleCount ?? 0}
                  disabled={isViewMode || isLoading}
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
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={isViewMode || isLoading}
                    helperText={touched?.paymentDate && errors?.paymentDate}
                    error={touched?.paymentDate && Boolean(errors?.paymentDate)}
                    value={values?.paymentDate ? formatDateForInputField(values?.paymentDate) : ""}
                  />
                )}
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <Typography>Unpaid</Typography>
                  <Switch
                    checked={isPaid}
                    id="paymentStatus"
                    name="paymentStatus"
                    onChange={handleSwitchChange}
                    disabled={isViewMode || isLoading}
                    inputProps={{ "aria-label": "payment status" }}
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
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={isViewMode || isLoading}
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
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={isViewMode || isLoading}
                  helperText={touched?.lrDate && errors?.lrDate}
                  error={touched?.lrDate && Boolean(errors?.lrDate)}
                  value={values?.lrDate ? formatDateForInputField(values?.lrDate) : ""}
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
                    disabled={isViewMode || isLoading}
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
                    disabled={isLoading}
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
                    disabled={isViewMode || isLoading}
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
                    disabled={isLoading}
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
                    disabled={isViewMode || isLoading}
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
                          <strong>{item?.label}</strong>&nbsp;-&nbsp;
                          {item?.address}
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
                    disabled={isLoading}
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
                      disabled={isLoading}
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
                      label="Phone/Landline Number of New Customer"
                      margin="dense"
                      size="small"
                      onBlur={handleBlur}
                      disabled={isLoading}
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
                    disabled={isLoading}
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
                  disabled={disableAddProductExtraBtns}
                  size={isMobile() ? "small" : "medium"}
                  onClick={() => handleOpenAddEditProductModal()}>
                  Add &nbsp; Product
                </Button>
              )}
            </Stack>
            <DataGrid
              disableColumnMenu
              sx={styles.dataGrid}
              slots={{
                footer: CustomDataGridFooter
              }}
              slotProps={{
                footer: {
                  columns: productTableColumns,
                  rows: currentPageData?.products || []
                }
              }}
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
                  disabled={disableAddProductExtraBtns}
                  size={isMobile() ? "small" : "medium"}
                  onClick={() => handleOpenAddEditExtraModal()}>
                  Add &nbsp; Extra
                </Button>
              )}
            </Stack>
            <DataGrid
              disableColumnMenu
              sx={styles.dataGrid}
              slots={{
                footer: CustomDataGridFooter
              }}
              slotProps={{
                footer: {
                  columns: extraTableColumns,
                  rows: currentPageData?.extras || []
                }
              }}
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
            disabled={!isSubmitEnabled}
            size={isMobile() ? "small" : "medium"}>
            {isNewMode ? "Submit" : "Save"}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Invoice;
