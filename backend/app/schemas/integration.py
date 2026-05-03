from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


class IntegrationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    integration_type: str = Field(..., pattern="^(linkedin|gmail|slack|hubspot|salesforce|stripe|zapier|webhook|custom_api)$")


class IntegrationCreate(IntegrationBase):
    config: Optional[Dict[str, Any]] = None
    webhook_url: Optional[str] = Field(None, max_length=500)


class IntegrationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    status: Optional[str] = Field(None, pattern="^(connected|disconnected|error|pending)$")
    is_active: Optional[bool] = None
    config: Optional[Dict[str, Any]] = None
    webhook_url: Optional[str] = Field(None, max_length=500)


class Integration(IntegrationBase):
    id: UUID
    organization_id: UUID
    status: str
    is_active: bool
    config: Optional[Dict[str, Any]] = None
    webhook_url: Optional[str] = None
    total_syncs: str
    last_sync_at: Optional[str] = None
    last_error: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
