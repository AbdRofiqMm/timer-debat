import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Helper function to save timer state to LocalStorage
const saveToLocalStorage = (state: TimerState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("timerState", JSON.stringify(state));
  }
};

// Load initial timer state from LocalStorage if it exists
const loadFromLocalStorage = (): TimerState | null => {
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("timerState");
    return savedState ? JSON.parse(savedState) : null;
  }
  return null;
};

interface TimerState {
  timeLeft: number;
  isActive: boolean;
  isTimeSet: boolean;
}

const initialState: TimerState = {
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
      saveToLocalStorage(state);
    },
    startTimer: (state) => {
      state.isActive = true;
      saveToLocalStorage(state);
    },
    decrementTime: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
        saveToLocalStorage(state);
      }
    },
    resetTimer: (state) => {
      state.timeLeft = 0;
      state.isActive = false;
      state.isTimeSet = false;
      saveToLocalStorage(state);
    },
  },
});

// export const timerSlice = createSlice({
//   name: "timer",
//   initialState,
//   reducers: {
//     setTime: (state, action: PayloadAction<number>) => {
//       state.timeLeft = action.payload;
//       state.isTimeSet = true;
//     },
//     startTimer: (state) => {
//       state.isActive = true;
//     },
//     decrementTime: (state) => {
//       if (state.timeLeft > 0) {
//         state.timeLeft -= 1;
//       }
//     },
//     resetTimer: (state) => {
//       state.timeLeft = 0;
//       state.isActive = false;
//       state.isTimeSet = false;
//     },
//   },
// });

export const { setTime, startTimer, decrementTime, resetTimer } =
  timerSlice.actions;

export default timerSlice.reducer;
