from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.admin import Admin
from app.models.category import Category
from app.models.photo import Photo
from app.models.lead import Lead, LeadStatusEnum
from app.schemas.dashboard import DashboardStatsResponse
from app.schemas.lead import LeadResponse

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])


@router.get(
    "/stats",
    response_model=DashboardStatsResponse,
    summary="Get Studio Overview Statistics",
)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    total_categories = db.query(func.count(Category.id)).scalar() or 0
    total_photos = db.query(func.count(Photo.id)).scalar() or 0
    total_leads = db.query(func.count(Lead.id)).scalar() or 0
    unread_leads = (
        db.query(func.count(Lead.id))
        .filter(Lead.status == LeadStatusEnum.new)
        .scalar()
        or 0
    )

    recent_leads_objs = (
        db.query(Lead).order_by(Lead.created_at.desc()).limit(5).all()
    )

    return DashboardStatsResponse(
        total_categories=total_categories,
        total_photos=total_photos,
        total_leads=total_leads,
        unread_leads=unread_leads,
        recent_leads=[LeadResponse.model_validate(l) for l in recent_leads_objs],
    )
