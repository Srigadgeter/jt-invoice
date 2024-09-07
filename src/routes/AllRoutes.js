/* eslint-disable react/jsx-pascal-case */
import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import routes from "./routes";

const PrivateRoutes = lazy(() => import("./PrivateRoutes"));
const NotFound = lazy(() => import("components/common/NotFound"));

const AllRoutes = () => {
  const { SIGN_IN, HOME, INVOICES, INVOICE_NEW, INVOICE_VIEW, INVOICE_EDIT, PRODUCTS, CUSTOMERS } =
    routes;

  return (
    <Routes>
      <Route exact element={<PrivateRoutes />}>
        <Route exact path={HOME.path} element={<HOME.component />} />
        <Route exact path={INVOICES.path} element={<INVOICES.component />} />
        <Route exact path={INVOICE_NEW.path} element={<INVOICE_NEW.component />} />
        <Route exact path={INVOICE_VIEW.path} element={<INVOICE_VIEW.component />} />
        <Route exact path={INVOICE_EDIT.path} element={<INVOICE_EDIT.component />} />
        <Route exact path={PRODUCTS.path} element={<PRODUCTS.component />} />
        <Route exact path={CUSTOMERS.path} element={<CUSTOMERS.component />} />
      </Route>
      <Route exact path={HOME.path} element={<SIGN_IN.component />} />
      <Route exact path={SIGN_IN.path} element={<SIGN_IN.component />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
