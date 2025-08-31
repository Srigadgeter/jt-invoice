import * as yup from "yup";

import {
  CUSTOMER_ADDRESS_MAX_LEN,
  CUSTOMER_ADDRESS_MIN_LEN,
  CUSTOMER_NAME_MAX_LEN,
  CUSTOMER_NAME_MIN_LEN,
  GST_LEN,
  LOGISTICS_NAME_MAX_LEN,
  LOGISTICS_NAME_MIN_LEN,
  TRANSPORT_DESTINATION_NAME_MAX_LEN,
  TRANSPORT_DESTINATION_NAME_MIN_LEN
} from "utils/constants";

// Schema for the Invoice page
const invoiceSchema = yup.object({
  // Invoice details schema
  invoiceDate: yup.date().required("Invoice Date is required"),
  baleCount: yup
    .number()
    .required("Bale count is required")
    .positive("Bale count should be positive number"),
  paymentStatus: yup.string().required("Payment Status is required"),
  paymentDate: yup
    .date()
    .nullable()
    .when("paymentStatus", {
      is: "paid",
      then: (schema) => schema.required("Payment Date is required")
    }),
  lrNumber: yup.string().nullable(),
  lrDate: yup.date().required("Lorry Receipt (LR) Date is required"),
  logistics: yup.object({
    label: yup.string().trim(),
    value: yup.string().trim().required("Logistics is required")
  }),
  newLogistics: yup.string().when("logistics.value", {
    is: "new",
    then: (schema) =>
      schema
        .required("New Logisticcs is required")
        .min(
          LOGISTICS_NAME_MIN_LEN,
          `New Logisticcs must be at least ${LOGISTICS_NAME_MIN_LEN} characters`
        )
        .max(
          LOGISTICS_NAME_MAX_LEN,
          `New Logisticcs should not be more than ${LOGISTICS_NAME_MAX_LEN} characters`
        )
        .trim()
  }),
  transportDestination: yup.object({
    label: yup.string().trim(),
    value: yup.string().trim().required("Transport Destination is required")
  }),
  newTransportDestination: yup.string().when("transportDestination.value", {
    is: "new",
    then: (schema) =>
      schema
        .required("New Transport Destination is required")
        .min(
          TRANSPORT_DESTINATION_NAME_MIN_LEN,
          `New Transport Destination must be at least ${TRANSPORT_DESTINATION_NAME_MIN_LEN} characters`
        )
        .max(
          TRANSPORT_DESTINATION_NAME_MAX_LEN,
          `New Logisticcs should not be more than ${TRANSPORT_DESTINATION_NAME_MAX_LEN} characters`
        )
        .trim()
  }),
  // Customer details schema
  customerName: yup.object({
    label: yup.string().trim(),
    value: yup.string().trim().required("Customer Name is required")
  }),
  newCustomerName: yup.string().when("customerName.value", {
    is: "new",
    then: (schema) =>
      schema
        .required("New Customer Name is required")
        .min(
          CUSTOMER_NAME_MIN_LEN,
          `New Customer Name must be at least ${CUSTOMER_NAME_MIN_LEN} characters`
        )
        .max(
          CUSTOMER_NAME_MAX_LEN,
          `New Customer Name should not be more than ${CUSTOMER_NAME_MAX_LEN} characters`
        )
        .trim()
  }),
  newCustomerSource: yup.object().when("customerName.value", {
    is: "new",
    then: () =>
      yup.object({
        label: yup.string().trim(),
        value: yup.string().trim().required("Source is required")
      })
  }),
  newCustomerNewSource: yup.string().when("newCustomerSource.value", {
    is: "new",
    then: (schema) => schema.required("New Source is required").trim()
  }),
  newCustomerGSTNumber: yup.string().when("customerName.value", {
    is: "new",
    then: (schema) =>
      schema
        .nullable()
        .length(GST_LEN, `GST number should be ${GST_LEN} characters`)
        .trim()
        .matches(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[0-9A-Z]{1}$/,
          "Provide a valid GST number (Ex: 33AAAAA0000A1Z3)"
        )
  }),
  newCustomerPhoneNumber: yup.string().when("customerName.value", {
    is: "new",
    then: (schema) =>
      schema
        .required("Phone Number is required")
        .trim()
        .matches(
          /^(\+91[-\s]?)?[6-9]\d{9}$|^(0\d{2,4}[-\s]?)?\d{6,8}$/,
          "Provide a valid India phone or landline number"
        )
  }),
  newCustomerAddress: yup.string().when("customerName.value", {
    is: "new",
    then: (schema) =>
      schema
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
  })
});

export default invoiceSchema;
