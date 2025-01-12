import React, { useEffect, useState } from "react";

function RestTimer({ onFinish }) {
  const [timeLeft, setTimeLeft] = useState(30); // Default rest time in seconds

  useEffect(() => {
    if (timeLeft === 0) {
      onFinish();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onFinish]);

  return <div>Rest Timer: {timeLeft}s</div>;
}

export default RestTimer;
