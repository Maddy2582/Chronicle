import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Episode } from "@/services/podcastService";
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
  playEpisode: (episode: Episode) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setProgress: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setSkipInterval: (seconds: number) => void;

  nextEpisode: () => void;
  previousEpisode: () => void;
}

const PlayerContext =
  createContext<PlayerContextValue | null>(null);

export function PlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const episodeRef = useRef<Episode | null>(null);

  const skipIntervalRef = useRef(15);

  const playbackRateRef = useRef(1);

  const [episode, setEpisode] = useState<Episode | null>(null);

  const [episodes, setEpisodes] = useState<Episode[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [volume, setVolumeState] = useState(1);

  const [playbackRate, setPlaybackRateState] = useState(1);

  const [skipInterval, setSkipIntervalState] = useState(15);

  const { markPlayed } =
  useEpisodeStore();

  useEffect(() => {
    skipIntervalRef.current = skipInterval;
  }, [skipInterval]);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const audio = new Audio();

    audioRef.current = audio;

    audio.volume = volume;

    const handleTimeUpdate = () => {
      
      setCurrentTime(audio.currentTime);
      const progress =
  audio.currentTime /
  (audio.duration || 1);

if (
  progress >= 0.9 &&
  episodeRef.current
) {
  markPlayed(
    episodeRef.current.guid
  );
}
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      playNextEpisode();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener("play", handlePlay);

    audio.addEventListener("pause", handlePause);

    audio.addEventListener("ended", handleEnded);

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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const audio = audioRef.current;

      const currentEpisode = episodeRef.current;

      if (!audio || !currentEpisode) {
        return;
      }

      localStorage.setItem(
        `chronicle-progress-${currentEpisode.guid}`,
        audio.currentTime.toString()
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const playEpisode = (
    newEpisode: Episode
  ) => {
    const audio = audioRef.current;

    if (!audio || !newEpisode.audio) {
      return;
    }

    audio.pause();

    audio.src = newEpisode.audio;

    audio.playbackRate =
      playbackRateRef.current;

    const savedProgress =
      localStorage.getItem(
        `chronicle-progress-${newEpisode.guid}`
      );

    audio.currentTime =
      savedProgress
        ? Number(savedProgress)
        : 0;

    setEpisode(newEpisode);

    episodeRef.current = newEpisode;

    audio.play().catch(console.error);
  };

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio || !episodeRef.current) {
      return;
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const seek = (
    seconds: number
  ) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = Math.max(
      0,
      Math.min(
        audio.currentTime + seconds,
        audio.duration || Infinity
      )
    );
  };

  const setProgress = (
    time: number
  ) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = time;

    setCurrentTime(time);
  };

  const setVolume = (
    newVolume: number
  ) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = newVolume;

    setVolumeState(newVolume);
  };

  const setPlaybackRate = (
    rate: number
  ) => {
    const audio = audioRef.current;

    if (audio) {
      audio.playbackRate = rate;
    }

    setPlaybackRateState(rate);
  };

  const setSkipInterval = (
    seconds: number
  ) => {
    setSkipIntervalState(seconds);
  };

  const playNextEpisode = () => {
    const currentEpisode = episodeRef.current;

    if (!currentEpisode) {
      return;
    }

    const index =
      episodes.findIndex(
        (item) =>
          item.guid === currentEpisode.guid
      );

    if (
      index === -1 ||
      index === episodes.length - 1
    ) {
      return;
    }

    playEpisode(episodes[index + 1]);
  };

  const playPreviousEpisode = () => {
    const currentEpisode = episodeRef.current;

    if (!currentEpisode) {
      return;
    }

    const index =
      episodes.findIndex(
        (item) =>
          item.guid === currentEpisode.guid
      );

    if (index <= 0) {
      return;
    }

    playEpisode(episodes[index - 1]);
  };

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent
    ) => {
      if (
        event.target instanceof
          HTMLInputElement ||
        event.target instanceof
          HTMLTextAreaElement
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
          seek(-skipIntervalRef.current);
          break;

        case "ArrowRight":
          event.preventDefault();
          seek(skipIntervalRef.current);
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

        nextEpisode: playNextEpisode,
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