import React from "react";
import { useNavigate } from "react-router";

import { TopBar } from "@/components/TopBar";
import { RoundStage, UserRole } from "@/interfaces/interfaces";
import { useAuthRole } from "@/states/Auth.state";
import { useGameActions, useGameRounds, useGameTimeOffset } from "@/states/Game.state";
import { cn } from "@/utils";
import { getRoundStage } from "@/states/Round.state";

export const RoundsListPage = () => {
  const navigate = useNavigate();
  //Auth store
  const role = useAuthRole();
  //Game store
  const { createRound, getRounds } = useGameActions();
  const rounds = useGameRounds();
  const timeOffset = useGameTimeOffset();

  const selectRoundHandler = (id: number) => {
    navigate(`/rounds/${id}`);
  };

  const createRoundHandler = async () => {
    if (role !== UserRole.Admin) return;

    const roundId = await createRound();

    roundId && navigate(`/rounds/${roundId}`);
  };


  React.useEffect(() => {
    getRounds();

    //каждую секунду запрашиваем список раундов
    setInterval(getRounds, 1000);
  }, []);

  return (
    <div className="container mx-auto p-10">
      <TopBar title={'Список РАУНДОВ'} />

      {role === UserRole.Admin &&
        <div className="flex justify-center mt-10">
          <button className="btn btn-primary btn-wide btn-lg btn-outline" onClick={createRoundHandler}>{'Create round'}</button>
        </div>
      }

      <div className="flex flex-col items-center gap-4 mt-10">
        {rounds.map((round) => {
          const stage = getRoundStage(round.startTime, round.endTime, timeOffset);

          return (
            <div
              key={round.id}
              className={cn("card w-96 bg-base-100 shadow-lg opacity-70", {
                "hover:shadow transition-shadow cursor-pointer opacity-100": stage === RoundStage.Pending,
              })}
              onClick={() => selectRoundHandler(round.id)}
            >
              <div className="card-body">
                <h2 className="card-title">Round: {round.id}</h2>
                <p>Start: {new Date(round.startTime).toLocaleString()}</p>
                <p>End: {new Date(round.endTime).toLocaleString()}</p>
                <div className="divider my-0" />
                <p>State: {stage}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
};
