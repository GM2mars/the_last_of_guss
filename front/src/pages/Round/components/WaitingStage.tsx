import React from "react";
import dayjs from "dayjs";

import { RoundStage } from "@/interfaces/interfaces";

interface WaitingStageProps {
  setStage: (stage: RoundStage) => void;
  start: string;
  offset: number;
}

export const WaitingStage = ({ start, offset, setStage }: WaitingStageProps) => {
  const intervalRef = React.useRef(0);
  const [time, setTime] = React.useState("00:00");

  const calcTime = () => {
    const currentTime = new Date().getTime() + offset;
    const startTime = new Date(start).getTime();

    if (currentTime < startTime) {
      const duration = startTime - currentTime;
      setTime(dayjs(duration, 'unix').format('mm:ss'));
    } else {
      setStage(RoundStage.Active);
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
      <p className="uppercase">{'Pending'}</p>
      <p>До начала раунда: {time}</p>
    </div>
  )
};
