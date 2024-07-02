import * as yup from "yup";

// Schema for the AddProductModal component
const addProductSchema = yup
  .object({
    productName: yup.string().trim().required("Product Name is required"),
    newProductName: yup.string().when("productName", {
      is: "new",
      then: (schema) =>
        schema
          .required("New Product Name is required")
          .min(3, "New Product Name must be at least 3 characters")
          .trim()
    }),
    productQuantityPieces: yup.number().positive().integer().nullable(),
    productQuantityMeters: yup.number().positive().integer().nullable(),
    productRate: yup.number().required("Product Rate is required").positive()
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

export default addProductSchema;
