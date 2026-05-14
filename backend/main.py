import os
import uuid
import math
import json
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.orm import joinedload

import models
import schemas
from database import engine, get_db, Base
from auth import get_current_user
from utils import hash_password, verify_password, create_access_token

os.makedirs("uploads", exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="uploads"), name="static")

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Backend Running"}


# -------------------------
# AUTH UPLOAD -> CREATE POST
# -------------------------
@app.post("/upload", response_model=schemas.PostResponse)
async def upload_file(
    file: UploadFile = File(...),
    content: str = Form(""),
    service_details: str = Form(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join("uploads", filename)

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())

    image_url = f"/static/{filename}"

    service_details = json.loads(service_details)

    new_post = models.Post(
        user_id=current_user.id,
        type="service",
        content=content,
        image_url=image_url
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    category = db.query(models.Category).filter(
        models.Category.name == service_details["category_name"]
    ).first()

    if not category:
        category = models.Category(name=service_details["category_name"])
        db.add(category)
        db.commit()
        db.refresh(category)

    service = models.ServiceDetails(
        post_id=new_post.id,
        category_id=category.id,
        price=service_details.get("price"),
        availability=service_details.get("availability")
    )

    db.add(service)
    db.commit()
    db.refresh(new_post)

    return new_post


# -------------------------
# GET POSTS (FULL DATA)
# -------------------------
@app.get("/posts", response_model=List[schemas.PostResponse])
def get_posts(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    posts = db.query(models.Post).options(
        joinedload(models.Post.user),
        joinedload(models.Post.service).joinedload(models.ServiceDetails.category)
    ).all()

    if lat is not None and lon is not None:
        def dist(post):
            if not post.user or post.user.latitude is None or post.user.longitude is None:
                return float("inf")
            return math.hypot(post.user.latitude - lat, post.user.longitude - lon)

        posts.sort(key=dist)

    return posts[skip:skip + limit]


# -------------------------
# CREATE POST (SERVICE ONLY)
# -------------------------
@app.post("/posts", response_model=schemas.PostResponse)
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_post = models.Post(
        user_id=current_user.id,
        type="service",
        content=post.content,
        image_url=post.image_url
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    category = db.query(models.Category).filter(
        models.Category.name == post.service_details.category_name
    ).first()

    if not category:
        category = models.Category(name=post.service_details.category_name)
        db.add(category)
        db.commit()
        db.refresh(category)

    service = models.ServiceDetails(
        post_id=new_post.id,
        category_id=category.id,
        price=post.service_details.price,
        availability=post.service_details.availability
    )

    db.add(service)
    db.commit()
    db.refresh(new_post)

    return new_post


# -------------------------
# AUTH
# -------------------------
@app.post("/auth/register", response_model=schemas.TokenResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(new_user.id)

    return {"access_token": token}


@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(db_user.id)

    return {"access_token": token}