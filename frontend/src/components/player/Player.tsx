import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  SkipBack,
  SkipForward,
} from "lucide-react";

import { usePlayer } from "@/context/PlayerContext";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export default function Player() {
  const {
    episode,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    skipInterval,
    togglePlay,
    seek,
    setProgress,
    setVolume,
    setPlaybackRate,
    nextEpisode,
    previousEpisode,
  } = usePlayer();

  if (!episode) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        {/* Episode */}
        <div className="mb-3 flex items-center gap-3">
          {episode.image && (
            <img
              src={episode.image}
              alt=""
              className="h-12 w-12 rounded-lg object-cover"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {episode.title}
            </p>

            <p className="text-xs text-zinc-500">Now Playing</p>
          </div>
        </div>

        {/* Progress */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(event) => setProgress(Number(event.target.value))}
          className="w-full"
        />

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{formatTime(currentTime)}</span>

          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="mt-3 flex items-center justify-center gap-5">
          <button
            onClick={previousEpisode}
            className="rounded-full p-2 hover:bg-zinc-800"
            aria-label="Previous episode"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={() => seek(-skipInterval)}
            className="rounded-full p-2 hover:bg-zinc-800"
            aria-label={`Skip back ${skipInterval} seconds`}
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            onClick={togglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </button>

          <button
            onClick={() => seek(skipInterval)}
            className="rounded-full p-2 hover:bg-zinc-800"
            aria-label={`Skip forward ${skipInterval} seconds`}
          >
            <RotateCw className="h-5 w-5" />
          </button>

          <button
            onClick={nextEpisode}
            className="rounded-full p-2 hover:bg-zinc-800"
            aria-label="Next episode"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex justify-center">
          <select
            value={playbackRate}
            onChange={(event) => setPlaybackRate(Number(event.target.value))}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white"
          >
            <option value={0.5}>0.5×</option>
            <option value={0.75}>0.75×</option>
            <option value={1}>1×</option>
            <option value={1.25}>1.25×</option>
            <option value={1.5}>1.5×</option>
            <option value={2}>2×</option>
          </select>
        </div>

        {/* Volume */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <Volume2 className="h-4 w-4 text-zinc-500" />

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
}
