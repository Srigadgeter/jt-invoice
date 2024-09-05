import { createSlice } from "@reduxjs/toolkit";

import { getNow } from "utils/utilites";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      state.push({ id: getNow(), ...action.payload });
    },
    removeNotification: (state, action) =>
      state.filter((notification) => notification.id !== action.payload)
  }
});

export const { addNotification, removeNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;
