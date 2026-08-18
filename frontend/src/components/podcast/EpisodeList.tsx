import type { Episode } from "@/services/podcastService";

interface EpisodeListProps {
  episodes: Episode[];
}

import { Play } from "lucide-react";

import { usePlayer } from "@/context/PlayerContext";
import { useEpisodeStore } from "@/store/episodeStore";

import {
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function EpisodeList({
  episodes,
}: EpisodeListProps) {
      const { playEpisode, episode: currentEpisode } =
    usePlayer();
    const { markPlayed, markUnplayed } = useEpisodeStore();
    const { played } =
  useEpisodeStore();
  return (
    <div className="space-y-3">
      {episodes.map((episode, index) => (
<article
  key={`${episode.title}-${index}`}
  className={`rounded-2xl border p-5 transition ${
    currentEpisode?.title === episode.title
      ? "border-white/30 bg-zinc-800"
      : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80"
  }`}
>
  <div className="flex items-start gap-4">

    {/* Episode Number */}
    {/* <div className="hidden w-10 shrink-0 pt-1 text-center text-sm font-medium text-zinc-600 sm:block">
      {index + 1}
    </div> */}

    <div className="flex h-10 w-10 items-center justify-center">

  {played[episode.guid] ? (
    <CheckCircle2 className="h-6 w-6 text-green-400" />
  ) : (
    <Circle className="h-6 w-6 text-zinc-500" />
  )}

</div>

    <div className="min-w-0 flex-1">

      {episode.published && (
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {episode.published}
        </p>
      )}

      <h4 className="mt-2 text-lg font-semibold text-white">
        {episode.title}
      </h4>

      {episode.description && (
        <p
          className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400"
          dangerouslySetInnerHTML={{
            __html: episode.description,
          }}
        />
      )}

      {/* <div className="mt-4 flex items-center gap-4">

        <button
          onClick={() => playEpisode(episode)}
          disabled={!episode.audio}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Play className="h-4 w-4 fill-current" />

          Play
        </button>

        {episode.duration && (
          <span className="text-xs text-zinc-500">
            {episode.duration}
          </span>
        )}

      </div> */}

      <div className="mt-4 flex items-center gap-4 flex-wrap">

  <button
    onClick={() => playEpisode(episode)}
    disabled={!episode.audio}
    className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
  >
    <Play className="h-4 w-4 fill-current" />
    Play
  </button>

  {episode.duration && (
    <span className="text-xs text-zinc-500">
      {episode.duration}
    </span>
  )}

  <button
    onClick={() =>
      played[episode.guid]
        ? markUnplayed(episode.guid)
        : markPlayed(episode.guid)
    }
    className="text-xs text-zinc-500 hover:text-white"
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