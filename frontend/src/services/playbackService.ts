import { API_BASE_URL } from "@/config";

export async function fetchPlayed() {
  const response = await fetch(
    `${API_BASE_URL}/played`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch played episodes"
    );
  }

  return response.json();
}

export async function updatePlayed(
  guid: string,
  played: boolean
) {
  const response = await fetch(
    `${API_BASE_URL}/played`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        guid,
        played,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update played state"
    );
  }

  return response.json();
}

export async function fetchProgress() {
  const response = await fetch(
    `${API_BASE_URL}/progress`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch playback progress"
    );
  }

  return response.json();
}

export async function updateProgress(
  guid: string,
  seconds: number
) {
  const response = await fetch(
    `${API_BASE_URL}/progress`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        guid,
        seconds,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update playback progress"
    );
  }

  return response.json();
}