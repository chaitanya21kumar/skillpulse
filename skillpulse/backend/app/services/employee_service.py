from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.employee import Employee, EmployeeStatus


class EmployeeService:
    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        department: Optional[str] = None,
    ) -> List[Employee]:
        query = db.query(Employee)
        if department:
            query = query.filter(Employee.department == department)
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, employee_id: int) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.id == employee_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.email == email).first()

    @staticmethod
    def deactivate(db: Session, employee_id: int) -> bool:
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            return False
        employee.status = EmployeeStatus.INACTIVE
        db.commit()
        return True
