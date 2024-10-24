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

const CountDownPage = () => {
  const [inputMinutes, setInputMinutes] = useState<number>(1);
  const dispatch = useDispatch();
  const router = useRouter();

  const { isActive, isTimeSet, timeLeft } = useSelector(
    (state: RootState) => state.timer
  );

  const handleSetTime = () => {
    dispatch(setTime(inputMinutes * 60)); // Konversi ke detik
  };

  const handleStart = () => {
    dispatch(startTimer());
  };

  const handleReset = () => {
    dispatch(resetTimer());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputMinutes(Number(e.target.value));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);
    }

    return () => clearInterval(interval); // Membersihkan interval saat komponen unmount
  }, [isActive, timeLeft, dispatch]);

  const getTimerStyle = () => {
    if (timeLeft === 0) {
      return { color: "white" }; // Ubah warna menjadi putih ketika timeLeft = 0
    }
    if (timeLeft <= 5) {
      return { color: "red" }; // Ubah warna menjadi merah jika timeLeft <= 5 detik
    }
    return { color: "white" }; // Warna default
  };

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
        <select
          id="minutesInput"
          value={inputMinutes}
          onChange={handleInputChange}
          disabled={isActive}
          className="border-2 border-slate-700 rounded-md p-2 text-slate-800 w-full"
        >
          <option value={1}>1 Minute</option>
          <option value={2}>2 Minutes</option>
          <option value={3}>3 Minutes</option>
          <option value={4}>4 Minutes</option>
          <option value={5}>5 Minutes</option>
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
