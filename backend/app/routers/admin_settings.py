from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.admin import Admin
from app.models.settings import StudioSettings
from app.schemas.settings import (
    StudioSettingsUpdate,
    StudioSettingsResponse,
)

router = APIRouter(prefix="/admin/settings", tags=["Admin Settings"])


@router.get(
    "",
    response_model=StudioSettingsResponse,
    summary="Get Studio Settings Configuration",
)
def get_studio_settings(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    settings_obj = db.query(StudioSettings).first()
    if not settings_obj:
        # Fallback creation if seed script was not run
        settings_obj = StudioSettings(
            studio_name="IMPO Digital Studio",
            phone="+91 98765 43210",
            email="contact@impodigitalstudio.com",
            address="N.G Complex, Belaganahalli Road, Opposite Police Station, Heggadadevanakote, Karnataka – 571114",
        )
        db.add(settings_obj)
        db.commit()
        db.refresh(settings_obj)

    return settings_obj


@router.put(
    "",
    response_model=StudioSettingsResponse,
    summary="Update Studio Settings Configuration",
)
def update_studio_settings(
    payload: StudioSettingsUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    settings_obj = db.query(StudioSettings).first()
    if not settings_obj:
        settings_obj = StudioSettings()
        db.add(settings_obj)

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(settings_obj, field, value)

    db.commit()
    db.refresh(settings_obj)
    return settings_obj
