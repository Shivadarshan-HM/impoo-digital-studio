from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.admin import Admin
from app.models.lead import Lead, LeadStatusEnum
from app.schemas.lead import (
    LeadStatusUpdate,
    LeadResponse,
    LeadListResponse,
)

router = APIRouter(prefix="/admin/leads", tags=["Admin Leads"])


@router.get(
    "",
    response_model=LeadListResponse,
    summary="List & Filter Client Leads (Paginated)",
)
def list_leads(
    search: Optional[str] = Query(None, description="Search by name, email, or phone"),
    status_filter: Optional[LeadStatusEnum] = Query(
        None, alias="status", description="Filter by status (new, contacted, closed)"
    ),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    query = db.query(Lead)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Lead.name.ilike(search_pattern),
                Lead.email.ilike(search_pattern),
                Lead.phone.ilike(search_pattern),
            )
        )

    if status_filter:
        query = query.filter(Lead.status == status_filter)

    total = query.count()
    offset = (page - 1) * limit
    leads = (
        query.order_by(Lead.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return LeadListResponse(
        total=total,
        page=page,
        limit=limit,
        items=[LeadResponse.model_validate(lead) for lead in leads],
    )


@router.get(
    "/{lead_id}",
    response_model=LeadResponse,
    summary="Get Single Lead Details",
)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with id {lead_id} not found",
        )
    return lead


@router.patch(
    "/{lead_id}/status",
    response_model=LeadResponse,
    summary="Update Lead Status",
)
def update_lead_status(
    lead_id: int,
    payload: LeadStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with id {lead_id} not found",
        )

    lead.status = payload.status
    db.commit()
    db.refresh(lead)
    return lead


@router.delete(
    "/{lead_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Lead Inquiry",
)
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with id {lead_id} not found",
        )

    db.delete(lead)
    db.commit()
    return None
