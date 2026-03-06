from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

_db_url = settings.database_url
_connect_args = {}

if _db_url.startswith("postgresql"):
    # Always set a connection timeout to avoid hanging at startup
    _connect_args["connect_timeout"] = 10
    # Only use SSL for external connections (contain hostname with .render.com)
    if "sslmode=require" in _db_url or ".render.com" in _db_url:
        _connect_args["sslmode"] = "require"
        # Remove sslmode from URL to avoid parameter conflicts
        if "?sslmode=" in _db_url:
            _db_url = _db_url.split("?sslmode=")[0]

engine = create_engine(
    _db_url,
    pool_pre_ping=True,
    connect_args=_connect_args,
    pool_timeout=30,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
