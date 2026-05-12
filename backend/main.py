from fastapi import FastAPI
from database import engine, Base
from auth import get_current_user
import schemas
import models
import schemas

from auth import get_current_user
from database import get_db, engine, Base

import models

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Backend Running"}

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

import models, schemas
from database import engine, get_db, Base
from utils import hash_password, verify_password, create_access_token

app = FastAPI()

Base.metadata.create_all(bind=engine)
@app.post("/posts")
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_post = models.Post(
        user_id=current_user.id,
        type=post.type,
        content=post.content
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return {"message": "Post created"}



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

    return {
        "access_token": token
    }

@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(db_user.id)

    return {
        "access_token": token
    }
