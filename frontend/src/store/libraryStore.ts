import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LibraryPodcast {
  rss: string;
  appleId?: number;
  title: string;
  author: string;
  image: string;
}

interface LibraryState {
  podcasts: LibraryPodcast[];

  addPodcast: (podcast: LibraryPodcast) => void;

  removePodcast: (rss: string) => void;
}

export const useLibraryStore =
  create<LibraryState>()(
    persist(
      (set) => ({
        podcasts: [],

        addPodcast: (podcast) =>
          set((state) => {
            if (
              state.podcasts.some(
                (p) => p.rss === podcast.rss
              )
            ) {
              return state;
            }

            return {
              podcasts: [
                ...state.podcasts,
                podcast,
              ],
            };
          }),

        removePodcast: (rss) =>
          set((state) => ({
            podcasts:
              state.podcasts.filter(
                (p) => p.rss !== rss
              ),
          })),
      }),

      {
        name: "chronicle-library",
      }
    )
  );