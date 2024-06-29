import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [
    {
      invoiceNumber: "JT20232024TX00001",
      customerName: "SRINIWAS & CO",
      createdAt: "2023-11-10",
      status: "paid",
      totalAmount: 22440,
      noOfBales: 2,
      lrNumber: "ABC123",
      lrDate: "2023-11-10",
      products: [
        {
          productName: "PLATINUM WHITE SHIRT (H)",
          productQuantityPieces: 50,
          productQuantityMeters: null,
          productRate: 185
        },
        {
          productName: "PLATINUM WHITE SHIRT (F)",
          productQuantityPieces: 30,
          productQuantityMeters: null,
          productRate: 205
        },
        {
          productName: "Gray Cloth",
          productQuantityPieces: 10,
          productQuantityMeters: 200,
          productRate: 3.2
        },
        {
          productName: "Gray Cloth - B",
          productQuantityPieces: null,
          productQuantityMeters: 200,
          productRate: 3.2
        }
      ]
    },
    {
      invoiceNumber: "JT20232024TX00002",
      customerName: "SIVANANDA TEXTILES & READYMADES",
      createdAt: "2023-11-11",
      status: "unpaid",
      totalAmount: 13000
    },
    {
      invoiceNumber: "JT20232024TX00003",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-12",
      status: "unpaid",
      totalAmount: 25000
    },
    {
      invoiceNumber: "JT20232024TX00004",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-13",
      status: "unpaid",
      totalAmount: 10000
    },
    {
      invoiceNumber: "JT20232024TX00005",
      customerName: "SRI BHAVANI HANDLOOM STORES",
      createdAt: "2023-11-14",
      status: "paid",
      totalAmount: 16500
    },
    {
      invoiceNumber: "JT20232024TX00012",
      customerName:
        "SRI BHAVANI HANDLOOM STORES SRI BHAVANI HANDLOOM STORES SRI BHAVANI HANDLOOM STORES",
      createdAt: "2023-11-14",
      status: "paid",
      totalAmount: 16500
    },
    {
      invoiceNumber: "JT20232024TX00011",
      customerName: "RANJANAAS READYMADES & SAREES",
      createdAt: "2023-11-15",
      status: "unpaid",
      totalAmount: 21500
    },
    {
      invoiceNumber: "JT20232024TX00006",
      customerName: "RANJANAAS READYMADES & SAREES",
      createdAt: "2023-11-15",
      status: "unpaid",
      totalAmount: 21500
    },
    {
      invoiceNumber: "JT20232024TX00007",
      customerName: "SRINIWAS & CO",
      createdAt: "2023-11-10",
      status: "paid",
      totalAmount: 30000
    },
    {
      invoiceNumber: "JT20232024TX00008",
      customerName: "SIVANANDA TEXTILES & READYMADES",
      createdAt: "2023-11-11",
      status: "unpaid",
      totalAmount: 13000
    },
    {
      invoiceNumber: "JT20232024TX00009",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-12",
      status: "unpaid",
      totalAmount: 25000
    },
    {
      invoiceNumber: "JT20232024TX00010",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-13",
      status: "unpaid",
      totalAmount: 10000
    }
  ],
  selectedInvoice: {},
  viewMode: ""
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      // TODO: rework logic
      state.invoices = action.payload;
    },
    setInvoice: (state, action) => {
      const filteredInvoice = state.invoices.filter(
        (item) => item.invoiceNumber === action.payload
      )[0];
      state.selectedInvoice = filteredInvoice;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    }
  }
});

export const { setInvoices, setInvoice, setViewMode } = invoicesSlice.actions;

export default invoicesSlice.reducer;
