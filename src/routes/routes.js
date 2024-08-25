import { lazy } from "react";

// Pages import
const Products = lazy(() => import("components/products"));
const Customers = lazy(() => import("components/customers"));
const SignIn = lazy(() => import("components/signIn/SignIn"));
const Invoice = lazy(() => import("components/invoices/Invoice"));
const Invoices = lazy(() => import("components/invoices/Invoices"));

const routes = {
  SIGN_IN: {
    path: "/signin",
    to: () => "/signin",
    component: SignIn
  },
  HOME: {
    path: "/",
    to: () => "/",
    component: Invoices
  },
  INVOICES: {
    path: "/invoices",
    to: () => "/invoices",
    component: Invoices
  },
  INVOICE_NEW: {
    path: "/invoice/new",
    to: () => `/invoice/new`,
    component: Invoice
  },
  INVOICE_VIEW: {
    path: "/invoice/:startYear/:endYear/:invoiceId",
    to: (startYear, endYear, invoiceId) => `/invoice/${startYear}/${endYear}/${invoiceId}`,
    component: Invoice
  },
  INVOICE_EDIT: {
    path: "/invoice/:startYear/:endYear/:invoiceId/edit",
    to: (startYear, endYear, invoiceId) => `/invoice/${startYear}/${endYear}/${invoiceId}/edit`,
    component: Invoice
  },
  PRODUCTS: {
    path: "/products",
    to: () => "/products",
    component: Products
  },
  CUSTOMERS: {
    path: "/customers",
    to: () => "/customers",
    component: Customers
  }
};

export default routes;
