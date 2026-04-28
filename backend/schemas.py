from pydantic import BaseModel
from typing import Optional, List


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PostCreate(BaseModel):
    type: str  # social | service

    content: str

    # media
    image_url: Optional[str] = None
    video_url: Optional[str] = None

    # service fields (optional for social posts)
    category_id: Optional[str] = None
    price_min: Optional[int] = None
    price_max: Optional[int] = None
    availability: Optional[str] = None

    # frontend toggle (used only when service post)
    use_current_location: Optional[bool] = False


class UserOut(BaseModel):
    id: str
    name: str
    profile_image: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        orm_mode = True


class PostOut(BaseModel):
    id: str
    type: str
    content: str
    image_url: Optional[str]
    user: UserOut
    distance_km: float

    class Config:
        orm_mode = True