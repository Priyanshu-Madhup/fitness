import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    tomtom_api_key: str = ""
    app_env: str = "development"
    allowed_origins: str = "http://localhost:3000"
    port: int = int(os.environ.get("PORT", 8000))

    @property
    def cors_origins(self) -> list[str]:
        if self.app_env == "production":
            return [o.strip() for o in self.allowed_origins.split(",")]
        return ["*"]


settings = Settings()
