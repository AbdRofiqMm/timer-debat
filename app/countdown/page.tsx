"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  decrementTime,
  resetTimer,
  setTime,
  startTimer,
} from "@/lib/timerSlice";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

const CountDownPage = () => {
  const [inputMinutes, setInputMinutes] = useState<number>(1);
  const dispatch = useDispatch();
  const router = useRouter();

  const { isActive, isTimeSet, timeLeft } = useSelector(
    (state: RootState) => state.timer
  );

  const handleSetTime = () => {
    dispatch(setTime(inputMinutes * 60)); // Convert to seconds
  };

  const handleStart = () => {
    dispatch(startTimer());
    // router.push("/live-timer"); // Navigate to timer page
  };

  const handleReset = () => {
    dispatch(resetTimer());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMinutes(Number(e.target.value));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);
    }

    return () => clearInterval(interval); // Clear interval on unmount
  }, [isActive, timeLeft, dispatch]);

  const getTimerStyle = () => {
    if (timeLeft === 0) {
      return { color: "white" }; // Change color to white when timeLeft is 0
    }
    if (timeLeft <= 5) {
      return { color: "red" }; // Change color to red if timeLeft <= 5 seconds
    }
    return { color: "white" }; // Default color
  };

  // Format time as mm:ss
  const formatTime = (): string => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="w-[300px]">
      <div
        style={{ fontSize: "6rem", ...getTimerStyle() }}
        className="flex items-center justify-center"
      >
        {formatTime()}
      </div>

      <div className="flex flex-col gap-2 mb-4 mt-6">
        <label htmlFor="minutesInput">Set Minutes: </label>
        <input
          id="minutesInput"
          type="number"
          value={inputMinutes}
          onChange={handleInputChange}
          min="0"
          disabled={isActive}
          style={{ marginRight: "1rem" }}
          className="border-2 border-slate-700 rounded-md p-2 text-slate-800 w-full"
        />
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
