/* eslint-disable no-unused-vars */
import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { drawerList } from "utils/drawerList";
import { getItemFromLS } from "utils/utilites";
import { LOCALSTORAGE_KEYS } from "utils/constants";
import { fetchData, restoreAppData } from "utils/fetchUtils";
import Header from "components/common/Header";
import SideDrawer from "components/common/SideDrawer";
import Loader from "components/common/Loader";
import routes from "./routes";

const PrivateRoutes = () => {
  const [isLoading, setLoader] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const { SIGN_IN } = routes;
  const { LS_USER } = LOCALSTORAGE_KEYS;
  const dispatch = useDispatch();

  const { user = {} } = useSelector((state) => state?.app);
  const storedUserData = getItemFromLS(LS_USER, true) || {};
  const isLoggedIn = !!user?.uid || !!storedUserData?.uid;

  const { invoices = [] } = useSelector((state) => state?.invoices);
  const { products = [] } = useSelector((state) => state?.products);
  const { customers = [] } = useSelector((state) => state?.customers);

  // fetch data
  useEffect(() => {
    const userLen = Object.keys(user).length;
    const storedUserDataLen = Object.keys(storedUserData).length;
    if (!userLen && storedUserDataLen && isLoggedIn) {
      restoreAppData(dispatch);
    } else if (userLen && storedUserDataLen && isLoggedIn) {
      fetchData(dispatch, setLoader, invoices, products, customers);
    }
  }, []);

  const content = (
    <>
      <SideDrawer open={openDrawer} handleClose={() => setOpenDrawer(false)} list={drawerList} />
      <Header setOpenDrawer={setOpenDrawer} />
      <Suspense fallback={<Loader />}>
        <Outlet context={{ loading: isLoading }} />
      </Suspense>
    </>
  );

  return isLoggedIn ? content : <Navigate to={SIGN_IN.path} replace />;
};

export default PrivateRoutes;
