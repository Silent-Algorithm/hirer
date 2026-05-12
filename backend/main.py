import os
import uuid
import math
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from auth import get_current_user
from utils import hash_password, verify_password, create_access_token
import models
import schemas

os.makedirs("uploads", exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.mount("/static", StaticFiles(directory="uploads"), name="static")


@app.get("/")
def root():
    return {"message": "Backend Running"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join("uploads", filename)
    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())
    return {"image_url": f"/static/{filename}"}


@app.post("/posts", response_model=schemas.PostResponse)
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # FIX: was missing
):
    new_post = models.Post(
        user_id=current_user.id,
        type=post.type,
        content=post.content,
        image_url=post.image_url  # FIX: restored removed field
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    if post.type == "service" and post.service_details:
        cat_name = post.service_details.category_name
        category = db.query(models.Category).filter(models.Category.name == cat_name).first()
        if not category:
            category = models.Category(name=cat_name)
            db.add(category)
            db.commit()
            db.refresh(category)

        service_details = models.ServiceDetails(
            post_id=new_post.id,
            category_id=category.id,
            price_min=post.service_details.price_min,
            price_max=post.service_details.price_max,
            availability=post.service_details.availability
        )
        db.add(service_details)
        db.commit()
        db.refresh(new_post)

    return new_post  # FIX: was returning {"message": "Post created"} instead of the post


@app.get("/posts", response_model=List[schemas.PostResponse])
def get_posts(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    posts = db.query(models.Post).all()

    if lat is not None and lon is not None:
        def get_distance(post):
            post_lat = post.user.latitude
            post_lon = post.user.longitude
            if post_lat is None or post_lon is None:
                return float('inf')
            return math.hypot(post_lat - lat, post_lon - lon)
        posts.sort(key=get_distance)

    return posts[skip: skip + limit]


@app.post("/register", response_model=schemas.UserPrivate)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = models.User(
        id=str(uuid.uuid4()),
        email=user.email,
        name=user.name,
        password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": db_user.id})
    return {"access_token": token}


@app.get("/users/search", response_model=List[schemas.UserPublic])
def search_users(
    q: Optional[str] = None,
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(models.User)

    if q:
        search_term = f"%{q}%"
        query = query.filter(
            or_(
                models.User.name.ilike(search_term),
                models.User.skills.ilike(search_term)
            )
        )

    users = query.all()

    if lat is not None and lon is not None:
        def get_distance(user):
            if user.latitude is None or user.longitude is None:
                return float('inf')
            return math.hypot(user.latitude - lat, user.longitude - lon)
        users.sort(key=get_distance)

    return users[skip: skip + limit]


@app.get("/auth/me", response_model=schemas.UserPrivate)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.put("/users/profile", response_model=schemas.UserPrivate)
def update_profile(
    profile_data: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    update_data = profile_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@app.get("/users/{user_id}", response_model=schemas.UserPublic)
def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/users/verify")
def verify_user(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    current_user.is_verified = True
    db.add(current_user)
    db.commit()
    return {"message": "Verification approved. You now have a verified badge."}


@app.post("/favorites/{worker_id}")
def add_favorite(
    worker_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    worker = db.query(models.User).filter(models.User.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    existing = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id,
        models.Favorite.favorite_user_id == worker_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Worker already in favorites")

    fav = models.Favorite(user_id=current_user.id, favorite_user_id=worker_id)
    db.add(fav)
    db.commit()
    return {"message": "Added to favorites"}


@app.get("/favorites", response_model=List[schemas.FavoriteResponse])
def get_favorites(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Favorite).filter(models.Favorite.user_id == current_user.id).all()


@app.delete("/favorites/{worker_id}")
def remove_favorite(
    worker_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    existing = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id,
        models.Favorite.favorite_user_id == worker_id
    ).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(existing)
    db.commit()
    return {"message": "Removed from favorites"}


@app.post("/users/{user_id}/ratings", response_model=schemas.RatingResponse)
def add_rating(
    user_id: str,
    rating_in: schemas.RatingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot rate yourself")

    worker = db.query(models.User).filter(models.User.id == user_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    existing = db.query(models.Rating).filter(
        models.Rating.reviewer_id == current_user.id,
        models.Rating.reviewed_user_id == user_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already rated this worker")

    new_rating = models.Rating(
        reviewer_id=current_user.id,
        reviewed_user_id=user_id,
        rating=rating_in.rating,
        comment=rating_in.comment
    )
    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)
    return new_rating


@app.get("/users/{user_id}/ratings", response_model=List[schemas.RatingResponse])
def get_ratings(user_id: str, db: Session = Depends(get_db)):
    worker = db.query(models.User).filter(models.User.id == user_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    return db.query(models.Rating).filter(models.Rating.reviewed_user_id == user_id).all()