from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SkillCreate(BaseModel):
    name: str
    category: str
    description: Optional[str] = None


class SkillResponse(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class EmployeeSkillAssign(BaseModel):
    skill_id: int
    proficiency_level: int
    years_of_experience: float = 0.0
