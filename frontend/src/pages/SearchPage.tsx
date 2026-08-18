import PodcastSearch from "@/components/podcast/PodcastSearch";
import RssLoader from "@/components/podcast/RssLoader";

export default function SearchPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Discover
        </h1>

        <p className="mt-2 text-zinc-500">
          Search millions of podcasts or add one using its RSS feed.
        </p>
      </div>

      {/* Normal Search */}

      <PodcastSearch />

      {/* Advanced RSS */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

        <details>

          <summary className="cursor-pointer text-sm font-medium text-zinc-300">
            Advanced — Add using RSS Feed
          </summary>

          <div className="mt-4">
            <RssLoader />
          </div>

        </details>

      </div>

    </div>
  );
}