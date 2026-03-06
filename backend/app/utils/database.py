from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# For PostgreSQL connections, set a short connect timeout
_db_url = settings.database_url
_connect_args = {}
if _db_url.startswith("postgresql"):
    _connect_args = {"connect_timeout": 10, "sslmode": "require"}
    # Remove sslmode from URL if present to avoid conflicts
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
