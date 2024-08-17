import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
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

import commonStyles from "utils/commonStyles";
import AppModal from "components/common/AppModal";
import { GST_PERCENTAGE } from "utils/constants";
import { generateKeyValuePair, isMobile } from "utils/utilites";
import { addProduct, editProduct } from "store/slices/invoicesSlice";
import addEditProductSchema from "validationSchemas/addEditProductSchema";

const styles = {
  fullWidth: {
    width: "100%"
  },
  amount: {
    fontWeight: 400
  },
  ...commonStyles
};

const INITIAL_VALUES = {
  productName: { value: "", label: "" },
  newProductName: "",
  productQuantityPieces: null,
  productQuantityMeters: null,
  productRate: null
};

const AddEditProductModal = ({ open, handleClose, itemIndex = null, initialValues = null }) => {
  const [amount, setAmount] = useState(0);

  const dispatch = useDispatch();

  const { products: productList } = useSelector((state) => state?.products);

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
    enableReinitialize: true,
    initialValues: initialValues ?? INITIAL_VALUES,
    validationSchema: addEditProductSchema,
    onSubmit: async (val, { setErrors }) => {
      try {
        const gstAmount = parseFloat(((amount * GST_PERCENTAGE) / 100).toFixed(2));

        // trim & frame the form values
        const formValues = {
          productQuantityPieces: val?.productQuantityPieces,
          productQuantityMeters: val?.productQuantityMeters,
          productRate: val?.productRate,
          productAmount: amount,
          producGstAmount: gstAmount,
          productAmountInclGST: amount + gstAmount
        };
        if (val?.newProductName) formValues.productName = generateKeyValuePair(val?.newProductName);
        else formValues.productName = val?.productName;

        // add or update data to the store
        if (itemIndex === null) await dispatch(addProduct(formValues));
        else await dispatch(editProduct({ ...formValues, itemIndex }));

        // reset the form
        resetForm();

        // close the modal
        handleClose();
      } catch (error) {
        setErrors({
          productName: {
            value: error?.message
          }
        });
      }
    }
  });

  useEffect(() => {
    let amt = 0;
    if (values) {
      if (Object.keys(values).length > 0) {
        if (
          !(errors?.productQuantityPieces || errors?.productQuantityMeters || errors.productRate)
        ) {
          amt =
            (values?.productQuantityPieces ?? 1) *
            (values?.productQuantityMeters ?? 1) *
            values.productRate;
        }
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
      handleClose={handleCancel}
      footer={footerContent(values, isValid, dirty, handleSubmit)}
      title={`${(itemIndex ?? null) === null ? "Add" : "Edit"} Product`}>
      <Stack direction="column" spacing={2} sx={styles.fullWidth}>
        <Stack direction="row" spacing={2} sx={styles.fullWidth}>
          <FormControl
            fullWidth
            size="small"
            margin="dense"
            error={touched?.productName && Boolean(errors?.productName?.value)}>
            <InputLabel id="productName">Product Name</InputLabel>
            <Select
              id="productName"
              name="productName"
              label="Product Name"
              onBlur={handleBlur}
              value={values?.productName?.value ?? ""}
              MenuProps={{ sx: styles.selectDropdownMenuStyle }}
              onChange={(e) => handleSelectChange(e, productList)}>
              <MenuItem value="" sx={styles.selectDropdownNoneMenuItem}>
                <em>None</em>
              </MenuItem>
              <MenuItem value="new" sx={styles.selectDropdownNewMenuItem}>
                <em>New</em>
              </MenuItem>
              {productList &&
                Array.isArray(productList) &&
                productList.map((item) => (
                  <MenuItem key={item?.value} value={item?.value}>
                    {item?.label}
                  </MenuItem>
                ))}
            </Select>
            {touched?.productName && Boolean(errors?.productName?.value) && (
              <FormHelperText
                htmlFor="form-selector"
                error={touched?.productName && Boolean(errors?.productName?.value)}>
                {errors?.productName?.value}
              </FormHelperText>
            )}
          </FormControl>
          {values?.productName?.value === "new" && (
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
            (touched?.productQuantityPieces || touched?.productQuantityMeters) &&
            (errors?.productQuantityPieces || errors?.atLeastOneFilled)
          }
          error={
            (touched?.productQuantityPieces || touched?.productQuantityMeters) &&
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
            (touched?.productQuantityPieces || touched?.productQuantityMeters) &&
            (errors?.productQuantityMeters || errors?.atLeastOneFilled)
          }
          error={
            (touched?.productQuantityPieces || touched?.productQuantityMeters) &&
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

export default AddEditProductModal;
