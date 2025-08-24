import * as yup from "yup";

import {
  CUSTOMER_ADDRESS_MAX_LEN,
  CUSTOMER_ADDRESS_MIN_LEN,
  CUSTOMER_NAME_MAX_LEN,
  CUSTOMER_NAME_MIN_LEN,
  GST_LEN
} from "utils/constants";

// Schema for the AddEditCustomerModal component in the Customers page
const customerSchema = yup.object({
  name: yup
    .string()
    .required("Customer Name is required")
    .min(
      CUSTOMER_NAME_MIN_LEN,
      `Customer Name must be at least ${CUSTOMER_NAME_MIN_LEN} characters`
    )
    .max(
      CUSTOMER_NAME_MAX_LEN,
      `Customer Name should not be more than ${CUSTOMER_NAME_MAX_LEN} characters`
    )
    .trim(),
  gstNumber: yup
    .string()
    .nullable()
    .length(GST_LEN, `GST number should be ${GST_LEN} characters`)
    .trim()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[0-9A-Z]{1}$/,
      "Provide a valid GST number (Ex: 33AAAAA0000A1Z3)"
    ),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .trim()
    .matches(
      /^(\+91[-\s]?)?[6-9]\d{9}$|^(0\d{2,4}[-\s]?)?\d{6,8}$/,
      "Provide a valid India phone or landline number"
    ),
  address: yup
    .string()
    .required("Customer Address is required")
    .min(
      CUSTOMER_ADDRESS_MIN_LEN,
      `Customer Address must be at least ${CUSTOMER_ADDRESS_MIN_LEN} characters`
    )
    .max(
      CUSTOMER_ADDRESS_MAX_LEN,
      `Customer Address should not be more than ${CUSTOMER_ADDRESS_MAX_LEN} characters`
    )
    .trim()
});

export default customerSchema;
