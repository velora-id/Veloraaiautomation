from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class WorkflowBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    trigger_type: str = Field("manual", pattern="^(manual|schedule|webhook|event)$")
    nodes: List[Dict[str, Any]] = Field(..., min_items=1)
    edges: List[Dict[str, Any]] = Field(default_factory=list)
    icon: str = Field("workflow", max_length=50)
    color: str = Field("blue", max_length=20)


class WorkflowCreate(WorkflowBase):
    trigger_config: Optional[Dict[str, Any]] = None
    timeout_seconds: int = Field(300, ge=30, le=3600)
    max_retries: int = Field(3, ge=0, le=10)
    retry_delay_seconds: int = Field(60, ge=10, le=600)
    tags: Optional[List[str]] = None


class WorkflowUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    trigger_type: Optional[str] = Field(None, pattern="^(manual|schedule|webhook|event)$")
    trigger_config: Optional[Dict[str, Any]] = None
    nodes: Optional[List[Dict[str, Any]]] = Field(None, min_items=1)
    edges: Optional[List[Dict[str, Any]]] = None
    status: Optional[str] = Field(None, pattern="^(active|inactive|running|error)$")
    is_active: Optional[bool] = None
    timeout_seconds: Optional[int] = Field(None, ge=30, le=3600)
    max_retries: Optional[int] = Field(None, ge=0, le=10)
    retry_delay_seconds: Optional[int] = Field(None, ge=10, le=600)
    tags: Optional[List[str]] = None
    icon: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, max_length=20)


class Workflow(WorkflowBase):
    id: UUID
    organization_id: UUID
    status: str
    is_active: bool
    trigger_config: Optional[Dict[str, Any]] = None
    timeout_seconds: int
    max_retries: int
    retry_delay_seconds: int
    total_executions: int
    successful_executions: int
    failed_executions: int
    last_executed_at: Optional[str] = None
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    tags: Optional[List[str]] = None

    class Config:
        from_attributes = True
