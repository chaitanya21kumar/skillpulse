from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    app_name: str = "SkillPulse"
    database_url: str = "postgresql://user:password@localhost/skillpulse"
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    debug: bool = True
    allowed_origins: List[str] = ["*"]

    @property
    def is_production(self) -> bool:
        return not self.debug

    class Config:
        env_file = ".env"


settings = Settings()
