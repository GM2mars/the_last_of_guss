import React from "react";

import type { IRound } from "@/interfaces/interfaces";

interface FinishedStageProps {
  round: IRound;
  userId: string;
}

export const FinishedStage = ({ round, userId }: FinishedStageProps) => {
  const [state, setState] = React.useState(null);

  React.useEffect(() => {
    if (!round || !userId) return;

    const totalScore = round.stats.reduce((res, s) => res + s.score, 0);
    const winner = round.stats.sort((a, b) => a.score - b.score).reverse()[0];
    const score = round.stats.find((s) => s.user.id === userId)?.score || 0;

    setState({ totalScore, winner, score });
  }, [round, userId]);

  return (
    <div className="flex flex-col gap-4">
      <p className="uppercase">{'Finished'}</p>
      <p>Всего: {state?.totalScore}</p>
      <p>Победитель: {state?.winner?.user.username} - {state?.winner?.score}</p>
      <p>Мои очки: {state?.score}</p>
    </div>
  )
};
