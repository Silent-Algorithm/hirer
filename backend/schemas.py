from pydantic import BaseModel
from typing import Optional


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


# -------------------------
# SERVICE ONLY
# -------------------------
class ServiceDetailsCreate(BaseModel):
    category_name: str
    price: Optional[int] = None
    availability: Optional[str] = None


class PostCreate(BaseModel):
    content: str
    image_url: Optional[str] = None
    service_details: ServiceDetailsCreate


class UserPublic(BaseModel):
    id: str
    name: str
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    skills: Optional[str] = None
    availability: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    whatsapp_link: Optional[str] = None
    is_verified: bool

    class Config:
        orm_mode = True


class UserPrivate(UserPublic):
    email: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    skills: Optional[str] = None
    availability: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    whatsapp_link: Optional[str] = None


class CategoryResponse(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True


class ServiceDetailsResponse(BaseModel):
    id: str
    category: CategoryResponse
    price: Optional[int] = None
    availability: Optional[str] = None

    class Config:
        from_attributes = True


class PostResponse(BaseModel):
    id: str
    type: str
    content: str
    image_url: Optional[str] = None
    user: UserPublic
    service: Optional[ServiceDetailsResponse] = None

    class Config:
        from_attributes = True


class FavoriteResponse(BaseModel):
    id: str
    favorite_user_id: str
    user_id: str

    class Config:
        from_attributes = True


class RatingCreate(BaseModel):
    rating: int
    comment: Optional[str] = None


class RatingResponse(BaseModel):
    id: str
    reviewer_id: str
    reviewed_user_id: str
    rating: int
    comment: Optional[str] = None

    class Config:
        orm_mode = True