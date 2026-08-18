export interface SearchResult {
  id: number;
  title: string;
  author: string;
  image: string;
  rss: string;
}

export async function searchPodcasts(
  query: string
): Promise<{ results: SearchResult[] }> {

  const response = await fetch(
    `http://localhost:8000/search?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
}