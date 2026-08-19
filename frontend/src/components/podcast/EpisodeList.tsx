import type { Episode } from "@/services/podcastService";

import { Play } from "lucide-react";
import {
  CheckCircle2,
  Circle,
} from "lucide-react";

import { usePlayer } from "@/context/PlayerContext";
import { useEpisodeStore } from "@/store/episodeStore";

interface EpisodeListProps {
  episodes: Episode[];
}

export default function EpisodeList({
  episodes,
}: EpisodeListProps) {
  const {
    playEpisode,
    loadEpisode,
    episode: currentEpisode,
  } = usePlayer();

  const {
    markPlayed,
    markUnplayed,
    played,
  } = useEpisodeStore();

  return (
    <div className="space-y-3">
      {episodes.map((episode, index) => (
        <article
          key={`${episode.title}-${index}`}
          onClick={() => loadEpisode(episode)}
          className={`cursor-pointer rounded-2xl border p-5 transition ${
            currentEpisode?.guid === episode.guid
              ? "border-white/30 bg-zinc-800"
              : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80"
          }`}
        >
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
                    __html: episode.description,
                  }}
                />
              )}

              {/* Controls */}
              <div className="mt-4 flex flex-wrap items-center gap-4">

                {/* Play button */}
                <button
                  onClick={(event) => {
                    event.stopPropagation();

                    playEpisode(episode);
                  }}
                  disabled={!episode.audio}
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

                    played[episode.guid]
                      ? markUnplayed(episode.guid)
                      : markPlayed(episode.guid);
                  }}
                  className="
                    text-xs
                    text-zinc-500
                    hover:text-white
                  "
                >
                  {played[episode.guid]
                    ? "Mark Unplayed"
                    : "Mark Played"}
                </button>

              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}