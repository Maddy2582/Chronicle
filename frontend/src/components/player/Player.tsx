import { useState } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  SkipBack,
  SkipForward,
  ChevronDown,
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
  const [expanded, setExpanded] = useState(false);

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

  if (!episode) return null;

  return (
    <>
      {/* ---------- Desktop Player ---------- */}

      <div className="fixed bottom-0 left-0 right-0 z-50 hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur md:block">
        <div className="mx-auto max-w-6xl px-6 py-4">

          <div className="mb-4 flex items-center gap-4">

            {episode.image && (
              <img
                src={episode.image}
                alt=""
                className="h-14 w-14 rounded-xl object-cover"
              />
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold">
                {episode.title}
              </p>

              <p className="text-sm text-zinc-500">
                Now Playing
              </p>
            </div>

          </div>

          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) =>
              setProgress(Number(e.target.value))
            }
            className="w-full accent-white"
          />

          <div className="mt-1 flex justify-between text-xs text-zinc-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-5">

            <button
              onClick={previousEpisode}
              className="rounded-full p-2 hover:bg-zinc-800"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              onClick={() => seek(-skipInterval)}
              className="rounded-full p-2 hover:bg-zinc-800"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </button>

            <button
              onClick={() => seek(skipInterval)}
              className="rounded-full p-2 hover:bg-zinc-800"
            >
              <RotateCw className="h-5 w-5" />
            </button>

            <button
              onClick={nextEpisode}
              className="rounded-full p-2 hover:bg-zinc-800"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            <select
              value={playbackRate}
              onChange={(e) =>
                setPlaybackRate(Number(e.target.value))
              }
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
            >
              <option value={0.5}>0.5×</option>
              <option value={0.75}>0.75×</option>
              <option value={1}>1×</option>
              <option value={1.25}>1.25×</option>
              <option value={1.5}>1.5×</option>
              <option value={2}>2×</option>
            </select>

            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-zinc-500" />

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) =>
                  setVolume(Number(e.target.value))
                }
                className="w-28 accent-white"
              />
            </div>

          </div>

        </div>
      </div>

      {/* ---------- Mobile Mini Player ---------- */}

      <div className="fixed bottom-[72px] left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur md:hidden">

        <div className="flex items-center gap-3 px-4 py-3">

          <button
            onClick={() => setExpanded(true)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >

            {episode.image && (
              <img
                src={episode.image}
                alt=""
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {episode.title}
              </p>

              <p className="truncate text-xs text-zinc-500">
                Tap to expand
              </p>
            </div>

          </button>

          <button
            onClick={togglePlay}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black active:scale-95"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </button>

        </div>

      </div>

      {/* ---------- Mobile Full Player ---------- */}

      {expanded && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950 md:hidden">

          <div className="flex items-center justify-between px-5 py-5">

            <button
              onClick={() => setExpanded(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-zinc-900"
            >
              <ChevronDown className="h-6 w-6" />
            </button>

            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Now Playing
            </p>

            <div className="w-11" />

          </div>

          <div className="flex flex-1 flex-col justify-center px-6">

            {episode.image && (
              <img
                src={episode.image}
                alt=""
                className="mx-auto aspect-square w-full max-w-[320px] rounded-3xl object-cover shadow-2xl"
              />
            )}

            <div className="mt-8 text-center">

              <h2 className="line-clamp-2 text-2xl font-bold text-white">
                {episode.title}
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Now Playing
              </p>

            </div>

            <div className="mt-8">

              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={(e) =>
                  setProgress(Number(e.target.value))
                }
                className="w-full accent-white"
              />

              <div className="mt-2 flex justify-between text-sm text-zinc-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

            </div>

            <div className="mt-10 flex items-center justify-center gap-8">

              <button
                onClick={previousEpisode}
                className="rounded-full p-2 active:scale-90"
              >
                <SkipBack className="h-6 w-6" />
              </button>

              <button
                onClick={() => seek(-10)}
                className="rounded-full p-2 active:scale-90"
              >
                <RotateCcw className="h-7 w-7" />
              </button>

              <button
                onClick={togglePlay}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 fill-current" />
                ) : (
                  <Play className="h-8 w-8 fill-current" />
                )}
              </button>

              <button
                onClick={() => seek(30)}
                className="rounded-full p-2 active:scale-90"
              >
                <RotateCw className="h-7 w-7" />
              </button>

              <button
                onClick={nextEpisode}
                className="rounded-full p-2 active:scale-90"
              >
                <SkipForward className="h-6 w-6" />
              </button>

            </div>

            <div className="mt-10 flex justify-center gap-3">

              {[0.75, 1, 1.25, 1.5, 2].map(
                (speed) => (
                  <button
                    key={speed}
                    onClick={() =>
                      setPlaybackRate(speed)
                    }
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      playbackRate === speed
                        ? "bg-white text-black"
                        : "bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    {speed}×
                  </button>
                )
              )}

            </div>

            <div className="mt-8 flex items-center justify-center gap-3">

              <Volume2 className="h-5 w-5 text-zinc-500" />

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) =>
                  setVolume(Number(e.target.value))
                }
                className="w-48 accent-white"
              />

            </div>

          </div>

        </div>
      )}
    </>
  );
}