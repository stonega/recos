import useWindowSize from "@/lib/hooks/use-window-size";
import React, { useEffect } from "react";
import ReactConfetti from "react-confetti";

const Confetti = () => {
  const {
    windowSize: { width, height },
  } = useWindowSize();
  const [show, setShow] = React.useState(true);
  const [opacity, setOpacity] = React.useState(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);
    let interval: number | NodeJS.Timer;
    const opacityTimer = setTimeout(() => {
      interval = setInterval(() => setOpacity((prev) => prev - 0.2), 100);
    }, 2500);
    return () => {
      clearTimeout(timer);
      clearTimeout(opacityTimer);
      if (interval) clearInterval(interval);
    };
  });
  if (show)
    return (
      <ReactConfetti
        width={width ?? 0}
        height={height ?? 0}
        opacity={opacity}
      />
    );
  return <></>;
};

export default Confetti;
