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
import { useDispatch, useSelector } from "react-redux";
import FormHelperText from "@mui/material/FormHelperText";
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
  selectDropdownMenuStyle: commonStyles?.selectDropdownMenuStyle || {},
  selectDropdownNoneMenuItem: commonStyles?.selectDropdownNoneMenuItem || {},
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
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={handleCancel}
          size={isMobile ? "small" : "medium"}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<DoneIcon />}
          onClick={handleSubmit}
          disabled={!(dirty && isValid)}
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
      title={`${(itemIndex ?? null) === null ? "Add" : "Edit"} Extra`}>
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
              onChange={(e) => handleSelectChange(e, extrasList)}>
              <MenuItem value="" sx={styles.selectDropdownNoneMenuItem}>
                <em>None</em>
              </MenuItem>
              <MenuItem value="new" sx={styles.selectDropdownNewMenuItem}>
                <em>New</em>
              </MenuItem>
              {extrasList &&
                Array.isArray(extrasList) &&
                extrasList.map((item) => (
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
