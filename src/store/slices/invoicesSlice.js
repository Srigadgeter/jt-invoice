import { createSlice } from "@reduxjs/toolkit";

import { MODES } from "utils/constants";
import { getSum } from "utils/utilites";

const initialState = {
  invoices: [
    {
      invoiceNumber: "JT20232024TX00001",
      customerName: "SRINIWAS & CO",
      createdAt: "2023-11-10",
      invoiceDate: "2023-11-10",
      paymentStatus: "paid",
      paymentDate: "2023-12-08",
      totalAmount: 22440,
      noOfBales: 2,
      lrNumber: "ABC123",
      lrDate: "2023-11-10",
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
          productAmount: 1234567.89,
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
          reason: "Bus Fare",
          amount: 1000
        }
      ]
    },
    {
      invoiceNumber: "JT20232024TX00002",
      customerName: "SIVANANDA TEXTILES & READYMADES",
      createdAt: "2023-11-11",
      invoiceDate: "2023-11-11",
      paymentStatus: "unpaid",
      totalAmount: 1300
    },
    {
      invoiceNumber: "JT20232024TX00003",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-12",
      invoiceDate: "2023-11-12",
      paymentStatus: "unpaid",
      totalAmount: 2500
    },
    {
      invoiceNumber: "JT20232024TX00004",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-13",
      invoiceDate: "2023-11-13",
      paymentStatus: "unpaid",
      totalAmount: 10000
    },
    {
      invoiceNumber: "JT20232024TX00005",
      customerName: "SRI BHAVANI HANDLOOM STORES",
      createdAt: "2023-11-14",
      invoiceDate: "2023-11-14",
      paymentStatus: "paid",
      paymentDate: "2023-12-01",
      totalAmount: 16500
    },
    {
      invoiceNumber: "JT20232024TX00012",
      customerName:
        "SRI BHAVANI HANDLOOM STORES SRI BHAVANI HANDLOOM STORES SRI BHAVANI HANDLOOM STORES",
      createdAt: "2023-11-14",
      invoiceDate: "2023-11-14",
      paymentStatus: "paid",
      paymentDate: "2023-12-03",
      totalAmount: 16500
    },
    {
      invoiceNumber: "JT20232024TX00011",
      customerName: "RANJANAAS READYMADES & SAREES",
      createdAt: "2023-11-15",
      invoiceDate: "2023-11-15",
      paymentStatus: "unpaid",
      totalAmount: 21500
    },
    {
      invoiceNumber: "JT20232024TX00006",
      customerName: "RANJANAAS READYMADES & SAREES",
      createdAt: "2023-11-15",
      invoiceDate: "2023-11-15",
      paymentStatus: "unpaid",
      totalAmount: 21500
    },
    {
      invoiceNumber: "JT20232024TX00007",
      customerName: "SRINIWAS & CO",
      createdAt: "2023-11-10",
      invoiceDate: "2023-11-10",
      paymentStatus: "paid",
      paymentDate: "2023-12-05",
      totalAmount: 30000
    },
    {
      invoiceNumber: "JT20232024TX00008",
      customerName: "SIVANANDA TEXTILES & READYMADES",
      createdAt: "2023-11-11",
      invoiceDate: "2023-11-11",
      paymentStatus: "unpaid",
      totalAmount: 1300
    },
    {
      invoiceNumber: "JT20232024TX00009",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-12",
      invoiceDate: "2023-11-12",
      paymentStatus: "unpaid",
      totalAmount: 2500
    },
    {
      invoiceNumber: "JT20232024TX00010",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-13",
      invoiceDate: "2023-11-13",
      paymentStatus: "unpaid",
      totalAmount: 1000
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
  setPageMode,
  addProduct,
  editProduct,
  removeProduct,
  addExtra,
  editExtra,
  removeExtra
} = invoicesSlice.actions;

export default invoicesSlice.reducer;
