import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import InputAdornment from "@mui/material/InputAdornment";

import {
  commonSelectOnChangeHandler,
  generateKeyValuePair,
  getNow,
  sortByStringProperty
} from "utils/utilites";
import commonStyles from "utils/commonStyles";
import { GST_PERCENTAGE } from "utils/constants";
import AppModal from "components/common/AppModal";
import useBreakpoints from "hooks/useBreakpoints";
import { addProduct, editProduct } from "store/slices/invoicesSlice";
import addEditProductSchema from "validationSchemas/addEditProductSchema";

const styles = {
  fullWidth: {
    width: "100%"
  },
  xsFullWidth: (theme) => ({
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  }),
  amount: {
    fontWeight: 400
  },
  modalStyle: {
    width: { xs: "90%", sm: "65%", md: "50%", lg: "40%" },
    minHeight: "fit-content"
  },
  selectDropdownMenuStyle: commonStyles?.selectDropdownMenuStyle || {},
  selectDropdownNewMenuItem: commonStyles?.selectDropdownNewMenuItem || {}
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
  const { isMobile } = useBreakpoints();

  const { products = [] } = useSelector((state) => state?.products);
  const productList = sortByStringProperty([...products], "value");

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

        // frame the form values
        const formValues = {
          productQuantityPieces: val?.productQuantityPieces,
          productQuantityMeters: val?.productQuantityMeters,
          productRate: val?.productRate,
          productAmount: amount,
          producGstAmount: gstAmount,
          productAmountInclGST: amount + gstAmount
        };

        let productValueLabel = {};

        if (val?.productName?.value === "new" && val?.newProductName) {
          const productNameData = generateKeyValuePair(val?.newProductName);
          const isProductNameAlreadyPresent = productList.some(
            (item) => item?.value === productNameData?.value
          );
          if (isProductNameAlreadyPresent) throw new Error("This product name already exists");
          else productValueLabel = productNameData;
        } else productValueLabel = val?.productName;

        const filteredproduct = productList.filter((p) => p?.value === productValueLabel?.value);
        const productId = filteredproduct.length ? filteredproduct[0]?.id : "new";
        const productCreatedAt = filteredproduct.length ? filteredproduct[0]?.createdAt : getNow();
        const productUpdatedAt = filteredproduct.length ? filteredproduct[0]?.updatedAt : [];

        formValues.productName = {
          id: productId,
          createdAt: productCreatedAt,
          updatedAt: productUpdatedAt,
          ...productValueLabel
        };

        // add or update data to the store
        if (itemIndex === null) await dispatch(addProduct(formValues));
        else await dispatch(editProduct({ ...formValues, itemIndex }));

        // reset the form
        resetForm();

        // close the modal
        handleClose();
      } catch (error) {
        if (val?.productName?.value === "new" && val?.newProductName)
          setErrors({
            newProductName: error?.message
          });
        else
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
        if (!(
          errors?.productQuantityPieces ||
          errors?.productQuantityMeters ||
          errors.productRate
        )) {
          amt =
            (values?.productQuantityPieces || 1) *
            (values?.productQuantityMeters || 1) *
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

  const handleSelectChange = ({ target: { name, value } }, list) =>
    commonSelectOnChangeHandler(name, value, list, setFieldValue);

  const footerContent = () => (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      gap={{ xs: 1, sm: 1 }}>
      <Stack direction="row" spacing={1}>
        <Typography variant="h6" style={styles.amount}>
          Amount:
        </Typography>
        <Typography variant="h6" style={styles.amount}>
          Rs. {amount}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} sx={styles.xsFullWidth}>
        <Button
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={handleCancel}
          fullWidth={{ xs: true, sm: false }}
          size={isMobile ? "small" : "medium"}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<DoneIcon />}
          onClick={handleSubmit}
          disabled={!(dirty && isValid)}
          fullWidth={{ xs: true, sm: false }}
          size={isMobile ? "small" : "medium"}>
          Save
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <AppModal
      open={open}
      footer={footerContent()}
      handleClose={handleCancel}
      modalStyle={styles.modalStyle}
      title={`${(itemIndex ?? null) === null ? "Add" : "Edit"} Product`}>
      <Stack direction="column" spacing={2} sx={styles.fullWidth}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          sx={styles.fullWidth}>
          <Autocomplete
            id="productName"
            fullWidth
            size="small"
            options={[{ label: "New", value: "new" }, ...(productList || [])]}
            getOptionLabel={(option) => option.label || ""}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
            value={values?.productName?.value !== undefined ? values.productName : null}
            onChange={(e, newValue) => {
              handleSelectChange(
                { target: { name: "productName", value: newValue?.value ?? "" } },
                productList
              );
            }}
            onBlur={handleBlur}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <Box
                  component="li"
                  key={key}
                  {...otherProps}
                  sx={option.value === "new" ? styles.selectDropdownNewMenuItem : undefined}>
                  {option.label}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="productName"
                label="Product Name"
                margin="dense"
                sx={{ mt: "5px" }}
                error={touched?.productName && Boolean(errors?.productName?.value)}
                helperText={touched?.productName && errors?.productName?.value}
              />
            )}
          />
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
