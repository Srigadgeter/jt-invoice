import { createSlice } from "@reduxjs/toolkit";

import { LOCALSTORAGE_KEYS } from "utils/constants";
import { setItemToLS, sortByStringProperty } from "utils/utilites";

const { LS_CUSTOMERS } = LOCALSTORAGE_KEYS;

const initialState = {
  customers: [],
  sourceList: []
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearCustomersSlice: (state) => {
      state.customers = initialState.customers;
      state.sourceList = initialState.sourceList;
    },
    setSourceList: (state, action) => {
      const customers = action.payload;
      const listMap = new Map();

      customers.forEach((customer) => {
        if (customer?.source?.value && customer?.source?.label) {
          listMap.set(customer?.source?.value, customer?.source?.label);
        }
      });
      const arr = Array.from(listMap, ([key, value]) => ({
        value: key,
        label: value
      }));
      sortByStringProperty(arr, "value");

      state.sourceList = arr;
    },
    setCustomers: (state, action) => {
      state.customers = action?.payload;
      setItemToLS(LS_CUSTOMERS, action?.payload, true);
      customersSlice.caseReducers.setSourceList(state, action);
    },
    addCustomer: (state, action) => {
      const currentCustomers = [...state.customers];
      const modifiedCustomers = [...currentCustomers, { ...action?.payload }];
      state.customers = modifiedCustomers;
      setItemToLS(LS_CUSTOMERS, modifiedCustomers, true);
      customersSlice.caseReducers.setSourceList(state, {
        payload: [...modifiedCustomers]
      });
    },
    editCustomer: (state, action) => {
      const modifiedCustomers = state?.customers?.map((item) => {
        if (item?.id === action?.payload?.id) return { ...action?.payload };
        return item;
      });
      state.customers = modifiedCustomers;
      setItemToLS(LS_CUSTOMERS, modifiedCustomers, true);
      customersSlice.caseReducers.setSourceList(state, {
        payload: [...modifiedCustomers]
      });
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

export const { clearCustomersSlice, setCustomers, addCustomer, editCustomer, deleteCustomer } =
  customersSlice.actions;

export default customersSlice.reducer;
