# Backend API Documentation

## Overview

Velora AI Backend API adalah REST API yang powerful untuk automation workflows dan AI integrations.

- **Base URL**: `http://localhost:8000/api/v1`
- **API Version**: v1
- **Authentication**: Bearer Token (JWT)
- **Response Format**: JSON
- **Documentation**: `/docs` (Swagger UI) | `/redoc` (ReDoc)

---

## Authentication

Semua endpoints (kecuali `/health` dan public endpoints) memerlukan token JWT.

### Mendapatkan Token

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "token_type": "bearer",
    "expires_in": 1800
  }
}
```

### Menggunakan Token

```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:8000/api/v1/workflows
```

---

## Base Response Format

Semua responses mengikuti format konsisten:

### Success Response (200, 201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Example",
    ...
  },
  "message": "Operation successful"
}
```

### Paginated Response (200)
```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "Item 1" },
    { "id": "2", "name": "Item 2" }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "page_size": 10,
    "total_pages": 5
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

---

## Endpoints

### Health Check

#### GET /health
Check API health status

**Response:**
```json
{
  "status": "healthy",
  "app": "Velora AI",
  "version": "1.0.0",
  "environment": "production"
}
```

---

### Integrations

#### GET /integrations/providers
Get list of available integration providers

**Response:**
```json
{
  "success": true,
  "data": {
    "stripe": {
      "name": "Stripe",
      "description": "Payment processing",
      "fields": [
        {
          "name": "api_key",
          "type": "password",
          "label": "Stripe Secret Key",
          "required": true
        }
      ],
      "actions": [
        {
          "name": "create_payment",
          "label": "Create Payment",
          "description": "Create a payment intent"
        }
      ]
    }
  }
}
```

#### GET /integrations
Get organization's integrations

**Query Parameters:**
- `skip` (int): Offset (default: 0)
- `limit` (int): Page size (default: 100)
- `provider` (string): Filter by provider

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "integ_123",
      "name": "Production Stripe",
      "provider": "stripe",
      "status": "active",
      "created_at": "2026-05-17T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "page_size": 100,
    "total_pages": 1
  }
}
```

#### POST /integrations
Create new integration

**Request:**
```json
{
  "name": "Production Stripe",
  "provider": "stripe",
  "credentials": {
    "api_key": "sk_live_..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "integ_123",
    "name": "Production Stripe",
    "provider": "stripe",
    "status": "active",
    "created_at": "2026-05-17T10:00:00Z"
  }
}
```

#### GET /integrations/{integration_id}
Get specific integration

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "integ_123",
    "name": "Production Stripe",
    "provider": "stripe",
    "status": "active",
    "config": { ... },
    "created_at": "2026-05-17T10:00:00Z"
  }
}
```

#### POST /integrations/{integration_id}/verify
Verify integration credentials

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "message": "Integration credentials verified successfully"
  }
}
```

#### POST /integrations/{integration_id}/test
Test integration connection

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "connected",
    "details": {
      "account_id": "acct_...",
      "email": "admin@example.com"
    }
  }
}
```

#### DELETE /integrations/{integration_id}
Delete integration

**Response:**
```json
{
  "success": true,
  "message": "Integration deleted successfully"
}
```

---

### Workflows

#### GET /workflows
List workflows for organization

**Query Parameters:**
- `skip` (int): Offset
- `limit` (int): Page size
- `status` (string): Filter by status (draft, published, archived)
- `search` (string): Search by name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "wf_123",
      "name": "Lead Enrichment",
      "description": "Enrich lead data from multiple sources",
      "status": "published",
      "nodes_count": 5,
      "created_at": "2026-05-17T10:00:00Z",
      "updated_at": "2026-05-17T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "page_size": 10,
    "total_pages": 3
  }
}
```

#### POST /workflows
Create new workflow

**Request:**
```json
{
  "name": "Lead Enrichment",
  "description": "Enrich lead data",
  "nodes": [
    {
      "id": "trigger_1",
      "type": "trigger",
      "config": { "trigger_type": "webhook" }
    },
    {
      "id": "agent_1",
      "type": "ai_agent",
      "config": { "agent_id": "agent_123" }
    }
  ],
  "edges": [
    { "from": "trigger_1", "to": "agent_1" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "wf_123",
    "name": "Lead Enrichment",
    "status": "draft",
    "nodes": [ ... ],
    "edges": [ ... ]
  }
}
```

#### GET /workflows/{workflow_id}
Get specific workflow

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "wf_123",
    "name": "Lead Enrichment",
    "description": "...",
    "status": "published",
    "nodes": [ ... ],
    "edges": [ ... ],
    "created_at": "2026-05-17T10:00:00Z"
  }
}
```

#### PUT /workflows/{workflow_id}
Update workflow

**Request:**
```json
{
  "name": "Lead Enrichment v2",
  "description": "Updated description",
  "nodes": [ ... ],
  "edges": [ ... ]
}
```

#### POST /workflows/{workflow_id}/execute
Execute workflow manually

**Request:**
```json
{
  "input": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "execution_id": "exec_123",
    "workflow_id": "wf_123",
    "status": "completed",
    "duration": 2.5,
    "output": {
      "email": "user@example.com",
      "name": "John Doe",
      "enriched_data": { ... }
    },
    "results": {
      "trigger_1": { ... },
      "agent_1": { ... }
    },
    "execution_log": [ ... ]
  }
}
```

#### DELETE /workflows/{workflow_id}
Delete workflow

**Response:**
```json
{
  "success": true,
  "message": "Workflow deleted successfully"
}
```

---

### Workflow Executions

#### GET /workflows/{workflow_id}/executions
Get workflow execution history

**Query Parameters:**
- `skip` (int): Offset
- `limit` (int): Page size
- `status` (string): Filter by status (running, completed, failed)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "exec_123",
      "workflow_id": "wf_123",
      "status": "completed",
      "duration": 2.5,
      "created_at": "2026-05-17T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### GET /workflows/{workflow_id}/executions/{execution_id}
Get execution details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "exec_123",
    "workflow_id": "wf_123",
    "status": "completed",
    "duration": 2.5,
    "input": { ... },
    "output": { ... },
    "results": { ... },
    "execution_log": [ ... ],
    "created_at": "2026-05-17T10:00:00Z"
  }
}
```

---

### AI Agents

#### GET /agents
List AI agents

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "agent_123",
      "name": "Lead Scorer",
      "description": "Score leads based on...",
      "model": "gemini-pro",
      "system_prompt": "You are...",
      "temperature": 70,
      "max_tokens": 1000,
      "created_at": "2026-05-17T10:00:00Z"
    }
  ]
}
```

#### POST /agents
Create new agent

**Request:**
```json
{
  "name": "Lead Scorer",
  "description": "Score leads",
  "system_prompt": "You are a lead scoring expert...",
  "temperature": 70,
  "max_tokens": 1000
}
```

#### PUT /agents/{agent_id}
Update agent

#### DELETE /agents/{agent_id}
Delete agent

---

## Integration Actions

### Stripe Actions

#### Send Payment

```bash
POST /integrations/{integration_id}/execute
Content-Type: application/json

{
  "action": "create_payment",
  "params": {
    "amount": 99.99,
    "currency": "usd",
    "description": "Subscription payment"
  }
}
```

#### Create Customer

```bash
POST /integrations/{integration_id}/execute

{
  "action": "create_customer",
  "params": {
    "email": "customer@example.com",
    "name": "John Doe"
  }
}
```

### Mailgun Actions

#### Send Email

```bash
POST /integrations/{integration_id}/execute

{
  "action": "send_email",
  "params": {
    "to": "user@example.com",
    "subject": "Welcome",
    "text": "Hello {{name}}",
    "html": "<p>Hello {{name}}</p>"
  }
}
```

#### Send Batch

```bash
POST /integrations/{integration_id}/execute

{
  "action": "send_batch",
  "params": {
    "recipients": ["user1@example.com", "user2@example.com"],
    "subject": "Newsletter",
    "text": "Check out..."
  }
}
```

### Slack Actions

#### Send Message

```bash
POST /integrations/{integration_id}/execute

{
  "action": "send_message",
  "params": {
    "channel": "#general",
    "text": "Hello team!"
  }
}
```

#### Send Direct Message

```bash
POST /integrations/{integration_id}/execute

{
  "action": "send_direct_message",
  "params": {
    "user_id": "U123",
    "text": "Hello!"
  }
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 422 | Input validation failed |
| UNAUTHORIZED | 401 | Invalid or missing token |
| FORBIDDEN | 403 | Access denied |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| RATE_LIMITED | 429 | Rate limit exceeded |
| INTERNAL_ERROR | 500 | Internal server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

---

## Rate Limiting

- **Limit**: 60 requests per minute (per user)
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Pagination

Untuk endpoints yang mengembalikan list:

- `page` (int): Current page (1-based)
- `page_size` (int): Items per page (default: 10, max: 100)
- `total` (int): Total items
- `total_pages` (int): Total pages

---

## Webhooks

Workflows dapat trigger via webhooks:

```bash
POST /webhooks/{webhook_id}
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

---

## Examples

### Complete Workflow Execution Example

```bash
# 1. Create workflow
curl -X POST http://localhost:8000/api/v1/workflows \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Email Sender",
    "nodes": [
      {
        "id": "trigger",
        "type": "trigger",
        "config": { "trigger_type": "webhook" }
      },
      {
        "id": "mailgun",
        "type": "integration",
        "config": {
          "integration_id": "integ_mailgun",
          "action": "send_email",
          "params": {
            "to": "{{recipient}}",
            "subject": "Hello",
            "text": "Hi {{name}}"
          }
        }
      }
    ]
  }'

# 2. Execute workflow
curl -X POST http://localhost:8000/api/v1/workflows/{workflow_id}/execute \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "recipient": "user@example.com",
      "name": "John"
    }
  }'
```

---

## Support

- **Documentation**: https://docs.veloraai.com
- **Email**: support@veloraai.com
- **Status Page**: https://status.veloraai.com
