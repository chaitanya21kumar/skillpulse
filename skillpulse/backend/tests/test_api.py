import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.utils.database import get_db, Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

Base.metadata.create_all(bind=test_engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "SkillPulse" in response.json()["message"]


def test_get_employees_empty():
    response = client.get("/api/employees/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_employee():
    response = client.post(
        "/api/employees/",
        json={
            "employee_id": "EMP001",
            "name": "John Doe",
            "email": "john@example.com",
            "department": "Engineering",
            "designation": "Software Engineer",
            "joining_date": "2024-01-01T00:00:00",
        },
    )
    assert response.status_code == 201
    assert response.json()["name"] == "John Doe"
    assert response.json()["employee_id"] == "EMP001"


def test_create_duplicate_employee():
    client.post(
        "/api/employees/",
        json={
            "employee_id": "EMP002",
            "name": "Jane Doe",
            "email": "jane@example.com",
            "department": "HR",
            "designation": "HR Manager",
            "joining_date": "2024-01-01T00:00:00",
        },
    )
    response = client.post(
        "/api/employees/",
        json={
            "employee_id": "EMP002",
            "name": "Jane Doe",
            "email": "jane@example.com",
            "department": "HR",
            "designation": "HR Manager",
            "joining_date": "2024-01-01T00:00:00",
        },
    )
    assert response.status_code == 400


def test_get_employee_not_found():
    response = client.get("/api/employees/99999")
    assert response.status_code == 404


def test_dashboard_stats():
    response = client.get("/api/analytics/dashboard-stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_employees" in data
    assert "total_skills" in data
    assert "department_distribution" in data


def test_get_all_skills():
    response = client.get("/api/skills/all")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_skill_matrix():
    response = client.get("/api/skills/matrix")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
