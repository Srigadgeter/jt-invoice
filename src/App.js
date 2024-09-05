// external imports
import React, { Suspense } from "react";

import AllRoutes from "routes/AllRoutes";
import Loader from "components/common/Loader";
import Notify from "components/common/Notify";
import ErrorBoundary from "components/common/ErrorBoundary";

// stylesheets
import "./App.css";

const App = () => (
  <Suspense fallback={<Loader />}>
    <ErrorBoundary>
      <AllRoutes />
      <Notify />
    </ErrorBoundary>
  </Suspense>
);

export default App;
