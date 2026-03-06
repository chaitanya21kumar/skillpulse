from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.routes import employees, skills, analytics, import_data
from app.utils.database import Base, engine
from app.config import settings
from app.middleware.error_handler import error_handler_middleware

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
app.add_middleware(BaseHTTPMiddleware, dispatch=error_handler_middleware)

app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(import_data.router, prefix="/api/import", tags=["Import"])


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": settings.app_name}


@app.get("/")
def root():
    return {"message": f"Welcome to {settings.app_name}"}
