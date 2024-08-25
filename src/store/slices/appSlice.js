import { createSlice } from "@reduxjs/toolkit";

import { DEFAULT_DARK, DEFAULT_LIGHT } from "utils/constants";

const initialState = {
  user: {},
  appTheme: process.env.REACT_APP_THEME || DEFAULT_LIGHT
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.appTheme = action.payload;
    },
    toggleTheme: (state) => {
      state.appTheme = state.appTheme === DEFAULT_LIGHT ? DEFAULT_DARK : DEFAULT_LIGHT;
    }
  }
});

export const { setTheme, toggleTheme } = appSlice.actions;

export default appSlice.reducer;
