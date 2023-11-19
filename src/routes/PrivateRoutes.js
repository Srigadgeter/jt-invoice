import React, { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import routes from "./routes";

const Header = lazy(() => import("components/common/Header"));

const PrivateRoutes = () => {
  const { SIGN_IN } = routes;
  const loggedIn = true; // TODO: rework logic

  const content = (
    <>
      <Header />
      <Outlet />
    </>
  );

  return loggedIn ? content : <Navigate to={SIGN_IN.path} replace />;
};

export default PrivateRoutes;
