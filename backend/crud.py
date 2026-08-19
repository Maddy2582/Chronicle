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