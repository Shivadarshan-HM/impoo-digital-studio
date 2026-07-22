from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.lead import LeadStatusEnum


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    phone: str = Field(..., min_length=5, max_length=50)
    email: EmailStr
    event_type: str = Field(..., min_length=2, max_length=100)
    event_date: Optional[date] = None
    message: str = Field(..., min_length=5)
    # Honeypot field for spam prevention — bots typically fill hidden fields
    hp_website: Optional[str] = Field(default=None, description="Honeypot field (should be empty)")


class LeadStatusUpdate(BaseModel):
    status: LeadStatusEnum


class LeadResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    event_type: str
    event_date: Optional[date] = None
    message: str
    status: LeadStatusEnum
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LeadListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: List[LeadResponse]
