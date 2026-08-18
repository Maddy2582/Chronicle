from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import feedparser

app = FastAPI(title="Chronicle API")

# Allow the React frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/podcast")
async def get_podcast(rss: str):
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(rss)
            response.raise_for_status()

        feed = feedparser.parse(response.text)

        episodes = []

        for entry in feed.entries:

            # Episode artwork
            image = None

            if entry.get("image"):
                image = entry.image.get("href")
            elif feed.feed.get("image"):
                image = feed.feed.get("image", {}).get("href")

            episodes.append({
                "guid": entry.get("id") or entry.get("guid") or entry.get("link"),
                "title": entry.get("title"),
                "published": entry.get("published"),
                "description": entry.get("summary", ""),
                "audio": entry.enclosures[0]["href"] if entry.get("enclosures") else None,
                "duration": entry.get("itunes_duration"),
                "image": image
            })

        # Oldest → Newest
        episodes.reverse()

        return {
            "title": feed.feed.get("title"),
            "author": feed.feed.get("author"),
            "image": feed.feed.get("image", {}).get("href"),
            "description": feed.feed.get("description"),
            "episodeCount": len(episodes),
            "episodes": episodes
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))