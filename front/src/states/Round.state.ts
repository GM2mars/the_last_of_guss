import { create } from "zustand";

import { RoundEvent, RoundStage, WsEvents, WsStatus, type IRound } from "@/interfaces/interfaces";
import { Websocket } from "@/services/ws";


interface RoundActions {
  initGame: (id: string) => Promise<void>;
  setStage: (stage: RoundStage) => void;
  increaseScore: () => void;
  getRoundStats: (id: string) => void;

  setRound: (data: any) => void;
};

interface RoundState {
  round: IRound;
  stage: RoundStage;
  timeOffset: number;
  score: number;
  ws: Websocket;
  actions: RoundActions;
};

const useRoundStore = create<RoundState>((set, get) => ({
  round: null,
  stage: null,
  timeOffset: 0,
  score: 0,
  ws: Websocket.getInstance(),

  actions: {
    initGame: async (id: string) => {
      const ws = get().ws;

      if (ws.status === WsStatus.Offline) {
        await ws.connect();

        setTimeout(() => get().actions.initGame(id), 1000);
      }

      ws.sendMessage(WsEvents.Round, { action: RoundEvent.GetRoundStats, data: { id } });

      ws.addEventListener(WsEvents.Round, (payload: any) => {
        if (!payload || !payload.detail) return;

        const { action, data } = payload.detail;

        switch (action) {
          case RoundEvent.GetRoundStats:
            get().actions.setRound(data);
            break;
          case RoundEvent.IncreaseScore:
            set({ score: data.score });
            break;
        }
      });
    },

    setRound: (data: any) => {
      const currentTime = new Date().getTime();
      const timeOffset = currentTime - data.serverTime;
      const stage = getRoundStage(data.round.startTime, data.round.endTime, timeOffset);

      set({ round: data.round, timeOffset, stage });
    },

    setStage: (stage: RoundStage) => {
      set({ stage });
    },

    increaseScore: () => {
      get().ws.sendMessage(WsEvents.Round, { action: RoundEvent.IncreaseScore });
    },

    getRoundStats: (id) => {
      get().ws.sendMessage(WsEvents.Round, { action: RoundEvent.GetRoundStats, data: { id } });
    },
  }
}));

export const useRoundActions = () => useRoundStore(state => state.actions);
export const useRound = () => useRoundStore(state => state.round);
export const useRoundScore = () => useRoundStore(state => state.score);
export const useRoundStage = () => useRoundStore(state => state.stage);
export const useRoundTimeOffset = () => useRoundStore(state => state.timeOffset);


export function getRoundStage(start: string, end: string, timeOffset: number = 0): RoundStage {
  const currentTime = new Date().getTime();
  const currentTimeWithOffset = currentTime + timeOffset;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  let stage = RoundStage.Pending;

  if (currentTimeWithOffset > startTime) stage = RoundStage.Active;
  if (currentTimeWithOffset > endTime) stage = RoundStage.Finished;

  return stage;
}