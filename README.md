# 🚀 Hirer Backend API

A lightweight, scalable backend powering a service marketplace where users can post services, discover workers, connect, and build trust through ratings and favorites.

Built with FastAPI, SQLAlchemy, and JWT authentication.

---

## 🌊 Overview

Hirer is a location-aware service platform that connects clients to skilled workers.

Think:
- “I need a plumber nearby”
- “Show me designers around me”
- “Save this worker for later”

All flowing through a fast, structured API.

---

## ⚙️ Tech Stack

- 🐍 Python (FastAPI)
- 🗄️ SQLite (dev database)
- 🧱 SQLAlchemy (ORM)
- 🔐 JWT (authentication)
- 🔑 Passlib + bcrypt (password hashing)
- 🌐 CORS-enabled REST API

---

## ✨ Core Features

### 👤 Authentication
- User registration
- Login with JWT token
- Secure password hashing
- Get current user profile

---

### 📝 Posts System
Users can:
- Create posts (general or service-based)
- Attach images
- Add service details (pricing, category, availability)
- Fetch posts with optional location sorting

---

### 🔍 User Discovery
- Search users by name or skills
- Optional geo-based sorting (distance-aware)
- Pagination support

---

### ⭐ Ratings System
- Rate other users (1–5 stars)
- Add comments
- Prevent self-rating
- One rating per user per worker

---

### ❤️ Favorites
- Save workers to favorites
- Remove from favorites
- Fetch saved workers list

---

### 📸 File Uploads
- Upload images
- Stored locally in `/uploads`
- Served via `/static`

---

## 🔐 Authentication Flow

1. User registers → password hashed
2. Login → JWT token generated
3. Token used in protected routes
4. Middleware validates user on each request

---

## 📦 API Endpoints

### Auth

```http
POST /auth/register
POST /auth/login
GET  /auth/me
```

``` Clone repo
git clone https://github.com/your-repo/hirer.git
cd backend
```

```Create virtual environment
python -m venv venv
venv\Scripts\activate
```
```Install dependencies
pip install -r requirements.txt
```

```Run server
uvicorn main:app --reload
```
POST /auth/login

GET  /auth/me

