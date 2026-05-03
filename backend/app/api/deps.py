from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.organization import Organization
from app.schemas.token import TokenPayload

# Security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)

        if token_data.sub is None:
            raise credentials_exception

        if token_data.type != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

    except JWTError:
        raise credentials_exception

    # Get user from database
    result = await db.execute(
        select(User).where(User.id == token_data.sub)
    )
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current active user
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user


async def get_current_superuser(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current superuser
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    return current_user


async def get_current_organization(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> Organization:
    """
    Get current user's organization
    """
    result = await db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = result.scalar_one_or_none()

    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )

    if not organization.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Organization is inactive"
        )

    return organization


def require_role(required_role: UserRole):
    """
    Dependency factory for role-based access control
    Usage: require_role(UserRole.ADMIN)
    """
    async def role_checker(current_user: User = Depends(get_current_active_user)) -> User:
        role_hierarchy = {
            UserRole.MEMBER: 1,
            UserRole.ADMIN: 2,
            UserRole.OWNER: 3,
        }

        user_role_level = role_hierarchy.get(current_user.role, 0)
        required_role_level = role_hierarchy.get(required_role, 0)

        if user_role_level < required_role_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {required_role.value}"
            )

        return current_user

    return role_checker


async def check_credits_limit(
    organization: Organization = Depends(get_current_organization),
    credits_needed: int = 1
) -> Organization:
    """
    Check if organization has enough API credits
    """
    if organization.api_credits_limit != -1:  # -1 means unlimited
        if organization.api_credits_used + credits_needed > organization.api_credits_limit:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="API credit limit exceeded. Please upgrade your plan."
            )

    return organization


async def check_agent_limit(
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
) -> Organization:
    """
    Check if organization can create more AI agents
    """
    from app.models.ai_agent import AIAgent

    if organization.max_ai_agents == -1:  # Unlimited
        return organization

    # Count existing agents
    result = await db.execute(
        select(AIAgent).where(AIAgent.organization_id == organization.id)
    )
    agent_count = len(result.scalars().all())

    if agent_count >= organization.max_ai_agents:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"AI Agent limit reached ({organization.max_ai_agents}). Please upgrade your plan."
        )

    return organization


async def check_workflow_limit(
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
) -> Organization:
    """
    Check if organization can create more workflows
    """
    from app.models.workflow import Workflow

    if organization.max_workflows == -1:  # Unlimited
        return organization

    # Count existing workflows
    result = await db.execute(
        select(Workflow).where(Workflow.organization_id == organization.id)
    )
    workflow_count = len(result.scalars().all())

    if workflow_count >= organization.max_workflows:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Workflow limit reached ({organization.max_workflows}). Please upgrade your plan."
        )

    return organization
