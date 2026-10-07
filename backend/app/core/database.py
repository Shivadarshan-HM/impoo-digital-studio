from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

# Force the psycopg2 driver regardless of how DATABASE_URL is written
db_url = make_url(settings.DATABASE_URL).set(drivername="postgresql+psycopg2")

# Engine created with the pooled DATABASE_URL for high-concurrency runtime performance
engine = create_engine(
    db_url,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)