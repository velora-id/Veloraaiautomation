from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.api.deps import get_current_active_user, get_current_organization
from app.models.user import User
from app.models.organization import Organization
from app.models.integration import Integration, IntegrationStatus
from app.schemas.integration import Integration as IntegrationSchema, IntegrationCreate, IntegrationUpdate
from app.schemas.api_response import APIResponse, PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[IntegrationSchema])
async def list_integrations(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all integrations for current organization
    """
    result = await db.execute(
        select(Integration)
        .where(Integration.organization_id == organization.id)
        .offset(skip)
        .limit(limit)
    )
    integrations = result.scalars().all()

    count_result = await db.execute(
        select(Integration).where(Integration.organization_id == organization.id)
    )
    total = len(count_result.scalars().all())

    return PaginatedResponse(
        success=True,
        data=integrations,
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        total_pages=(total + limit - 1) // limit
    )


@router.get("/{integration_id}", response_model=APIResponse[IntegrationSchema])
async def get_integration(
    integration_id: UUID,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get specific integration by ID
    """
    result = await db.execute(
        select(Integration).where(
            Integration.id == integration_id,
            Integration.organization_id == organization.id
        )
    )
    integration = result.scalar_one_or_none()

    if not integration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Integration not found"
        )

    return APIResponse(
        success=True,
        data=integration
    )


@router.post("", response_model=APIResponse[IntegrationSchema], status_code=status.HTTP_201_CREATED)
async def create_integration(
    integration_in: IntegrationCreate,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Create new integration
    """
    integration = Integration(
        organization_id=organization.id,
        name=integration_in.name,
        integration_type=integration_in.integration_type,
        config=integration_in.config,
        webhook_url=integration_in.webhook_url,
        status=IntegrationStatus.PENDING
    )

    db.add(integration)
    await db.commit()
    await db.refresh(integration)

    return APIResponse(
        success=True,
        message="Integration created successfully",
        data=integration
    )


@router.put("/{integration_id}", response_model=APIResponse[IntegrationSchema])
async def update_integration(
    integration_id: UUID,
    integration_in: IntegrationUpdate,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Update integration
    """
    result = await db.execute(
        select(Integration).where(
            Integration.id == integration_id,
            Integration.organization_id == organization.id
        )
    )
    integration = result.scalar_one_or_none()

    if not integration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Integration not found"
        )

    update_data = integration_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(integration, field, value)

    await db.commit()
    await db.refresh(integration)

    return APIResponse(
        success=True,
        message="Integration updated successfully",
        data=integration
    )


@router.delete("/{integration_id}", response_model=APIResponse)
async def delete_integration(
    integration_id: UUID,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete integration
    """
    result = await db.execute(
        select(Integration).where(
            Integration.id == integration_id,
            Integration.organization_id == organization.id
        )
    )
    integration = result.scalar_one_or_none()

    if not integration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Integration not found"
        )

    await db.delete(integration)
    await db.commit()

    return APIResponse(
        success=True,
        message="Integration deleted successfully"
    )


@router.post("/{integration_id}/connect", response_model=APIResponse)
async def connect_integration(
    integration_id: UUID,
    credentials: dict,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Connect/activate integration
    Placeholder - actual OAuth/API connection logic will be added per integration type
    """
    result = await db.execute(
        select(Integration).where(
            Integration.id == integration_id,
            Integration.organization_id == organization.id
        )
    )
    integration = result.scalar_one_or_none()

    if not integration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Integration not found"
        )

    # TODO: Implement actual connection logic per integration type
    integration.status = IntegrationStatus.CONNECTED
    integration.is_active = True

    await db.commit()

    return APIResponse(
        success=True,
        message="Integration connected successfully"
    )


@router.post("/{integration_id}/disconnect", response_model=APIResponse)
async def disconnect_integration(
    integration_id: UUID,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Disconnect integration
    """
    result = await db.execute(
        select(Integration).where(
            Integration.id == integration_id,
            Integration.organization_id == organization.id
        )
    )
    integration = result.scalar_one_or_none()

    if not integration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Integration not found"
        )

    integration.status = IntegrationStatus.DISCONNECTED
    integration.is_active = False

    await db.commit()

    return APIResponse(
        success=True,
        message="Integration disconnected successfully"
    )
