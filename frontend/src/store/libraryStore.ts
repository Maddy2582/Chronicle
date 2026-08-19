import { create } from "zustand";

import {
  addLibraryPodcast,
  fetchLibrary,
  removeLibraryPodcast,
} from "@/services/libraryService";

export interface LibraryPodcast {
  id?: number;
  rss: string;
  appleId?: number;
  title: string;
  author: string;
  image: string;
}

interface LibraryState {
  podcasts: LibraryPodcast[];

  loading: boolean;

  loadLibrary: () => Promise<void>;

  addPodcast: (
    podcast: LibraryPodcast
  ) => Promise<void>;

  removePodcast: (
    rss: string
  ) => Promise<void>;
}

export const useLibraryStore =
  create<LibraryState>((set, get) => ({
    podcasts: [],

    loading: false,

    loadLibrary: async () => {
      set({ loading: true });

      try {
        const podcasts =
          await fetchLibrary();

        set({
          podcasts,
          loading: false,
        });
      } catch (error) {
        console.error(error);

        set({ loading: false });
      }
    },

    addPodcast: async (podcast) => {
      if (
        get().podcasts.some(
          (p) => p.rss === podcast.rss
        )
      ) {
        return;
      }

      set({
        podcasts: [
          ...get().podcasts,
          podcast,
        ],
      });

      try {
        await addLibraryPodcast(podcast);

        await get().loadLibrary();
      } catch (error) {
        console.error(error);
      }
    },

    removePodcast: async (rss) => {
      const previous =
        get().podcasts;

      set({
        podcasts:
          previous.filter(
            (p) => p.rss !== rss
          ),
      });

      try {
        await removeLibraryPodcast(rss);

        await get().loadLibrary();
      } catch (error) {
        console.error(error);

        set({
          podcasts: previous,
        });
      }
    },
  }));