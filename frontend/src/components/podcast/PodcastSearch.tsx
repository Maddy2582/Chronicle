import {
  Search,
  Plus,
  Check,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {useNavigate} from "react-router-dom";
import {
  searchPodcasts,
  type SearchResult,
} from "@/services/searchService";

import { useLibraryStore } from "@/store/libraryStore";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function PodcastSearch() {

    const navigate = useNavigate();

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<SearchResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  const {
    podcasts,
    addPodcast,
  } = useLibraryStore();

  useEffect(() => {

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {

      setLoading(true);

      try {

        const data =
          await searchPodcasts(query);

        setResults(data.results);

      } finally {
        setLoading(false);
      }

    }, 300);

    return () => clearTimeout(timer);

  }, [query]);

  return (
    <div className="space-y-4">

      <div className="relative">

        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />

        <Input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search podcasts..."
          className="pl-10"
        />

      </div>

      {loading && (
        <p className="text-sm text-zinc-500">
          Searching...
        </p>
      )}

      <div className="space-y-3">

        {results.map((podcast) => {

          const alreadyAdded =
            podcasts.some(
              (p) =>
                p.rss === podcast.rss
            );

          return (
            <div
              key={podcast.rss}
              className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
            >

              <img
                src={podcast.image}
                className="h-14 w-14 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">

                <h3 className="truncate font-semibold">
                  {podcast.title}
                </h3>

                <p className="truncate text-sm text-zinc-500">
                  {podcast.author}
                </p>

              </div>

<Button
  disabled={alreadyAdded}
  onClick={async () => {
    await addPodcast({
      rss: podcast.rss,
      appleId: podcast.id,
      title: podcast.title,
      author: podcast.author,
      image: podcast.image,
    });

    navigate(`/podcast/${encodeURIComponent(podcast.rss)}`);
  }}
>

                {alreadyAdded ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </>
                )}

              </Button>

            </div>
          );

        })}

      </div>

    </div>
  );
}