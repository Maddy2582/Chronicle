from sqlalchemy.orm import Session

import models


def get_library(db: Session):
    return db.query(models.LibraryPodcast).all()


def add_library(db: Session, podcast):
    existing = (
        db.query(models.LibraryPodcast)
        .filter_by(rss=podcast.rss)
        .first()
    )

    if existing:
        return existing

    item = models.LibraryPodcast(**podcast.model_dump())

    db.add(item)

    db.commit()

    db.refresh(item)

    return item


def remove_library(db: Session, rss: str):
    item = (
        db.query(models.LibraryPodcast)
        .filter_by(rss=rss)
        .first()
    )

    if item:
        db.delete(item)
        db.commit()

def get_played(db: Session):
    items = db.query(models.PlayedEpisode).all()

    return {item.guid: item.played for item in items}


def update_played(db: Session, played):
    item = (
        db.query(models.PlayedEpisode)
        .filter_by(guid=played.guid)
        .first()
    )

    if item:
        item.played = played.played
    else:
        item = models.PlayedEpisode(**played.model_dump())
        db.add(item)

    db.commit()

    return item

def get_progress(db: Session):
    items = db.query(models.PlaybackProgress).all()

    return {
        item.guid: item.seconds
        for item in items
    }


def update_progress(db: Session, progress):
    item = (
        db.query(models.PlaybackProgress)
        .filter_by(guid=progress.guid)
        .first()
    )

    if item:
        item.seconds = progress.seconds
    else:
        item = models.PlaybackProgress(**progress.model_dump())
        db.add(item)

    db.commit()

    return item