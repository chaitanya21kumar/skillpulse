from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime


class SkillBase(BaseModel):
    id: int
    name: str
    proficiency_level: int

    class Config:
        from_attributes = True


class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    department: str
    designation: str
    employee_id: str

    @field_validator("name")
    @classmethod
    def name_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name must not be blank")
        return v.strip()

    @field_validator("department")
    @classmethod
    def department_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Department must not be blank")
        return v.strip()


class EmployeeCreate(EmployeeBase):
    joining_date: datetime


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None


class EmployeeListResponse(BaseModel):
    total: int
    employees: List["EmployeeResponse"]


class EmployeeResponse(EmployeeBase):
    id: int
    status: str
    created_at: datetime
    skills: List[SkillBase] = []

    class Config:
        from_attributes = True
