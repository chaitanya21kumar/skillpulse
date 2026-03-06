from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.skill import Skill, EmployeeSkill


class SkillService:
    @staticmethod
    def get_all(db: Session) -> List[Skill]:
        return db.query(Skill).all()

    @staticmethod
    def get_by_id(db: Session, skill_id: int) -> Optional[Skill]:
        return db.query(Skill).filter(Skill.id == skill_id).first()

    @staticmethod
    def get_by_name(db: Session, name: str) -> Optional[Skill]:
        return db.query(Skill).filter(Skill.name.ilike(name)).first()

    @staticmethod
    def get_employee_skills(db: Session, employee_id: int) -> List[EmployeeSkill]:
        return (
            db.query(EmployeeSkill)
            .filter(EmployeeSkill.employee_id == employee_id)
            .all()
        )
