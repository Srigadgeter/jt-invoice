/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
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
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { setInvoice, setViewMode } from "store/slices/invoicesSlice";
import { MODES, PAGE_INFO, INVOICE_STATUS } from "utils/constants";
import routes from "routes/routes";
import { isMobile } from "utils/utilites";

const styles = {
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
    mb: 5
  },
  paper2: {
    px: 2,
    pb: 2.5
  },
  paper3: {
    px: 2,
    pt: 2,
    pb: 2.5,
    my: 3
  },
  box: {
    my: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  floatingBtnContainer: {
    zIndex: 2,
    bottom: 0,
    position: "fixed",
    "& > :not(style)": {
      m: 1
    }
  },
  stack2: {
    width: "100%"
  }
};

const Invoice = () => {
  const { INVOICE } = PAGE_INFO;
  const { selectedInvoice = {} } = useSelector((state) => state.invoices);
  const [currentMode, setCurrentMode] = useState(MODES.VIEW);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [noOfBales, setNoOfBales] = useState(0);
  const [lrNum, setLrNum] = useState("");
  const [lrDate, setLrDate] = useState("");
  const [selectedLogistics, setSelectedLogistics] = useState("");
  const [newLogistics, setNewLogistics] = useState("");
  const [selectedTransportDestination, setSelectedTransportDestination] = useState("");
  const [newTransportDestination, setNewTransportDestination] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerGSTNumber, setNewCustomerGSTNumber] = useState("");
  const [newCustomerPhoneNumber, setNewCustomerPhoneNumber] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [status, setStatus] = useState(INVOICE_STATUS.UNPAID);
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

    if (pathname.includes(NEW)) {
      setCurrentMode(NEW);
      dispatch(setViewMode(NEW));
    } else if (pathname.includes(EDIT)) {
      setCurrentMode(EDIT);
      dispatch(setViewMode(EDIT));
    } else {
      setCurrentMode(VIEW);
      dispatch(setViewMode(VIEW));
    }
  }, []);

  useEffect(() => {
    console.log("selectedInvoice >>", selectedInvoice);
    const {
      products = [],
      invoiceNumber: invoiceNum,
      createdAt,
      customerName,
      status: currentStatus,
      noOfBales: baleCount,
      lrNumber,
      lrDate: lrd,
      totalAmount: tAmount
    } = selectedInvoice;
    console.log("products >>", products);
    if (invoiceNum) setInvoiceNo(invoiceNum);
    if (createdAt) setInvoiceDate(createdAt);
    if (customerName) setSelectedCustomerName(customerName);
    if (currentStatus) setStatus(currentStatus);
    if (baleCount) setNoOfBales(baleCount);
    if (lrNumber) setLrNum(lrNumber);
    if (lrd) setLrDate(lrd);
    if (tAmount) setTotalAmount(tAmount);
    if (products && Array.isArray(products) && products.length > 0) {
      setCurrentProducts(products);
      // const total = products.reduce(
      //   (sum, product) =>
      //     sum +
      //     (product.productQuantityPieces ?? 1) *
      //       (product.productQuantityMeters ?? 1) *
      //       (product.productRate ?? 1),
      //   0
      // );
    }
  }, [selectedInvoice]);

  const handleAdd = () => {
    const newProductObj = {
      productName: "",
      productQuantityPieces: null,
      productQuantityMeters: null,
      productRate: null
    };
    const allProducts = [...currentProducts];
    allProducts.push(newProductObj);
    setCurrentProducts(allProducts);
  };

  console.log("currentProducts >>", currentProducts);

  const handleTextFieldChange = ({ target: { id, value } }) => {
    console.log("textfield >>", id, value);
    if (id === "createdAt") setInvoiceDate(value);
    if (id === "noOfBales") setNoOfBales(value);
    if (id === "lrNumber") setLrNum(value);
    if (id === "lrDate") setLrDate(value);
  };

  const handleDropdownChange = () => {
    // console.log("select >>", id, value);
  };

  const handleSwitchChange = ({ target: { id, checked } }) => {
    console.log("switch >>", id, checked);
    setStatus(checked ? INVOICE_STATUS.PAID : INVOICE_STATUS.UNPAID);
  };

  const handleChangeMode = (selectedMode) => {
    setCurrentMode(selectedMode);
    dispatch(setViewMode(selectedMode));
    navigate(routes.INVOICE_EDIT.to(invoiceNumber));
  };

  const handleBack = () => navigate(routes.HOME.to());

  const handleRemoveItem = (itemIndex) => {
    const allProducts = [...currentProducts];
    allProducts.splice(itemIndex, 1);
    console.log("allProducts >>", allProducts);
    setCurrentProducts(allProducts);
    const currentTotal = allProducts.reduce(
      (total, product) =>
        total +
        (product.productQuantityPieces ?? 1) *
          (product.productQuantityMeters ?? 1) *
          (product.productRate ?? 1),
      0
    );
    setTotalAmount(currentTotal);
    console.log("currentTotal >>", currentTotal);
  };

  const isViewMode = currentMode === MODES.VIEW;
  const isNewMode = currentMode === MODES.NEW;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={styles.headerStack}>
        <Typography variant="h4">{INVOICE.title}</Typography>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          {isViewMode && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => handleChangeMode(EDIT)}
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

      <Box px={3}>
        <Paper elevation={5} sx={styles.paper}>
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
                value={noOfBales}
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
                value={lrNum}
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
                value={lrDate}
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
                  checked={status === INVOICE_STATUS.PAID}
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

        <Paper elevation={5} sx={styles.paper2}>
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

        {!isViewMode && (
          <Box sx={styles.floatingBtnContainer}>
            <Fab size="medium" color="primary" aria-label="add" onClick={() => handleAdd()}>
              <AddIcon />
            </Fab>
          </Box>
        )}

        {currentProducts.map((product, index) => (
          <Paper elevation={5} sx={styles.paper3} key={`product-no-${index + 1}`}>
            <Stack direction="row" alignItems="center">
              <Stack direction="column" alignItems="center" sx={styles.stack2}>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <Typography variant="h6">Product {index + 1}</Typography>
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <FormControl fullWidth size="small" margin="dense">
                      <InputLabel id="productName">Product Name</InputLabel>
                      <Select
                        id="productName"
                        labelId="productName"
                        value=""
                        label="Product Name"
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
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        id="newproductName"
                        label="New product Name"
                        margin="dense"
                        size="small"
                      />
                    </Grid>
                  )}
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      id="productQuantityPieces"
                      label="Product Quantity"
                      margin="dense"
                      size="small"
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="start">Pcs</InputAdornment>
                      }}
                      value={product.productQuantityPieces ?? ""}
                      disabled={isViewMode}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      id="productQuantityMeters"
                      label="Product Quantity"
                      margin="dense"
                      size="small"
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="start">Mtrs</InputAdornment>
                      }}
                      value={product.productQuantityMeters ?? ""}
                      disabled={isViewMode}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      id="productRate"
                      label="Product Rate"
                      margin="dense"
                      size="small"
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>
                      }}
                      value={product.productRate ?? ""}
                      disabled={isViewMode}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      id="productAmount"
                      label="Amount"
                      margin="dense"
                      size="small"
                      type="number"
                      disabled={isViewMode}
                      InputProps={{
                        readOnly: !isViewMode,
                        startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>
                      }}
                      value={
                        product.productQuantityPieces !== null || product.productQuantityMeters
                          ? (product.productQuantityPieces ?? 1) *
                            (product.productQuantityMeters ?? 1) *
                            (product.productRate ?? 1)
                          : 0
                      }
                    />
                  </Grid>
                </Grid>
              </Stack>
              {!isViewMode && (
                <IconButton aria-label="delete" onClick={() => handleRemoveItem(index)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
          </Paper>
        ))}

        <Box sx={styles.box}>
          <Typography variant="h5">Total Amount: &nbsp;</Typography>
          <Typography variant="h4">&#8377; {totalAmount}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Invoice;
