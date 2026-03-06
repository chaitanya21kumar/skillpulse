from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class SkillBase(BaseModel):
    id: int
    name: str
    proficiency_level: int


class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    department: str
    designation: str
    employee_id: str


class EmployeeCreate(EmployeeBase):
    joining_date: datetime


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    id: int
    status: str
    created_at: datetime
    skills: List[SkillBase] = []

    class Config:
        from_attributes = True
