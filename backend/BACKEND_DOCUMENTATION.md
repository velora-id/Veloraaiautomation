# Velora AI - Backend Documentation

## 📚 Overview

Comprehensive FastAPI backend for Velora AI Automation Framework with production-ready features including JWT authentication, multi-tenant architecture, role-based access control, and Gemini AI integration.

---

## 🏗️ Architecture

### Technology Stack

- **Framework**: FastAPI 0.109.0
- **Database**: PostgreSQL 15 with SQLAlchemy 2.0 (async)
- **Authentication**: JWT with python-jose
- **AI Engine**: Google Gemini API
- **Cache**: Redis 7
- **Container**: Docker & Docker Compose

### Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py                 # API dependencies (auth, rate limiting)
│   │   └── endpoints/              # API route handlers
│   │       ├── auth.py            # Authentication endpoints
│   │       ├── ai_agents.py       # AI Agents CRUD
│   │       ├── workflows.py       # Workflows CRUD
│   │       ├── leads.py           # Leads & CRM
│   │       ├── integrations.py    # Integrations management
│   │       ├── users.py           # User management
│   │       └── organizations.py   # Organization settings
│   ├── core/
│   │   ├── config.py              # Application configuration
│   │   ├── database.py            # Database setup
│   │   └── security.py            # JWT & password hashing
│   ├── middleware/
│   │   ├── tenant.py              # Multi-tenant isolation
│   │   └── rate_limit.py          # API rate limiting
│   ├── models/                     # SQLAlchemy models
│   │   ├── user.py
│   │   ├── organization.py
│   │   ├── ai_agent.py
│   │   ├── workflow.py
│   │   ├── lead.py
│   │   ├── integration.py
│   │   ├── api_key.py
│   │   ├── usage_log.py
│   │   └── activity_log.py
│   ├── schemas/                    # Pydantic schemas
│   │   ├── user.py
│   │   ├── organization.py
│   │   ├── ai_agent.py
│   │   ├── workflow.py
│   │   ├── lead.py
│   │   ├── integration.py
│   │   ├── token.py
│   │   └── api_response.py
│   ├── services/                   # Business logic services
│   │   ├── gemini_service.py      # Gemini AI integration
│   │   └── workflow_service.py    # Workflow execution engine
│   └── main.py                     # FastAPI application
├── alembic/                        # Database migrations
├── tests/                          # Test files
├── .env.example                    # Environment template
├── requirements.txt                # Python dependencies
├── Dockerfile                      # Docker image
├── docker-compose.yml              # Multi-container setup
└── README.md                       # Setup instructions
```

---

## 🔐 Security & Authentication

### JWT Authentication

```python
# Token Structure
{
  "sub": "user_id",
  "organization_id": "org_id",
  "type": "access",  # or "refresh"
  "exp": timestamp
}
```

### Role-Based Access Control (RBAC)

**Role Hierarchy:**
1. **Owner** (Level 3) - Full organization control
2. **Admin** (Level 2) - Manage resources and team
3. **Member** (Level 1) - Basic access

**Usage:**
```python
from app.api.deps import require_role
from app.models.user import UserRole

@router.put("/settings")
async def update_settings(
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    # Only owners can access this endpoint
    ...
```

### Multi-Tenant Data Isolation

Every database query automatically filters by `organization_id`:

```python
# Automatic tenant filtering
result = await db.execute(
    select(AIAgent).where(
        AIAgent.id == agent_id,
        AIAgent.organization_id == organization.id  # Multi-tenant filter
    )
)
```

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

---

## 📊 Database Schema

### Core Tables

#### organizations
```sql
- id (UUID, PK)
- name (VARCHAR)
- slug (VARCHAR, UNIQUE)
- billing_plan (ENUM: free, pro, enterprise)
- api_credits_used (INTEGER)
- api_credits_limit (INTEGER)
- max_ai_agents (INTEGER)
- max_workflows (INTEGER)
- max_team_members (INTEGER)
- stripe_customer_id (VARCHAR)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### users
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- hashed_password (VARCHAR)
- full_name (VARCHAR)
- organization_id (UUID, FK)
- role (ENUM: owner, admin, member)
- is_active, is_verified, is_superuser (BOOLEAN)
- avatar_url, phone, timezone, theme (VARCHAR)
- notification_email, notification_push (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### ai_agents
```sql
- id (UUID, PK)
- organization_id (UUID, FK)
- name, description (VARCHAR/TEXT)
- agent_type (ENUM)
- status (ENUM: active, inactive, training, error)
- system_prompt (TEXT)
- temperature (0-100), max_tokens (INTEGER)
- ai_model (VARCHAR)
- config, tools, knowledge_base, tags (JSON)
- total_executions, total_tokens_used, success_rate (INTEGER)
- icon, color (VARCHAR)
- created_by (UUID, FK)
- created_at, updated_at (TIMESTAMP)
```

#### workflows
```sql
- id (UUID, PK)
- organization_id (UUID, FK)
- name, description (VARCHAR/TEXT)
- status (ENUM: active, inactive, running, error)
- trigger_type (ENUM: manual, schedule, webhook, event)
- trigger_config, nodes, edges, tags (JSON)
- timeout_seconds, max_retries, retry_delay_seconds (INTEGER)
- total_executions, successful_executions, failed_executions (INTEGER)
- last_executed_at (TIMESTAMP)
- icon, color (VARCHAR)
- created_by (UUID, FK)
- created_at, updated_at (TIMESTAMP)
```

#### leads
```sql
- id (UUID, PK)
- organization_id (UUID, FK)
- email (VARCHAR, INDEX)
- full_name, company, job_title, phone (VARCHAR)
- status (ENUM: new, contacted, qualified, converted, lost)
- source (ENUM: linkedin, email, website, referral, manual, ai_agent, workflow, other)
- city, country, linkedin_url, website (VARCHAR)
- notes (TEXT)
- lead_score (0-100), last_contacted_at (VARCHAR)
- workflow_id, agent_id (UUID)
- custom_fields, tags (JSON)
- created_at, updated_at (TIMESTAMP)
```

#### integrations
```sql
- id (UUID, PK)
- organization_id (UUID, FK)
- name (VARCHAR)
- integration_type (ENUM: linkedin, gmail, slack, hubspot, salesforce, stripe, zapier, webhook, custom_api)
- status (ENUM: connected, disconnected, error, pending)
- config (JSON)
- credentials, access_token, refresh_token (TEXT, ENCRYPTED)
- token_expires_at (TIMESTAMP)
- webhook_url, webhook_secret (VARCHAR)
- total_syncs, last_sync_at, last_error (VARCHAR/TEXT)
- icon, color (VARCHAR)
- created_at, updated_at (TIMESTAMP)
```

---

## 🚀 API Endpoints

### Authentication

#### POST /api/v1/auth/register
Register new user and create organization

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "full_name": "John Doe",
  "organization_name": "My Company"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "bearer"
  }
}
```

#### POST /api/v1/auth/login
Login with email and password

**Request (Form Data):**
```
username=user@example.com
password=SecurePass123
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "bearer"
  }
}
```

### AI Agents

#### GET /api/v1/agents
List all AI agents (paginated)

**Query Params:**
- `skip`: Offset (default: 0)
- `limit`: Page size (default: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Support Agent",
      "agent_type": "customer_support",
      "status": "active",
      "total_executions": 150,
      ...
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 100,
  "total_pages": 1
}
```

#### POST /api/v1/agents
Create new AI agent

**Request:**
```json
{
  "name": "Lead Gen Agent",
  "description": "Generates qualified leads from LinkedIn",
  "agent_type": "lead_generation",
  "system_prompt": "You are an expert lead generation assistant...",
  "temperature": 70,
  "max_tokens": 2000,
  "ai_model": "gemini-pro",
  "icon": "bot",
  "color": "purple"
}
```

#### POST /api/v1/agents/{agent_id}/execute
Execute AI agent with input

**Request:**
```json
{
  "input_text": "Find me 10 B2B SaaS leads in San Francisco"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agent_id": "uuid",
    "input": "Find me 10 B2B SaaS leads...",
    "output": "AI generated response...",
    "tokens_used": 1234
  }
}
```

### Workflows

#### POST /api/v1/workflows
Create new workflow

**Request:**
```json
{
  "name": "Lead Follow-up Automation",
  "description": "Automatically follow up with new leads",
  "trigger_type": "schedule",
  "trigger_config": {
    "schedule": "0 9 * * *"
  },
  "nodes": [
    {
      "id": "trigger",
      "type": "trigger",
      "config": {}
    },
    {
      "id": "ai-agent",
      "type": "ai_agent",
      "config": {
        "agent_id": "uuid"
      }
    }
  ],
  "edges": [
    {
      "source": "trigger",
      "target": "ai-agent"
    }
  ]
}
```

#### POST /api/v1/workflows/{workflow_id}/execute
Execute workflow

**Request:**
```json
{
  "input_data": {
    "lead_email": "prospect@company.com"
  }
}
```

### Leads

#### POST /api/v1/leads/bulk
Bulk create leads

**Request:**
```json
[
  {
    "email": "lead1@company.com",
    "full_name": "John Smith",
    "company": "Tech Corp",
    "source": "linkedin"
  },
  {
    "email": "lead2@startup.io",
    "full_name": "Jane Doe",
    "company": "Startup Inc",
    "source": "ai_agent"
  }
]
```

---

## 🤖 Gemini AI Integration

### GeminiService

Located in `app/services/gemini_service.py`

#### Generate Text
```python
from app.services.gemini_service import gemini_service

response = await gemini_service.generate_text(
    prompt="What is AI automation?",
    system_prompt="You are a helpful AI assistant",
    temperature=0.7,
    max_tokens=500
)

print(response["text"])
print(f"Tokens used: {response['tokens_used']}")
```

#### Chat Completion
```python
messages = [
    {"role": "user", "content": "What is FastAPI?"},
    {"role": "assistant", "content": "FastAPI is a modern web framework..."},
    {"role": "user", "content": "How do I use it?"}
]

response = await gemini_service.chat_completion(
    messages=messages,
    temperature=0.7,
    max_tokens=1000
)
```

---

## 🔄 Workflow Execution

### WorkflowService

Located in `app/services/workflow_service.py`

**Supported Node Types:**
1. **Trigger** - Workflow start point
2. **AI Agent** - Execute AI agent
3. **Condition** - Conditional branching
4. **Action** - External actions (API calls, emails)
5. **Delay** - Time delays

**Execution Flow:**
```python
from app.services.workflow_service import workflow_service

result = await workflow_service.execute_workflow(
    workflow=workflow_instance,
    input_data={"input": "user data"},
    db=db_session
)

# result contains:
# - status: "completed" | "failed"
# - results: dict of node executions
# - output: final workflow output
```

---

## 🧪 Usage Limits & Billing

### Free Plan
- API Credits: 1,000 / month
- AI Agents: 3
- Workflows: 5
- Team Members: 3

### Pro Plan
- API Credits: 50,000 / month
- AI Agents: 50
- Workflows: 100
- Team Members: 10

### Enterprise Plan
- API Credits: Unlimited
- AI Agents: Unlimited
- Workflows: Unlimited
- Team Members: Unlimited

### Checking Limits

Limits are automatically enforced through dependencies:
```python
from app.api.deps import check_credits_limit, check_agent_limit

@router.post("/agents")
async def create_agent(
    organization: Organization = Depends(check_agent_limit)
):
    # Will raise 402 Payment Required if limit exceeded
    ...
```

---

## 🔧 Configuration

### Environment Variables

**Required:**
```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/db
SECRET_KEY=your-secret-key-min-32-chars
GEMINI_API_KEY=your-gemini-api-key
```

**Optional:**
```env
ENVIRONMENT=development
DEBUG=True
REDIS_URL=redis://localhost:6379/0
STRIPE_SECRET_KEY=sk_test_...
SENTRY_DSN=https://...
RATE_LIMIT_PER_MINUTE=60
```

---

## 📈 Monitoring & Logging

### Health Check

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "app": "Velora AI",
  "version": "1.0.0",
  "environment": "development"
}
```

### Error Tracking

Configure Sentry DSN in `.env` for production error tracking.

---

## 🚀 Deployment

### Docker Deployment

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### Production Checklist

- [ ] Set `ENVIRONMENT=production`
- [ ] Set `DEBUG=False`
- [ ] Use strong `SECRET_KEY` (32+ characters)
- [ ] Configure SSL/TLS
- [ ] Set up database backups
- [ ] Configure Sentry for error tracking
- [ ] Set proper CORS origins
- [ ] Enable rate limiting
- [ ] Use production PostgreSQL instance
- [ ] Configure Redis for caching
- [ ] Set up CI/CD pipeline

---

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

---

## 📝 Development Guidelines

### Adding New Endpoint

1. Create schema in `app/schemas/`
2. Create model in `app/models/`
3. Create endpoint in `app/api/endpoints/`
4. Add router to `app/main.py`
5. Add tests in `tests/`

### Code Style

- Use type hints for all functions
- Write docstrings for public functions
- Follow PEP 8 guidelines
- Use async/await for I/O operations
- Keep functions focused and small

---

## 🔒 Security Best Practices

1. **Never commit secrets** - Use `.env` files
2. **Hash all passwords** - Using bcrypt
3. **Validate all inputs** - Using Pydantic
4. **Use parameterized queries** - SQLAlchemy handles this
5. **Implement rate limiting** - Already configured
6. **Enable CORS properly** - Configure allowed origins
7. **Use HTTPS in production** - SSL/TLS required
8. **Log security events** - Monitor authentication failures
9. **Keep dependencies updated** - Regular updates
10. **Implement RBAC** - Role-based access control

---

## 📞 Support

- **Documentation**: `/docs` endpoint
- **Issues**: GitHub Issues
- **Email**: support@veloraai.com

---

## 📄 License

Copyright © 2026 Velora AI. All rights reserved.
