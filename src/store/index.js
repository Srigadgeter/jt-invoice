import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./slices/appSlice";
import invoicesReducer from "./slices/invoicesSlice";
import productsReducer from "./slices/productsSlice";
import customersReducer from "./slices/customersSlice";
import profileReducer from "./slices/profileSlice";
import notificationsReducer from "./slices/notificationsSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    invoices: invoicesReducer,
    products: productsReducer,
    customers: customersReducer,
    profile: profileReducer,
    notifications: notificationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["app/setUser", "invoices/setInvoices"],
        // Ignore these paths in the state
        ignoredPaths: ["app.user"]
      }
    })
});

export default store;
