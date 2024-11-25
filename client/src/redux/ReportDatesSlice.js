import { createSlice } from "@reduxjs/toolkit";

// Initial state for highlighted dates
const initialState = {
  dates: [],
};

// Create slice
const highlightedDatesSlice = createSlice({
  name: "highlightedDates",
  initialState,
  reducers: {
    addHighlightedDate: (state, action) => {
      state.dates.push(new Date(action.payload)); // Add new highlighted date
    },
    setHighlightedDates: (state, action) => {
      state.dates = action.payload.map((date) => new Date(date)); // Set initial dates from API
    },
  },
});

// Export the actions
export const { addHighlightedDate, setHighlightedDates } =
  highlightedDatesSlice.actions;

// Export the reducer
export default highlightedDatesSlice.reducer;
