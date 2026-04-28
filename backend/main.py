from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from database import engine, Base, get_db
import models
import schemas

from auth import get_current_user
from utils import hash_password, verify_password, create_access_token, calculate_distance

from typing import List

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Backend Running"}


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

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(db_user.id)

    return {"access_token": token}


@app.post("/posts")
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    if post.type not in ["social", "service"]:
        raise HTTPException(status_code=400, detail="Invalid post type")

    # -------------------------
    # 1. CREATE BASE POST
    # -------------------------
    new_post = models.Post(
        user_id=current_user.id,
        type=post.type,
        content=post.content,
        image_url=post.image_url
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # -------------------------
    # 2. IF SERVICE POST
    # -------------------------
    if post.type == "service":

        if not post.category_id:
            raise HTTPException(status_code=400, detail="Category required for service posts")

        service = models.ServiceDetails(
            post_id=new_post.id,
            category_id=post.category_id,
            price_min=post.price_min,
            price_max=post.price_max,
            availability=post.availability
        )

        db.add(service)

        # -------------------------
        # 3. LOCATION TOGGLE LOGIC
        # -------------------------
        if post.use_current_location:
            # keep current GPS (frontend already updates user before posting)
            pass
        else:
            # fallback: do nothing or later you can override logic
            pass

        db.commit()

    return {
        "message": "Post created successfully",
        "post_id": new_post.id,
        "type": post.type
    }


@app.get("/feed", response_model=List[schemas.PostOut])
def get_feed(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user), limit: int = 20):

    posts = (
        db.query(models.Post)
        .options(joinedload(models.Post.user))
        .order_by(models.Post.id.desc())
        .limit(100)
        .all()
    )

    feed = []

    for post in posts:

        distance = calculate_distance(
            current_user.latitude,
            current_user.longitude,
            post.user.latitude,
            post.user.longitude
        )

        if distance is None or not isinstance(distance, (int, float)):
            distance = None

        feed.append({
            "id": post.id,
            "type": post.type,
            "content": post.content,
            "image_url": post.image_url,
            "user": {
                "id": post.user.id,
                "name": post.user.name,
                "profile_image": post.user.profile_image
            },
            "distance_km": round(distance, 2) if distance is not None else None
        })

    feed.sort(key=lambda x: x["distance_km"] if x["distance_km"] is not None else 999999)

    return feed[:limit]