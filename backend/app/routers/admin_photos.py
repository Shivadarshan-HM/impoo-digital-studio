from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_admin
from app.core.cloudinary_config import delete_cloudinary_image
from app.models.admin import Admin
from app.models.category import Category
from app.models.photo import Photo

from app.schemas.photo import (
    PhotoCreate,
    PhotoReorderRequest,
    PhotoResponse,
)

router = APIRouter(prefix="/admin/photos", tags=["Admin Photos"])


@router.get(
    "",
    response_model=List[PhotoResponse],
    summary="List Category Photos",
)
def list_photos(
    category_id: Optional[int] = Query(None, description="Filter photos by Category ID"),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    query = db.query(Photo)
    if category_id is not None:
        query = query.filter(Photo.category_id == category_id)
    
    photos = query.order_by(Photo.display_order.asc(), Photo.created_at.desc()).all()
    return photos


@router.post(
    "",
    response_model=PhotoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Photo Record",
)
def create_photo(
    payload: PhotoCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    category = db.query(Category).filter(Category.id == payload.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {payload.category_id} not found",
        )

    # If this is marked as cover photo, unset any existing cover photos for this category
    if payload.is_cover:
        db.query(Photo).filter(
            Photo.category_id == payload.category_id, Photo.is_cover.is_(True)
        ).update({"is_cover": False})

    photo = Photo(
        category_id=payload.category_id,
        image_url=payload.image_url,
        display_order=payload.display_order,
        is_cover=payload.is_cover,
        is_published=payload.is_published,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)

    # Update category cover_image_url if set as cover or if category cover_image_url is empty
    if payload.is_cover or not category.cover_image_url:
        category.cover_image_url = payload.image_url
        db.commit()

    return photo


@router.delete(
    "/{photo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Photo (Auto-promotes new cover if needed)",
)
def delete_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Photo with id {photo_id} not found",
        )

    category_id = photo.category_id
    was_cover = photo.is_cover

    if photo.image_url:
        delete_cloudinary_image(photo.image_url)

    db.delete(photo)
    db.commit()


    # If deleted photo was cover, auto-promote another remaining photo in the category
    if was_cover:
        next_cover = (
            db.query(Photo)
            .filter(Photo.category_id == category_id)
            .order_by(Photo.display_order.asc(), Photo.created_at.desc())
            .first()
        )

        category = db.query(Category).filter(Category.id == category_id).first()
        if next_cover:
            next_cover.is_cover = True
            if category:
                category.cover_image_url = next_cover.image_url
        else:
            if category:
                category.cover_image_url = None
        db.commit()

    return None


@router.patch(
    "/{photo_id}/set-cover",
    response_model=PhotoResponse,
    summary="Set Photo as Category Cover Image",
)
def set_cover_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Photo with id {photo_id} not found",
        )

    category_id = photo.category_id

    # Reset all photos in category to is_cover=False
    db.query(Photo).filter(Photo.category_id == category_id).update({"is_cover": False})

    # Set this photo as cover
    photo.is_cover = True

    # Update parent category cover_image_url
    category = db.query(Category).filter(Category.id == category_id).first()
    if category:
        category.cover_image_url = photo.image_url

    db.commit()
    db.refresh(photo)
    return photo


@router.patch(
    "/reorder",
    status_code=status.HTTP_200_OK,
    summary="Bulk Reorder Photos",
)
def reorder_photos(
    payload: PhotoReorderRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    for item in payload.items:
        db.query(Photo).filter(Photo.id == item.id).update(
            {"display_order": item.display_order}
        )
    db.commit()
    return {"message": "Photo order updated successfully"}
