import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { useFormik } from "formik";

import { db } from "integrations/firebase";
import { setProfile } from "store/slices/profileSlice";
import { addNotification } from "store/slices/notificationsSlice";
import { FIREBASE_COLLECTIONS, PROFILE_DOC_ID } from "utils/constants";
import { formatDateForInputField } from "utils/utilites";
import profileAddressSchema from "validationSchemas/profileAddressSchema";
import TitleBanner from "components/common/TitleBanner";
import Loader from "components/common/Loader";

const { PROFILE } = FIREBASE_COLLECTIONS;

const styles = {
  page: {
    p: 3
  },
  card: {
    p: 3,
    mt: 2,
    borderRadius: "15px",
    border: (theme) => `1px solid ${theme.palette.divider}`,
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.background.custom : theme.palette.common.white,
    boxShadow: (theme) =>
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05) 0px 4px 12px"
        : "rgba(0, 0, 0, 0.06) 0px 4px 12px"
  },
  sectionTitle: {
    fontWeight: 600,
    mb: 2,
    display: "flex",
    alignItems: "center",
    gap: 1
  },
  staticField: {
    p: 2,
    borderRadius: "10px",
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100]
  },
  addressRow: {
    p: 2,
    mb: 1.5,
    borderRadius: "10px",
    border: (theme) => `1px solid ${theme.palette.divider}`
  },
  addBtn: {
    mt: 1
  },
  saveBtn: {
    mt: 2,
    alignSelf: "flex-end"
  },
  divider: {
    my: 2
  }
};

const Profile = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoader] = useState(false);

  const { profile = {} } = useSelector((state) => state?.profile);
  const storedAddresses = profile?.addresses || [];

  // Memoize so the reference only changes when storedAddresses actually changes
  // (after a save). Without this, enableReinitialize resets the form on every
  // render, wiping user input and reverting the date picker.
  const sortedAddresses = useMemo(
    () =>
      storedAddresses.length > 0
        ? [...storedAddresses].sort((a, b) => new Date(b.effectiveFrom) - new Date(a.effectiveFrom))
        : [{ address: "", effectiveFrom: new Date().toISOString() }],
    [storedAddresses]
  );

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: { addresses: sortedAddresses },
      enableReinitialize: true,
      validationSchema: profileAddressSchema,
      onSubmit: async (val) => {
        setLoader(true);
        try {
          const profileDocRef = doc(db, PROFILE, PROFILE_DOC_ID);
          const updatedAddresses = val.addresses.map((entry) => ({
            address: entry.address.trim(),
            effectiveFrom: entry.effectiveFrom
          }));

          await updateDoc(profileDocRef, { addresses: updatedAddresses });

          dispatch(setProfile({ ...profile, addresses: updatedAddresses }));
          dispatch(
            addNotification({
              message: "Profile address updated successfully",
              variant: "success"
            })
          );
        } catch (err) {
          console.error(err);
          dispatch(
            addNotification({
              message: "There was an issue saving the address"
            })
          );
        } finally {
          setLoader(false);
        }
      }
    });

  const handleAddAddress = () => {
    setFieldValue("addresses", [
      { address: "", effectiveFrom: new Date().toISOString() },
      ...values.addresses
    ]);
  };

  const handleRemoveAddress = (index) => {
    const updated = values.addresses.filter((_, i) => i !== index);
    setFieldValue("addresses", updated);
  };

  return (
    <Box sx={styles.page}>
      {isLoading && <Loader height="100vh" />}

      <TitleBanner page="PROFILE" Icon={BusinessIcon} />

      {/* Company Name — static, from env */}
      <Box sx={styles.card}>
        <Typography sx={styles.sectionTitle}>
          <BusinessIcon fontSize="small" color="primary" />
          Company Information
        </Typography>
        <Box sx={styles.staticField}>
          <Typography variant="caption" color="text.secondary">
            Company Name
          </Typography>
          <Typography fontWeight={600} fontSize={18}>
            {process.env.REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME}
          </Typography>
        </Box>
      </Box>

      {/* Address History — from Firestore */}
      <Box sx={styles.card} component="form" onSubmit={handleSubmit}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography sx={{ ...styles.sectionTitle, mb: 0 }}>
            <LocationOnIcon fontSize="small" color="primary" />
            Address History
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddAddress}
            id="add-address-btn"
            sx={styles.addBtn}>
            Add Address
          </Button>
        </Stack>

        <Divider sx={styles.divider} />

        <Stack spacing={2}>
          {values.addresses.map((entry, index) => {
            const addressError = errors?.addresses?.[index]?.address;
            const addressTouched = touched?.addresses?.[index]?.address;
            const dateError = errors?.addresses?.[index]?.effectiveFrom;
            const dateTouched = touched?.addresses?.[index]?.effectiveFrom;

            return (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={index} sx={styles.addressRow}>
                <Stack direction="row" alignItems="flex-start" spacing={2}>
                  <Stack flex={1} spacing={1.5}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      maxRows={4}
                      size="small"
                      label="Address"
                      id={`addresses[${index}].address`}
                      name={`addresses[${index}].address`}
                      value={entry.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={addressTouched && !!addressError}
                      helperText={addressTouched && addressError}
                    />
                    <TextField
                      size="small"
                      type="date"
                      label="Effective From"
                      id={`addresses[${index}].effectiveFrom`}
                      name={`addresses[${index}].effectiveFrom`}
                      value={formatDateForInputField(entry.effectiveFrom)}
                      onChange={(e) =>
                        setFieldValue(
                          `addresses[${index}].effectiveFrom`,
                          // Parse as local time (appending T00:00:00 avoids UTC
                          // midnight shifting the date by a day in IST/UTC+ zones)
                          new Date(`${e.target.value}T00:00:00`).toISOString()
                        )
                      }
                      onBlur={handleBlur}
                      error={dateTouched && !!dateError}
                      helperText={dateTouched && dateError}
                      InputLabelProps={{ shrink: true }}
                      sx={{ maxWidth: 220 }}
                    />
                  </Stack>

                  {values.addresses.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`remove-address-${index}`}
                      onClick={() => handleRemoveAddress(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Stack>

        <Stack direction="row" justifyContent="flex-end" sx={styles.saveBtn}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isLoading}
            id="save-profile-btn">
            Save
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Profile;
