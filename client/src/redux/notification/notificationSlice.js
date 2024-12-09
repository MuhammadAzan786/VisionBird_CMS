import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial State
const initialState = {
  notifications: [],
  status: "idle",
  error: null,
};

export const fetchNotifications = createAsyncThunk("notification/fetchNotifications", async (userId) => {
  try {
    const res = await axios.get(`/api/notification/user/${userId}`);
    return res.data;
  } catch (error) {
    console.log(error);

    return;
  }
});

// Slice
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
