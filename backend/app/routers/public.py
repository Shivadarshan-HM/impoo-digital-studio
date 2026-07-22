from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.category import Category
from app.models.photo import Photo
from app.models.lead import Lead, LeadStatusEnum
from app.schemas.category import PublicCategoryResponse
from app.schemas.photo import PhotoResponse
from app.schemas.lead import LeadCreate, LeadResponse

router = APIRouter(prefix="/public", tags=["Public Site API"])


@router.get(
    "/categories",
    response_model=List[PublicCategoryResponse],
    summary="List Published Portfolio Categories for Website",
)
def get_public_categories(db: Session = Depends(get_db)):
    categories = (
        db.query(Category)
        .filter(Category.is_published.is_(True))
        .order_by(Category.display_order.asc(), Category.created_at.desc())
        .all()
    )

    results = []
    for cat in categories:
        photo_count = (
            db.query(func.count(Photo.id))
            .filter(Photo.category_id == cat.id, Photo.is_published.is_(True))
            .scalar()
            or 0
        )
        res = PublicCategoryResponse.model_validate(cat)
        res.photo_count = photo_count
        results.append(res)

    return results


@router.get(
    "/categories/slug/{slug}",
    response_model=PublicCategoryResponse,
    summary="Get Published Portfolio Category Details by Slug",
)
def get_public_category_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    category = (
        db.query(Category)
        .filter(Category.slug == slug, Category.is_published.is_(True))
        .first()
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Published category with slug '{slug}' not found",
        )

    photo_count = (
        db.query(func.count(Photo.id))
        .filter(Photo.category_id == category.id, Photo.is_published.is_(True))
        .scalar()
        or 0
    )
    res = PublicCategoryResponse.model_validate(category)
    res.photo_count = photo_count
    return res


@router.get(
    "/categories/slug/{slug}/photos",
    response_model=List[PhotoResponse],
    summary="List Published Photos for a Category by Slug",
)
def get_public_category_photos_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    category = (
        db.query(Category)
        .filter(Category.slug == slug, Category.is_published.is_(True))
        .first()
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Published category with slug '{slug}' not found",
        )

    photos = (
        db.query(Photo)
        .filter(Photo.category_id == category.id, Photo.is_published.is_(True))
        .order_by(Photo.display_order.asc(), Photo.created_at.desc())
        .all()
    )
    return photos


@router.get(
    "/categories/{category_id}/photos",
    response_model=List[PhotoResponse],
    summary="List Published Photos for a Category by ID",
)
def get_public_category_photos(
    category_id: int,
    db: Session = Depends(get_db),
):
    category = (
        db.query(Category)
        .filter(Category.id == category_id, Category.is_published.is_(True))
        .first()
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Published category with id {category_id} not found",
        )

    photos = (
        db.query(Photo)
        .filter(Photo.category_id == category_id, Photo.is_published.is_(True))
        .order_by(Photo.display_order.asc(), Photo.created_at.desc())
        .all()
    )
    return photos


@router.post(
    "/leads",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Client Inquiry Lead from Contact Form",
)
def submit_public_lead(
    payload: LeadCreate,
    db: Session = Depends(get_db),
):
    # Lightweight Spam Honeypot Check:
    # If the hidden honeypot field 'hp_website' is filled, silently discard spam
    if payload.hp_website and payload.hp_website.strip():
        # Return dummy LeadResponse without persisting spam to database
        return LeadResponse(
            id=0,
            name=payload.name,
            phone=payload.phone,
            email=payload.email,
            event_type=payload.event_type,
            event_date=payload.event_date,
            message=payload.message,
            status=LeadStatusEnum.new,
            created_at=func.now(),
        )

    lead = Lead(
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        email=payload.email.lower().strip(),
        event_type=payload.event_type.strip(),
        event_date=payload.event_date,
        message=payload.message.strip(),
        status=LeadStatusEnum.new,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead
