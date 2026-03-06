# SkillPulse — Employee Skill Management Platform

A production-grade full-stack platform for managing employee skill profiles, competencies, and analytics.

**Developer:** Chaitanya Kumar
**Stack:** FastAPI · React · PostgreSQL · Tailwind CSS
**Deployment:** Render (backend) · Netlify (frontend)

---

## Features

- **Employee Management** — Create, view, update, and deactivate employee profiles
- **Skill Tracking** — Maintain skill profiles with proficiency levels (1–5 scale)
- **Data Visualization** — Real-time dashboards with department distribution charts and top performer rankings
- **Bulk Import** — CSV/Excel import for both employees and skills
- **Analytics Engine** — Skill gap analysis, top performers, department insights
- **Responsive UI** — Modern dark-themed interface built with Tailwind CSS
- **RESTful API** — Fully documented FastAPI endpoints with OpenAPI/Swagger UI

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | FastAPI, SQLAlchemy, Pydantic, Pandas   |
| Database   | PostgreSQL                              |
| Frontend   | React 18, TypeScript, Vite              |
| Styling    | Tailwind CSS, Recharts, Lucide React    |
| Deployment | Render (backend), Netlify (frontend)    |

---

## Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 13+ (or Docker)

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/chaitanya21kumar/skillpulse.git
cd skillpulse
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start PostgreSQL (Docker)
docker-compose up -d

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run server
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# .env.local: VITE_API_URL=http://localhost:8000/api
npm run dev
```

Frontend runs at: http://localhost:5173

---

## API Endpoints

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/{id}` | Get employee by ID |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Deactivate employee |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills/all` | List all skills |
| POST | `/api/skills` | Create skill |
| POST | `/api/skills/{id}/assign` | Assign skill to employee |
| GET | `/api/skills/matrix` | Full skill matrix |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard-stats` | Dashboard statistics |
| GET | `/api/analytics/skill-distribution` | Skill level distribution |
| GET | `/api/analytics/skill-gaps` | Skill gap analysis |
| GET | `/api/analytics/top-performers` | Top performing employees |

### Import
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/import/employees` | Import employees from CSV/Excel |
| POST | `/api/import/employee-skills` | Import skills from CSV/Excel |

---

## CSV Import Format

### Employees CSV
```
employee_id,name,email,department,designation,joining_date
EMP001,John Doe,john@company.com,Engineering,Senior Engineer,2023-01-15
EMP002,Jane Smith,jane@company.com,Product,Product Manager,2022-06-01
```

### Skills CSV
```
employee_id,skill_name,proficiency_level
EMP001,Python,5
EMP001,React,4
EMP002,Product Strategy,5
```

Proficiency levels: `1` (Beginner) → `5` (Expert)

---

## Running Tests

```bash
cd backend
pip install pytest httpx
pytest tests/ -v
```

---

## Deployment

### Backend → Render

1. Push repo to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect GitHub repo, set root directory to `backend/`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `DATABASE_URL` — PostgreSQL connection string
   - `SECRET_KEY` — random secure string

### Frontend → Netlify

1. Create new site on [netlify.com](https://netlify.com) from GitHub
2. Set base directory to `frontend/`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` — your Render backend URL + `/api`

---

## License

MIT License — Chaitanya Kumar
