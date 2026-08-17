import { useState } from "react";
import { Loader2 } from "lucide-react";

import RssLoader from "@/components/podcast/RssLoader";
import EpisodeList from "@/components/podcast/EpisodeList";

import {
  fetchPodcast,
  type Podcast,
} from "@/services/podcastService";

export default function Home() {
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPodcast = async (rss: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchPodcast(rss);

      setPodcast(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load podcast. Please check the RSS feed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f10] text-white">

      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-zinc-800 p-6 md:flex">
        <h1 className="text-3xl font-bold">
          Chronicle
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Start from Episode 1.
        </p>

        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Your Library
          </p>

          {podcast && (
            <div className="rounded-xl bg-zinc-900 p-3">
              {podcast.title}
            </div>
          )}

          {!podcast && (
            <p className="text-sm text-zinc-500">
              No podcasts added yet.
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-8">

        <div className="mx-auto max-w-6xl p-6 md:p-10">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight">
              Your Library
            </h2>

            <p className="mt-2 text-zinc-400">
              Add a podcast using its RSS feed.
            </p>
          </div>

          {/* RSS Loader */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="mb-3 text-sm font-medium">
              Add Podcast
            </p>

            <RssLoader onLoad={loadPodcast} />
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-10 flex items-center justify-center gap-3 text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin" />

              <span>
                Loading podcast...
              </span>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Podcast Information */}
          {podcast && !loading && (
            <section className="mt-10">

              {/* Podcast Header */}
              <div className="flex flex-col gap-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:flex-row">

                {/* Artwork */}
                {podcast.image && (
                  <img
                    src={podcast.image}
                    alt={`${podcast.title} artwork`}
                    className="h-48 w-48 shrink-0 rounded-2xl object-cover shadow-2xl"
                  />
                )}

                {/* Information */}
                <div className="flex flex-col justify-center">

                  <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                    Podcast
                  </p>

                  <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                    {podcast.title}
                  </h2>

                  {podcast.author && (
                    <p className="mt-2 text-lg text-zinc-400">
                      {podcast.author}
                    </p>
                  )}

                  <p className="mt-4 text-sm text-zinc-500">
                    {podcast.episodeCount} episodes
                  </p>

                  {podcast.description && (
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
                      {podcast.description}
                    </p>
                  )}

                </div>
              </div>

              {/* Episodes will go here */}
              <section className="mt-10">

                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Episodes
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Oldest → Newest
                    </p>
                  </div>

                  <span className="text-sm text-zinc-500">
                    {podcast.episodeCount} episodes
                  </span>
                </div>

                <EpisodeList episodes={podcast.episodes} />

              </section>

            </section>
          )}

        </div>

      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-zinc-800 bg-zinc-950 p-4 md:hidden">
        <button className="text-sm text-zinc-300">
          Home
        </button>

        <button className="text-sm text-zinc-300">
          Library
        </button>

        <button className="text-sm text-zinc-300">
          Search
        </button>
      </nav>

    </div>
  );
}