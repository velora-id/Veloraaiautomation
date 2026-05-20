# 🐳 Complete Docker Setup Guide - Velora AI

Install Velora AI Backend & Database locally using Docker Compose.

---

## 📋 Prerequisites

**Before starting, ensure you have:**

1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop)
   - Windows: Docker Desktop for Windows
   - Mac: Docker Desktop for Mac
   - Linux: Docker Engine + Docker Compose

2. **Git** - [Download here](https://git-scm.com)

3. **System Requirements:**
   - 4GB RAM minimum (8GB recommended)
   - 2GB free disk space
   - Port 5432 (PostgreSQL), 6379 (Redis), 8000 (Backend) available

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Clone Repository

```bash
cd your-projects-folder
git clone https://github.com/velora-id/Veloraaiautomation.git
cd Veloraaiautomation
```

### Step 2: Configure Environment

```bash
cd backend

# Copy environment template
cp .env.example .env
```

**Edit `.env` file** with your settings:
```env
# Database Configuration (Docker)
DATABASE_URL=postgresql+asyncpg://velora:velora_password@postgres:5432/velora_db
REDIS_URL=redis://redis:6379/0

# Security (Generate a 32+ character secret key)
SECRET_KEY=your-super-secret-key-change-this-to-something-random-min-32-chars

# Google Gemini AI (Optional but recommended)
GEMINI_API_KEY=your-gemini-api-key-here

# CORS Origins (for frontend)
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# Environment
ENVIRONMENT=development
DEBUG=True
```

### Step 3: Build & Start Docker Containers

```bash
# Build and start all services in background
docker-compose up -d

# Watch logs (Ctrl+C to stop watching)
docker-compose logs -f backend
```

**Services started:**
- 🗄️ PostgreSQL 15 (port 5432)
- 📦 Redis 7 (port 6379)
- 🚀 FastAPI Backend (port 8000)

### Step 4: Verify Everything Works

```bash
# Check container status
docker-compose ps

# Test health endpoint
curl http://localhost:8000/health

# Should see: {"status":"healthy","app":"Velora AI","version":"1.0.0"}
```

### Step 5: Access API

Open these URLs in your browser:

| URL | Purpose |
|-----|---------|
| http://localhost:8000/health | Health check |
| http://localhost:8000/docs | **Swagger UI** (interactive API) |
| http://localhost:8000/redoc | ReDoc (API documentation) |

---

## 👤 Create First User

### Via Swagger UI (Easiest)

1. Go to http://localhost:8000/docs
2. Find **Authentication** section
3. Click `POST /api/v1/auth/register`
4. Click "Try it out"
5. Enter:
```json
{
  "email": "admin@example.com",
  "password": "SecurePassword123",
  "full_name": "Admin User",
  "organization_name": "My Company"
}
```
6. Click "Execute"
7. Copy the `access_token` from response

### Via cURL

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123",
    "full_name": "Admin User",
    "organization_name": "My Company"
  }'
```

---

## 🧪 Test API with Authentication

### Using Swagger UI

1. Go to http://localhost:8000/docs
2. Click 🔒 **Authorize** button (top right)
3. Paste your access token in the value field
4. Click "Authorize" then "Close"
5. Now all endpoints are authorized!

### Using cURL

```bash
TOKEN="your-access-token-here"

curl http://localhost:8000/api/v1/organizations/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 Project Structure in Docker

```
backend/
├── docker-compose.yml    # Services configuration
├── Dockerfile            # Backend image definition
├── requirements.txt      # Python dependencies
├── .env.example          # Environment template
├── app/
│   ├── main.py          # FastAPI entry point
│   ├── api/             # API endpoints
│   ├── models/          # Database models
│   ├── services/        # Business logic
│   └── schemas/         # Pydantic schemas
└── uploads/             # User uploads (persistent)
```

---

## 🛠️ Common Docker Commands

```bash
# View container status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes database!)
docker-compose down -v

# Rebuild after code changes
docker-compose build
docker-compose up -d

# Enter backend container
docker-compose exec backend bash

# Run Python command in backend
docker-compose exec backend python -m pytest

# View database
docker-compose exec postgres psql -U velora -d velora_db
```

---

## 🔍 Troubleshooting

### Issue: Containers won't start

```bash
# Check for port conflicts
docker ps  # List running containers

# View detailed logs
docker-compose logs

# Try rebuilding
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Issue: Database connection error

```bash
# Check PostgreSQL health
docker-compose exec postgres pg_isready -U velora

# View database logs
docker-compose logs postgres

# Rebuild and restart
docker-compose restart postgres
```

### Issue: Backend crashes on startup

```bash
# Check logs
docker-compose logs backend

# Common causes:
# - Missing .env file
# - DATABASE_URL is wrong
# - Port 8000 already in use

# Kill process using port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or on Mac/Linux
lsof -i :8000
kill -9 <PID>
```

### Issue: "Port already in use"

Change ports in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # PostgreSQL: 5433 locally, 5432 in container
  - "6380:6379"  # Redis: 6380 locally, 6379 in container
  - "8001:8000"  # Backend: 8001 locally, 8000 in container
```

Then update `.env`:
```env
DATABASE_URL=postgresql+asyncpg://velora:velora_password@localhost:5433/velora_db
REDIS_URL=redis://localhost:6380/0
```

---

## 🧪 Run Tests in Docker

```bash
# Run all tests
docker-compose exec backend python -m pytest

# Run specific test file
docker-compose exec backend python -m pytest tests/test_integrations.py

# Run with coverage
docker-compose exec backend python -m pytest --cov=app tests/

# Run in verbose mode
docker-compose exec backend python -m pytest -v
```

---

## 📊 Database Management

### Access PostgreSQL

```bash
docker-compose exec postgres psql -U velora -d velora_db
```

**Common SQL commands:**
```sql
-- List tables
\dt

-- Describe table
\d users

-- See all data
SELECT * FROM users;

-- Count rows
SELECT COUNT(*) FROM organizations;

-- Exit
\q
```

### Reset Database

```bash
# Remove volumes (deletes all data!)
docker-compose down -v

# Restart
docker-compose up -d
```

---

## 🔐 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql+asyncpg://...` |
| `REDIS_URL` | Redis connection | `redis://redis:6379/0` |
| `SECRET_KEY` | JWT signing key | Min 32 characters |
| `GEMINI_API_KEY` | Google AI API key | Get from AI Studio |
| `BACKEND_CORS_ORIGINS` | Allowed frontend URLs | `["http://localhost:5173"]` |
| `ENVIRONMENT` | Run mode | `development` or `production` |
| `DEBUG` | Debug mode | `True` or `False` |

---

## 📖 Next Steps

1. **Read API Documentation**: http://localhost:8000/docs
2. **Create users and test endpoints**
3. **Check [Backend API Documentation](backend/API_DOCUMENTATION.md)**
4. **Review [Testing Guide](backend/TESTING_GUIDE.md)**
5. **Explore [Implementation Guide](IMPLEMENTATION_GUIDE.md)**

---

## 🆘 Need Help?

- **Backend Issues**: Check `docker-compose logs backend`
- **Database Issues**: Check `docker-compose logs postgres`
- **API Questions**: Visit http://localhost:8000/docs
- **Code Issues**: See [Backend Documentation](backend/BACKEND_DOCUMENTATION.md)

---

**Happy coding! 🚀**
