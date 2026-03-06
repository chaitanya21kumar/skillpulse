"""
Sample data seeder for SkillPulse development environment.
Run: python seed_data.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.utils.database import SessionLocal, Base, engine
from app.models.employee import Employee, EmployeeStatus
from app.models.skill import Skill, EmployeeSkill
from datetime import datetime

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        # Skip if data already exists
        if db.query(Employee).count() > 0:
            print("Database already has data. Skipping seed.")
            return

        # Create skills
        skills_data = [
            ("Python", "Backend"), ("React", "Frontend"), ("TypeScript", "Frontend"),
            ("PostgreSQL", "Database"), ("FastAPI", "Backend"), ("Docker", "DevOps"),
            ("AWS", "Cloud"), ("Machine Learning", "Data"), ("Product Management", "Management"),
            ("Agile", "Process"),
        ]
        skills = []
        for name, category in skills_data:
            skill = Skill(name=name, category=category, description=f"{name} skill")
            db.add(skill)
            skills.append(skill)
        db.flush()

        # Create employees
        employees_data = [
            ("EMP001", "Alice Chen", "alice@company.com", "Engineering", "Senior Engineer"),
            ("EMP002", "Bob Smith", "bob@company.com", "Engineering", "Backend Developer"),
            ("EMP003", "Carol Davis", "carol@company.com", "Product", "Product Manager"),
            ("EMP004", "David Lee", "david@company.com", "Data", "Data Scientist"),
            ("EMP005", "Emma Wilson", "emma@company.com", "DevOps", "DevOps Engineer"),
        ]

        emp_objects = []
        for eid, name, email, dept, designation in employees_data:
            emp = Employee(
                employee_id=eid, name=name, email=email,
                department=dept, designation=designation,
                joining_date=datetime(2022, 1, 15),
                status=EmployeeStatus.ACTIVE,
            )
            db.add(emp)
            emp_objects.append(emp)
        db.flush()

        # Assign skills
        assignments = [
            (0, 0, 5), (0, 1, 4), (0, 3, 3),
            (1, 0, 4), (1, 4, 5), (1, 3, 3),
            (2, 8, 5), (2, 9, 4),
            (3, 7, 5), (3, 0, 4), (3, 3, 4),
            (4, 5, 5), (4, 6, 4), (4, 0, 2),
        ]
        for emp_idx, skill_idx, level in assignments:
            db.add(EmployeeSkill(
                employee_id=emp_objects[emp_idx].id,
                skill_id=skills[skill_idx].id,
                proficiency_level=level,
            ))

        db.commit()
        print(f"Seeded {len(emp_objects)} employees and {len(skills)} skills.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
