from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.core.database import get_db
from app.api.deps import get_current_active_user, get_current_organization
from app.models.user import User
from app.models.organization import Organization
from app.schemas.user import User as UserSchema, UserUpdate
from app.schemas.api_response import APIResponse

router = APIRouter()


@router.get("/me", response_model=APIResponse[UserSchema])
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user information
    """
    return APIResponse(
        success=True,
        data=current_user
    )


@router.put("/me", response_model=APIResponse[UserSchema])
async def update_current_user(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user profile
    """
    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)

    return APIResponse(
        success=True,
        message="Profile updated successfully",
        data=current_user
    )


@router.get("/organization/members", response_model=APIResponse)
async def list_organization_members(
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    List all members in current organization
    """
    result = await db.execute(
        select(User).where(User.organization_id == organization.id)
    )
    members = result.scalars().all()

    return APIResponse(
        success=True,
        data=[{
            "id": str(member.id),
            "email": member.email,
            "full_name": member.full_name,
            "role": member.role,
            "is_active": member.is_active,
            "avatar_url": member.avatar_url,
            "created_at": member.created_at.isoformat()
        } for member in members]
    )
