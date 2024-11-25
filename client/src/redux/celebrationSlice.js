// celebrationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  celebrationData: null, // Store the celebration data (could be an object or null initially)
  showCelebration: false, // Control visibility of celebration
};

const celebrationSlice = createSlice({
  name: 'celebration',
  initialState,
  reducers: {
    setCelebrationData: (state, action) => {
      state.celebrationData = action.payload; // Set the celebration data
    },
    setShowCelebration: (state, action) => {
      state.showCelebration = action.payload; // Show or hide the celebration
    },
    resetCelebration: (state) => {
      state.celebrationData = null; // Reset celebration data
      state.showCelebration = false; // Hide celebration
    },
  },
});

// Export actions to use in components
export const { setCelebrationData, setShowCelebration, resetCelebration } = celebrationSlice.actions;

// Export the reducer to be added to the store
export default celebrationSlice.reducer;
