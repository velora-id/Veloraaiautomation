from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.api.deps import get_current_active_user, get_current_organization
from app.models.user import User
from app.models.organization import Organization
from app.models.lead import Lead, LeadStatus
from app.schemas.lead import Lead as LeadSchema, LeadCreate, LeadUpdate
from app.schemas.api_response import APIResponse, PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[LeadSchema])
async def list_leads(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None, pattern="^(new|contacted|qualified|converted|lost)$"),
    source: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all leads for current organization with optional filters
    """
    query = select(Lead).where(Lead.organization_id == organization.id)

    if status:
        query = query.where(Lead.status == status)
    if source:
        query = query.where(Lead.source == source)

    result = await db.execute(query.offset(skip).limit(limit))
    leads = result.scalars().all()

    count_result = await db.execute(query)
    total = len(count_result.scalars().all())

    return PaginatedResponse(
        success=True,
        data=leads,
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        total_pages=(total + limit - 1) // limit
    )


@router.get("/{lead_id}", response_model=APIResponse[LeadSchema])
async def get_lead(
    lead_id: UUID,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get specific lead by ID
    """
    result = await db.execute(
        select(Lead).where(
            Lead.id == lead_id,
            Lead.organization_id == organization.id
        )
    )
    lead = result.scalar_one_or_none()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )

    return APIResponse(
        success=True,
        data=lead
    )


@router.post("", response_model=APIResponse[LeadSchema], status_code=status.HTTP_201_CREATED)
async def create_lead(
    lead_in: LeadCreate,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Create new lead
    """
    # Check if lead with same email exists
    result = await db.execute(
        select(Lead).where(
            Lead.email == lead_in.email,
            Lead.organization_id == organization.id
        )
    )
    existing_lead = result.scalar_one_or_none()

    if existing_lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lead with this email already exists"
        )

    lead = Lead(
        organization_id=organization.id,
        email=lead_in.email,
        full_name=lead_in.full_name,
        company=lead_in.company,
        job_title=lead_in.job_title,
        phone=lead_in.phone,
        city=lead_in.city,
        country=lead_in.country,
        linkedin_url=lead_in.linkedin_url,
        website=lead_in.website,
        notes=lead_in.notes,
        source=lead_in.source,
        tags=lead_in.tags,
        custom_fields=lead_in.custom_fields,
        status=LeadStatus.NEW
    )

    db.add(lead)
    await db.commit()
    await db.refresh(lead)

    return APIResponse(
        success=True,
        message="Lead created successfully",
        data=lead
    )


@router.put("/{lead_id}", response_model=APIResponse[LeadSchema])
async def update_lead(
    lead_id: UUID,
    lead_in: LeadUpdate,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Update lead
    """
    result = await db.execute(
        select(Lead).where(
            Lead.id == lead_id,
            Lead.organization_id == organization.id
        )
    )
    lead = result.scalar_one_or_none()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )

    update_data = lead_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lead, field, value)

    await db.commit()
    await db.refresh(lead)

    return APIResponse(
        success=True,
        message="Lead updated successfully",
        data=lead
    )


@router.delete("/{lead_id}", response_model=APIResponse)
async def delete_lead(
    lead_id: UUID,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete lead
    """
    result = await db.execute(
        select(Lead).where(
            Lead.id == lead_id,
            Lead.organization_id == organization.id
        )
    )
    lead = result.scalar_one_or_none()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )

    await db.delete(lead)
    await db.commit()

    return APIResponse(
        success=True,
        message="Lead deleted successfully"
    )


@router.post("/bulk", response_model=APIResponse)
async def create_leads_bulk(
    leads_in: List[LeadCreate],
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Create multiple leads at once
    """
    created_leads = []
    errors = []

    for lead_data in leads_in:
        try:
            # Check if lead exists
            result = await db.execute(
                select(Lead).where(
                    Lead.email == lead_data.email,
                    Lead.organization_id == organization.id
                )
            )
            if result.scalar_one_or_none():
                errors.append(f"Lead with email {lead_data.email} already exists")
                continue

            lead = Lead(
                organization_id=organization.id,
                **lead_data.model_dump(),
                status=LeadStatus.NEW
            )
            db.add(lead)
            created_leads.append(lead)

        except Exception as e:
            errors.append(f"Error creating lead {lead_data.email}: {str(e)}")

    await db.commit()

    return APIResponse(
        success=len(errors) == 0,
        message=f"Created {len(created_leads)} leads",
        data={
            "created": len(created_leads),
            "errors": errors
        }
    )
