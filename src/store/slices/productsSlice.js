import { createSlice } from "@reduxjs/toolkit";

// import { MODES } from "utils/constants";

const initialState = {
  products: [],
  selectedProudctInitialValue: {},
  selectedProudct: {},
  newProudct: {},
  pageMode: ""
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action?.payload;
    }
  }
});

export const { setProducts } = productsSlice.actions;

export default productsSlice.reducer;
