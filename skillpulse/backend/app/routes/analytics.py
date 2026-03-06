from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from app.models.employee import Employee
from app.models.skill import Skill, EmployeeSkill
from app.utils.database import get_db

router = APIRouter()


@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_employees = db.query(func.count(Employee.id)).scalar()
    total_skills = db.query(func.count(distinct(EmployeeSkill.skill_id))).scalar()

    dept_dist = (
        db.query(Employee.department, func.count(Employee.id).label("count"))
        .group_by(Employee.department)
        .all()
    )

    return {
        "total_employees": total_employees,
        "total_skills": total_skills,
        "department_distribution": [
            {"department": d[0], "count": d[1]} for d in dept_dist
        ],
    }


@router.get("/skill-distribution")
def get_skill_distribution(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    distribution = []

    for skill in skills:
        levels = (
            db.query(
                EmployeeSkill.proficiency_level,
                func.count(EmployeeSkill.id).label("count"),
            )
            .filter(EmployeeSkill.skill_id == skill.id)
            .group_by(EmployeeSkill.proficiency_level)
            .all()
        )
        distribution.append(
            {
                "skill": skill.name,
                "levels": [{"level": l[0], "count": l[1]} for l in levels],
            }
        )

    return distribution


@router.get("/skill-gaps")
def analyze_skill_gaps(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    gaps: dict = {}

    for emp in employees:
        dept = emp.department
        if dept not in gaps:
            gaps[dept] = {}

        for es in emp.skills:
            if es.proficiency_level < 3:
                skill_name = es.skill.name
                if skill_name not in gaps[dept]:
                    gaps[dept][skill_name] = 0
                gaps[dept][skill_name] += 1

    return {
        "department_gaps": gaps,
        "total_gaps": sum(sum(d.values()) for d in gaps.values()),
    }


@router.get("/top-performers")
def get_top_performers(limit: int = Query(10, le=50), db: Session = Depends(get_db)):
    results = (
        db.query(
            Employee.id,
            Employee.name,
            Employee.department,
            func.avg(EmployeeSkill.proficiency_level).label("avg_level"),
        )
        .join(EmployeeSkill)
        .group_by(Employee.id)
        .order_by(func.avg(EmployeeSkill.proficiency_level).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": r[0],
            "name": r[1],
            "department": r[2],
            "avg_proficiency": round(float(r[3]), 2) if r[3] else 0,
        }
        for r in results
    ]
