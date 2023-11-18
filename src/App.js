// external imports
import React, { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import AllRoutes from "routes/AllRoutes";
import ErrorBoundary from "components/common/ErrorBoundary";

// stylesheets
import "./App.css";

const App = () => (
  <Suspense
    fallback={<CircularProgress />} // based on theme, the CircularProgress component should be updated
  >
    <ErrorBoundary>
      <AllRoutes />
    </ErrorBoundary>
  </Suspense>
);

export default App;
