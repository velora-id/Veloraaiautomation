from sqlalchemy import Column, String, Boolean, Integer, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSON
import enum
from app.models.base import BaseModel


class WorkflowStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    RUNNING = "running"
    ERROR = "error"


class WorkflowTrigger(str, enum.Enum):
    MANUAL = "manual"
    SCHEDULE = "schedule"
    WEBHOOK = "webhook"
    EVENT = "event"


class Workflow(BaseModel):
    __tablename__ = "workflows"

    # Multi-tenant
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)

    # Basic Info
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Status
    status = Column(SQLEnum(WorkflowStatus), default=WorkflowStatus.INACTIVE, nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)

    # Trigger Configuration
    trigger_type = Column(SQLEnum(WorkflowTrigger), default=WorkflowTrigger.MANUAL, nullable=False)
    trigger_config = Column(JSON, nullable=True)  # Schedule, webhook URL, etc.

    # Workflow Definition (Visual Designer Output)
    nodes = Column(JSON, nullable=False)  # Array of workflow nodes
    edges = Column(JSON, nullable=False)  # Array of connections between nodes

    # Settings
    timeout_seconds = Column(Integer, default=300, nullable=False)
    max_retries = Column(Integer, default=3, nullable=False)
    retry_delay_seconds = Column(Integer, default=60, nullable=False)

    # Usage Stats
    total_executions = Column(Integer, default=0, nullable=False)
    successful_executions = Column(Integer, default=0, nullable=False)
    failed_executions = Column(Integer, default=0, nullable=False)
    last_executed_at = Column(String(50), nullable=True)

    # Metadata
    tags = Column(JSON, nullable=True)
    icon = Column(String(50), default="workflow", nullable=False)
    color = Column(String(20), default="blue", nullable=False)

    # Ownership
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="workflows")
    created_by_user = relationship("User", back_populates="workflows", foreign_keys=[created_by])

    def __repr__(self):
        return f"<Workflow {self.name}>"
