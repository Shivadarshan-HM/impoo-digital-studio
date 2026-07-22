from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class StudioSettingsBase(BaseModel):
    studio_name: str
    phone: str
    email: EmailStr
    address: str


class StudioSettingsUpdate(BaseModel):
    studio_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None


class StudioSettingsResponse(StudioSettingsBase):
    id: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
