import PodcastSearch from "@/components/podcast/PodcastSearch";

export default function SearchPage() {
  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-4xl font-bold">
          Discover
        </h1>

        <p className="mt-2 text-zinc-500">
          Search millions of podcasts.
        </p>

      </div>

      <PodcastSearch />

    </div>
  );
}