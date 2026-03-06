from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.utils.database import Base, engine
from app.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="Employee Skill Management & Analytics Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": settings.app_name}


@app.get("/")
def root():
    return {"message": f"Welcome to {settings.app_name}"}
