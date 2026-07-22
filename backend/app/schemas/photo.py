from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class PhotoBase(BaseModel):
    category_id: int
    image_url: str
    display_order: int = 0
    is_cover: bool = False
    is_published: bool = True


class PhotoCreate(PhotoBase):
    pass


class PhotoUpdate(BaseModel):
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None
    is_cover: Optional[bool] = None
    is_published: Optional[bool] = None


class PhotoReorderItem(BaseModel):
    id: int
    display_order: int


class PhotoReorderRequest(BaseModel):
    items: List[PhotoReorderItem]


class PhotoResponse(PhotoBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
