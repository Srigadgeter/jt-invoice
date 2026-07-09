import { createSlice } from "@reduxjs/toolkit";

import { LOCALSTORAGE_KEYS } from "utils/constants";
import { setItemToLS } from "utils/utilites";

const { LS_PROFILE } = LOCALSTORAGE_KEYS;

const initialState = {
  profile: {}
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileSlice: (state) => {
      state.profile = initialState.profile;
    },
    setProfile: (state, action) => {
      state.profile = action?.payload;
      setItemToLS(LS_PROFILE, action?.payload, true);
    }
  }
});

export const { clearProfileSlice, setProfile } = profileSlice.actions;

export default profileSlice.reducer;
