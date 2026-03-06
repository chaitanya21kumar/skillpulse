from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.skill import Skill, EmployeeSkill
from app.models.employee import Employee
from app.schemas.skill import SkillCreate, SkillResponse, EmployeeSkillAssign
from app.utils.database import get_db

router = APIRouter()


@router.get("/all", response_model=List[SkillResponse])
def get_all_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()


@router.post("/", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db)):
    existing = db.query(Skill).filter(Skill.name.ilike(skill.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Skill already exists")
    new_skill = Skill(**skill.dict())
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill


@router.post("/{employee_id}/assign")
def assign_skill_to_employee(
    employee_id: int,
    payload: EmployeeSkillAssign,
    db: Session = Depends(get_db),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    skill = db.query(Skill).filter(Skill.id == payload.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    if not (1 <= payload.proficiency_level <= 5):
        raise HTTPException(status_code=400, detail="Proficiency level must be 1-5")

    existing = db.query(EmployeeSkill).filter(
        EmployeeSkill.employee_id == employee_id,
        EmployeeSkill.skill_id == payload.skill_id,
    ).first()

    if existing:
        existing.proficiency_level = payload.proficiency_level
        existing.years_of_experience = payload.years_of_experience
    else:
        employee_skill = EmployeeSkill(
            employee_id=employee_id,
            skill_id=payload.skill_id,
            proficiency_level=payload.proficiency_level,
            years_of_experience=payload.years_of_experience,
        )
        db.add(employee_skill)

    db.commit()
    return {"message": "Skill assigned successfully"}


@router.get("/matrix")
def get_skill_matrix(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    matrix = []

    for emp in employees:
        emp_data = {
            "employee_id": emp.id,
            "name": emp.name,
            "department": emp.department,
            "skills": [
                {"skill_name": es.skill.name, "level": es.proficiency_level}
                for es in emp.skills
            ],
        }
        matrix.append(emp_data)

    return matrix
