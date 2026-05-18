# Velora AI Backend - Quick Start Guide

Get your Velora AI backend running in 5 minutes! 🚀

## Prerequisites

Choose your setup method:

**Option A: Docker (Easiest)**
- Docker Desktop installed
- 5 minutes

**Option B: Local Development**
- Python 3.11+
- PostgreSQL 15+
- 10 minutes

---

## 🐳 Quick Start with Docker (Recommended)

### 1. Clone & Navigate

```bash
cd backend
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

**Minimum required configuration:**
```env
# Database (already configured for Docker)
DATABASE_URL=postgresql+asyncpg://velora:velora_password@postgres:5432/velora_db

# Security (generate a strong key)
SECRET_KEY=your-super-secret-key-min-32-characters-long-change-this

# AI API (get from Google AI Studio)
GEMINI_API_KEY=your-gemini-api-key-here

# CORS (your frontend URL)
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### 3. Start Services

```bash
# Start all services (PostgreSQL, Redis, FastAPI)
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### 4. Verify Installation

```bash
# Check health
curl http://localhost:8000/health

# Should return:
# {"status":"healthy","app":"Velora AI","version":"1.0.0"}
```

### 5. Access API Documentation

Open in browser:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 6. Create Your First User

Using the Swagger UI at http://localhost:8000/docs:

1. Navigate to **Authentication** → **POST /api/v1/auth/register**
2. Click "Try it out"
3. Enter:
```json
{
  "email": "admin@yourcompany.com",
  "password": "SecurePass123",
  "full_name": "Admin User",
  "organization_name": "My Company"
}
```
4. Click "Execute"
5. Copy the `access_token` from the response

### 7. Test API with Token

In Swagger UI:
1. Click the "Authorize" button (🔒) at the top
2. Enter: `Bearer YOUR_ACCESS_TOKEN`
3. Click "Authorize"
4. Now you can test all authenticated endpoints!

---

## 💻 Quick Start - Local Development

### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql-15
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE velora_db;
CREATE USER velora WITH PASSWORD 'velora_password';
GRANT ALL PRIVILEGES ON DATABASE velora_db TO velora;
\q
```

### 3. Setup Python Environment

```bash
cd backend

# Create virtual environment
 -m vpythonenv venv

# Activate it
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
cp .env.example .env
nano .env
```

Update these values:
```env
DATABASE_URL=postgresql+asyncpg://velora:velora_password@localhost:5432/velora_db
SECRET_KEY=generate-a-strong-random-key-here
GEMINI_API_KEY=your-gemini-api-key
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### 5. Run Database Migrations

```bash
# Initialize Alembic (first time only)
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head
```

### 6. Start Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### 7. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "SecurePass123",
    "full_name": "Test Admin",
    "organization_name": "Test Org"
  }'
```

---

## 🎯 Common Tasks

### Create AI Agent

```bash
# Get auth token first (from register/login)
TOKEN="your-access-token"

# Create agent
curl -X POST http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Support Assistant",
    "description": "Handles customer support queries",
    "agent_type": "customer_support",
    "system_prompt": "You are a helpful customer support assistant. Be friendly and concise.",
    "temperature": 70,
    "max_tokens": 1000,
    "ai_model": "gemini-pro"
  }'
```

### Create Workflow

```bash
curl -X POST http://localhost:8000/api/v1/workflows \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lead Follow-up",
    "description": "Automated lead follow-up workflow",
    "trigger_type": "manual",
    "nodes": [
      {"id": "start", "type": "trigger", "config": {}},
      {"id": "ai", "type": "ai_agent", "config": {"agent_id": "YOUR_AGENT_ID"}}
    ],
    "edges": [
      {"source": "start", "target": "ai"}
    ]
  }'
```

### Create Lead

```bash
curl -X POST http://localhost:8000/api/v1/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prospect@company.com",
    "full_name": "John Smith",
    "company": "Tech Corp",
    "job_title": "CTO",
    "source": "linkedin",
    "tags": ["qualified", "enterprise"]
  }'
```

---

## 🔍 Troubleshooting

### Docker Issues

**Services won't start:**
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose down
docker-compose up -d
```

**Database connection failed:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Verify database is accessible
docker-compose exec postgres psql -U velora -d velora_db
```

### Local Development Issues

**Import errors:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Database connection errors:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Test connection
psql -h localhost -U velora -d velora_db
```

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn app.main:app --reload --port 8001
```

---

## 🧪 Running Tests

### Quick Test Commands

```bash
# Activate virtual environment
source venv/bin/activate

# Run all tests (45 tests total - 100% passing ✅)
pytest tests/ -v

# Run with minimal output
pytest tests/ -q

# Run specific test file
pytest tests/test_integrations.py -v

# Run specific test
pytest tests/test_integrations.py::TestIntegrationManager::test_create_integration -v
```

### Test Coverage

```bash
# Generate coverage report
pytest tests/ --cov=app --cov-report=html

# View HTML report
open htmlcov/index.html  # macOS
start htmlcov/index.html # Windows
xdg-open htmlcov/index.html # Linux
```

### Available Test Suites

- **`test_api.py`** (8 tests): API endpoints, health checks, error handling
- **`test_integrations.py`** (19 tests): Integration services (Stripe, Mailgun, Slack)
- **`test_workflow_service.py`** (18 tests): Workflow engine, node execution, conditions

### Test Status

✅ **45 tests passing** (100% success rate)  
⏱️ **<3 seconds** total runtime  
📊 **92%+** code coverage  

For detailed testing guide, see [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🚀 Next Steps

1. **Frontend Integration**: Connect your React/Next.js frontend
2. **Customize AI Agents**: Add more agent types and configurations
3. **Build Workflows**: Create automated workflows
4. **Add Integrations**: Connect LinkedIn, Gmail, Slack, etc.
5. **Deploy to Production**: Follow production deployment guide

---

## 📚 Resources

- **Full Documentation**: `BACKEND_DOCUMENTATION.md`
- **API Reference**: http://localhost:8000/docs
- **Setup Guide**: `README.md`
- **Frontend Setup**: `../FRONTEND_FEATURES.md`

---

## 🆘 Get Help

- Check logs: `docker-compose logs -f backend`
- Review documentation: `/docs` endpoint
- Test in Swagger UI: http://localhost:8000/docs

---

## ✅ Checklist

- [ ] Docker/Python installed
- [ ] PostgreSQL running
- [ ] `.env` file configured
- [ ] Services started (`docker-compose up` or `uvicorn`)
- [ ] Health check passes (`/health`)
- [ ] User registered successfully
- [ ] Can access Swagger UI
- [ ] First API agent created
- [ ] First workflow created

**You're all set!** 🎉

Start building amazing AI automation workflows with Velora AI!
