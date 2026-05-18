from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta
from uuid import UUID
import re

from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.core.config import settings
from app.models.user import User, UserRole
from app.models.organization import Organization, BillingPlan
from app.schemas.user import UserCreate, User as UserSchema
from app.schemas.token import RefreshTokenRequest, Token
from app.schemas.api_response import APIResponse

router = APIRouter()


def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from organization name"""
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')
    return slug


@router.post("/register", response_model=APIResponse[Token], status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Register new user and create organization
    """
    # Check if email already exists
    result = await db.execute(
        select(User).where(User.email == user_in.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create organization
    org_name = user_in.organization_name or f"{user_in.full_name}'s Organization"
    org_slug = generate_slug(org_name)

    # Check if slug exists, append number if needed
    base_slug = org_slug
    counter = 1
    while True:
        result = await db.execute(
            select(Organization).where(Organization.slug == org_slug)
        )
        if not result.scalar_one_or_none():
            break
        org_slug = f"{base_slug}-{counter}"
        counter += 1

    organization = Organization(
        name=org_name,
        slug=org_slug,
        billing_plan=BillingPlan.FREE,
        api_credits_limit=settings.PLAN_FREE_CREDITS,
        max_ai_agents=settings.PLAN_FREE_AGENTS,
        max_workflows=settings.PLAN_FREE_WORKFLOWS,
        max_team_members=3
    )
    db.add(organization)
    await db.flush()

    # Create user as organization owner
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        avatar_url=user_in.avatar_url,
        timezone=user_in.timezone,
        theme=user_in.theme,
        organization_id=organization.id,
        role=UserRole.OWNER,
        is_active=True,
        is_verified=False
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Generate tokens
    access_token = create_access_token(
        subject=user.id,
        additional_claims={"organization_id": str(organization.id)}
    )
    refresh_token = create_refresh_token(subject=user.id)

    return APIResponse(
        success=True,
        message="User registered successfully",
        data=Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    )


@router.post("/login", response_model=APIResponse[Token])
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    OAuth2 compatible token login
    """
    # Get user by email
    result = await db.execute(
        select(User).where(User.email == form_data.username)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # Generate tokens
    access_token = create_access_token(
        subject=user.id,
        additional_claims={"organization_id": str(user.organization_id)}
    )
    refresh_token = create_refresh_token(subject=user.id)

    return APIResponse(
        success=True,
        message="Login successful",
        data=Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    )


@router.post("/refresh", response_model=APIResponse[Token])
async def refresh_token(
    payload: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token using refresh token
    """
    try:
        token_payload = decode_token(payload.refresh_token)

        if token_payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

        user_id = token_payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        try:
            user_uuid = UUID(str(user_id))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token subject"
            )

        # Get user
        result = await db.execute(
            select(User).where(User.id == user_uuid)
        )
        user = result.scalar_one_or_none()

        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token or inactive user"
            )

        # Generate new tokens
        access_token = create_access_token(
            subject=user.id,
            additional_claims={"organization_id": str(user.organization_id)}
        )
        new_refresh_token = create_refresh_token(subject=user.id)

        return APIResponse(
            success=True,
            message="Token refreshed successfully",
            data=Token(
                access_token=access_token,
                refresh_token=new_refresh_token,
                token_type="bearer"
            )
        )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
