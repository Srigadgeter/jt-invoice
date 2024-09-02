/* eslint-disable no-unused-vars */
import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { fetchData } from "utils/fetchUtils";
import { drawerList } from "utils/drawerList";
import routes from "./routes";

const Header = lazy(() => import("components/common/Header"));
const SideDrawer = lazy(() => import("components/common/SideDrawer"));

const PrivateRoutes = () => {
  const { SIGN_IN } = routes;
  const loggedIn = true; // TODO: rework logic

  const [isLoading, setLoader] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const dispatch = useDispatch();

  const { invoices = [] } = useSelector((state) => state?.invoices);
  const { products = [] } = useSelector((state) => state?.products);
  const { customers = [] } = useSelector((state) => state?.customers);

  // fetch data
  useEffect(() => {
    fetchData(dispatch, setLoader, invoices, products, customers);
  }, []);

  const content = (
    <>
      <SideDrawer open={openDrawer} handleClose={() => setOpenDrawer(false)} list={drawerList} />
      <Header setOpenDrawer={setOpenDrawer} />
      <Outlet context={{ loading: isLoading }} />
    </>
  );

  return loggedIn ? content : <Navigate to={SIGN_IN.path} replace />;
};

export default PrivateRoutes;
