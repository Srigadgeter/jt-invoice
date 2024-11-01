/* eslint-disable func-names */
import * as yup from "yup";

import { PRODUCT_NAME_MAX_LEN, PRODUCT_NAME_MIN_LEN } from "utils/constants";

// Schema for the AddEditProductModal component in the Invoice page
const addEditProductSchema = yup
  .object({
    productName: yup.object({
      label: yup.string().trim(),
      value: yup.string().trim().required("Product Name is required")
    }),
    newProductName: yup.string().when("productName.value", {
      is: "new",
      then: (schema) =>
        schema
          .required("New Product Name is required")
          .min(
            PRODUCT_NAME_MIN_LEN,
            `New Product Name must be at least ${PRODUCT_NAME_MIN_LEN} characters`
          )
          .max(
            PRODUCT_NAME_MAX_LEN,
            `New Product Name should not be more than ${PRODUCT_NAME_MAX_LEN} characters`
          )
          .trim()
    }),
    productQuantityPieces: yup
      .number()
      .positive("Product Quantity (in Pcs) must be a positive number")
      .integer("Product Quantity (in Pcs) must be an integer")
      .nullable(),
    productQuantityMeters: yup
      .number()
      .positive("Product Quantity (in Mtrs) must be a positive number")
      .nullable(),
    productRate: yup
      .number()
      .required("Product Rate is required")
      .positive("Product Rate must be a positive number")
  })
  // Don't use arrow fn, use only ES5 function since test fn won't work if it is arrow fn
  .test("atLeastOneFilled", null, function (values) {
    // This function helps to validate atleast one of the both fields should be filled
    const condition = !values?.productQuantityPieces && !values?.productQuantityMeters;
    if (condition)
      return this.createError({
        path: "atLeastOneFilled", // This sets the error message on the atLeastOneFilled property (ie,. errors.atLeastOneFilled)
        message: "At least one of pieces or meters must be filled"
      });
    return true;
  });

export default addEditProductSchema;
