// pages info
export const PAGE_INFO = {
  INVOICES: {
    title: "Invoices",
    description: "List of all bills"
  },
  INVOICE: {
    title: "Invoice",
    titleNew: "Add Invoice",
    titleEdit: "Edit Invoice",
    invoiceDetails: "Invoice Details",
    customerDetails: "Customer Details",
    products: "Products",
    extras: "Extras"
  },
  PRODUCTS: {
    title: "Products",
    description: "Quality items that are being sold to our customers"
  },
  CUSTOMERS: {
    title: "Customers",
    description: "Heart of our business"
  }
};

// theme constants
export const DEFAULT_LIGHT = "DEFAULT_LIGHT";
export const DEFAULT_DARK = "DEFAULT_DARK";

// page mode constants
export const MODES = {
  NEW: "new",
  VIEW: "view",
  EDIT: "edit"
};

// invoice statuses
export const INVOICE_STATUS = {
  PAID: "paid",
  UNPAID: "unpaid"
};

// GST constants
export const GST_PERCENTAGE = 5;

// Firebase db collections
export const FIREBASE_COLLECTIONS = {
  INVOICES: "invoices",
  PRODUCTS: "products",
  CUSTOMERS: "customers"
};

export const RECORDS_LIMIT_COUNT = 15;

export const LOCALSTORAGE_KEYS = {
  LS_USER: "user",
  LS_INVOICES: "invoices",
  LS_PRODUCTS: "products",
  LS_CUSTOMERS: "customers"
};

// Threshold values
export const GST_LEN = 15;
export const PRODUCT_NAME_MIN_LEN = 3;
export const PRODUCT_NAME_MAX_LEN = 35;
export const CUSTOMER_NAME_MIN_LEN = 3;
export const CUSTOMER_NAME_MAX_LEN = 40;
export const CUSTOMER_ADDRESS_MIN_LEN = 10;
export const CUSTOMER_ADDRESS_MAX_LEN = 150;
export const EXTRA_REASON_MIN_LEN = 3;
export const EXTRA_REASON_MAX_LEN = 30;
export const LOGISTICS_NAME_MIN_LEN = 2;
export const LOGISTICS_NAME_MAX_LEN = 15;
export const TRANSPORT_DESTINATION_NAME_MIN_LEN = 3;
export const TRANSPORT_DESTINATION_NAME_MAX_LEN = 15;
