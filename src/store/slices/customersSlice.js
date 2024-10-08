import { createSlice } from "@reduxjs/toolkit";

import { setItemToLS } from "utils/utilites";
import { LOCALSTORAGE_KEYS } from "utils/constants";

const { LS_CUSTOMERS } = LOCALSTORAGE_KEYS;

const initialState = {
  customers: []
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action?.payload;
      setItemToLS(LS_CUSTOMERS, action?.payload, true);
    },
    addCustomer: (state, action) => {
      const currentCustomers = [...state.customers];
      const modifiedCustomers = [...currentCustomers, { ...action?.payload }];
      state.customers = modifiedCustomers;
      setItemToLS(LS_CUSTOMERS, modifiedCustomers, true);
    },
    editCustomer: (state, action) => {
      const modifiedCustomers = state?.customers?.map((item) => {
        if (item?.id === action?.payload?.id) return { ...action?.payload };
        return item;
      });
      state.customers = modifiedCustomers;
      setItemToLS(LS_CUSTOMERS, modifiedCustomers, true);
    },
    deleteCustomer: (state, action) => {
      const filteredCustomers = state?.customers?.filter(
        (item) => item?.id !== action?.payload?.id
      );
      state.customers = filteredCustomers;
      setItemToLS(LS_CUSTOMERS, filteredCustomers, true);
    }
  }
});

export const { setCustomers, addCustomer, editCustomer, deleteCustomer } = customersSlice.actions;

export default customersSlice.reducer;
