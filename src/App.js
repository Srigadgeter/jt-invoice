// external imports
import React, { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import ErrorBoundary from "components/common/ErrorBoundary";
import AllRoutes from "./routes/AllRoutes";

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
