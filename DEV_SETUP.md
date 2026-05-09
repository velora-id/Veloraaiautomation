# 🚀 Velora AI - Development Setup Complete

## ✅ Current Status

### Backend Services
- ✅ **Backend API**: Running on `http://localhost:8000`
- ✅ **PostgreSQL**: Running (Docker container: `velora_postgres`)
- ✅ **Redis**: Running (Docker container: `velora_redis`)
- ✅ **Database**: Initialized with tables
- ✅ **Swagger UI**: Available at `http://localhost:8000/docs`
- ✅ **ReDoc**: Available at `http://localhost:8000/redoc`

### Frontend
- ✅ **Frontend Dev Server**: Running on `http://localhost:5174`
- ✅ **Dependencies**: Installed with pnpm
- ✅ **Vite**: Hot module reloading enabled

---

## 📋 Quick Commands

### Backend

```bash
# Start backend services (if stopped)
cd /workspaces/Veloraaiautomation/backend
docker-compose up -d postgres redis

# Start backend server (if stopped)
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Check health
curl http://localhost:8000/health
```

### Frontend

```bash
# Start frontend dev server (if stopped)
cd /workspaces/Veloraaiautomation
pnpm dev  # Runs on http://localhost:5174

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Database Migrations

```bash
cd /workspaces/Veloraaiautomation/backend
source venv/bin/activate

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 🔧 Project Structure

```
/workspaces/Veloraaiautomation/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/endpoints/   # API routes
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   └── core/            # Core configuration
│   ├── Dockerfile           # Docker image
│   ├── docker-compose.yml   # Services orchestration
│   └── requirements.txt     # Python dependencies
│
├── src/                      # React frontend
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── context/         # React context
│   │   └── layouts/         # Layout components
│   └── styles/              # Tailwind CSS styles
│
├── package.json             # Frontend dependencies
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind CSS config
```

---

## 🔌 API Integration

### Authentication

```typescript
// Login
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=password

// Response
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}

// Use token for subsequent requests
Authorization: Bearer {access_token}
```

### Create First User

1. Open **Swagger UI**: http://localhost:8000/docs
2. Navigate to **Authentication → POST /api/v1/auth/register**
3. Click "Try it out"
4. Enter user details:
   ```json
   {
     "email": "admin@example.com",
     "password": "SecurePass123",
     "full_name": "Admin User",
     "organization_name": "My Company"
   }
   ```
5. Execute and copy the `access_token`

---

## 🛠️ Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql+asyncpg://velora:velora_password@localhost:5432/velora_db
SECRET_KEY=your-super-secret-key-min-32-characters-long
GEMINI_API_KEY=your-gemini-api-key
BACKEND_CORS_ORIGINS=["http://localhost:5174"]
ENVIRONMENT=development
DEBUG=True
REDIS_URL=redis://localhost:6379/0
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

## 📦 Installation Used

### Backend Dependencies
- FastAPI 0.109.0
- SQLAlchemy 2.0.25 (async)
- PostgreSQL 15 (asyncpg)
- Redis 7
- Google Gemini AI
- JWT authentication

### Frontend Dependencies
- React 18
- TypeScript
- Tailwind CSS v4
- Vite
- Radix UI
- shadcn/ui
- React Router v7
- Recharts

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -i :8000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9

# Kill process on port 5174
lsof -i :5174 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

### Database Connection Error
```bash
# Verify Docker containers
docker-compose ps

# Check logs
docker-compose logs postgres
docker-compose logs backend

# Restart services
docker-compose restart
```

### Module Import Errors
```bash
# Reinstall dependencies
cd backend && source venv/bin/activate && pip install -r requirements.txt
cd ../.. && pnpm install
```

---

## 📝 Next Steps

### Immediate
1. ✅ **Backend Running**: API on http://localhost:8000
2. ✅ **Frontend Running**: Dev server on http://localhost:5174
3. ⏭️ **Test API**: Create test user via Swagger UI
4. ⏭️ **Connect Frontend to Backend**: Update API client in src/services/api.ts
5. ⏭️ **Test End-to-End**: Create agents, workflows, leads

### Short-term
- Add real-time WebSocket support
- Implement file upload for leads import
- Add email notification system
- Create webhook system
- Build Stripe integration

### Long-term
- White-label solution
- Mobile app (React Native)
- Advanced analytics
- ML model fine-tuning
- Marketplace

---

## 📚 Documentation

- **Backend**: `backend/BACKEND_DOCUMENTATION.md`
- **Quick Start**: `backend/QUICKSTART.md`
- **Frontend Features**: `FRONTEND_FEATURES.md`
- **Workflows**: `WORKFLOW_DESIGNER_README.md`
- **Implementation**: `IMPLEMENTATION_GUIDE.md`

---

## 🔗 Useful Links

- **Backend API Docs**: http://localhost:8000/docs
- **Backend ReDoc**: http://localhost:8000/redoc
- **Frontend**: http://localhost:5174
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

---

**Last Updated**: May 9, 2026  
**Status**: 🟢 Development Environment Ready
