import { useNavigate } from "react-router-dom";

import LibraryCard from "@/components/podcast/LibraryCard";

import { useLibraryStore } from "@/store/libraryStore";

export default function LibraryPage() {
  const navigate = useNavigate();

  const { podcasts } = useLibraryStore();

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-4xl font-bold">
          Your Library
        </h1>

        <p className="mt-2 text-zinc-500">
          {podcasts.length} saved podcasts
        </p>
      </div>

      {podcasts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 p-8 text-center">

          <p className="text-zinc-400">
            Search and add your first podcast.
          </p>

        </div>
      ) : (
        <div className="space-y-3">

          {podcasts.map((podcast) => (
            <LibraryCard
              key={podcast.rss}
              podcast={podcast}
              onOpen={() =>
                navigate(
                  `/podcast/${encodeURIComponent(
                    podcast.rss
                  )}`
                )
              }
            />
          ))}

        </div>
      )}

    </div>
  );
}