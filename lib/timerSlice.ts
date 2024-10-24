import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Helper function to save timer state to LocalStorage
const saveToLocalStorage = (state: TimerState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("timerState", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }
};

// Load initial timer state from LocalStorage
const loadFromLocalStorage = (): TimerState | null => {
  if (typeof window !== "undefined") {
    try {
      const savedState = localStorage.getItem("timerState");
      return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return null;
    }
  }
  return null;
};

interface TimerState {
  timeLeft: number;
  isActive: boolean;
  isTimeSet: boolean;
}

// Set the initial state either from localStorage or default values
const initialState: TimerState = loadFromLocalStorage() || {
  timeLeft: 0,
  isActive: false,
  isTimeSet: false,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setTime: (state, action: PayloadAction<number>) => {
      state.timeLeft = action.payload;
      state.isTimeSet = true;
      state.isActive = false;
      saveToLocalStorage(state); // Save state on timer set
    },
    startTimer: (state) => {
      state.isActive = true;
      saveToLocalStorage(state); // Save state on timer start
    },
    decrementTime: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      } else {
        state.isActive = false; // Stop timer when it reaches 0
      }
    },
    resetTimer: (state) => {
      state.timeLeft = 0;
      state.isActive = false;
      state.isTimeSet = false;
      saveToLocalStorage(state); // Save state on timer reset
    },
  },
});

export const { setTime, startTimer, decrementTime, resetTimer } =
  timerSlice.actions;

export default timerSlice.reducer;
