from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.api.deps import (
    get_current_active_user,
    get_current_organization,
    check_agent_limit
)
from app.models.user import User
from app.models.organization import Organization
from app.models.ai_agent import AIAgent, AgentStatus
from app.schemas.ai_agent import AIAgent as AIAgentSchema, AIAgentCreate, AIAgentUpdate
from app.schemas.api_response import APIResponse, PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[AIAgentSchema])
async def list_agents(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all AI agents for current organization
    """
    # Query agents with multi-tenant filter
    result = await db.execute(
        select(AIAgent)
        .where(AIAgent.organization_id == organization.id)
        .offset(skip)
        .limit(limit)
    )
    agents = result.scalars().all()

    # Get total count
    count_result = await db.execute(
        select(AIAgent).where(AIAgent.organization_id == organization.id)
    )
    total = len(count_result.scalars().all())

    return PaginatedResponse(
        success=True,
        data=agents,
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        total_pages=(total + limit - 1) // limit
    )


@router.get("/{agent_id}", response_model=APIResponse[AIAgentSchema])
async def get_agent(
    agent_id: UUID,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get specific AI agent by ID
    """
    result = await db.execute(
        select(AIAgent).where(
            AIAgent.id == agent_id,
            AIAgent.organization_id == organization.id  # Multi-tenant filter
        )
    )
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI Agent not found"
        )

    return APIResponse(
        success=True,
        data=agent
    )


@router.post("", response_model=APIResponse[AIAgentSchema], status_code=status.HTTP_201_CREATED)
async def create_agent(
    agent_in: AIAgentCreate,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(check_agent_limit),  # Check limits
    db: AsyncSession = Depends(get_db)
):
    """
    Create new AI agent
    """
    agent = AIAgent(
        organization_id=organization.id,
        created_by=current_user.id,
        name=agent_in.name,
        description=agent_in.description,
        agent_type=agent_in.agent_type,
        system_prompt=agent_in.system_prompt,
        temperature=agent_in.temperature,
        max_tokens=agent_in.max_tokens,
        ai_model=agent_in.ai_model,
        tools=agent_in.tools,
        knowledge_base=agent_in.knowledge_base,
        tags=agent_in.tags,
        icon=agent_in.icon,
        color=agent_in.color,
        status=AgentStatus.INACTIVE
    )

    db.add(agent)
    await db.commit()
    await db.refresh(agent)

    return APIResponse(
        success=True,
        message="AI Agent created successfully",
        data=agent
    )


@router.put("/{agent_id}", response_model=APIResponse[AIAgentSchema])
async def update_agent(
    agent_id: UUID,
    agent_in: AIAgentUpdate,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Update AI agent
    """
    result = await db.execute(
        select(AIAgent).where(
            AIAgent.id == agent_id,
            AIAgent.organization_id == organization.id
        )
    )
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI Agent not found"
        )

    # Update fields
    update_data = agent_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(agent, field, value)

    await db.commit()
    await db.refresh(agent)

    return APIResponse(
        success=True,
        message="AI Agent updated successfully",
        data=agent
    )


@router.delete("/{agent_id}", response_model=APIResponse)
async def delete_agent(
    agent_id: UUID,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete AI agent
    """
    result = await db.execute(
        select(AIAgent).where(
            AIAgent.id == agent_id,
            AIAgent.organization_id == organization.id
        )
    )
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI Agent not found"
        )

    await db.delete(agent)
    await db.commit()

    return APIResponse(
        success=True,
        message="AI Agent deleted successfully"
    )


@router.post("/{agent_id}/execute", response_model=APIResponse)
async def execute_agent(
    agent_id: UUID,
    input_text: str,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Execute AI agent with input
    This is a placeholder - actual Gemini integration will be added later
    """
    result = await db.execute(
        select(AIAgent).where(
            AIAgent.id == agent_id,
            AIAgent.organization_id == organization.id,
            AIAgent.is_active == True
        )
    )
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI Agent not found or inactive"
        )

    # TODO: Integrate with Gemini API
    # For now, return placeholder response

    return APIResponse(
        success=True,
        message="AI Agent executed successfully (placeholder)",
        data={
            "agent_id": str(agent_id),
            "input": input_text,
            "output": "This is a placeholder response. Gemini integration coming soon.",
            "tokens_used": 0
        }
    )
