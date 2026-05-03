# Velora AI - Backend API

FastAPI-based backend for Velora AI Automation Framework with PostgreSQL, JWT authentication, and multi-tenant architecture.

## 🚀 Features

- ✅ FastAPI with async/await support
- ✅ PostgreSQL database with SQLAlchemy ORM
- ✅ JWT authentication & authorization
- ✅ Multi-tenant data isolation
- ✅ Role-based access control (Owner/Admin/Member)
- ✅ API rate limiting
- ✅ Comprehensive API endpoints for:
  - AI Agents CRUD
  - Workflows CRUD
  - Leads & CRM
  - Integrations
  - User management
  - Organization management
- ✅ Pydantic schemas for validation
- ✅ Docker & Docker Compose setup
- ✅ Production-ready configuration

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+ (optional, for caching)
- Docker & Docker Compose (optional)

## 🛠️ Installation

### Option 1: Docker (Recommended)

```bash
# Navigate to backend directory
cd backend

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

The API will be available at `http://localhost:8000`

### Option 2: Local Development

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env and configure your settings
nano .env

# Run database migrations (after setting up PostgreSQL)
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🔧 Configuration

### Environment Variables

Edit `.env` file with your configuration:

```env
# Database
DATABASE_URL=postgresql+asyncpg://velora:velora_password@localhost:5432/velora_db

# Security
SECRET_KEY=your-secret-key-min-32-characters-long

# AI APIs
GEMINI_API_KEY=your-gemini-api-key-here

# CORS Origins
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

## 📚 API Documentation

### Interactive Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token

#### AI Agents
- `GET /api/v1/agents` - List all agents
- `GET /api/v1/agents/{id}` - Get agent by ID
- `POST /api/v1/agents` - Create agent
- `PUT /api/v1/agents/{id}` - Update agent
- `DELETE /api/v1/agents/{id}` - Delete agent
- `POST /api/v1/agents/{id}/execute` - Execute agent

#### Workflows
- `GET /api/v1/workflows` - List all workflows
- `GET /api/v1/workflows/{id}` - Get workflow by ID
- `POST /api/v1/workflows` - Create workflow
- `PUT /api/v1/workflows/{id}` - Update workflow
- `DELETE /api/v1/workflows/{id}` - Delete workflow
- `POST /api/v1/workflows/{id}/execute` - Execute workflow

#### Leads
- `GET /api/v1/leads` - List all leads
- `GET /api/v1/leads/{id}` - Get lead by ID
- `POST /api/v1/leads` - Create lead
- `PUT /api/v1/leads/{id}` - Update lead
- `DELETE /api/v1/leads/{id}` - Delete lead
- `POST /api/v1/leads/bulk` - Bulk create leads

#### Integrations
- `GET /api/v1/integrations` - List all integrations
- `GET /api/v1/integrations/{id}` - Get integration by ID
- `POST /api/v1/integrations` - Create integration
- `PUT /api/v1/integrations/{id}` - Update integration
- `DELETE /api/v1/integrations/{id}` - Delete integration
- `POST /api/v1/integrations/{id}/connect` - Connect integration
- `POST /api/v1/integrations/{id}/disconnect` - Disconnect integration

#### Users & Organizations
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/organization/members` - List team members
- `GET /api/v1/organizations/me` - Get current organization
- `PUT /api/v1/organizations/me` - Update organization (Owner only)
- `GET /api/v1/organizations/usage` - Get usage statistics

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Register & Login

```bash
# Register new user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "full_name": "John Doe",
    "organization_name": "My Company"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePass123"
```

### Using the Access Token

```bash
# Example: Get current user
curl -X GET http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🏗️ Database Schema

### Main Tables

- `organizations` - Multi-tenant organizations
- `users` - User accounts with role-based access
- `ai_agents` - AI agent configurations
- `workflows` - Workflow definitions
- `leads` - Lead/CRM data
- `integrations` - Third-party integrations
- `api_keys` - API key management
- `usage_logs` - Usage tracking
- `activity_logs` - Activity history

### Multi-Tenant Architecture

All data is isolated by `organization_id` to ensure complete data separation between tenants.

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# View coverage report
open htmlcov/index.html
```

## 🚦 Rate Limiting

Default rate limits:
- 60 requests per minute per IP
- 1000 requests per hour per IP

Configure in `.env`:
```env
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
```

## 📦 Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Connect to PostgreSQL manually
docker-compose exec postgres psql -U velora -d velora_db
```

### Backend Issues

```bash
# View backend logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Rebuild backend
docker-compose up -d --build backend
```

## 📝 Development Guidelines

### Code Style

- Follow PEP 8 guidelines
- Use type hints
- Write docstrings for all functions
- Keep functions small and focused

### Security Best Practices

- Never commit `.env` files
- Always use environment variables for secrets
- Implement proper input validation
- Use parameterized SQL queries (SQLAlchemy handles this)
- Hash all passwords (using bcrypt)

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure database backups
- [ ] Set up monitoring (Sentry)
- [ ] Configure rate limiting
- [ ] Review security settings

### Environment Variables for Production

```env
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<generate-strong-key>
DATABASE_URL=<production-database-url>
SENTRY_DSN=<your-sentry-dsn>
```

## 📄 License

Copyright © 2026 Velora AI. All rights reserved.

## 🤝 Support

For issues and questions:
- Create an issue in the repository
- Contact: support@veloraai.com
