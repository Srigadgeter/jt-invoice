import { createSlice } from "@reduxjs/toolkit";

import { MODES } from "utils/constants";
import { getSum } from "utils/utilites";

const initialState = {
  invoices: [],
  selectedInvoiceInitialValue: {},
  selectedInvoice: {},
  newInvoice: {},
  pageMode: ""
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    serializeData: (state, action) => {
      const invoiceArray = action?.payload;

      return invoiceArray.map((invoice) => {
        const modifiedData = {};
        Object.entries(invoice).forEach(([key, value]) => {
          // TODO: Serialize firebase reference data
          // Serializing firebase timestamp data
          if (value && (value instanceof Date || typeof value.toDate === "function"))
            modifiedData[key] = value.toDate();
          else modifiedData[key] = value;
        });
        return modifiedData;
      });
    },
    setInvoices: (state, action) => {
      const serializedData = invoicesSlice.caseReducers.serializeData(state, action);
      state.invoices = [...serializedData];
    },
    setInvoice: (state, action) => {
      const filteredInvoice = state?.invoices?.filter(
        (item) => item?.invoiceNumber === action?.payload
      )[0];
      state.selectedInvoice = filteredInvoice;
      state.selectedInvoiceInitialValue = filteredInvoice;
    },
    addInvoice: (state, action) => {
      const updatedInvoices = [...state.invoices];
      const newNumber = state.invoices.length + 1;
      updatedInvoices.push({ ...action?.payload, invoiceNumber: `JT20232024TX0000${newNumber}` });
      state.invoices = updatedInvoices;
      state.newInvoice = {};
    },
    editInvoice: (state, action) => {
      const modifiedInvoices = state?.invoices?.map((item) => {
        if (item?.invoiceNumber === action?.payload?.invoiceNumber) return { ...action?.payload };
        return item;
      });
      state.invoices = modifiedInvoices;
      state.selectedInvoice = {};
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
          errorMessage: "Product already added to the invoice"
        }
      });
    },
    editProduct: (state, action) => {
      invoicesSlice.caseReducers.editFn(state, {
        payload: {
          ...(action?.payload ?? {}),
          fieldKey: "products",
          propKey: "productName",
          errorMessage: "Product already added to the invoice"
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
          errorMessage: "This extra already added to the invoice"
        }
      });
    },
    editExtra: (state, action) => {
      invoicesSlice.caseReducers.editFn(state, {
        payload: {
          ...(action?.payload ?? {}),
          fieldKey: "extras",
          propKey: "reason",
          errorMessage: "This extra already added to the invoice"
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
