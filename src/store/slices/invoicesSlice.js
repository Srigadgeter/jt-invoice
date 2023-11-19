import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: []
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      // TODO: rework logic
      state.invoices = action.payload;
    }
  }
});

export const { setInvoices } = invoicesSlice.actions;

export default invoicesSlice.reducer;
