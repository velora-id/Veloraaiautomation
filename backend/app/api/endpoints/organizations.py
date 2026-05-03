from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.api.deps import get_current_active_user, get_current_organization, require_role
from app.models.user import User, UserRole
from app.models.organization import Organization
from app.schemas.organization import Organization as OrganizationSchema, OrganizationUpdate
from app.schemas.api_response import APIResponse

router = APIRouter()


@router.get("/me", response_model=APIResponse[OrganizationSchema])
async def get_current_organization_info(
    organization: Organization = Depends(get_current_organization)
):
    """
    Get current organization information
    """
    return APIResponse(
        success=True,
        data=organization
    )


@router.put("/me", response_model=APIResponse[OrganizationSchema])
async def update_organization(
    org_in: OrganizationUpdate,
    current_user: User = Depends(require_role(UserRole.OWNER)),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Update organization settings (Owner only)
    """
    update_data = org_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(organization, field, value)

    await db.commit()
    await db.refresh(organization)

    return APIResponse(
        success=True,
        message="Organization updated successfully",
        data=organization
    )


@router.get("/usage", response_model=APIResponse)
async def get_organization_usage(
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current organization usage statistics
    """
    from app.models.ai_agent import AIAgent
    from app.models.workflow import Workflow
    from app.models.lead import Lead

    # Count resources
    agents_result = await db.execute(
        select(AIAgent).where(AIAgent.organization_id == organization.id)
    )
    agents_count = len(agents_result.scalars().all())

    workflows_result = await db.execute(
        select(Workflow).where(Workflow.organization_id == organization.id)
    )
    workflows_count = len(workflows_result.scalars().all())

    leads_result = await db.execute(
        select(Lead).where(Lead.organization_id == organization.id)
    )
    leads_count = len(leads_result.scalars().all())

    return APIResponse(
        success=True,
        data={
            "billing_plan": organization.billing_plan,
            "api_credits": {
                "used": organization.api_credits_used,
                "limit": organization.api_credits_limit,
                "percentage": round((organization.api_credits_used / organization.api_credits_limit * 100), 2) if organization.api_credits_limit > 0 else 0
            },
            "ai_agents": {
                "count": agents_count,
                "limit": organization.max_ai_agents
            },
            "workflows": {
                "count": workflows_count,
                "limit": organization.max_workflows
            },
            "leads": {
                "count": leads_count
            }
        }
    )
