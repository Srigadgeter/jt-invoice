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
      status: "unpaid",
      totalAmount: 1300
    },
    {
      invoiceNumber: "JT20232024TX00003",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-12",
      status: "unpaid",
      totalAmount: 2500
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
      totalAmount: 1300
    },
    {
      invoiceNumber: "JT20232024TX00009",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-12",
      status: "unpaid",
      totalAmount: 2500
    },
    {
      invoiceNumber: "JT20232024TX00010",
      customerName: "SHREE VENKATESHWARA SILKS",
      createdAt: "2023-11-13",
      status: "unpaid",
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
    }
  }
});

export const { setInvoices, setInvoice, setPageMode } = invoicesSlice.actions;

export default invoicesSlice.reducer;
