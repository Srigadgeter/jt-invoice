import React from "react";
import { useFormik } from "formik";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";

import commonStyles from "utils/commonStyles";
import AppModal from "components/common/AppModal";
import { isMobile, trimString } from "utils/utilites";
import addEditExtraSchema from "validationSchemas/addEditExtraSchema";

const styles = {
  fullWidth: {
    width: "100%"
  },
  ...commonStyles
};

const INITIAL_VALUES = {
  reason: { value: "", label: "" },
  amount: null
};

const extraList = [{ value: "bus-fare", label: "Bus Fare" }];

const AddEditExtraModal = ({ open, handleClose, initialValues = INITIAL_VALUES }) => {
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
    validationSchema: addEditExtraSchema,
    onSubmit: (val) => {
      // trim the values
      const formValues = {};
      Object.entries(val).forEach(([key, value]) => {
        formValues[key] = trimString(value);
      });

      // >>> TODO; API call - create new extra if newReason has value <<<
      // >>> TODO; add extra to redux store <<<

      // reset the form
      resetForm();

      // close the modal
      handleClose();
    }
  });

  const handleCancel = () => {
    // reset the form
    resetForm();

    // close the modal
    handleClose();
  };

  const handleSelectChange = ({ target: { name, value } }, list) => {
    if (value === "") {
      setFieldValue(name, { label: "", value: "" });
    } else if (value === "new") {
      setFieldValue(name, { label: "New", value: "new" });
    } else {
      const selectedOption = list.find((option) => option.value === value);
      setFieldValue(name, { label: selectedOption?.label, value: selectedOption?.value });
    }
  };

  const footerContent = () => (
    <Stack direction="row" justifyContent="flex-end" alignItems="center">
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
      title={`${initialValues?.reason?.value ? "Edit" : "Add"} Extra`}>
      <Stack direction="column" spacing={2} sx={styles.fullWidth}>
        <Stack direction="row" spacing={2} sx={styles.fullWidth}>
          <FormControl
            fullWidth
            size="small"
            margin="dense"
            error={touched?.reason && Boolean(errors?.reason?.value)}>
            <InputLabel id="reason">Reason</InputLabel>
            <Select
              id="reason"
              name="reason"
              label="Reason"
              onBlur={handleBlur}
              value={values?.reason?.value ?? ""}
              MenuProps={{ sx: styles.selectDropdownMenuStyle }}
              onChange={(e) => handleSelectChange(e, extraList)}>
              <MenuItem value="" sx={styles.selectDropdownNoneMenuItem}>
                <em>None</em>
              </MenuItem>
              <MenuItem value="new" sx={styles.selectDropdownNewMenuItem}>
                <em>New</em>
              </MenuItem>
              {extraList &&
                Array.isArray(extraList) &&
                extraList.map((item) => (
                  <MenuItem key={item?.value} value={item?.value}>
                    {item?.label}
                  </MenuItem>
                ))}
            </Select>
            {touched?.reason && Boolean(errors?.reason?.value) && (
              <FormHelperText
                htmlFor="form-selector"
                error={touched?.reason && Boolean(errors?.reason?.value)}>
                {errors?.reason?.value}
              </FormHelperText>
            )}
          </FormControl>
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
