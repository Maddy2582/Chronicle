import { API_BASE_URL } from "@/config";

export interface Episode {
  guid: string;
  title: string;
  published: string;
  description: string;
  audio: string | null;
  duration: string | null;
  image: string | null
}

export interface Podcast {
  title: string;
  author: string;
  image: string;
  description: string;
  episodeCount: number;
  episodes: Episode[];
}

export async function fetchPodcast(rss: string): Promise<Podcast> {


  const response = await fetch(
    `${API_BASE_URL}/podcast?rss=${encodeURIComponent(rss)}`
  );

  if (!response.ok) {
    throw new Error("Failed to load podcast");
  }

  return response.json();
}