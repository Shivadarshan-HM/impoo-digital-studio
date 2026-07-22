import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.security import get_current_admin
from app.core.cloudinary_config import delete_cloudinary_image
from app.models.admin import Admin
from app.models.category import Category
from app.models.photo import Photo
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryReorderRequest,
    CategoryResponse,
)

router = APIRouter(prefix="/admin/categories", tags=["Admin Categories"])


def slugify(text: str) -> str:
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def generate_unique_slug(db: Session, name: str, current_id: int | None = None) -> str:
    base_slug = slugify(name) or "category"
    slug = base_slug
    counter = 1
    while True:
        query = db.query(Category).filter(Category.slug == slug)
        if current_id is not None:
            query = query.filter(Category.id != current_id)
        if not query.first():
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1


@router.get(
    "",
    response_model=List[CategoryResponse],
    summary="List All Portfolio Categories",
)
def list_categories(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    categories = (
        db.query(Category)
        .order_by(Category.display_order.asc(), Category.created_at.desc())
        .all()
    )

    results = []
    for cat in categories:
        photo_count = (
            db.query(func.count(Photo.id))
            .filter(Photo.category_id == cat.id)
            .scalar()
            or 0
        )
        res = CategoryResponse.model_validate(cat)
        res.photo_count = photo_count
        results.append(res)

    return results


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Category",
)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    slug = payload.slug.strip() if payload.slug and payload.slug.strip() else generate_unique_slug(db, payload.name)

    category = Category(
        name=payload.name,
        slug=slug,
        cover_image_url=payload.cover_image_url,
        display_order=payload.display_order,
        is_published=payload.is_published,
    )
    db.add(category)
    db.commit()
    db.refresh(category)

    res = CategoryResponse.model_validate(category)
    res.photo_count = 0
    return res


@router.put(
    "/{category_id}",
    response_model=CategoryResponse,
    summary="Update Category Details",
)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "slug" in update_data and update_data["slug"]:
        update_data["slug"] = generate_unique_slug(db, update_data["slug"], current_id=category_id)
    elif "name" in update_data and update_data["name"] and update_data["name"] != category.name:
        update_data["slug"] = generate_unique_slug(db, update_data["name"], current_id=category_id)

    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)

    photo_count = (
        db.query(func.count(Photo.id))
        .filter(Photo.category_id == category.id)
        .scalar()
        or 0
    )
    res = CategoryResponse.model_validate(category)
    res.photo_count = photo_count
    return res


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Category (Cascades to Photos)",
)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found",
        )

    # Best-effort Cloudinary deletion of cover image and child photo images
    if category.cover_image_url:
        delete_cloudinary_image(category.cover_image_url)

    photos = db.query(Photo).filter(Photo.category_id == category_id).all()
    for photo in photos:
        if photo.image_url:
            delete_cloudinary_image(photo.image_url)

    db.delete(category)
    db.commit()
    return None


@router.patch(
    "/reorder",
    status_code=status.HTTP_200_OK,
    summary="Bulk Reorder Categories",
)
def reorder_categories(
    payload: CategoryReorderRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    for item in payload.items:
        db.query(Category).filter(Category.id == item.id).update(
            {"display_order": item.display_order}
        )
    db.commit()
    return {"message": "Category order updated successfully"}
