import type { Episode } from "@/services/podcastService";

import {
  Play,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { useEffect, useRef } from "react";

import { usePlayer } from "@/context/PlayerContext";
import { useEpisodeStore } from "@/store/episodeStore";

interface EpisodeListProps {
  episodes: Episode[];
  podcastRss: string;
}

export default function EpisodeList({
  episodes,
  podcastRss,
}: EpisodeListProps) {
  const {
    playEpisode,
    loadEpisode,
    episode: currentEpisode,
    progress,
  } = usePlayer();

  const {
    markPlayed,
    markUnplayed,
    played,
  } = useEpisodeStore();

  /*
   * Ref for the currently selected / last-played
   * episode.
   */
  const currentEpisodeRef =
    useRef<HTMLElement | null>(null);

  /*
   * Automatically scroll to the current episode
   * when opening a podcast.
   */
  useEffect(() => {
    if (!currentEpisode) {
      return;
    }

    const isCurrentEpisodeVisible =
      episodes.some(
        (item) =>
          item.guid === currentEpisode.guid
      );

    if (!isCurrentEpisodeVisible) {
      return;
    }

    const timer = setTimeout(() => {
      currentEpisodeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [currentEpisode, episodes, podcastRss]);

  return (
    <div className="space-y-3">
      {episodes.map((episode, index) => {
        /*
         * Is this the currently selected / last-played
         * episode?
         */
        const isCurrent =
          currentEpisode?.guid ===
          episode.guid;

        /*
         * Get the saved playback position for
         * this particular episode.
         *
         * progress is:
         *
         * Record<string, number>
         *
         * Example:
         *
         * {
         *   "episode-guid-1": 523,
         *   "episode-guid-2": 1240
         * }
         */
        const currentProgress =
          progress[episode.guid] ?? 0;

        /*
         * Convert RSS duration such as:
         *
         * 42:35
         *
         * or:
         *
         * 1:12:45
         *
         * into seconds.
         */
        const durationSeconds =
          parseDuration(
            episode.duration
          );

        /*
         * Calculate percentage played.
         */
        const progressPercent =
          durationSeconds > 0
            ? Math.min(
                100,
                Math.max(
                  0,
                  (currentProgress /
                    durationSeconds) *
                    100
                )
              )
            : 0;

        return (
          <article
            key={`${episode.title}-${index}`}
            ref={
              isCurrent
                ? currentEpisodeRef
                : null
            }
            onClick={() =>
              loadEpisode(episode)
            }
            className={`relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition ${
              isCurrent
                ? "border-blue-500/60 bg-blue-950/30 ring-1 ring-blue-500/30"
                : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80"
            }`}
          >
            {/* ================================
                Playback progress bar
            ================================= */}

            {progressPercent > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
            )}

            <div className="flex items-start gap-4">
              {/* Played / Unplayed indicator */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                {played[episode.guid] ? (
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                ) : (
                  <Circle className="h-6 w-6 text-zinc-500" />
                )}
              </div>

              {/* Episode content */}

              <div className="min-w-0 flex-1">
                {/* Current episode label */}

                {isCurrent && (
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Last Played
                  </p>
                )}

                {/* Published date */}

                {episode.published && (
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {episode.published}
                  </p>
                )}

                {/* Title */}

                <h4 className="mt-2 text-lg font-semibold text-white">
                  {episode.title}
                </h4>

                {/* Description */}

                {episode.description && (
                  <p
                    className="
                      mt-2
                      line-clamp-3
                      text-sm
                      leading-6
                      text-zinc-400
                    "
                    dangerouslySetInnerHTML={{
                      __html:
                        episode.description,
                    }}
                  />
                )}

                {/* Playback progress */}

                {progressPercent > 0 && (
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                      <span>
                        Progress
                      </span>

                      <span>
                        {Math.round(
                          progressPercent
                        )}
                        %
                      </span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-white transition-all"
                        style={{
                          width: `${progressPercent}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-zinc-500">
                      {formatProgress(
                        currentProgress
                      )}{" "}
                      played
                    </p>
                  </div>
                )}

                {/* Controls */}

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {/* Play button */}

                  <button
                    onClick={(event) => {
                      event.stopPropagation();

                      playEpisode(
                        episode
                      );
                    }}
                    disabled={
                      !episode.audio
                    }
                    className="
                      flex
                      min-h-11
                      items-center
                      gap-2
                      rounded-full
                      bg-white
                      px-5
                      text-sm
                      font-medium
                      text-black
                      transition
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Play
                  </button>

                  {/* Duration */}

                  {episode.duration && (
                    <span className="text-xs text-zinc-500">
                      {episode.duration}
                    </span>
                  )}

                  {/* Mark Played / Unplayed */}

                  <button
                    onClick={(event) => {
                      event.stopPropagation();

                      played[
                        episode.guid
                      ]
                        ? markUnplayed(
                            episode.guid
                          )
                        : markPlayed(
                            episode.guid
                          );
                    }}
                    className="
                      text-xs
                      text-zinc-500
                      hover:text-white
                    "
                  >
                    {played[
                      episode.guid
                    ]
                      ? "Mark Unplayed"
                      : "Mark Played"}
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/*
 * Convert seconds into a human-readable
 * playback position.
 *
 * Examples:
 *
 * 65  -> 1:05
 * 523 -> 8:43
 */
function formatProgress(
  seconds: number
) {
  const minutes = Math.floor(
    seconds / 60
  );

  const remainingSeconds =
    Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

/*
 * Convert RSS duration into seconds.
 *
 * Supported formats:
 *
 * MM:SS
 * HH:MM:SS
 */
function parseDuration(
  duration: string | null
): number {
  if (!duration) {
    return 0;
  }

  const parts =
    duration.split(":").map(Number);

  if (
    parts.some(
      (part) =>
        !Number.isFinite(part)
    )
  ) {
    return 0;
  }

  if (parts.length === 2) {
    const [minutes, seconds] =
      parts;

    return (
      minutes * 60 +
      seconds
    );
  }

  if (parts.length === 3) {
    const [
      hours,
      minutes,
      seconds,
    ] = parts;

    return (
      hours * 3600 +
      minutes * 60 +
      seconds
    );
  }

  return 0;
}