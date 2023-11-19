import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import routes from "./routes";

const PrivateRoutes = () => {
  const { SIGN_IN } = routes;
  const loggedIn = false; // TODO: rework logic

  return loggedIn ? <Outlet /> : <Navigate to={SIGN_IN.path} replace />;
};

export default PrivateRoutes;
