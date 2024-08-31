import * as yup from "yup";

// Schema for the AddEditProductModal component
const productSchema = yup.object({
  productName: yup
    .string()
    .required("Product Name is required")
    .min(3, "Product Name must be at least 3 characters")
    .max(30, "Product Name should not be more than 30 characters")
    .trim()
});

export default productSchema;
