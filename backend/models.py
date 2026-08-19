from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import String

from database import Base


class LibraryPodcast(Base):
    __tablename__ = "library"

    id = Column(Integer, primary_key=True)

    rss = Column(String, unique=True, nullable=False)

    title = Column(String)

    author = Column(String)

    image = Column(String)


class PlayedEpisode(Base):
    __tablename__ = "played"

    guid = Column(String, primary_key=True)

    played = Column(Boolean, default=True)


class PlaybackProgress(Base):
    __tablename__ = "progress"

    guid = Column(String, primary_key=True)

    seconds = Column(Float, default=0)