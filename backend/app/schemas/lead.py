from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class LeadBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=255)
    company: Optional[str] = Field(None, max_length=255)
    job_title: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    city: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    linkedin_url: Optional[str] = Field(None, max_length=500)
    website: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = None


class LeadCreate(LeadBase):
    source: str = Field("manual", pattern="^(linkedin|email|website|referral|manual|ai_agent|workflow|other)$")
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None


class LeadUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=255)
    company: Optional[str] = Field(None, max_length=255)
    job_title: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    status: Optional[str] = Field(None, pattern="^(new|contacted|qualified|converted|lost)$")
    city: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    linkedin_url: Optional[str] = Field(None, max_length=500)
    website: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = None
    lead_score: Optional[int] = Field(None, ge=0, le=100)
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None


class Lead(LeadBase):
    id: UUID
    organization_id: UUID
    status: str
    source: str
    lead_score: str
    last_contacted_at: Optional[str] = None
    workflow_id: Optional[UUID] = None
    agent_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
