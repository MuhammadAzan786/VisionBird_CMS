import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mobileOpen: false,
  isClosing: false,
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    setMobileOpen(state, action) {
      state.mobileOpen = action.payload;
    },
    setIsClosing(state, action) {
      state.isClosing = action.payload;
    },
  },
});

export const { setMobileOpen, setIsClosing } = toggleSlice.actions;

export default toggleSlice.reducer;
