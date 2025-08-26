import { lazy } from "react";

// Pages import
const SignIn = lazy(() => import("components/signIn/SignIn"));
const Invoice = lazy(() => import("components/invoices/Invoice"));
const Invoices = lazy(() => import("components/invoices/Invoices"));
const Products = lazy(() => import("components/products/Products"));
const Dashboard = lazy(() => import("components/dashboard/Dashboard"));
const Customers = lazy(() => import("components/customers/Customers"));

const routes = {
  SIGN_IN: {
    path: "/signin",
    to: () => "/signin",
    component: SignIn
  },
  HOME: {
    path: "/",
    to: () => "/",
    component: Dashboard
  },
  INVOICES: {
    path: "/invoices/:startYear/:endYear",
    to: (startYear, endYear) => `/invoices/${startYear}/${endYear}`,
    component: Invoices
  },
  INVOICE_NEW: {
    path: "/invoice/:startYear/:endYear/new",
    to: (startYear, endYear) => `/invoice/${startYear}/${endYear}/new`,
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
