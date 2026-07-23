import logging
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger("uvicorn")

DEFAULT_SECRET_KEYS = {
    "supersecretkey_change_me_in_production_32bytes",
    "change_this_secret_key_in_production_32bytes_minimum",
    "secret",
    "secretkey",
    "changeme",
}


class Settings(BaseSettings):
    PROJECT_NAME: str = "IMPO Digital Studio Backend"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"

    # Database URLs (Neon PostgreSQL)
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/impodb"
    DIRECT_URL: str = "postgresql://user:password@localhost:5432/impodb"

    # Cloudinary Credentials (Must be provided via .env)
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Security & Auth
    SECRET_KEY: str = "change_this_secret_key_in_production_32bytes_minimum"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Admin Registration Defaults
    ADMIN_EMAIL: str = "admin@impodigitalstudio.com"
    ADMIN_PASSWORD: str = "admin123"

    # Dynamic CORS & Domain Configurations
    # ADMIN_SITE_URL: Live Vercel Admin Panel URL
    ADMIN_SITE_URL: str = "https://impoo-digital-studio.vercel.app"
    # PUBLIC_SITE_URL: Placeholder for future public website domain
    PUBLIC_SITE_URL: str = "http://localhost:3000"
    # ALLOWED_ORIGINS: Comma-separated list for any additional production domains
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001,https://impoo-digital-studio.vercel.app"

    @property
    def cors_origins(self) -> List[str]:
        """
        Dynamically calculates allowed CORS origins for FastAPI.
        Guarantees local development ports (3000/3001) and production Vercel Admin URL are always permitted.
        """
        origins_set = {
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "https://impoo-digital-studio.vercel.app",
        }

        if self.ALLOWED_ORIGINS:
            for item in self.ALLOWED_ORIGINS.split(","):
                cleaned = item.strip()
                if cleaned:
                    origins_set.add(cleaned)

        if self.PUBLIC_SITE_URL and self.PUBLIC_SITE_URL.strip():
            origins_set.add(self.PUBLIC_SITE_URL.strip())

        if self.ADMIN_SITE_URL and self.ADMIN_SITE_URL.strip():
            origins_set.add(self.ADMIN_SITE_URL.strip())

        return list(origins_set)

    def validate_secret_key_strength(self) -> None:
        """
        Validates SECRET_KEY security on backend startup.
        In production, raises RuntimeError if default or weak key is detected.
        In non-production, outputs a warning log.
        """
        is_default = self.SECRET_KEY in DEFAULT_SECRET_KEYS or "change" in self.SECRET_KEY.lower()
        is_short = len(self.SECRET_KEY) < 32

        if is_default or is_short:
            msg = (
                "⚠️ SECURITY ALERT: SECRET_KEY is set to a default, weak, or short value. "
                "Set a secure random SECRET_KEY (32+ bytes) in .env for production deployment."
            )
            if self.ENVIRONMENT.lower() == "production":
                logger.critical(msg)
                raise RuntimeError("Refusing to start in PRODUCTION with an insecure or default SECRET_KEY.")
            else:
                logger.warning(msg)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )


settings = Settings()
