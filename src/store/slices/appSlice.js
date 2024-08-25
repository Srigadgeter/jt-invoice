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
    toggleTheme: (state) => {
      state.appTheme = state.appTheme === DEFAULT_LIGHT ? DEFAULT_DARK : DEFAULT_LIGHT;
    }
  }
});

export const { toggleTheme } = appSlice.actions;

export default appSlice.reducer;
