from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# For PostgreSQL on Render, use connection args that handle SSL
_db_url = settings.database_url
_connect_args = {}
if _db_url.startswith("postgresql") and "sslmode" not in _db_url:
    _connect_args = {"sslmode": "prefer"}

engine = create_engine(_db_url, pool_pre_ping=True, connect_args=_connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
