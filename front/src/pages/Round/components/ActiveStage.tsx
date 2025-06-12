import React from "react";
import dayjs from "dayjs";

import { RoundStage } from "@/interfaces/interfaces";

interface ActiveStageProps {
  setStage: (stage: RoundStage) => void;
  score: number;
  end: string;
  offset: number;
}

export const ActiveStage = ({ score, end, offset, setStage }: ActiveStageProps) => {
  const intervalRef = React.useRef(0);
  const [time, setTime] = React.useState("00:00");

  const calcTime = () => {
    const currentTime = new Date().getTime() + offset;
    const endTime = new Date(end).getTime();

    if (currentTime < endTime) {
      const duration = endTime - currentTime;
      setTime(dayjs(duration, 'unix').format('mm:ss'));
    } else {
      setStage(RoundStage.Finished);
    }
  };


  React.useEffect(() => {
    calcTime();

    intervalRef.current = window.setInterval(calcTime, 100);

    return () => {
      clearInterval(intervalRef.current);
    }
  }, []);


  return (
    <div className="flex flex-col gap-4">
      <p className="uppercase">{'Active'}</p>
      <p>Time: {time}</p>
      <p>Score: {score}</p>
    </div>
  )
};
