import time
import logging
from collections import defaultdict, deque
from typing import Dict
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core import cloudinary_config
from app.core.config import settings
from app.routers import (
    auth,
    admin_categories,
    admin_photos,
    admin_upload,
    admin_leads,
    admin_settings,
    admin_dashboard,
    public,
)

logger = logging.getLogger("uvicorn.error")

# Simple In-Memory Rate Limiter for sensitive endpoints (/api/v1/auth/login, /api/v1/public/leads)
RATE_LIMIT_RULES: Dict[str, tuple] = {
    "/api/v1/auth/login": (5, 60),    # 5 attempts per 60s
    "/api/v1/public/leads": (10, 60), # 10 requests per 60s
}
request_history: Dict[str, deque] = defaultdict(deque)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup validation checks
    logger.info("Initializing IMPO Digital Studio API server...")
    settings.validate_secret_key_strength()
    yield
    logger.info("Shutting down IMPO Digital Studio API server...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS Configuration dynamically reading settings.cors_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Security Headers & Rate Limiting Middleware
@app.middleware("http")
async def security_and_rate_limit_middleware(request: Request, call_next):
    # 1. Rate Limiting for sensitive routes
    client_ip = request.client.host if request.client else "127.0.0.1"
    path = request.url.path

    if path in RATE_LIMIT_RULES:
        max_requests, window_seconds = RATE_LIMIT_RULES[path]
        now = time.time()
        key = f"{client_ip}:{path}"
        history = request_history[key]

        # Purge expired timestamps
        while history and history[0] <= now - window_seconds:
            history.popleft()

        if len(history) >= max_requests:
            logger.warning(f"Rate limit exceeded for IP {client_ip} on path {path}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": True,
                    "status_code": 429,
                    "detail": "Too many requests. Please try again later.",
                    "path": path,
                },
            )
        history.append(now)

    # Process Request
    response: Response = await call_next(request)

    # 2. Production Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

    return response


# Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "detail": exc.detail,
            "path": request.url.path,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "status_code": 422,
            "detail": "Input validation error",
            "errors": exc.errors(),
            "path": request.url.path,
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled server error at {request.url.path}: {exc}")
    detail = "An internal server error occurred." if settings.ENVIRONMENT.lower() == "production" else str(exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "status_code": 500,
            "detail": detail,
            "path": request.url.path,
        },
    )


# Health Check Endpoints
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "IMPOO Digital Studio API"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}


# Register API Routers under /api/v1
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(admin_categories.router, prefix=settings.API_V1_STR)
app.include_router(admin_photos.router, prefix=settings.API_V1_STR)
app.include_router(admin_upload.router, prefix=settings.API_V1_STR)
app.include_router(admin_leads.router, prefix=settings.API_V1_STR)
app.include_router(admin_settings.router, prefix=settings.API_V1_STR)
app.include_router(admin_dashboard.router, prefix=settings.API_V1_STR)
app.include_router(public.router, prefix=settings.API_V1_STR)
