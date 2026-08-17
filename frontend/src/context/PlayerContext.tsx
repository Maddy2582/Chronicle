import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Episode } from "@/services/podcastService";

interface PlayerContextValue {
  episode: Episode | null;

  isPlaying: boolean;

  currentTime: number;

  duration: number;

  volume: number;

  playEpisode: (episode: Episode) => void;

  togglePlay: () => void;

  seek: (seconds: number) => void;

  setProgress: (time: number) => void;

  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(
  null
);

export function PlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [episode, setEpisode] = useState<Episode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [volume, setVolumeState] = useState(1);

  useEffect(() => {
    const audio = new Audio();

    audioRef.current = audio;

    audio.volume = 1;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
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

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener("play", handlePlay);

    audio.addEventListener("pause", handlePause);

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
    };
  }, []);

  const playEpisode = (newEpisode: Episode) => {
    const audio = audioRef.current;

    if (!audio || !newEpisode.audio) {
      return;
    }

    audio.pause();

    audio.src = newEpisode.audio;

    audio.currentTime = 0;

    setEpisode(newEpisode);

    setCurrentTime(0);

    audio
      .play()
      .catch((error) => {
        console.error(
          "Unable to play episode:",
          error
        );
      });
  };

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio || !episode) {
      return;
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const seek = (seconds: number) => {
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

  const setProgress = (time: number) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = time;

    setCurrentTime(time);
  };

  const setVolume = (newVolume: number) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = newVolume;

    setVolumeState(newVolume);
  };

  return (
    <PlayerContext.Provider
      value={{
        episode,
        isPlaying,
        currentTime,
        duration,
        volume,
        playEpisode,
        togglePlay,
        seek,
        setProgress,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayer must be used inside PlayerProvider"
    );
  }

  return context;
}