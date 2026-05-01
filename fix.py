import sys

def fix_main_py():
    path = "d:\\Hirer\\hirer\\backend\\main.py"
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    # Find the index of Base.metadata.create_all(bind=engine)
    idx = -1
    for i, line in enumerate(lines):
        if "Base.metadata.create_all(bind=engine)" in line:
            idx = i
            # let's find the last one (there should only be one after fix)
            # from our view_file, line 45 has the real one before @app.post("/posts")
            if i > 25: 
                break
                
    if idx == -1:
        print("Could not find anchor line.")
        return

    clean_header = """import os
import uuid
import math
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import or_
from sqlalchemy.orm import Session

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

Base.metadata.create_all(bind=engine)
"""
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(clean_header)
        for line in lines[idx+1:]:
            f.write(line)
            
    print("Fixed main.py.")

if __name__ == "__main__":
    fix_main_py()
