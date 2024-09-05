import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: []
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action?.payload;
    },
    addCustomer: (state, action) => {
      const currentCustomers = [...state.customers];
      state.customers = [...currentCustomers, { ...action?.payload }];
    },
    editCustomer: (state, action) => {
      const modifiedCustomers = state?.customers?.map((item) => {
        if (item?.id === action?.payload?.id) return { ...action?.payload };
        return item;
      });
      state.customers = modifiedCustomers;
    },
    deleteCustomer: (state, action) => {
      const filteredCustomers = state?.customers?.filter(
        (item) => item?.id !== action?.payload?.id
      );
      state.customers = filteredCustomers;
    }
  }
});

export const { setCustomers, addCustomer, editCustomer, deleteCustomer } = customersSlice.actions;

export default customersSlice.reducer;
