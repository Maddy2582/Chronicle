import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EpisodeState {
  played: Record<string, boolean>;

  markPlayed: (guid: string) => void;

  markUnplayed: (guid: string) => void;
}

export const useEpisodeStore =
  create<EpisodeState>()(
    persist(
      (set) => ({
        played: {},

        markPlayed: (guid) =>
          set((state) => ({
            played: {
              ...state.played,
              [guid]: true,
            },
          })),

        markUnplayed: (guid) =>
          set((state) => ({
            played: {
              ...state.played,
              [guid]: false,
            },
          })),
      }),

      {
        name: "chronicle-episodes",
      }
    )
  );