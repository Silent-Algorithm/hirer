from sqlalchemy import Column, String, Text, Boolean, Float, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
import uuid

from database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)

    name = Column(String, nullable=False)
    email = Column(String, unique=True)
    password_hash = Column(Text, nullable=False)

    bio = Column(Text)
    profile_image = Column(Text)

    latitude = Column(Float)
    longitude = Column(Float)

    skills = Column(Text)
    availability = Column(String)

    whatsapp_link = Column(Text)
    is_verified = Column(Boolean, default=False)

    posts = relationship("Post", back_populates="user")


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, unique=True)


class Post(Base):
    __tablename__ = "posts"

    id = Column(String, primary_key=True, default=generate_uuid)

    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String)  # social | service

    content = Column(Text)
    image_url = Column(Text)

    user = relationship("User", back_populates="posts")
    service = relationship("ServiceDetails", uselist=False, back_populates="post")


class ServiceDetails(Base):
    __tablename__ = "service_details"

    id = Column(String, primary_key=True, default=generate_uuid)

    post_id = Column(String, ForeignKey("posts.id"), unique=True)
    category_id = Column(String, ForeignKey("categories.id"))

    price_min = Column(Integer)
    price_max = Column(Integer)
    availability = Column(String)

    post = relationship("Post", back_populates="service")
    category = relationship("Category")


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(String, primary_key=True, default=generate_uuid)

    user_id = Column(String, ForeignKey("users.id"))
    favorite_user_id = Column(String, ForeignKey("users.id"))

    __table_args__ = (
        UniqueConstraint("user_id", "favorite_user_id", name="unique_favorite"),
    )


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(String, primary_key=True, default=generate_uuid)

    reviewer_id = Column(String, ForeignKey("users.id"))
    reviewed_user_id = Column(String, ForeignKey("users.id"))

    rating = Column(Integer)
    comment = Column(Text)

    __table_args__ = (
        UniqueConstraint("reviewer_id", "reviewed_user_id", name="unique_rating"),
    )