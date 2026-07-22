from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str
    slug: Optional[str] = None
    cover_image_url: Optional[str] = None
    display_order: int = 0
    is_published: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    cover_image_url: Optional[str] = None
    display_order: Optional[int] = None
    is_published: Optional[bool] = None


class CategoryReorderItem(BaseModel):
    id: int
    display_order: int


class CategoryReorderRequest(BaseModel):
    items: List[CategoryReorderItem]


class CategoryResponse(CategoryBase):
    id: int
    slug: str
    photo_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublicCategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    cover_image_url: Optional[str] = None
    display_order: int
    photo_count: int = 0

    model_config = ConfigDict(from_attributes=True)

