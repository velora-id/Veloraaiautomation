from sqlalchemy import Column, String, Integer, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSON
import enum
from app.models.base import BaseModel


class UsageType(str, enum.Enum):
    AI_AGENT = "ai_agent"
    WORKFLOW = "workflow"
    API_CALL = "api_call"


class UsageLog(BaseModel):
    __tablename__ = "usage_logs"

    # Multi-tenant
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)

    # Usage Type & Reference
    usage_type = Column(SQLEnum(UsageType), nullable=False)
    ai_agent_id = Column(UUID(as_uuid=True), ForeignKey("ai_agents.id", ondelete="SET NULL"), nullable=True)
    workflow_id = Column(UUID(as_uuid=True), nullable=True)

    # Usage Details
    tokens_used = Column(Integer, default=0, nullable=False)
    credits_charged = Column(Integer, default=0, nullable=False)

    # Request Details
    model = Column(String(100), nullable=True)
    duration_ms = Column(Integer, nullable=True)
    status = Column(String(20), nullable=False)  # success, error, timeout

    # Error Info (if applicable)
    error_message = Column(Text, nullable=True)

    # Metadata
    extra_metadata = Column(JSON, nullable=True)  # Additional context

    # Relationships
    organization = relationship("Organization", back_populates="usage_logs")
    ai_agent = relationship("AIAgent", back_populates="usage_logs")

    def __repr__(self):
        return f"<UsageLog {self.usage_type}>"
