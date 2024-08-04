import { createSlice } from "@reduxjs/toolkit";

import { MODES } from "utils/constants";
import { getSum } from "utils/utilites";

const initialState = {
  invoices: [
    {
      invoiceNumber: "JT20232024TX00001",
      createdAt: "2023-11-10",
      invoiceDate: "2023-11-10",
      baleCount: 2,
      paymentStatus: "paid",
      paymentDate: "2023-12-08",
      lrNumber: "ABC1234",
      lrDate: "2023-11-10",
      logistics: { value: "mss", label: "MSS" },
      transportDestination: { value: "namakkal", label: "Namakkal" },
      customerName: { value: "sriniwas-&-co", label: "Sriniwas & Co" },
      products: [
        {
          productName: { value: "platinum-white-shirt-f", label: "Platinum White Shirt (F)" },
          productQuantityPieces: 50,
          productQuantityMeters: null,
          productRate: 185,
          productAmount: 1000,
          producGstAmount: 50,
          productAmountInclGST: 1050
        },
        {
          productName: { value: "platinum-white-shirt-h", label: "Platinum White Shirt (H)" },
          productQuantityPieces: 50,
          productQuantityMeters: null,
          productRate: 185,
          productAmount: 1000,
          producGstAmount: 50,
          productAmountInclGST: 1050
        },
        {
          productName: { value: "aim-spray-shirt-f", label: "Aim Spray Shirt (F)" },
          productQuantityPieces: 30,
          productQuantityMeters: null,
          productRate: 205,
          productAmount: 1000,
          producGstAmount: 50,
          productAmountInclGST: 1050
        },
        {
          productName: { value: "style-one-shirt-h", label: "Style One Shirt (H)" },
          productQuantityPieces: 10,
          productQuantityMeters: null,
          productRate: 130,
          productAmount: 1000,
          producGstAmount: 50,
          productAmountInclGST: 1050
        },
        {
          productName: { value: "gray-cloth-20x20", label: "Gray Cloth 20x20" },
          productQuantityPieces: 10,
          productQuantityMeters: 200,
          productRate: 3,
          productAmount: 1000,
          producGstAmount: 50,
          productAmountInclGST: 1050
        },
        {
          productName: { value: "gray-cloth-40x50", label: "Gray Cloth 40x50" },
          productQuantityPieces: 30,
          productQuantityMeters: 200,
          productRate: 3.3,
          productAmount: 1000,
          producGstAmount: 50,
          productAmountInclGST: 1050
        }
      ],
      extras: [
        {
          reason: { value: "bus-fare", label: "Bus Fare" },
          amount: 1000
        }
      ],
      totalAmount: 7300
    }
  ],
  selectedInvoice: {},
  newInvoice: {},
  pageMode: ""
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      // TODO: rework logic
      state.invoices = action?.payload;
    },
    setInvoice: (state, action) => {
      const filteredInvoice = state?.invoices?.filter(
        (item) => item?.invoiceNumber === action?.payload
      )[0];
      state.selectedInvoice = filteredInvoice;
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
