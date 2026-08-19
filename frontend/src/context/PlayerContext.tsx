import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Episode } from "@/services/podcastService";

import {
  fetchProgress,
  updateProgress,
} from "@/services/playbackService";

import { useEpisodeStore } from "@/store/episodeStore";

interface PlayerContextValue {
  episode: Episode | null;
  episodes: Episode[];

  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  skipInterval: number;

setEpisodes: (episodes: Episode[]) => void;

loadEpisode: (
  episode: Episode
) => Promise<void>;

playEpisode: (
  episode: Episode
) => Promise<void>;

  togglePlay: () => void;

  seek: (seconds: number) => void;

  setProgress: (time: number) => void;

  setVolume: (volume: number) => void;

  setPlaybackRate: (rate: number) => void;

  setSkipInterval: (seconds: number) => void;

  nextEpisode: () => Promise<void>;

  previousEpisode: () => Promise<void>;
}

const PlayerContext =
  createContext<PlayerContextValue | null>(
    null
  );

export function PlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const episodeRef =
    useRef<Episode | null>(null);

  const episodesRef =
    useRef<Episode[]>([]);

  const skipIntervalRef =
    useRef(15);

  const playbackRateRef =
    useRef(1);

  const lastSavedProgressRef =
    useRef(0);

  const savingProgressRef =
    useRef(false);

  const [episode, setEpisode] =
    useState<Episode | null>(null);

  const [episodes, setEpisodes] =
    useState<Episode[]>([]);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolumeState] =
    useState(1);

  const [playbackRate, setPlaybackRateState] =
    useState(1);

  const [skipInterval, setSkipIntervalState] =
    useState(15);

  const markPlayed =
    useEpisodeStore(
      (state) => state.markPlayed
    );

  /*
   * Keep episode refs synchronized.
   */

  useEffect(() => {
    episodesRef.current = episodes;
  }, [episodes]);

  useEffect(() => {
    skipIntervalRef.current =
      skipInterval;
  }, [skipInterval]);

  useEffect(() => {
    playbackRateRef.current =
      playbackRate;
  }, [playbackRate]);

  /*
   * Load played state from Hermes
   * when Chronicle starts.
   */

  useEffect(() => {
    useEpisodeStore
      .getState()
      .loadPlayed()
      .catch(console.error);
  }, []);

  /*
   * Save current playback position
   * to Hermes.
   *
   * We don't want to send a request
   * every single second.
   */

  const saveProgress = async () => {
    const audio =
      audioRef.current;

    const currentEpisode =
      episodeRef.current;

    if (
      !audio ||
      !currentEpisode ||
      !Number.isFinite(audio.currentTime)
    ) {
      return;
    }

    if (savingProgressRef.current) {
      return;
    }

    /*
     * Don't save the exact same
     * position repeatedly.
     */

    if (
      Math.abs(
        audio.currentTime -
          lastSavedProgressRef.current
      ) < 1
    ) {
      return;
    }

    savingProgressRef.current = true;

    try {
      await updateProgress(
        currentEpisode.guid,
        audio.currentTime
      );

      lastSavedProgressRef.current =
        audio.currentTime;
    } catch (error) {
      console.error(
        "Failed to save playback progress:",
        error
      );
    } finally {
      savingProgressRef.current =
        false;
    }
  };

  /*
   * Create the audio element.
   */

  useEffect(() => {
    const audio =
      new Audio();

    audioRef.current = audio;

    audio.volume = volume;

    const handleTimeUpdate =
      () => {
        setCurrentTime(
          audio.currentTime
        );

        /*
         * Automatically mark the episode
         * as played once 90% has been heard.
         */

        const progress =
          audio.currentTime /
          (audio.duration || 1);

        if (
          progress >= 0.9 &&
          episodeRef.current
        ) {
          markPlayed(
            episodeRef.current.guid
          ).catch(console.error);
        }
      };

    const handleLoadedMetadata =
      () => {
        setDuration(
          audio.duration
        );
      };

    const handlePlay =
      () => {
        setIsPlaying(true);
      };

    const handlePause =
      () => {
        setIsPlaying(false);

        /*
         * Save progress immediately
         * when the user pauses.
         */

        saveProgress().catch(
          console.error
        );
      };

const handleEnded = () => {
  /*
   * Episode has finished.
   * Mark it as played.
   */

  if (episodeRef.current) {
    markPlayed(
      episodeRef.current.guid
    ).catch(console.error);
  }

  /*
   * Save final progress.
   */

  saveProgress().catch(
    console.error
  );

  /*
   * Do NOT automatically start
   * the next episode.
   */

  setIsPlaying(false);
};

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "play",
      handlePlay
    );

    audio.addEventListener(
      "pause",
      handlePause
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.pause();

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "play",
        handlePlay
      );

      audio.removeEventListener(
        "pause",
        handlePause
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [markPlayed]);

  /*
   * Periodically save progress.
   *
   * Every 5 seconds.
   */

  useEffect(() => {
    const interval =
      setInterval(() => {
        saveProgress().catch(
          console.error
        );
      }, 5000);

    return () =>
      clearInterval(interval);
  }, []);

  /*
   * Save progress when the page
   * is hidden or the user leaves.
   */

  useEffect(() => {
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "hidden"
        ) {
          saveProgress().catch(
            console.error
          );
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  /*
   * Play an episode.
   *
   * The saved position is retrieved
   * from Hermes before playback begins.
   */

const loadEpisode = async (
  newEpisode: Episode
) => {
  const audio =
    audioRef.current;

  if (
    !audio ||
    !newEpisode.audio
  ) {
    return;
  }

  /*
   * Save the previous episode's
   * position before switching.
   */

  if (
    episodeRef.current &&
    episodeRef.current.guid !==
      newEpisode.guid
  ) {
    await saveProgress();
  }

  /*
   * Stop current playback.
   */

  audio.pause();

  /*
   * Set new episode.
   */

  setEpisode(newEpisode);

  episodeRef.current =
    newEpisode;

  setCurrentTime(0);

  setDuration(0);

  /*
   * Set audio source.
   */

  audio.src =
    newEpisode.audio;

  audio.playbackRate =
    playbackRateRef.current;

  /*
   * Get latest progress
   * from Hermes.
   */

  let progressMap:
    Record<string, number> = {};

  try {
    progressMap =
      await fetchProgress();
  } catch (error) {
    console.error(
      "Failed to load playback progress:",
      error
    );
  }

  const savedProgress =
    Number(
      progressMap[
        newEpisode.guid
      ] ?? 0
    );

  /*
   * Wait for audio metadata.
   */

  await new Promise<void>(
    (resolve) => {
      if (
        audio.readyState >= 1
      ) {
        resolve();
        return;
      }

      const handleMetadata =
        () => {
          audio.removeEventListener(
            "loadedmetadata",
            handleMetadata
          );

          resolve();
        };

      audio.addEventListener(
        "loadedmetadata",
        handleMetadata
      );
    }
  );

  /*
   * Restore saved position.
   */

  if (
    Number.isFinite(
      audio.duration
    ) &&
    audio.duration > 0
  ) {
    audio.currentTime =
      Math.min(
        savedProgress,
        Math.max(
          0,
          audio.duration - 1
        )
      );
  } else {
    audio.currentTime =
      Math.max(
        0,
        savedProgress
      );
  }

  setCurrentTime(
    audio.currentTime
  );

  lastSavedProgressRef.current =
    audio.currentTime;

  /*
   * IMPORTANT:
   *
   * We intentionally do NOT call
   * audio.play() here.
   */
};

  /*
   * Play / pause.
   */

  const togglePlay =
    () => {
      const audio =
        audioRef.current;

      if (
        !audio ||
        !episodeRef.current
      ) {
        return;
      }

      if (audio.paused) {
        audio.play().catch(
          console.error
        );
      } else {
        audio.pause();
      }
    };

    const playEpisode = async (
  newEpisode: Episode
) => {
  await loadEpisode(
    newEpisode
  );

  const audio =
    audioRef.current;

  if (!audio) {
    return;
  }

  try {
    await audio.play();
  } catch (error) {
    console.error(
      "Failed to start playback:",
      error
    );
  }
};

  /*
   * Seek forward / backward.
   */

  const seek = (
    seconds: number
  ) => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime =
      Math.max(
        0,
        Math.min(
          audio.currentTime +
            seconds,
          audio.duration ||
            Infinity
        )
      );

    setCurrentTime(
      audio.currentTime
    );
  };

  /*
   * Set exact playback position.
   */

  const setProgress = (
    time: number
  ) => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime =
      Math.max(
        0,
        Math.min(
          time,
          audio.duration ||
            Infinity
        )
      );

    setCurrentTime(
      audio.currentTime
    );
  };

  /*
   * Volume.
   */

  const setVolume = (
    newVolume: number
  ) => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume =
      newVolume;

    setVolumeState(
      newVolume
    );
  };

  /*
   * Playback speed.
   */

  const setPlaybackRate = (
    rate: number
  ) => {
    const audio =
      audioRef.current;

    if (audio) {
      audio.playbackRate =
        rate;
    }

    setPlaybackRateState(
      rate
    );
  };

  /*
   * Skip interval.
   */

  const setSkipInterval = (
    seconds: number
  ) => {
    setSkipIntervalState(
      seconds
    );
  };

  /*
   * Next episode.
   */

  const playNextEpisode =
    async () => {
      const currentEpisode =
        episodeRef.current;

      if (!currentEpisode) {
        return;
      }

      const index =
        episodesRef.current.findIndex(
          (item) =>
            item.guid ===
            currentEpisode.guid
        );

      if (
        index === -1 ||
        index ===
          episodesRef.current.length - 1
      ) {
        return;
      }

      await playEpisode(
        episodesRef.current[
          index + 1
        ]
      );
    };

  /*
   * Previous episode.
   */

  const playPreviousEpisode =
    async () => {
      const currentEpisode =
        episodeRef.current;

      if (!currentEpisode) {
        return;
      }

      const index =
        episodesRef.current.findIndex(
          (item) =>
            item.guid ===
            currentEpisode.guid
        );

      if (index <= 0) {
        return;
      }

      await playEpisode(
        episodesRef.current[
          index - 1
        ]
      );
    };

  /*
   * Keyboard shortcuts.
   */

  useEffect(() => {
    const handleKeyboard =
      (
        event: KeyboardEvent
      ) => {
        /*
         * Don't trigger shortcuts
         * while typing/searching.
         */

        if (
          event.target instanceof
            HTMLInputElement ||
          event.target instanceof
            HTMLTextAreaElement ||
          event.target instanceof
            HTMLSelectElement
        ) {
          return;
        }

        switch (event.code) {
          case "Space":
            event.preventDefault();

            togglePlay();

            break;

          case "ArrowLeft":
            event.preventDefault();

            seek(
              -skipIntervalRef.current
            );

            break;

          case "ArrowRight":
            event.preventDefault();

            seek(
              skipIntervalRef.current
            );

            break;
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
  }, []);

  /*
   * Context.
   */

  return (
    <PlayerContext.Provider
      value={{
        episode,

        episodes,

        isPlaying,

        currentTime,

        duration,

        volume,

        playbackRate,

        skipInterval,

        setEpisodes,

        playEpisode,

        togglePlay,

        seek,

        setProgress,

        setVolume,

        setPlaybackRate,

        setSkipInterval,

        loadEpisode,

        nextEpisode:
          playNextEpisode,

        previousEpisode:
          playPreviousEpisode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context =
    useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayer must be used inside PlayerProvider"
    );
  }

  return context;
}