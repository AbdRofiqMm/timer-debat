"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  decrementTime,
  resetTimer,
  setTime,
  startTimer,
} from "@/lib/timerSlice";

const CountDownPage = () => {
  const [inputMinutes, setInputMinutes] = useState<number>(1); // Default select is 1 minute
  const [hasMounted, setHasMounted] = useState(false); // Track if component has mounted
  const dispatch = useDispatch();

  const { isActive, isTimeSet, timeLeft } = useSelector(
    (state: RootState) => state.timer
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the interval

  // Ensure component is only rendered on the client
  useEffect(() => {
    setHasMounted(true); // Set state to true after mounting
    dispatch(resetTimer()); // Reset timer on component mount (page reload)
  }, [dispatch]);

  // Handle setting the time
  const handleSetTime = () => {
    if (!isActive) {
      dispatch(setTime(inputMinutes * 60)); // Convert minutes to seconds
    }
  };

  // Handle starting the timer
  const handleStart = () => {
    if (!isActive && isTimeSet) {
      dispatch(startTimer());
    }
  };

  // Clear interval to avoid duplication
  const clearTimerInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      clearTimerInterval(); // Ensure no duplicate interval is running
      intervalRef.current = setInterval(() => {
        dispatch(decrementTime());
      }, 1000); // Decrease time every second
    } else if (timeLeft <= 0) {
      clearTimerInterval(); // Stop the timer when time is up
    }

    // Clean up interval on component unmount
    return () => {
      clearTimerInterval();
    };
  }, [isActive, timeLeft, dispatch]);

  const handleReset = () => {
    dispatch(resetTimer());
    clearTimerInterval(); // Clear interval on reset
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputMinutes(Number(e.target.value));
  };

  // Format time as mm:ss
  const formatTime = (): string => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Only render the component if it has mounted
  if (!hasMounted) {
    return null; // Return null until the component has mounted to prevent hydration error
  }

  return (
    <div className="w-[300px]">
      <div
        style={{ fontSize: "6rem" }}
        className="flex items-center justify-center"
      >
        {formatTime()}
      </div>

      <div className="flex flex-col gap-2 mb-4 mt-6">
        <label htmlFor="minutesSelect">Set Minutes: </label>
        <select
          id="minutesSelect"
          value={inputMinutes}
          onChange={handleSelectChange}
          disabled={isActive}
          className="border-2 border-slate-700 rounded-md p-2 text-slate-800 w-full"
        >
          <option value={1}>1 minute</option>
          <option value={2}>2 minutes</option>
          <option value={3}>3 minutes</option>
          <option value={4}>4 minutes</option>
          <option value={5}>5 minutes</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleSetTime}
          disabled={isActive || inputMinutes <= 0}
          className={`${
            isActive ? "bg-slate-400" : "bg-slate-700 "
          } rounded-md w-full p-4`}
        >
          Set Timer
        </button>

        <button
          onClick={handleStart}
          disabled={!isTimeSet || isActive}
          className={`${
            isActive ? "bg-blue-200" : "bg-blue-400"
          } w-full rounded-md p-4`}
        >
          Start
        </button>

        <button
          onClick={handleReset}
          disabled={!isTimeSet && !isActive}
          className={`${
            !isTimeSet && !isActive ? "bg-red-300" : "bg-red-400"
          } w-full rounded-md p-4`}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default CountDownPage;
