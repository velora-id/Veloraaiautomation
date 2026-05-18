"""
Pytest configuration and fixtures
"""
import pytest
import asyncio
from unittest.mock import Mock, AsyncMock
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.pool import StaticPool

from app.core.database import Base


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_db():
    """Create test database"""
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    await engine.dispose()


@pytest.fixture
async def db_session(test_db):
    """Create test database session"""
    async with AsyncSession(test_db) as session:
        yield session


@pytest.fixture
def mock_settings():
    """Create mock settings"""
    settings = Mock()
    settings.DATABASE_URL = "sqlite+aiosqlite:///:memory:"
    settings.DEBUG = True
    settings.ENVIRONMENT = "testing"
    settings.APP_NAME = "Velora AI"
    settings.APP_VERSION = "1.0.0"
    settings.SECRET_KEY = "test_secret_key"
    settings.RATE_LIMIT_PER_MINUTE = 60

    return settings


@pytest.fixture
def mock_current_user():
    """Create mock current user"""
    user = Mock()
    user.id = "user_123"
    user.email = "test@example.com"
    user.is_active = True

    return user


@pytest.fixture
def mock_organization():
    """Create mock organization"""
    org = Mock()
    org.id = "org_123"
    org.name = "Test Organization"
    org.plan = "pro"

    return org
