import re
from typing import Optional


def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def validate_proficiency_level(level: int) -> bool:
    """Validate proficiency level is between 1 and 5."""
    return 1 <= level <= 5


def validate_employee_id(employee_id: str) -> bool:
    """Validate employee ID format."""
    return bool(employee_id and employee_id.strip())
