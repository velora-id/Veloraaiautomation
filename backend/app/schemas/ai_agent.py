from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class AIAgentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    agent_type: str = Field(..., pattern="^(customer_support|lead_generation|content_creation|data_analysis|custom)$")
    system_prompt: str = Field(..., min_length=1)
    temperature: int = Field(70, ge=0, le=100)
    max_tokens: int = Field(1000, ge=100, le=8000)
    ai_model: str = Field("gemini-pro", max_length=100)
    icon: str = Field("bot", max_length=50)
    color: str = Field("purple", max_length=20)


class AIAgentCreate(AIAgentBase):
    tools: Optional[List[Dict[str, Any]]] = None
    knowledge_base: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None


class AIAgentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    agent_type: Optional[str] = Field(None, pattern="^(customer_support|lead_generation|content_creation|data_analysis|custom)$")
    system_prompt: Optional[str] = Field(None, min_length=1)
    temperature: Optional[int] = Field(None, ge=0, le=100)
    max_tokens: Optional[int] = Field(None, ge=100, le=8000)
    ai_model: Optional[str] = Field(None, max_length=100)
    status: Optional[str] = Field(None, pattern="^(active|inactive|training|error)$")
    is_active: Optional[bool] = None
    tools: Optional[List[Dict[str, Any]]] = None
    knowledge_base: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    icon: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, max_length=20)


class AIAgentExecuteRequest(BaseModel):
    input_text: str = Field(..., min_length=1)
    context: Optional[Dict[str, Any]] = None


class AIAgentExecuteResponse(BaseModel):
    agent_id: UUID
    input: str
    output: str
    model: str
    tokens_used: int
    prompt_tokens: int
    completion_tokens: int
    duration_ms: int


class AIAgent(AIAgentBase):
    id: UUID
    organization_id: UUID
    status: str
    is_active: bool
    total_executions: int
    total_tokens_used: int
    success_rate: int
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    tools: Optional[List[Dict[str, Any]]] = None
    knowledge_base: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None

    class Config:
        from_attributes = True
