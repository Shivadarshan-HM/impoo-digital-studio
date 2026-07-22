from typing import List
from pydantic import BaseModel
from app.schemas.lead import LeadResponse


class DashboardStatsResponse(BaseModel):
    total_categories: int
    total_photos: int
    total_leads: int
    unread_leads: int
    recent_leads: List[LeadResponse]
