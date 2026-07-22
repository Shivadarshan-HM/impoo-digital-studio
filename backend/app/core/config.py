from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "IMPO Digital Studio Backend"
    API_V1_STR: str = "/api/v1"

    # Database URLs (Neon PostgreSQL)
    # DATABASE_URL: Pooled connection string used by FastAPI application
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/impodb"
    # DIRECT_URL: Direct unpooled connection string used by Alembic migrations
    DIRECT_URL: str = "postgresql://user:password@localhost:5432/impodb"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = "dpavqhtee"
    CLOUDINARY_API_KEY: str = "656426634463392"
    CLOUDINARY_API_SECRET: str = "cyeiTSy0BHKsEjdyP5RsJjoFrDw"

    # Security & Auth
    SECRET_KEY: str = "supersecretkey_change_me_in_production_32bytes"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Admin Account Defaults
    ADMIN_EMAIL: str = "admin@impodigitalstudio.com"
    ADMIN_PASSWORD: str = "admin123"

    # CORS & Site URLs
    PUBLIC_SITE_URL: str = "http://localhost:3000"
    ADMIN_SITE_URL: str = "http://localhost:3001"

    @property
    def cors_origins(self) -> List[str]:
        origins = [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
        ]
        if self.PUBLIC_SITE_URL and self.PUBLIC_SITE_URL not in origins:
            origins.append(self.PUBLIC_SITE_URL)
        if self.ADMIN_SITE_URL and self.ADMIN_SITE_URL not in origins:
            origins.append(self.ADMIN_SITE_URL)
        return origins

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )


settings = Settings()

