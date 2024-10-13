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
    clearAppSlice: (state) => {
      state.user = initialState.user;
      state.appTheme = initialState.appTheme;
    },
    setTheme: (state, action) => {
      state.appTheme = action.payload;
    },
    toggleTheme: (state) => {
      state.appTheme = state.appTheme === DEFAULT_LIGHT ? DEFAULT_DARK : DEFAULT_LIGHT;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const { clearAppSlice, setTheme, toggleTheme, setUser } = appSlice.actions;

export default appSlice.reducer;
