import type { Episode } from "@/services/podcastService";

interface EpisodeListProps {
  episodes: Episode[];
}

export default function EpisodeList({
  episodes,
}: EpisodeListProps) {
  return (
    <div className="space-y-3">
      {episodes.map((episode, index) => (
        <article
          key={`${episode.title}-${index}`}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:bg-zinc-800/80"
        >
          <div className="flex items-start gap-4">

            {/* Episode Number */}
            <div className="hidden w-10 shrink-0 pt-1 text-center text-sm font-medium text-zinc-600 sm:block">
              {index + 1}
            </div>

            <div className="min-w-0 flex-1">

              {/* Date */}
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
                  className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400"
                  dangerouslySetInnerHTML={{
                    __html: episode.description,
                  }}
                />
              )}

              {/* Duration */}
              {episode.duration && (
                <p className="mt-3 text-xs text-zinc-500">
                  {episode.duration}
                </p>
              )}

            </div>

          </div>
        </article>
      ))}
    </div>
  );
}