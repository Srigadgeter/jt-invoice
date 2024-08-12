import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./slices/appSlice";
import invoicesReducer from "./slices/invoicesSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    invoices: invoicesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["invoices/setInvoices"]
      }
    })
});

export default store;
