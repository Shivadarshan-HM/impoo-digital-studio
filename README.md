# IMPO Digital Studio — Production Monorepo

Production-grade monorepo containing the public website, admin portal, and FastAPI backend API for **IMPO Digital Studio**.

```text
impo-digital-studio/
├── website/   # Public Next.js 15 Client Website (Port 3000)
├── admin/     # Admin Portal Next.js 15 Web Application (Port 3001)
└── backend/   # Production FastAPI REST API & Database Service (Port 8000)
```

---

## 🌐 Live Production URLs & Deployment Overview

| Service | Host | Live Production URL | Config Dashboard |
|---|---|---|---|
| **Backend API** | Render | `https://impoo-digital-studio.onrender.com` | Render Dashboard -> Environment |
| **Admin Portal** | Vercel | `https://impoo-digital-studio.vercel.app` | Vercel Dashboard -> Environment Variables |
| **Public Website** | Vercel | `https://impoo-digital-studio-c7n1-gilt.vercel.app` | Vercel Dashboard |

> ℹ️ **Render Cold Start Notice**: Render's free web service tier spins down after 15 minutes of inactivity. When a request is made after an idle period, the first request may take ~30–50 seconds to complete while the backend container boots up ("cold start"). This is expected free-tier hosting behavior, not a server bug.

---

## 🛠️ Monorepo Architecture

Each directory is self-contained with its own dependency configurations, environment setups, and scripts.

### 1. `website/` (Public Frontend)
- **Framework**: Next.js 15 (React 19, TypeScript, TailwindCSS v4)
- **Features**: Interactive portfolio showcase, smooth animations (Framer Motion, Lenis, GSAP, OGL), lead inquiry form, dynamic Cloudinary image rendering, and React Error Boundaries.
- **Port**: `3000`

### 2. `admin/` (Admin Portal)
- **Framework**: Next.js 15 (React 19, TypeScript, TailwindCSS v3)
- **Features**: Authentication guard, single-admin management, category reordering & slug generation, gallery management with direct Cloudinary uploads, lead inbox, and studio settings.
- **Port**: `3001`

### 3. `backend/` (REST API & DB Service)
- **Framework**: FastAPI (Python 3.10+, SQLAlchemy 2.0, Alembic, PostgreSQL)
- **Features**: JWT authentication, Cloudinary media management, CORS security, HTTP security headers middleware, in-memory rate limiting on auth & lead submission routes, N+1 query optimization, and strict production SECRET_KEY validation.
- **Port**: `8000`

---

## 🔑 Required Dashboard Environment Variables

### 1. Vercel Dashboard (Admin Portal Settings)
In your Vercel Dashboard for `admin`:
- **`NEXT_PUBLIC_API_URL`**: `https://impoo-digital-studio.onrender.com/api/v1`

### 2. Render Dashboard (Backend Web Service Settings)
In your Render Dashboard for `backend`:
- **`ENVIRONMENT`**: `production`
- **`SECRET_KEY`**: *(Strong 32+ byte random secret string, e.g. generated via `openssl rand -hex 32`)*
- **`DATABASE_URL`**: `postgresql://<user>:<password>@<host>/<dbname>?sslmode=require`
- **`DIRECT_URL`**: `postgresql://<user>:<password>@<host>/<dbname>?sslmode=require`
- **`ADMIN_SITE_URL`**: `https://impoo-digital-studio.vercel.app`
- **`PUBLIC_SITE_URL`**: `https://impoo-digital-studio-website.vercel.app` *(or placeholder until deployed)*
- **`ALLOWED_ORIGINS`**: `http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001,https://impoo-digital-studio.vercel.app`
- **`CLOUDINARY_CLOUD_NAME`**: *(Your Cloudinary cloud name)*
- **`CLOUDINARY_API_KEY`**: *(Your Cloudinary API key)*
- **`CLOUDINARY_API_SECRET`**: *(Your Cloudinary API secret)*

---

## 🚀 Local Development Setup

### 1. Backend Service (`backend/`)
```bash
cd backend
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Run database migrations & start dev server
python run_migration.py
uvicorn app.main:app --reload --port 8000
```
API Documentation: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)

---

### 2. Public Website (`website/`)
```bash
cd website
npm install
cp .env.example .env.local
npm run dev
```
Website live at: [http://localhost:3000](http://localhost:3000)

---

### 3. Admin Portal (`admin/`)
```bash
cd admin
npm install
cp .env.example .env.local
npm run dev
```
Admin portal live at: [http://localhost:3001](http://localhost:3001)

---

## 🛡️ Production Security & Hardening Features

1. **Dynamic CORS Support**: Permits local development (`localhost:3000`/`3001`) and live Vercel Admin URL (`https://impoo-digital-studio.vercel.app`) without code changes.
2. **SECRET_KEY Enforcement**: Refuses to start in `ENVIRONMENT=production` if `SECRET_KEY` is a default placeholder or shorter than 32 bytes.
3. **HTTP Security Headers**: Emits `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, and `Referrer-Policy: strict-origin-when-cross-origin`.
4. **Rate Limiting**: Integrated sliding-window rate limiting on `/api/v1/auth/login` (5 req/min) and `/api/v1/public/leads` (10 req/min).
5. **Optimized Queries**: Single-query SQL count aggregations eliminate N+1 query overhead in category listings.
6. **Client Resilience**: Global React Error Boundaries installed in `website/` and `admin/` layout hierarchies to prevent white-screen crashes.
