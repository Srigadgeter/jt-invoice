import React, { useState } from "react";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import TextField from "@mui/material/TextField";
import { collection } from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  addDocToFirestore,
  deleteDocFromFirestore,
  editDocInFirestore
} from "integrations/firestoreHelpers";
import { db } from "integrations/firebase";
import Loader from "components/common/Loader";
import commonStyles from "utils/commonStyles";
import ClickNew from "components/common/ClickNew";
import AppModal from "components/common/AppModal";
import TitleBanner from "components/common/TitleBanner";
import customerSchema from "validationSchemas/customerSchema";
import { MODES, FIREBASE_COLLECTIONS } from "utils/constants";
import { addNotification } from "store/slices/notificationsSlice";
import { formatDate, generateKeyValuePair, getNow, isMobile } from "utils/utilites";
import { addCustomer, deleteCustomer, editCustomer } from "store/slices/customersSlice";

const styles = {
  titleIcon: {
    fontSize: 70
  },
  box: {
    display: "flex",
    justifyContent: "flex-end"
  },
  modalStyle: {
    minHeight: "fit-content"
  },
  dataGrid: commonStyles?.dataGrid ?? {},
  addressColumn: {
    // wrap the content to the next line if it overlaps width of the cell
    whiteSpace: "normal",
    wordWrap: "break-word",
    overflow: "hidden"
  }
};

const INITIAL_VALUES = {
  name: "",
  gstNumber: "",
  phoneNumber: "",
  address: ""
};

const Customers = () => {
  const [isLoading, setLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [initialValues, setInitialValues] = useState(INITIAL_VALUES);

  const { loading = false } = useOutletContext();
  const { EDIT } = MODES;
  const { CUSTOMERS } = FIREBASE_COLLECTIONS;
  const { invoices = [] } = useSelector((state) => state?.invoices);
  const { customers = [] } = useSelector((state) => state?.customers);
  const dispatch = useDispatch();

  const customersCollectionRef = collection(db, CUSTOMERS);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setInitialValues(INITIAL_VALUES);
    setSelectedCustomer(null);
    setSelectedCustomerId(null);
    setOpenModal(false);
  };

  const handleEditCustomer = (customer) => {
    setInitialValues({
      name: customer?.name?.label,
      gstNumber: customer?.gstNumber,
      phoneNumber: customer?.phoneNumber,
      address: customer?.address
    });
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer?.id ?? null);
    handleOpenModal();
  };

  const handleDelete = (params) => {
    const isReferenced = invoices.filter((item) => item?.customer?.id === params?.row?.id);

    if (!isReferenced.length)
      deleteDocFromFirestore(
        params?.row,
        CUSTOMERS,
        setLoader,
        dispatch,
        deleteCustomer,
        `Successfully deleted a customer, '${params?.row?.name?.label}'`,
        "There is an issue with deleting the customer"
      );
    else {
      const message = `Cannot delete the customer '${params.row?.name?.label}' since it is referenced in one or more invoices`;
      dispatch(
        addNotification({
          message,
          variant: "warning"
        })
      );
    }
  };

  const validateForm = (field1, field2) => {
    if (customers && Array.isArray(customers)) {
      if (customers.length) {
        const isPresent = customers.some(
          (c) =>
            c?.name?.value === field1?.value &&
            c?.address === field2 &&
            c?.id !== selectedCustomerId
        );
        return !isPresent;
      }
      return true;
    }
    return true;
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
    handleSubmit
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: customerSchema,
    onSubmit: async (val, { setErrors }) => {
      setLoader(true);
      try {
        const customerNameObj = generateKeyValuePair(val?.name);

        // validate form
        const isValidForm = validateForm(customerNameObj, val?.address);

        if (isValidForm) {
          // frame the form values
          const formValues = {
            name: { ...customerNameObj },
            gstNumber: val?.gstNumber,
            phoneNumber: val?.phoneNumber,
            address: val?.address
          };

          if (selectedCustomerId) {
            formValues.createdAt = selectedCustomer?.createdAt;
            formValues.updatedAt = [...(selectedCustomer?.updatedAt || []), getNow()];
          } else {
            formValues.createdAt = getNow();
            formValues.updatedAt = [];
          }

          // add or update data to the firestore & redux store
          if (selectedCustomerId) {
            formValues.id = selectedCustomerId;

            await editDocInFirestore(
              CUSTOMERS,
              formValues,
              dispatch,
              "Successfully updated the customer",
              "There is an issue with updating the customer"
            );

            await dispatch(editCustomer(formValues));
          } else {
            const { id: customerDocId } = await addDocToFirestore(
              customersCollectionRef,
              formValues,
              dispatch,
              `Successfully added a new customer, '${formValues?.name?.label}'`,
              "There is an issue with adding the new customer"
            );

            if (customerDocId) {
              formValues.id = customerDocId;
              await dispatch(addCustomer(formValues));
            }
          }

          // reset the form
          resetForm();

          // close the modal
          handleCloseModal();
        } else throw new Error("This customer name already exists with the same address");
      } catch (error) {
        setErrors({
          name: error?.message
        });
      } finally {
        setLoader(false);
      }
    }
  });

  const handleCancel = () => {
    // reset the form
    resetForm();

    // close the modal
    handleCloseModal();
  };

  const columns = [
    {
      field: "id",
      headerName: "S No",
      sortable: false,
      width: 80,
      renderCell: (params) =>
        params.api.state.sorting.sortedRows.findIndex((id) => id === params?.id) + 1
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      valueFormatter: ({ value }) => value?.label,
      sortComparator: (v1, v2) => v1?.label.localeCompare(v2?.label) // default sorting based on label property of the name
    },
    {
      field: "gstNumber",
      headerName: "GST Number",
      width: 150
    },
    {
      field: "phoneNumber",
      headerName: "Phone / Landline",
      width: 120
    },
    {
      field: "address",
      headerName: "Address",
      width: 600,
      renderCell: ({ value }) => <Box sx={styles.addressColumn}>{value}</Box>
    },
    {
      field: "createdAt",
      headerName: "Added at",
      width: 100,
      valueFormatter: ({ value }) => formatDate(value)
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="large"
              aria-label={EDIT}
              disabled={loading || isLoading}
              onClick={() => {
                handleEditCustomer(params?.row);
              }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="large"
              aria-label="delete"
              disabled={loading || isLoading}
              onClick={() => handleDelete(params)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

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
    <Box px={3} mt={1}>
      {(loading || isLoading) && <Loader height="100vh" />}

      <TitleBanner page="CUSTOMERS" Icon={PersonIcon} />

      <Box sx={styles.box}>
        <Button
          variant="contained"
          disabled={loading || isLoading}
          startIcon={<AddIcon />}
          onClick={handleOpenModal}>
          New
        </Button>
      </Box>

      {!loading && customers && Array.isArray(customers) && customers.length > 0 ? (
        <DataGrid
          sx={styles.dataGrid}
          rows={customers}
          columns={columns}
          pageSizeOptions={[10]}
          initialState={{
            sorting: {
              sortModel: [{ field: "name", sort: "asc" }]
            },
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          disableColumnMenu
        />
      ) : (
        <ClickNew
          prefixMessage="Start add your"
          hightlightedText="customers"
          suffixMessage="here"
        />
      )}

      <AppModal
        open={openModal}
        footer={footerContent()}
        handleClose={handleCancel}
        modalStyle={styles.modalStyle}
        title={`${selectedCustomerId ? "Edit" : "Add"} Customer`}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Name"
          margin="dense"
          size="small"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values?.name ?? ""}
          helperText={touched?.name && errors?.name}
          error={touched?.name && Boolean(errors?.name)}
        />
        <TextField
          fullWidth
          id="gstNumber"
          name="gstNumber"
          label="GST Number"
          margin="dense"
          size="small"
          onBlur={handleBlur}
          disabled={loading || isLoading}
          onChange={handleChange}
          value={values?.gstNumber?.toUpperCase() ?? ""}
          helperText={touched?.gstNumber && errors?.gstNumber}
          error={touched?.gstNumber && Boolean(errors?.gstNumber)}
        />
        <TextField
          fullWidth
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          label="Phone/Landline Number"
          margin="dense"
          size="small"
          onBlur={handleBlur}
          disabled={loading || isLoading}
          onChange={handleChange}
          value={values?.phoneNumber ?? ""}
          helperText={touched?.phoneNumber && errors?.phoneNumber}
          error={touched?.phoneNumber && Boolean(errors?.phoneNumber)}
        />
        <TextField
          fullWidth
          multiline
          maxRows={4}
          id="address"
          name="address"
          label="Address"
          margin="dense"
          size="small"
          onBlur={handleBlur}
          disabled={loading || isLoading}
          onChange={handleChange}
          value={values?.address ?? ""}
          helperText={touched?.address && errors?.address}
          error={touched?.address && Boolean(errors?.address)}
        />
      </AppModal>
    </Box>
  );
};

export default Customers;
