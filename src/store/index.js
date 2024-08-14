import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./slices/appSlice";
import invoicesReducer from "./slices/invoicesSlice";
import productsReducer from "./slices/productsSlice";
import customersReducer from "./slices/customersSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    invoices: invoicesReducer,
    products: productsReducer,
    customers: customersReducer
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
