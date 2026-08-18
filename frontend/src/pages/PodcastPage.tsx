import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import EpisodeList from "@/components/podcast/EpisodeList";
import EpisodeToolbar from "@/components/podcast/EpisodeToolbar";

import {
  fetchPodcast,
  type Episode,
} from "@/services/podcastService";

import { usePlayer } from "@/context/PlayerContext";

export default function PodcastPage() {
  const { rss } = useParams();

  const { setEpisodes } = usePlayer();

  const [search, setSearch] = useState("");

  const [oldestFirst, setOldestFirst] =
    useState(true);

  const {
    data: podcast,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["podcast", rss],
    queryFn: () =>
      fetchPodcast(decodeURIComponent(rss!)),
    enabled: !!rss,
  });

  useEffect(() => {
    if (podcast) {
      setEpisodes(podcast.episodes);
    }
  }, [podcast, setEpisodes]);

  const filteredEpisodes = useMemo(() => {
    if (!podcast) return [];

    let episodes = oldestFirst
      ? [...podcast.episodes]
      : [...podcast.episodes].reverse();

    const query = search.trim().toLowerCase();

    if (!query) return episodes;

    return episodes.filter(
      (episode: Episode, index: number) => {
        const originalIndex =
          podcast.episodes.findIndex(
            (e) => e.guid === episode.guid
          );

        const episodeNumber =
          originalIndex + 1;

        return (
          episode.title
            .toLowerCase()
            .includes(query) ||
          String(episodeNumber).includes(query)
        );
      }
    );
  }, [podcast, search, oldestFirst]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-zinc-500">
          Loading podcast...
        </p>
      </div>
    );
  }

  if (isError || !podcast) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-400">
          Failed to load podcast.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Podcast Header */}
      <div className="flex flex-col gap-6 rounded-3xl bg-zinc-900 p-6 md:flex-row">
        <img
          src={podcast.image}
          alt={podcast.title}
          className="h-52 w-52 rounded-2xl object-cover"
        />

        <div className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-wider text-zinc-500">
            Podcast
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {podcast.title}
          </h1>

          <p className="mt-2 text-zinc-400">
            {podcast.author}
          </p>

          <p className="mt-4 text-sm text-zinc-500">
            {podcast.episodeCount} episodes
          </p>

          {podcast.description && (
            <p className="mt-6 max-w-3xl text-sm leading-6 text-zinc-400">
              {podcast.description}
            </p>
          )}
        </div>
      </div>

      {/* Search + Sort */}
      <EpisodeToolbar
        search={search}
        setSearch={setSearch}
        oldestFirst={oldestFirst}
        toggleSort={() =>
          setOldestFirst(!oldestFirst)
        }
      />

      {/* Episode Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Showing {filteredEpisodes.length}{" "}
          {filteredEpisodes.length === 1
            ? "episode"
            : "episodes"}
        </p>
      </div>

      {/* Episode List */}
      <EpisodeList
        episodes={filteredEpisodes}
      />
    </div>
  );
}