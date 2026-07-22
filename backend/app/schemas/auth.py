from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    confirm_password: str


class RegisterStatusResponse(BaseModel):
    registration_open: bool


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, description="New password (minimum 8 characters)")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str


class AdminResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
