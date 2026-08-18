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
  const url =
    `http://localhost:8000/podcast?rss=${encodeURIComponent(rss)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load podcast");
  }

  return response.json();
}