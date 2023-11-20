import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [
    {
      invoiceNumber: "JT20232024TX00001",
      customerName: "SRINIWAS & CO",
      createdDate: "10/11/2023",
      status: "paid",
      amount: 30000
    },
    {
      invoiceNumber: "JT20232024TX00002",
      customerName: "SIVANANDA TEXTILES & READYMADES",
      createdDate: "11/11/2023",
      status: "unpaid",
      amount: 13000
    },
    {
      invoiceNumber: "JT20232024TX00003",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdDate: "12/11/2023",
      status: "unpaid",
      amount: 25000
    },
    {
      invoiceNumber: "JT20232024TX00004",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdDate: "13/11/2023",
      status: "unpaid",
      amount: 10000
    },
    {
      invoiceNumber: "JT20232024TX00005",
      customerName: "SRI BHAVANI HANDLOOM STORES",
      createdDate: "14/11/2023",
      status: "paid",
      amount: 16500
    },
    {
      invoiceNumber: "JT20232024TX00012",
      customerName:
        "SRI BHAVANI HANDLOOM STORES SRI BHAVANI HANDLOOM STORES SRI BHAVANI HANDLOOM STORES",
      createdDate: "14/11/2023",
      status: "paid",
      amount: 16500
    },
    {
      invoiceNumber: "JT20232024TX00011",
      customerName: "RANJANAAS READYMADES & SAREES",
      createdDate: "15/11/2023",
      status: "unpaid",
      amount: 21500
    },
    {
      invoiceNumber: "JT20232024TX00006",
      customerName: "RANJANAAS READYMADES & SAREES",
      createdDate: "15/11/2023",
      status: "unpaid",
      amount: 21500
    },
    {
      invoiceNumber: "JT20232024TX00007",
      customerName: "SRINIWAS & CO",
      createdDate: "10/11/2023",
      status: "paid",
      amount: 30000
    },
    {
      invoiceNumber: "JT20232024TX00008",
      customerName: "SIVANANDA TEXTILES & READYMADES",
      createdDate: "11/11/2023",
      status: "unpaid",
      amount: 13000
    },
    {
      invoiceNumber: "JT20232024TX00009",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdDate: "12/11/2023",
      status: "unpaid",
      amount: 25000
    },
    {
      invoiceNumber: "JT20232024TX00010",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdDate: "13/11/2023",
      status: "unpaid",
      amount: 10000
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
      state.selectedInvoice = state.invoices.filter(
        (item) => item.invoiceNumber === action.payload
      );
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    }
  }
});

export const { setInvoices, setInvoice, setViewMode } = invoicesSlice.actions;

export default invoicesSlice.reducer;
