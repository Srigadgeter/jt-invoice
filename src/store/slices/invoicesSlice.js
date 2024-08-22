import { createSlice } from "@reduxjs/toolkit";

import { MODES } from "utils/constants";
import { getSum } from "utils/utilites";

const initialState = {
  invoices: [],
  logisticsList: [],
  transportDestinationList: [],
  selectedInvoiceInitialValue: {},
  selectedInvoice: {},
  newInvoice: {},
  pageMode: ""
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    resetInvoiceValues: (state) => {
      state.selectedInvoiceInitialValue = {};
      state.selectedInvoice = {};
      state.newInvoice = {};
    },
    setList: (state, action) => {
      const { invoices, name } = action.payload;
      const listMap = new Map();
      invoices.forEach((invoice) => listMap.set(invoice[name]?.value, invoice[name]?.label));
      const arr = Array.from(listMap, ([key, value]) => ({
        value: key,
        label: value
      }));
      state[`${name}List`] = arr;
    },
    setAllList: (state, action) => {
      invoicesSlice.caseReducers.setList(state, {
        payload: {
          invoices: action?.payload,
          name: "logistics"
        }
      });
      invoicesSlice.caseReducers.setList(state, {
        payload: {
          invoices: action?.payload,
          name: "transportDestination"
        }
      });
    },
    setInvoices: (state, action) => {
      state.invoices = action?.payload;
      invoicesSlice.caseReducers.setAllList(state, action);
    },
    setInvoice: (state, action) => {
      const filteredInvoice = state?.invoices?.filter((item) => item?.id === action?.payload)?.[0];
      state.selectedInvoice = filteredInvoice;
      state.selectedInvoiceInitialValue = filteredInvoice;
    },
    addInvoice: (state, action) => {
      const updatedInvoices = [...state.invoices];
      const newNumber = state.invoices.length + 1;
      updatedInvoices.push({ ...action?.payload, invoiceNumber: `JT20232024TX0000${newNumber}` });
      state.invoices = updatedInvoices;
      invoicesSlice.caseReducers.resetInvoiceValues(state);
    },
    editInvoice: (state, action) => {
      const modifiedInvoices = state?.invoices?.map((item) => {
        if (item?.invoiceNumber === action?.payload?.invoiceNumber) return { ...action?.payload };
        return item;
      });
      state.invoices = modifiedInvoices;
      invoicesSlice.caseReducers.resetInvoiceValues();
    },
    setPageMode: (state, action) => {
      state.pageMode = action?.payload;
    },
    setTotalAmount: (state, action) => {
      const { key = null } = action?.payload ?? {};
      if (key) {
        state[key] = {
          ...state?.[key],
          totalAmount: Math.ceil(
            getSum([...(state?.[key]?.products ?? [])], "productAmountInclGST") +
              getSum([...(state?.[key]?.extras ?? [])], "amount")
          )
        };
      }
    },
    addFn: (state, action) => {
      const { fieldKey = null, propKey = null, errorMessage = "", ...rest } = action?.payload ?? {};

      if (fieldKey && propKey && errorMessage) {
        const stateKey = state?.pageMode === MODES?.NEW ? "newInvoice" : "selectedInvoice";

        const isProductAlreadyPresent = state?.[stateKey]?.[fieldKey]?.find(
          (item) => item?.[propKey]?.value === action?.payload?.[propKey]?.value
        );

        if (!isProductAlreadyPresent) {
          state[stateKey] = {
            ...state?.[stateKey],
            [fieldKey]: [...(state?.[stateKey]?.[fieldKey] ?? []), { ...rest }]
          };
          invoicesSlice.caseReducers.setTotalAmount(state, { payload: { key: stateKey } });
        } else throw new Error(errorMessage);
      }
    },
    editFn: (state, action) => {
      const {
        itemIndex,
        fieldKey = null,
        propKey = null,
        errorMessage = "",
        ...rest
      } = action?.payload ?? {};

      if (fieldKey && propKey && errorMessage && itemIndex >= 0) {
        const stateKey = state?.pageMode === MODES?.NEW ? "newInvoice" : "selectedInvoice";

        const indexFound = state?.[stateKey]?.[fieldKey]?.findIndex(
          (item) => item?.[propKey]?.value === action?.payload?.[propKey]?.value
        );

        const isProductAlreadyPresent = indexFound >= 0 && indexFound !== itemIndex;

        if (!isProductAlreadyPresent) {
          const modifiedProducts = state?.[stateKey]?.[fieldKey]?.map((item, index) => {
            if (itemIndex === index) return { ...rest };
            return item;
          });
          state[stateKey] = {
            ...state?.[stateKey],
            [fieldKey]: [...modifiedProducts]
          };
          invoicesSlice.caseReducers.setTotalAmount(state, { payload: { key: stateKey } });
        } else throw new Error(errorMessage);
      }
    },
    removeFn: (state, action) => {
      const { fieldKey = null, propKey = null } = action?.payload ?? {};

      if (fieldKey && propKey) {
        const stateKey = state?.pageMode === MODES?.NEW ? "newInvoice" : "selectedInvoice";

        const filteredProducts = state?.[stateKey]?.[fieldKey]?.filter(
          (item) => item?.[propKey]?.value !== action?.payload?.[propKey]?.value
        );

        state[stateKey] = {
          ...state?.[stateKey],
          [fieldKey]: [...filteredProducts]
        };
        invoicesSlice.caseReducers.setTotalAmount(state, { payload: { key: stateKey } });
      }
    },
    addProduct: (state, action) => {
      invoicesSlice.caseReducers.addFn(state, {
        payload: {
          ...(action?.payload ?? {}),
          fieldKey: "products",
          propKey: "productName",
          errorMessage: "This product has already been added to the invoice"
        }
      });
    },
    editProduct: (state, action) => {
      invoicesSlice.caseReducers.editFn(state, {
        payload: {
          ...(action?.payload ?? {}),
          fieldKey: "products",
          propKey: "productName",
          errorMessage: "This product has already been added to the invoice"
        }
      });
    },
    removeProduct: (state, action) => {
      invoicesSlice.caseReducers.removeFn(state, {
        payload: {
          ...(action?.payload ?? {}),
          fieldKey: "products",
          propKey: "productName"
        }
      });
    },
    addExtra: (state, action) => {
      invoicesSlice.caseReducers.addFn(state, {
        payload: {
          ...(action?.payload ?? {}),
          fieldKey: "extras",
          propKey: "reason",
          errorMessage: "This item has already been added as an extra to the invoice"
        }
      });
    },
    editExtra: (state, action) => {
      invoicesSlice.caseReducers.editFn(state, {
        payload: {
          ...(action?.payload ?? {}),
          fieldKey: "extras",
          propKey: "reason",
          errorMessage: "This item has already been added as an extra to the invoice"
        }
      });
    },
    removeExtra: (state, action) => {
      invoicesSlice.caseReducers.removeFn(state, {
        payload: {
          ...(action?.payload ?? {}),
          fieldKey: "extras",
          propKey: "reason"
        }
      });
    }
  }
});

export const {
  resetInvoiceValues,
  setInvoices,
  setInvoice,
  addInvoice,
  editInvoice,
  setPageMode,
  addProduct,
  editProduct,
  removeProduct,
  addExtra,
  editExtra,
  removeExtra
} = invoicesSlice.actions;

export default invoicesSlice.reducer;
