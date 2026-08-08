import React from "react";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import InputAdornment from "@mui/material/InputAdornment";

import commonStyles from "utils/commonStyles";
import AppModal from "components/common/AppModal";
import useBreakpoints from "hooks/useBreakpoints";
import { addExtra, editExtra } from "store/slices/invoicesSlice";
import addEditExtraSchema from "validationSchemas/addEditExtraSchema";
import { commonSelectOnChangeHandler, generateKeyValuePair } from "utils/utilites";

const styles = {
  fullWidth: {
    width: "100%"
  },
  xsFullWidth: (theme) => ({
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  }),
  modalStyle: {
    width: { xs: "90%", sm: "65%", md: "50%", lg: "40%" },
    minHeight: "fit-content"
  },
  selectDropdownMenuStyle: commonStyles?.selectDropdownMenuStyle || {},
  selectDropdownNewMenuItem: commonStyles?.selectDropdownNewMenuItem || {}
};

const INITIAL_VALUES = {
  reason: { value: "", label: "" },
  newReason: "",
  amount: null
};

const AddEditExtraModal = ({ open, handleClose, itemIndex = null, initialValues = null }) => {
  const { extrasList = [] } = useSelector((state) => state?.invoices);

  const dispatch = useDispatch();
  const { isMobile } = useBreakpoints();

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
    validationSchema: addEditExtraSchema,
    onSubmit: async (val, { setErrors }) => {
      try {
        // frame the form values
        const formValues = {
          amount: val?.amount
        };
        if (val?.reason?.value === "new" && val?.newReason)
          formValues.reason = generateKeyValuePair(val?.newReason);
        else formValues.reason = val?.reason;

        // add or update data to the store
        if (itemIndex === null) await dispatch(addExtra(formValues));
        else await dispatch(editExtra({ ...formValues, itemIndex }));

        // reset the form
        resetForm();

        // close the modal
        handleClose();
      } catch (error) {
        if (val?.reason?.value === "new" && val?.newReason)
          setErrors({
            newReason: error?.message
          });
        else
          setErrors({
            reason: {
              value: error?.message
            }
          });
      }
    }
  });

  const handleCancel = () => {
    // reset the form
    resetForm();

    // close the modal
    handleClose();
  };

  const handleSelectChange = ({ target: { name, value } }, list) =>
    commonSelectOnChangeHandler(name, value, list, setFieldValue);

  const footerContent = () => (
    <Stack direction="row" justifyContent="flex-end" alignItems="center">
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
      title={`${(itemIndex ?? null) === null ? "Add" : "Edit"} Extra`}>
      <Stack direction="column" spacing={2} sx={styles.fullWidth}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          sx={styles.fullWidth}>
          <Autocomplete
            id="reason"
            fullWidth
            size="small"
            options={[{ label: "New", value: "new" }, ...(extrasList || [])]}
            getOptionLabel={(option) => option.label || ""}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
            value={values?.reason?.value !== undefined ? values.reason : null}
            onChange={(e, newValue) => {
              handleSelectChange(
                { target: { name: "reason", value: newValue?.value ?? "" } },
                extrasList
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
                name="reason"
                label="Reason"
                margin="dense"
                sx={{ mt: "5px" }}
                error={touched?.reason && Boolean(errors?.reason?.value)}
                helperText={touched?.reason && errors?.reason?.value}
              />
            )}
          />
          {values?.reason?.value === "new" && (
            <TextField
              fullWidth
              id="newReason"
              name="newReason"
              label="New Reason"
              margin="dense"
              size="small"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values?.newReason ?? ""}
              helperText={touched?.newReason && errors?.newReason}
              error={touched?.newReason && Boolean(errors?.newReason)}
            />
          )}
        </Stack>
        <TextField
          fullWidth
          id="amount"
          name="amount"
          label="Amount"
          margin="dense"
          size="small"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values?.amount ?? ""}
          helperText={touched?.amount && errors?.amount}
          error={touched?.amount && Boolean(errors?.amount)}
        />
      </Stack>
    </AppModal>
  );
};

export default AddEditExtraModal;
