// external imports
import React, { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

// AllRoutes import
import AllRoutes from "./routes/AllRoutes";

// stylesheets
import "./App.css";

const App = () => (
  <Suspense
    fallback={<CircularProgress />} // based on theme, the CircularProgress component should be updated
  >
    <AllRoutes />
  </Suspense>
);

export default App;
