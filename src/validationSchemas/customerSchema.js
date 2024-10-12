import * as yup from "yup";

// Schema for the AddEditCustomerModal component in the Customers page
const customerSchema = yup.object({
  name: yup
    .string()
    .required("Customer Name is required")
    .min(3, "Customer Name must be at least 3 characters")
    .max(40, "Customer Name should not be more than 40 characters")
    .trim(),
  gstNumber: yup
    .string()
    .nullable()
    .length(15, "GST number should be 15 characters")
    .trim()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[0-9A-Z]{1}$/,
      "Provide a valid GST number (Ex: 33AAAAA0000A1Z3)"
    ),
  phoneNumber: yup
    .string()
    .nullable()
    .trim()
    .matches(
      /^(\+91[-\s]?)?[6-9]\d{9}$|^(0\d{2,4}[-\s]?)?\d{6,8}$/,
      "Provide a valid India phone or landline number"
    ),
  address: yup
    .string()
    .required("Customer Address is required")
    .min(10, "Customer Address must be at least 10 characters")
    .max(150, "Customer Address should not be more than 150 characters")
    .trim()
});

export default customerSchema;
