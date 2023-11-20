import { lazy } from "react";

// Pages import
const SignIn = lazy(() => import("components/signIn/SignIn"));
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
  }
};

export default routes;
