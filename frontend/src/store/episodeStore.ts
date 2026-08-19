import { create } from "zustand";

import {
  fetchPlayed,
  updatePlayed,
} from "@/services/playbackService";

interface EpisodeState {
  played: Record<string, boolean>;

  loading: boolean;

  loadPlayed: () => Promise<void>;

  markPlayed: (guid: string) => Promise<void>;

  markUnplayed: (guid: string) => Promise<void>;
}

export const useEpisodeStore =
  create<EpisodeState>((set, get) => ({
    played: {},

    loading: false,

    loadPlayed: async () => {
      set({ loading: true });

      try {
        const playedMap =
          await fetchPlayed();

        set({
          played: playedMap,
          loading: false,
        });
      } catch (error) {
        console.error(
          "Failed to load played episodes:",
          error
        );

        set({ loading: false });
      }
    },

    markPlayed: async (guid) => {
      // Optimistic UI update
      set((state) => ({
        played: {
          ...state.played,
          [guid]: true,
        },
      }));

      try {
        await updatePlayed(
          guid,
          true
        );
      } catch (error) {
        console.error(
          "Failed to mark episode as played:",
          error
        );

        // Reload server state if request fails
        await get().loadPlayed();
      }
    },

    markUnplayed: async (guid) => {
      // Optimistic UI update
      set((state) => ({
        played: {
          ...state.played,
          [guid]: false,
        },
      }));

      try {
        await updatePlayed(
          guid,
          false
        );
      } catch (error) {
        console.error(
          "Failed to mark episode as unplayed:",
          error
        );

        // Reload server state if request fails
        await get().loadPlayed();
      }
    },
  }));