from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import feedparser
from database import Base
from database import engine
import models
from fastapi import Depends
from sqlalchemy.orm import Session

from database import get_db
import crud
import schemas

app = FastAPI(title="Chronicle API")

Base.metadata.create_all(bind=engine)
# Allow the React frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://192.168.88.7:5173",
                   "http://127.0.0.1:5173"],
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

@app.get("/search")
async def search_podcasts(query: str):
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(
                "https://itunes.apple.com/search",
                params={
                    "term": query,
                    "entity": "podcast",
                    "limit": 20,
                },
            )

            response.raise_for_status()

            data = response.json()

        results = []

        for item in data["results"]:
            results.append({
                "id": item.get("collectionId"),
                "title": item.get("collectionName"),
                "author": item.get("artistName"),
                "image": item.get("artworkUrl600"),
                "rss": item.get("feedUrl"),
            })

        return {"results": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/library")
def get_library(db: Session = Depends(get_db)):
    return crud.get_library(db)


@app.post("/library")
def add_library(
    podcast: schemas.LibraryPodcastCreate,
    db: Session = Depends(get_db),
):
    return crud.add_library(db, podcast)


@app.delete("/library/{rss:path}")
def delete_library(
    rss: str,
    db: Session = Depends(get_db),
):
    crud.remove_library(db, rss)

    return {"success": True}

@app.get("/played")
def get_played(
    db: Session = Depends(get_db),
):
    return crud.get_played(db)


@app.post("/played")
def update_played(
    played: schemas.PlayedEpisodeUpdate,
    db: Session = Depends(get_db),
):
    return crud.update_played(db, played)

@app.get("/progress")
def get_progress(
    db: Session = Depends(get_db),
):
    return crud.get_progress(db)


@app.post("/progress")
def update_progress(
    progress: schemas.PlaybackProgressUpdate,
    db: Session = Depends(get_db),
):
    return crud.update_progress(db, progress)