// external imports
import React, { Suspense } from "react";

import AllRoutes from "routes/AllRoutes";
import Loader from "components/common/Loader";
import ErrorBoundary from "components/common/ErrorBoundary";

// stylesheets
import "./App.css";

const App = () => (
  <Suspense fallback={<Loader />}>
    <ErrorBoundary>
      <AllRoutes />
    </ErrorBoundary>
  </Suspense>
);

export default App;
