from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core import cloudinary_config  # Validates Cloudinary credentials on startup
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

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS Configuration allowing website (port 3000), admin (port 3001), and production URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # website
        "http://localhost:3001",   # admin
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers for Uniform JSON Error Formatting
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


# Health Check Endpoints
@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def health_check():
    """
    Health check endpoint verifying API service availability.
    """
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME,
        "version": "1.0.0",
        "cors_origins": settings.cors_origins,
    }


# Register API Routers under /api/v1
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(admin_categories.router, prefix=settings.API_V1_STR)
app.include_router(admin_photos.router, prefix=settings.API_V1_STR)
app.include_router(admin_upload.router, prefix=settings.API_V1_STR)
app.include_router(admin_leads.router, prefix=settings.API_V1_STR)
app.include_router(admin_settings.router, prefix=settings.API_V1_STR)
app.include_router(admin_dashboard.router, prefix=settings.API_V1_STR)
app.include_router(public.router, prefix=settings.API_V1_STR)

