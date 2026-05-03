from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db, close_db
from app.middleware.tenant import TenantMiddleware
from app.middleware.rate_limit import RateLimitMiddleware

# Import routers
from app.api.endpoints import (
    auth,
    ai_agents,
    workflows,
    leads,
    integrations,
    users,
    organizations
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events
    """
    # Startup
    print("🚀 Starting Velora AI Backend...")
    await init_db()
    print("✅ Database initialized")
    yield
    # Shutdown
    print("🛑 Shutting down Velora AI Backend...")
    await close_db()
    print("✅ Database connections closed")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Velora AI Automation Framework - Backend API",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middlewares
app.add_middleware(TenantMiddleware)
app.add_middleware(RateLimitMiddleware, calls_per_minute=settings.RATE_LIMIT_PER_MINUTE)


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler
    """
    if settings.DEBUG:
        import traceback
        error_detail = traceback.format_exc()
        print(f"❌ Error: {error_detail}")

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "errors": [str(exc)] if settings.DEBUG else ["An unexpected error occurred"]
        }
    )


# Health check
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }


# Include routers
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["Authentication"]
)

app.include_router(
    ai_agents.router,
    prefix=f"{settings.API_V1_STR}/agents",
    tags=["AI Agents"]
)

app.include_router(
    workflows.router,
    prefix=f"{settings.API_V1_STR}/workflows",
    tags=["Workflows"]
)

app.include_router(
    leads.router,
    prefix=f"{settings.API_V1_STR}/leads",
    tags=["Leads"]
)

app.include_router(
    integrations.router,
    prefix=f"{settings.API_V1_STR}/integrations",
    tags=["Integrations"]
)

app.include_router(
    users.router,
    prefix=f"{settings.API_V1_STR}/users",
    tags=["Users"]
)

app.include_router(
    organizations.router,
    prefix=f"{settings.API_V1_STR}/organizations",
    tags=["Organizations"]
)


# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {
        "message": "Welcome to Velora AI API",
        "version": settings.APP_VERSION,
        "docs": "/docs" if settings.DEBUG else "Documentation disabled in production",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD
    )
