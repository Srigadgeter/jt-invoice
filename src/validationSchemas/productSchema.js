import * as yup from "yup";

import { PRODUCT_NAME_MAX_LEN, PRODUCT_NAME_MIN_LEN } from "utils/constants";

// Schema for the AddEditProductModal component in the Products page
const productSchema = yup.object({
  productName: yup
    .string()
    .required("Product Name is required")
    .min(PRODUCT_NAME_MIN_LEN, `Product Name must be at least ${PRODUCT_NAME_MIN_LEN} characters`)
    .max(
      PRODUCT_NAME_MAX_LEN,
      `Product Name should not be more than ${PRODUCT_NAME_MAX_LEN} characters`
    )
    .trim()
});

export default productSchema;
