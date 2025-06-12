import { create } from "zustand";

import { q } from "@/utils";
import { type IRound } from "@/interfaces/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

interface GameActions {
  createRound: () => Promise<string>;
  setRounds: (rounds: IRound[]) => Promise<void>;
  getRounds: () => Promise<void>;
};

interface GameState {
  rounds: IRound[];
  timeOffset: number;
  error: string;
  actions: GameActions;
};

const useGameStore = create<GameState>((set, get) => ({
  rounds: [],
  timeOffset: 0,
  error: null,

  actions: {
    createRound: async () => {
      const result = await q.post(`${API_URL}/game/create`);
      const { error, round } = result || { error: 'Server error' };

      if (error) set({ error });

      return round.id;
    },

    setRounds: async (rounds: IRound[]) => {
      set({ rounds });
    },

    getRounds: async () => {
      const currentTime = new Date().getTime();
      const result = await q.post(`${API_URL}/game/rounds`);
      const { error, rounds, serverTime } = result || { error: 'Server error' };

      if (error) set({ error });
      else set({ rounds, timeOffset: serverTime - currentTime });
    },
  }
}));

export const useGameRounds = () => useGameStore(state => state.rounds);
export const useGameTimeOffset = () => useGameStore(state => state.timeOffset);
export const useGameActions = () => useGameStore(state => state.actions);
