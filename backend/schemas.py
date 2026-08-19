from pydantic import BaseModel


class LibraryPodcastCreate(BaseModel):
    rss: str
    title: str
    author: str
    image: str


class LibraryPodcastResponse(LibraryPodcastCreate):
    id: int

    class Config:
        from_attributes = True


class PlayedEpisodeUpdate(BaseModel):
    guid: str
    played: bool


class PlaybackProgressUpdate(BaseModel):
    guid: str
    seconds: float