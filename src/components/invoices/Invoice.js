/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { setInvoice, setViewMode } from "store/slices/invoicesSlice";
import { MODES, PAGE_INFO } from "utils/constants";

const styles = {
  paper: {
    px: 2,
    pb: 2.5,
    mb: 5
  },
  paper2: {
    px: 2,
    pb: 2.5
  },
  box: {
    mt: 1,
    mb: 3,
    display: "flex",
    justifyContent: "flex-end"
  }
};

const Invoice = () => {
  const { INVOICE } = PAGE_INFO;
  const { selectedInvoice = {} } = useSelector((state) => state.invoices);
  const [currentProducts, setCurrentProducts] = useState([]);

  const dispatch = useDispatch();
  const location = useLocation();
  const { invoiceNumber = "" } = useParams();

  useEffect(() => {
    console.log("invoiceNo >>", invoiceNumber);
    if (invoiceNumber) dispatch(setInvoice(invoiceNumber));

    const { NEW, VIEW, EDIT } = MODES;
    const { pathname } = location;
    if (pathname.includes(NEW)) dispatch(setViewMode(NEW));
    else if (pathname.includes(EDIT)) dispatch(setViewMode(EDIT));
    else dispatch(setViewMode(VIEW));
  }, []);

  useEffect(() => {
    console.log("selectedInvoice >>", selectedInvoice);
    const { products = [] } = selectedInvoice;
    console.log("products >>", products);
    if (products && Array.isArray(products) && products.length > 0) setCurrentProducts(products);
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

  return (
    <Box px={3}>
      <Typography variant="h4" mb={2}>
        {INVOICE.title}
      </Typography>

      <Paper elevation={5} sx={styles.paper}>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <TextField
              disabled
              fullWidth
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
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              id="baleNumbers"
              label="Bale Numbers"
              margin="dense"
              size="small"
              type="number"
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField fullWidth id="lrNumber" label="LR Number" margin="dense" size="small" />
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
            />
          </Grid>
          <Grid item md={3} xs={12}>
            {/* switch for payment status (paid/unpaid) */}
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
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="ten">Ten</MenuItem>
                <MenuItem value="new">New</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              id="newLogistics"
              label="New Logistics"
              margin="dense"
              size="small"
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel id="transportDestination">Transport Destination</InputLabel>
              <Select
                id="transportDestination"
                labelId="transportDestination"
                value=""
                label="Transport Destination"
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
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              id="newTransportDestination"
              label="New Transport Destination"
              margin="dense"
              size="small"
            />
          </Grid>
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
        </Grid>
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
      </Paper>

      <Box sx={styles.box}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleAdd()}>
          Add
        </Button>
      </Box>

      {currentProducts.map((item, index) => (
        <Paper elevation={5} sx={styles.paper} key={`product-no-${index + 1}`}>
          <Grid container spacing={2}>
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
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                id="newproductName"
                label="New product Name"
                margin="dense"
                size="small"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                id="productQuantityPieces"
                label="Product Quantity (In Pieces)"
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                id="productQuantityMeters"
                label="Product Quantity (In Meters)"
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                id="productRate"
                label="Product Rate"
                margin="dense"
                size="small"
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default Invoice;
