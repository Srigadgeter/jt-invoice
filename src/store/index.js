import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./slices/appSlice";
import invoicesReducer from "./slices/invoicesSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    invoices: invoicesReducer
  }
});

export default store;
