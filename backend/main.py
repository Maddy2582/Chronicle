
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import feedparser

app = FastAPI(title="Chronicle API")

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
            episodes.append({
                "title": entry.get("title"),
                "published": entry.get("published"),
                "description": entry.get("summary", ""),
                "audio": entry.enclosures[0]["href"] if entry.get("enclosures") else None,
                "duration": entry.get("itunes_duration")
            })

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