import * as yup from "yup";

// Schema for the Invoice page
const invoiceSchema = yup.object({
  // Invoice details schema
  invoiceDate: yup.date().required("Invoice Date is required"),
  baleCount: yup
    .number()
    .required("Bale count is required")
    .positive("Bale count should be positive number"),
  paymentStatus: yup.string().required("Payment Status is required"),
  paymentDate: yup.date().when("paymentStatus", {
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
        .min(2, "New Logisticcs must be at least 2 characters")
        .max(15, "New Logisticcs should not be more than 15 characters")
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
        .min(3, "New Transport Destination must be at least 3 characters")
        .max(15, "New Logisticcs should not be more than 15 characters")
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
        .min(3, "New Customer Name must be at least 3 characters")
        .max(30, "New Customer Name should not be more than 30 characters")
        .trim()
  }),
  newCustomerGSTNumber: yup.string().when("customerName.value", {
    is: "new",
    then: (schema) =>
      schema
        .length(15, "GST number should be 15 characters")
        .trim()
        .matches(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[0-9A-Z]{1}$/,
          "Provide a valid GST number (Ex: 33AAAAA0000A1Z3)"
        )
  }),
  newCustomerPhoneNumber: yup.string().when("customerName.value", {
    is: "new",
    then: (schema) => schema.trim()
  }),
  newCustomerAddress: yup.string().when("customerName.value", {
    is: "new",
    then: (schema) =>
      schema
        .required("Customer Address is required")
        .min(10, "Customer Address must be at least 10 characters")
        .max(150, "Customer Address should not be more than 150 characters")
        .trim()
  })
});

export default invoiceSchema;
