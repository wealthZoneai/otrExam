// src/components/exam/Timer.tsx
import { useEffect, useState } from "react";

const EXAM_DURATION_SECONDS = 45 * 60;

interface TimerProps {
  isSubmitted: boolean;
  onTimeout: () => void;
}

const Timer: React.FC<TimerProps> = ({ isSubmitted, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !isSubmitted) onTimeout();
      return;
    }

    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeLeft, onTimeout]);

  const format = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return <p className="text-xl font-bold text-blue-700">Time Left: {format(timeLeft)}</p>;
};

export default Timer;
