import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: []
};

const invoicesReducer = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      // TODO: rework logic
      state.invoices = action.payload;
    }
  }
});

export const { setInvoices } = invoicesReducer.actions;

export default invoicesReducer.reducer;
