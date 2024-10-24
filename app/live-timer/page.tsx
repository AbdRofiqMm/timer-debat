"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { decrementTime, setTime, startTimer } from "@/lib/timerSlice";
import { useRouter } from "next/navigation";
import { IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons-react";

const LiveTimer: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { timeLeft, isActive } = useSelector((state: RootState) => state.timer);
  const timerRef = useRef<HTMLDivElement>(null); // Reference to the timer container
  const [isFullscreen, setIsFullscreen] = useState(false); // Track fullscreen state
  const [color, setColor] = useState<string>("white"); // State for text color
  const [isBlinking, setIsBlinking] = useState<boolean>(false); // State for blinking effect

  useEffect(() => {
    // Sync with LocalStorage whenever another tab changes the state
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

    // Hanya mulai timer jika timer aktif dan waktu lebih dari 0
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);
    }

    return () => clearInterval(interval); // Clear interval on unmount
  }, [isActive, timeLeft, dispatch]);

  useEffect(() => {
    // Play sound every second during the last 5 seconds of the timer
    if (timeLeft <= 5 && timeLeft > 0) {
      const sound = new Audio("/sounds/beep.wav"); // Create a new audio instance each time
      sound.play().catch((error) => {
        console.log("Failed to play sound:", error); // Log any play errors
      });

      // Start blinking effect during the last 5 seconds
      if (timeLeft === 5) {
        setIsBlinking(true);
      }
    }

    // Play final sound when time is 1 second
    if (timeLeft === 1) {
      const sound = new Audio("/sounds/beep.wav");
      sound.play();
      // Set a 1-second delay for sound1
      setTimeout(() => {
        const sound1 = new Audio("/sounds/beep-05.mp3");
        sound1.play().catch((error) => {
          console.log("Failed to play sound:", error);
        });
      }, 1000); // 1000ms = 1 second
    }

    if (timeLeft <= 0) {
      setIsBlinking(false); // Stop blinking when time runs out
    }
  }, [timeLeft]);

  // Handle blinking effect
  useEffect(() => {
    let blinkInterval: NodeJS.Timeout;

    if (isBlinking) {
      blinkInterval = setInterval(() => {
        setColor((prevColor) => (prevColor === "red" ? "white" : "red"));
      }, 500); // Change color every 500 ms
    } else {
      setColor("white"); // Reset to default color
    }

    return () => clearInterval(blinkInterval); // Clear blinking interval on unmount
  }, [isBlinking]);

  // Format time as mm:ss
  const formatTime = (): string => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Handle fullscreen activation or exit
  const handleFullscreenToggle = () => {
    if (!isFullscreen && timerRef.current) {
      // Enter fullscreen mode
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
      // Exit fullscreen mode
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

  // Listen for fullscreen changes to update button text and state
  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(!!document.fullscreenElement); // Update fullscreen state
    };

    document.addEventListener("fullscreenchange", fullscreenChangeHandler);
    document.addEventListener(
      "webkitfullscreenchange",
      fullscreenChangeHandler
    ); // Safari
    document.addEventListener("mozfullscreenchange", fullscreenChangeHandler); // Firefox
    document.addEventListener("MSFullscreenChange", fullscreenChangeHandler); // IE/Edge

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
      <div style={{ fontSize: "25rem", color }}>{formatTime()}</div>
      <button
        onClick={handleFullscreenToggle}
        style={{
          position: "absolute",
          top: "10px", // 10px from the top
          right: "10px", // 10px from the right edge
          padding: "10px",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isFullscreen ? (
          <IconArrowsMinimize size={12} className="text-slate-700" />
        ) : (
          <IconArrowsMaximize size={16} className="text-slate-400" />
        )}
      </button>{" "}
      {/* Fullscreen button */}
    </div>
  );
};

export default LiveTimer;
