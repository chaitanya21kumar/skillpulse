from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.models.skill import Skill, EmployeeSkill
from datetime import datetime
from typing import Dict


class ImportService:
    @staticmethod
    def import_employees_from_csv(file_path: str, db: Session) -> Dict:
        import pandas as pd  # lazy import to avoid slow startup
        try:
            df = (
                pd.read_csv(file_path)
                if file_path.endswith(".csv")
                else pd.read_excel(file_path)
            )

            required_columns = {"employee_id", "name", "email", "department", "designation"}
            if not required_columns.issubset(df.columns):
                missing = required_columns - set(df.columns)
                return {"imported": 0, "errors": [f"Missing columns: {missing}"]}

            imported_count = 0
            errors = []

            for idx, row in df.iterrows():
                try:
                    # Upsert: find by employee_id first, then by email
                    existing = db.query(Employee).filter(
                        Employee.employee_id == str(row["employee_id"])
                    ).first()
                    if not existing:
                        existing = db.query(Employee).filter(
                            Employee.email == row["email"]
                        ).first()

                    if existing:
                        # Update existing record with new data
                        existing.name = row["name"]
                        existing.email = row["email"]
                        existing.department = row["department"]
                        existing.designation = row["designation"]
                        existing.employee_id = str(row["employee_id"])
                        existing.status = "active"
                        if "joining_date" in row and row["joining_date"]:
                            existing.joining_date = pd.to_datetime(row["joining_date"])
                        imported_count += 1
                    else:
                        new_employee = Employee(
                            employee_id=str(row["employee_id"]),
                            name=row["name"],
                            email=row["email"],
                            department=row["department"],
                            designation=row["designation"],
                            joining_date=pd.to_datetime(
                                row.get("joining_date", datetime.now())
                            ),
                            status="active",
                        )
                        db.add(new_employee)
                        imported_count += 1
                except Exception as e:
                    errors.append(f"Row {idx + 1}: {str(e)}")

            db.commit()
            return {"imported": imported_count, "errors": errors}

        except Exception as e:
            return {"imported": 0, "errors": [str(e)]}

    @staticmethod
    def import_employee_skills_from_csv(file_path: str, db: Session) -> Dict:
        import pandas as pd  # lazy import to avoid slow startup
        try:
            df = (
                pd.read_csv(file_path)
                if file_path.endswith(".csv")
                else pd.read_excel(file_path)
            )

            required_columns = {"employee_id", "skill_name", "proficiency_level"}
            if not required_columns.issubset(df.columns):
                missing = required_columns - set(df.columns)
                return {"imported": 0, "errors": [f"Missing columns: {missing}"]}

            imported_count = 0
            errors = []

            for idx, row in df.iterrows():
                try:
                    employee = db.query(Employee).filter(
                        Employee.employee_id == str(row["employee_id"])
                    ).first()

                    if not employee:
                        errors.append(
                            f"Row {idx + 1}: Employee {row['employee_id']} not found"
                        )
                        continue

                    skill = db.query(Skill).filter(
                        Skill.name.ilike(str(row["skill_name"]))
                    ).first()

                    if not skill:
                        skill = Skill(
                            name=row["skill_name"],
                            category="General",
                            description="",
                        )
                        db.add(skill)
                        db.flush()

                    existing = db.query(EmployeeSkill).filter(
                        EmployeeSkill.employee_id == employee.id,
                        EmployeeSkill.skill_id == skill.id,
                    ).first()

                    if not existing:
                        emp_skill = EmployeeSkill(
                            employee_id=employee.id,
                            skill_id=skill.id,
                            proficiency_level=int(row["proficiency_level"]),
                            verified=False,
                        )
                        db.add(emp_skill)
                        imported_count += 1

                except Exception as e:
                    errors.append(f"Row {idx + 1}: {str(e)}")

            db.commit()
            return {"imported": imported_count, "errors": errors}

        except Exception as e:
            return {"imported": 0, "errors": [str(e)]}
