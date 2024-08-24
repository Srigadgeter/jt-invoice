import { createSlice } from "@reduxjs/toolkit";

// import { MODES } from "utils/constants";

const initialState = {
  customers: [],
  selectedCustomerInitialValue: {},
  selectedCustomer: {},
  newCustomer: {},
  pageMode: ""
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action?.payload;
    }
  }
});

export const { setCustomers } = customersSlice.actions;

export default customersSlice.reducer;
