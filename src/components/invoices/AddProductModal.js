import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";

import AppModal from "components/common/AppModal";
import { isMobile, trimString } from "utils/utilites";
import addProductSchema from "validationSchemas/addProductSchema";

const styles = {
  fullWidth: {
    width: "100%"
  },
  amount: {
    fontWeight: 400
  }
};

const AddProductModal = ({ open, handleClose }) => {
  const [amount, setAmount] = useState(0);
  const initialValues = {
    productName: "",
    newProductName: "",
    productQuantityPieces: null,
    productQuantityMeters: null,
    productRate: null
  };

  const {
    dirty,
    values,
    errors,
    touched,
    isValid,
    resetForm,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useFormik({
    initialValues,
    validationSchema: addProductSchema,
    onSubmit: (val) => {
      // trim the values
      const formValues = {};
      Object.entries(val).forEach(([key, value]) => {
        formValues[key] = trimString(value);
      });

      // >>> TODO; API call - create new product if newProductName has value <<<
      // >>> TODO; add product to redux store <<<

      // reset the form
      resetForm();

      // close the modal
      handleClose();
    }
  });

  useEffect(() => {
    let amt = 0;
    if (Object.keys(values).length > 0) {
      if (!(errors?.productQuantityPieces || errors?.productQuantityMeters || errors.productRate)) {
        amt =
          (values?.productQuantityPieces ?? 1) *
          (values?.productQuantityMeters ?? 1) *
          values.productRate;
      }
    }

    setAmount(parseFloat(amt.toFixed(2)));
  }, [values, errors]);

  const handleCancel = () => {
    // reset the form
    resetForm();

    // close the modal
    handleClose();
  };

  const handleSelectChange = ({ target: { name, value } }) => {
    setFieldValue(name, value);
  };

  const footerContent = () => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={1}>
        <Typography variant="h6" style={styles.amount}>
          Amount:
        </Typography>
        <Typography variant="h6" style={styles.amount}>
          Rs. {amount}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={handleCancel}
          size={isMobile() ? "small" : "medium"}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<DoneIcon />}
          onClick={handleSubmit}
          disabled={!(dirty && isValid)}
          size={isMobile() ? "small" : "medium"}>
          Save
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <AppModal
      open={open}
      title="Add Product"
      handleClose={handleCancel}
      footer={footerContent(values, isValid, dirty, handleSubmit)}>
      <Stack direction="column" spacing={2} sx={styles.fullWidth}>
        <Stack direction="row" spacing={2} sx={styles.fullWidth}>
          <FormControl
            fullWidth
            size="small"
            margin="dense"
            error={touched?.productName && Boolean(errors?.productName)}>
            <InputLabel id="productName">Product Name</InputLabel>
            <Select
              id="productName"
              name="productName"
              label="Product Name"
              onBlur={handleBlur}
              onChange={handleSelectChange}
              value={values?.productName ?? ""}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="ten">Ten</MenuItem>
              <MenuItem value="new">New</MenuItem>
            </Select>
            {touched?.productName && Boolean(errors?.productName) && (
              <FormHelperText
                htmlFor="form-selector"
                error={touched?.productName && Boolean(errors?.productName)}>
                {errors?.productName}
              </FormHelperText>
            )}
          </FormControl>
          {values?.productName === "new" && (
            <TextField
              fullWidth
              id="newProductName"
              name="newProductName"
              label="New product Name"
              margin="dense"
              size="small"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values?.newProductName ?? ""}
              helperText={touched?.newProductName && errors?.newProductName}
              error={touched?.newProductName && Boolean(errors?.newProductName)}
            />
          )}
        </Stack>
        <TextField
          fullWidth
          id="productQuantityPieces"
          name="productQuantityPieces"
          label="Product Quantity"
          margin="dense"
          size="small"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="start">Pcs</InputAdornment>
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values?.productQuantityPieces ?? ""}
          helperText={
            touched?.productQuantityPieces &&
            (errors?.productQuantityPieces || errors?.atLeastOneFilled)
          }
          error={
            touched?.productQuantityPieces &&
            Boolean(errors?.productQuantityPieces || errors?.atLeastOneFilled)
          }
        />
        <TextField
          fullWidth
          id="productQuantityMeters"
          name="productQuantityMeters"
          label="Product Quantity"
          margin="dense"
          size="small"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="start">Mtrs</InputAdornment>
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values?.productQuantityMeters ?? ""}
          helperText={
            touched?.productQuantityMeters &&
            (errors?.productQuantityMeters || errors?.atLeastOneFilled)
          }
          error={
            touched?.productQuantityMeters &&
            Boolean(errors?.productQuantityMeters || errors?.atLeastOneFilled)
          }
        />
        <TextField
          fullWidth
          id="productRate"
          name="productRate"
          label="Product Rate"
          margin="dense"
          size="small"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values?.productRate ?? ""}
          helperText={touched?.productRate && errors?.productRate}
          error={touched?.productRate && Boolean(errors?.productRate)}
        />
      </Stack>
    </AppModal>
  );
};

export default AddProductModal;
