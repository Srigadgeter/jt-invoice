import { lazy } from "react";

// Pages import
const SignIn = lazy(() => import("components/signIn/SignIn"));
const Invoices = lazy(() => import("components/invoices/Invoices"));
const Invoice = lazy(() => import("components/invoices/Invoice"));

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
    path: "/invoice/:invoiceNumber",
    to: (invoiceNumber) => `/invoice/${invoiceNumber}`,
    component: Invoice
  },
  INVOICE_EDIT: {
    path: "/invoice/:invoiceNumber/edit",
    to: (invoiceNumber) => `/invoice/${invoiceNumber}/edit`,
    component: Invoice
  }
};

export default routes;
