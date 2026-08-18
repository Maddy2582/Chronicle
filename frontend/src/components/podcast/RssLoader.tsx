import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { fetchPodcast } from "@/services/podcastService";
import { useLibraryStore } from "@/store/libraryStore";

export default function RssLoader() {
  const [rss, setRss] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { addPodcast } = useLibraryStore();

  async function handleLoad() {
    if (!rss.trim()) return;

    setLoading(true);

    try {
      const podcast = await fetchPodcast(rss);

      addPodcast({
        rss,
        title: podcast.title,
        author: podcast.author,
        image: podcast.image,
      });

      navigate(`/podcast/${encodeURIComponent(rss)}`);

    } catch {
      alert("Couldn't load RSS feed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">

      <Input
        value={rss}
        onChange={(e) => setRss(e.target.value)}
        placeholder="Paste RSS feed URL..."
      />

      <Button
        onClick={handleLoad}
        disabled={loading}
      >
        {loading ? "Loading..." : "Load RSS Feed"}
      </Button>

    </div>
  );
}