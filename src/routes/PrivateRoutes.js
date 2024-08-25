/* eslint-disable no-unused-vars */
import React, { lazy, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { drawerList } from "utils/drawerList";
import routes from "./routes";

const Header = lazy(() => import("components/common/Header"));
const SideDrawer = lazy(() => import("components/common/SideDrawer"));

const PrivateRoutes = () => {
  const { SIGN_IN } = routes;
  const loggedIn = true; // TODO: rework logic

  const [openDrawer, setOpenDrawer] = useState(false);

  const content = (
    <>
      <SideDrawer open={openDrawer} handleClose={() => setOpenDrawer(false)} list={drawerList} />
      <Header setOpenDrawer={setOpenDrawer} />
      <Outlet />
    </>
  );

  return loggedIn ? content : <Navigate to={SIGN_IN.path} replace />;
};

export default PrivateRoutes;
