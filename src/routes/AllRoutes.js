/* eslint-disable react/jsx-pascal-case */
import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import routes from "./routes";

const NotFound = lazy(() => import("../components/common/NotFound"));
const PrivateRoutes = lazy(() => import("./PrivateRoutes"));

const AllRoutes = () => {
  const { SIGN_IN } = routes;

  return (
    <Routes>
      <Route exact path={SIGN_IN.path} element={<SIGN_IN.component />} />
      <Route path="*" element={<NotFound />} />
      <Route exact element={<PrivateRoutes />}>
        {/* <Route exact path={INVOICES.path} element={<INVOICES.component />} /> */}
      </Route>
    </Routes>
  );
};

export default AllRoutes;
