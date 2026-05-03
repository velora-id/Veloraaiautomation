from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class OrganizationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=100, pattern="^[a-z0-9-]+$")


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    billing_plan: Optional[str] = Field(None, pattern="^(free|pro|enterprise)$")


class Organization(OrganizationBase):
    id: UUID
    billing_plan: str
    api_credits_used: int
    api_credits_limit: int
    max_ai_agents: int
    max_workflows: int
    max_team_members: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
