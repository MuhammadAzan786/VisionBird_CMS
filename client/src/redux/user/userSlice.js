import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  salaryMonthAndYear: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setSalaryMonthAndYear: (state) => {
      state.salaryMonthAndYear = action.payload;
    },
  },
});

export const { loginSuccess, signOut } = userSlice.actions;

export default userSlice.reducer;
