import useWindowSize from "@/lib/hooks/use-window-size";
import React, { useEffect } from "react";
import ReactConfetti from "react-confetti";

const Confetti = () => {
  const {
    windowSize: { width, height },
  } = useWindowSize();
  const [show, setShow] = React.useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 10000);
    return () => clearTimeout(timer);
  });
  if (show) return <ReactConfetti width={width ?? 0} height={height ?? 0} />;
  return <></>
};

export default Confetti;
