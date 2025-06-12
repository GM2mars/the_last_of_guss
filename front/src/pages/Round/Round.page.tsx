import React from "react";
import { useLocation } from 'react-router';

import goose from '@/assets/goose.png';
import { RoundStage } from "@/interfaces/interfaces";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/utils";
import {
  useRound,
  useRoundActions,
  useRoundScore,
  useRoundStage,
  useRoundTimeOffset,
} from "@/states/Round.state";

import { ActiveStage } from "./components/ActiveStage";
import { WaitingStage } from "./components/WaitingStage";
import { FinishedStage } from "./components/FinishedStage";
import { useAuthToken } from "@/states/Auth.state";

export const RoundPage = () => {
  const location = useLocation();
  //Auth State
  const token = useAuthToken();
  //Round State
  const {
    initGame,
    setStage,
    increaseScore,
    getRoundStats
  } = useRoundActions();
  const round = useRound();
  const stage = useRoundStage();
  const timeOffset = useRoundTimeOffset();
  const score = useRoundScore();


  const tapHandler = () => {
    if (stage !== RoundStage.Active) return;

    increaseScore();
  };

  React.useEffect(() => {
    const id = location.pathname.split('/').pop();

    stage === RoundStage.Finished && getRoundStats(id);
  }, [stage]);

  React.useEffect(() => {
    const id = location.pathname.split('/').pop();

    initGame(id);
  }, []);


  return (
    <div className="container mx-auto p-10">
      <TopBar title={stage || 'loading'} hasBack />
      <div className="flex flex-col items-center card w-fit bg-base-100 mx-auto p-10 shadow-xl mt-8">
        <figure
          className={cn("w-96 h-96 rounded-4xl overflow-hidden shadow opacity-40", {
            "cursor-pointer opacity-100": stage === RoundStage.Active
          })}
          onClick={tapHandler}
        >
          <img src={goose} alt="goose" />
        </figure>

        <div className="divider" />

        {stage === RoundStage.Pending &&
          <WaitingStage start={round.startTime} offset={timeOffset} setStage={setStage} />
        }

        {stage === RoundStage.Active &&
          <ActiveStage score={score} end={round.endTime} setStage={setStage} offset={timeOffset} />
        }

        {stage === RoundStage.Finished &&
          <FinishedStage userId={token} round={round} />
        }

      </div>

    </div>
  )
};

