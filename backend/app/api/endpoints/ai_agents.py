from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID
from time import perf_counter

from app.core.database import get_db
from app.api.deps import (
    get_current_active_user,
    get_current_organization,
    check_agent_limit
)
from app.models.user import User
from app.models.organization import Organization
from app.models.ai_agent import AIAgent, AgentStatus
from app.models.usage_log import UsageLog, UsageType
from app.schemas.ai_agent import (
    AIAgent as AIAgentSchema,
    AIAgentCreate,
    AIAgentUpdate,
    AIAgentExecuteRequest,
    AIAgentExecuteResponse,
)
from app.schemas.api_response import APIResponse, PaginatedResponse
from app.services.gemini_service import gemini_service

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


@router.post("/{agent_id}/execute", response_model=APIResponse[AIAgentExecuteResponse])
async def execute_agent(
    agent_id: UUID,
    payload: AIAgentExecuteRequest,
    current_user: User = Depends(get_current_active_user),
    organization: Organization = Depends(get_current_organization),
    db: AsyncSession = Depends(get_db)
):
    """
    Execute AI agent with input
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

    start_time = perf_counter()

    try:
        response = await gemini_service.generate_text(
            prompt=payload.input_text,
            system_prompt=agent.system_prompt,
            temperature=agent.temperature / 100.0,
            max_tokens=agent.max_tokens,
            model_name=agent.ai_model,
        )
        duration_ms = int((perf_counter() - start_time) * 1000)
        tokens_used = int(response.get("tokens_used", 0))

        previous_executions = agent.total_executions
        previous_successes = round((agent.success_rate / 100) * previous_executions)
        agent.total_executions = previous_executions + 1
        agent.total_tokens_used += tokens_used
        agent.success_rate = round(((previous_successes + 1) / agent.total_executions) * 100)

        credits_charged = max(1, tokens_used)
        organization.api_credits_used += credits_charged

        db.add(UsageLog(
            organization_id=organization.id,
            usage_type=UsageType.AI_AGENT,
            ai_agent_id=agent.id,
            tokens_used=tokens_used,
            credits_charged=credits_charged,
            model=response.get("model", agent.ai_model),
            duration_ms=duration_ms,
            status="success",
            extra_metadata={
                "input_length": len(payload.input_text),
                "context": payload.context or {},
            },
        ))

        await db.commit()

        return APIResponse(
            success=True,
            message="AI Agent executed successfully",
            data=AIAgentExecuteResponse(
                agent_id=agent.id,
                input=payload.input_text,
                output=response["text"],
                model=response.get("model", agent.ai_model),
                tokens_used=tokens_used,
                prompt_tokens=int(response.get("prompt_tokens", 0)),
                completion_tokens=int(response.get("completion_tokens", 0)),
                duration_ms=duration_ms,
            )
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )

    except Exception as e:
        duration_ms = int((perf_counter() - start_time) * 1000)
        agent.total_executions += 1
        agent.success_rate = round(
            ((agent.success_rate / 100) * (agent.total_executions - 1) / agent.total_executions) * 100
        )

        db.add(UsageLog(
            organization_id=organization.id,
            usage_type=UsageType.AI_AGENT,
            ai_agent_id=agent.id,
            tokens_used=0,
            credits_charged=0,
            model=agent.ai_model,
            duration_ms=duration_ms,
            status="error",
            error_message=str(e),
            extra_metadata={
                "input_length": len(payload.input_text),
                "context": payload.context or {},
            },
        ))

        await db.commit()

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI provider error: {str(e)}"
        )
