import { createSlice } from "@reduxjs/toolkit";

import { setItemToLS } from "utils/utilites";
import { LOCALSTORAGE_KEYS } from "utils/constants";

const { LS_PRODUCTS } = LOCALSTORAGE_KEYS;

const initialState = {
  products: []
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action?.payload;
      setItemToLS(LS_PRODUCTS, action?.payload, true);
    },
    addProduct: (state, action) => {
      const currentProducts = [...state.products];
      const modifiedProducts = [...currentProducts, { ...action?.payload }];
      state.products = modifiedProducts;
      setItemToLS(LS_PRODUCTS, modifiedProducts, true);
    },
    editProduct: (state, action) => {
      const modifiedProducts = state?.products?.map((item) => {
        if (item?.id === action?.payload?.id) return { ...action?.payload };
        return item;
      });
      state.products = modifiedProducts;
      setItemToLS(LS_PRODUCTS, modifiedProducts, true);
    },
    deleteProduct: (state, action) => {
      const filteredProducts = state?.products?.filter((item) => item?.id !== action?.payload?.id);
      state.products = filteredProducts;
      setItemToLS(LS_PRODUCTS, filteredProducts, true);
    }
  }
});

export const { setProducts, addProduct, editProduct, deleteProduct } = productsSlice.actions;

export default productsSlice.reducer;
