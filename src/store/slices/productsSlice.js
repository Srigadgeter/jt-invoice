import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: []
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action?.payload;
    },
    addProduct: (state, action) => {
      const currentProducts = [...state.products];
      state.products = [...currentProducts, { ...action?.payload }];
    },
    editProduct: (state, action) => {
      const modifiedProducts = state?.products?.map((item) => {
        if (item?.id === action?.payload?.id) return { ...action?.payload };
        return item;
      });
      state.products = modifiedProducts;
    },
    deleteProduct: (state, action) => {
      const filteredProducts = state?.products?.filter((item) => item?.id !== action?.payload?.id);
      state.products = filteredProducts;
    }
  }
});

export const { setProducts, addProduct, editProduct, deleteProduct } = productsSlice.actions;

export default productsSlice.reducer;
