import { lazy } from "react";

// Pages import
const SignIn = lazy(() => import("../components/signIn/SignIn"));

const routes = {
  SIGN_IN: {
    path: "/signin",
    component: SignIn
  }
};

export default routes;
