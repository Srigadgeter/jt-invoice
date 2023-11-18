import { configureStore } from "@reduxjs/toolkit";
import invoicesReducer from "./slices/invoicesSlice";

const store = configureStore({
  reducer: {
    invoices: invoicesReducer
  }
});

export default store;
