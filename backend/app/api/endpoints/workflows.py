from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID
from datetime import datetime

from app.core.database import get_db
from app.api.deps import (
    get_current_active_user,
    get_current_organization,
    check_workflow_limit
)
from app.models.user import User
from app.models.organization import Organization
from app.models.workflow import Workflow, WorkflowStatus
from app.schemas.workflow import Workflow as WorkflowSchema, WorkflowCreate, WorkflowUpdate
from app.schemas.api_response import APIResponse, PaginatedResponse
from app.services.workflow_service import workflow_service

router = APIRouter()


@router.get("", response_model=PaginatedResponse[WorkflowSchema])
async def list_workflows(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all workflows for current organization
    """
    result = await db.execute(
        select(Workflow)
        .where(Workflow.organization_id == organization.id)
        .offset(skip)
        .limit(limit)
    )
    workflows = result.scalars().all()

    count_result = await db.execute(
        select(Workflow).where(Workflow.organization_id == organization.id)
    )
    total = len(count_result.scalars().all())

    return PaginatedResponse(
        success=True,
        data=workflows,
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        total_pages=(total + limit - 1) // limit
    )


@router.get("/{workflow_id}", response_model=APIResponse[WorkflowSchema])
async def get_workflow(
    workflow_id: UUID,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get specific workflow by ID
    """
    result = await db.execute(
        select(Workflow).where(
            Workflow.id == workflow_id,
            Workflow.organization_id == organization.id
        )
    )
    workflow = result.scalar_one_or_none()

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )

    return APIResponse(
        success=True,
        data=workflow
    )


@router.post("", response_model=APIResponse[WorkflowSchema], status_code=status.HTTP_201_CREATED)
async def create_workflow(
    workflow_in: WorkflowCreate,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(check_workflow_limit),
    db: AsyncSession = Depends(get_db)
):
    """
    Create new workflow
    """
    workflow = Workflow(
        organization_id=organization.id,
        created_by=current_user.id,
        name=workflow_in.name,
        description=workflow_in.description,
        trigger_type=workflow_in.trigger_type,
        trigger_config=workflow_in.trigger_config,
        nodes=workflow_in.nodes,
        edges=workflow_in.edges,
        timeout_seconds=workflow_in.timeout_seconds,
        max_retries=workflow_in.max_retries,
        retry_delay_seconds=workflow_in.retry_delay_seconds,
        tags=workflow_in.tags,
        icon=workflow_in.icon,
        color=workflow_in.color,
        status=WorkflowStatus.INACTIVE
    )

    db.add(workflow)
    await db.commit()
    await db.refresh(workflow)

    return APIResponse(
        success=True,
        message="Workflow created successfully",
        data=workflow
    )


@router.put("/{workflow_id}", response_model=APIResponse[WorkflowSchema])
async def update_workflow(
    workflow_id: UUID,
    workflow_in: WorkflowUpdate,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Update workflow
    """
    result = await db.execute(
        select(Workflow).where(
            Workflow.id == workflow_id,
            Workflow.organization_id == organization.id
        )
    )
    workflow = result.scalar_one_or_none()

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )

    update_data = workflow_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(workflow, field, value)

    await db.commit()
    await db.refresh(workflow)

    return APIResponse(
        success=True,
        message="Workflow updated successfully",
        data=workflow
    )


@router.delete("/{workflow_id}", response_model=APIResponse)
async def delete_workflow(
    workflow_id: UUID,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete workflow
    """
    result = await db.execute(
        select(Workflow).where(
            Workflow.id == workflow_id,
            Workflow.organization_id == organization.id
        )
    )
    workflow = result.scalar_one_or_none()

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )

    await db.delete(workflow)
    await db.commit()

    return APIResponse(
        success=True,
        message="Workflow deleted successfully"
    )


@router.post("/{workflow_id}/execute", response_model=APIResponse)
async def execute_workflow(
    workflow_id: UUID,
    input_data: dict | None = None,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Execute workflow
    """
    result = await db.execute(
        select(Workflow).where(
            Workflow.id == workflow_id,
            Workflow.organization_id == organization.id,
            Workflow.is_active == True
        )
    )
    workflow = result.scalar_one_or_none()

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found or inactive"
        )

    execution_result = await workflow_service.execute_workflow(
        workflow=workflow,
        input_data=input_data or {},
        db=db
    )

    workflow.total_executions += 1
    workflow.last_executed_at = datetime.utcnow().isoformat()

    if execution_result.get("status") == "completed":
        workflow.successful_executions += 1
    else:
        workflow.failed_executions += 1

    await db.commit()
    await db.refresh(workflow)

    return APIResponse(
        success=True,
        message="Workflow executed successfully",
        data=execution_result
    )
