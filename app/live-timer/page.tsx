"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { decrementTime, setTime, startTimer } from "@/lib/timerSlice";
import { IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons-react";

const LiveTimer: React.FC = () => {
  const dispatch = useDispatch();
  const { timeLeft, isActive } = useSelector((state: RootState) => state.timer);

  const timerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [color, setColor] = useState<string>("white");
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState(false); // State baru untuk mendeteksi komponen sudah mount

  useEffect(() => {
    setHasMounted(true); // Tandai bahwa komponen sudah mount di client
  }, []);

  useEffect(() => {
    const syncTimerWithLocalStorage = () => {
      const savedState = localStorage.getItem("timerState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch(setTime(parsedState.timeLeft));
        if (parsedState.isActive) {
          dispatch(startTimer());
        }
      }
    };
    window.addEventListener("storage", syncTimerWithLocalStorage);
    return () => {
      window.removeEventListener("storage", syncTimerWithLocalStorage);
    };
  }, [dispatch]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);
    }

    if (timeLeft <= 5 && timeLeft > 0) {
      const sound = new Audio("/sounds/beep.wav");
      sound
        .play()
        .catch((error) => console.log("Failed to play sound:", error));

      if (timeLeft === 5) {
        setIsBlinking(true);
      }
    }

    if (timeLeft === 1) {
      setTimeout(() => {
        const finalSound = new Audio("/sounds/beep-05.mp3");
        finalSound
          .play()
          .catch((error) => console.log("Failed to play sound:", error));
      }, 1000);
    }

    if (timeLeft <= 0) {
      setIsBlinking(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, dispatch]);

  useEffect(() => {
    let blinkInterval: NodeJS.Timeout;

    if (isBlinking) {
      blinkInterval = setInterval(() => {
        setColor((prevColor) => (prevColor === "red" ? "white" : "red"));
      }, 500);
    } else {
      setColor("white");
    }

    return () => clearInterval(blinkInterval);
  }, [isBlinking]);

  const formatTime = (): string => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFullscreenToggle = () => {
    if (!isFullscreen && timerRef.current) {
      if (timerRef.current.requestFullscreen) {
        timerRef.current.requestFullscreen();
      } else if ((timerRef.current as any).webkitRequestFullscreen) {
        (timerRef.current as any).webkitRequestFullscreen();
      } else if ((timerRef.current as any).mozRequestFullScreen) {
        (timerRef.current as any).mozRequestFullScreen();
      } else if ((timerRef.current as any).msRequestFullscreen) {
        (timerRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", fullscreenChangeHandler);
    document.addEventListener(
      "webkitfullscreenchange",
      fullscreenChangeHandler
    );
    document.addEventListener("mozfullscreenchange", fullscreenChangeHandler);
    document.addEventListener("MSFullscreenChange", fullscreenChangeHandler);

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
      document.removeEventListener(
        "webkitfullscreenchange",
        fullscreenChangeHandler
      );
      document.removeEventListener(
        "mozfullscreenchange",
        fullscreenChangeHandler
      );
      document.removeEventListener(
        "MSFullscreenChange",
        fullscreenChangeHandler
      );
    };
  }, []);

  return (
    <div
      ref={timerRef}
      className="flex flex-col h-screen items-center justify-center"
    >
      {/* Hanya render timeLeft setelah komponen ter-mount */}
      <div style={{ fontSize: "25rem", color }}>
        {hasMounted ? formatTime() : "Loading..."}
      </div>
      <button
        onClick={handleFullscreenToggle}
        style={{
          position: "absolute",
          top: "60px",
          right: "10px",
          padding: "10px",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isFullscreen ? (
          <IconArrowsMinimize size={14} className="text-slate-700" />
        ) : (
          <IconArrowsMaximize size={16} className="text-slate-400" />
        )}
      </button>
    </div>
  );
};

export default LiveTimer;
