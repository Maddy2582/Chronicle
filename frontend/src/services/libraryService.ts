import { API_BASE_URL } from "@/config";

export interface LibraryPodcast {
  id?: number;

  rss: string;

  title: string;

  author: string;

  image: string;
}

export async function fetchLibrary() {
  const response = await fetch(
    `${API_BASE_URL}/library`
  );

  return response.json();
}

export async function addLibraryPodcast(
  podcast: LibraryPodcast
) {
  const response = await fetch(
    `${API_BASE_URL}/library`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(podcast),
    }
  );

  return response.json();
}

export async function removeLibraryPodcast(
  rss: string
) {
  await fetch(
    `${API_BASE_URL}/library/${encodeURIComponent(
      rss
    )}`,
    {
      method: "DELETE",
    }
  );
}