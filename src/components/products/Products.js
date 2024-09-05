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
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

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
import productSchema from "validationSchemas/productSchema";
import { MODES, FIREBASE_COLLECTIONS } from "utils/constants";
import { addNotification } from "store/slices/notificationsSlice";
import { addProduct, deleteProduct, editProduct } from "store/slices/productsSlice";
import { formatDate, generateKeyValuePair, getNow, isMobile } from "utils/utilites";

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
  dataGrid: commonStyles?.dataGrid ?? {}
};

const INITIAL_VALUES = {
  productName: ""
};

const Products = () => {
  const [isLoading, setLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [initialValues, setInitialValues] = useState(INITIAL_VALUES);

  const { loading = false } = useOutletContext();
  const { EDIT } = MODES;
  const { PRODUCTS } = FIREBASE_COLLECTIONS;
  const { products = [] } = useSelector((state) => state?.products);
  const { invoices = [] } = useSelector((state) => state?.invoices);
  const dispatch = useDispatch();

  const productsCollectionRef = collection(db, PRODUCTS);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setInitialValues(INITIAL_VALUES);
    setSelectedProduct(null);
    setSelectedProductId(null);
    setOpenModal(false);
  };

  const handleEditProduct = (product) => {
    setInitialValues({
      productName: product?.label
    });
    setSelectedProduct(product);
    setSelectedProductId(product?.id ?? null);
    handleOpenModal();
  };

  const handleDelete = (params) => {
    const isReferencedArr = [];
    invoices.forEach((item) => {
      const isPresent = item?.products.filter((p) => p?.productName?.id === params?.row?.id);
      isReferencedArr.push(isPresent);
    });

    const isReferenced = isReferencedArr.flat();

    if (!isReferenced.length)
      deleteDocFromFirestore(
        params?.row,
        PRODUCTS,
        setLoader,
        dispatch,
        deleteProduct,
        `Successfully deleted a product, '${params?.row?.label}'`,
        "There is an issue with deleting the product"
      );
    else {
      const message = `Cannot delete the product '${params.row?.label}' since it is referenced in one or more invoices`;
      dispatch(
        addNotification({
          message,
          variant: "warning"
        })
      );
    }
  };

  const validateForm = (field) => {
    if (products && Array.isArray(products)) {
      if (products.length) {
        const isPresent = products.some(
          (p) => p?.value === field?.value && p?.id !== selectedProductId
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
    validationSchema: productSchema,
    onSubmit: async (val, { setErrors }) => {
      setLoader(true);
      try {
        const productNameObj = generateKeyValuePair(val?.productName);

        // validate form
        const isValidForm = validateForm(productNameObj);

        if (isValidForm) {
          // frame the form values
          const formValues = {
            ...productNameObj
          };

          if (selectedProductId) {
            formValues.createdAt = selectedProduct?.createdAt;
            formValues.updatedAt = [...(selectedProduct?.updatedAt || []), getNow()];
          } else {
            formValues.createdAt = getNow();
            formValues.updatedAt = [];
          }

          // add or update data to the firestore & redux store
          if (selectedProductId) {
            formValues.id = selectedProductId;

            await editDocInFirestore(
              PRODUCTS,
              formValues,
              dispatch,
              "Successfully updated the product",
              "There is an issue with updating the product"
            );

            await dispatch(editProduct(formValues));
          } else {
            const { id: productDocId } = await addDocToFirestore(
              productsCollectionRef,
              formValues,
              dispatch,
              `Successfully added a new product, '${formValues?.label}'`,
              "There is an issue with adding the new product"
            );

            if (productDocId) {
              formValues.id = productDocId;
              await dispatch(addProduct(formValues));
            }
          }

          // reset the form
          resetForm();

          // close the modal
          handleCloseModal();
        } else throw new Error("This product already exists");
      } catch (error) {
        setErrors({
          productName: error?.message
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
      field: "label",
      headerName: "Name",
      flex: 1
    },
    {
      field: "createdAt",
      headerName: "Added at",
      width: 130,
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
                handleEditProduct(params?.row);
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

      <TitleBanner page="PRODUCTS" Icon={ShoppingBagIcon} />

      <Box sx={styles.box}>
        <Button
          variant="contained"
          disabled={loading || isLoading}
          startIcon={<AddIcon />}
          onClick={handleOpenModal}>
          New
        </Button>
      </Box>

      {!loading && products && Array.isArray(products) && products.length > 0 ? (
        <DataGrid
          sx={styles.dataGrid}
          rows={products}
          columns={columns}
          pageSizeOptions={[10]}
          initialState={{
            sorting: {
              sortModel: [{ field: "label", sort: "asc" }]
            },
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          disableColumnMenu
        />
      ) : (
        <ClickNew
          prefixMessage="Start listing your"
          hightlightedText="products"
          suffixMessage="here"
        />
      )}

      <AppModal
        open={openModal}
        footer={footerContent()}
        handleClose={handleCancel}
        modalStyle={styles.modalStyle}
        title={`${selectedProductId ? "Edit" : "Add"} Product`}>
        <TextField
          fullWidth
          id="productName"
          name="productName"
          label="Name"
          margin="dense"
          size="small"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values?.productName ?? ""}
          helperText={touched?.productName && errors?.productName}
          error={touched?.productName && Boolean(errors?.productName)}
        />
      </AppModal>
    </Box>
  );
};

export default Products;
