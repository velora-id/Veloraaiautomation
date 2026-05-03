from sqlalchemy import Column, String, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSON
import enum
from app.models.base import BaseModel
from sqlalchemy.orm import relationship


class ActivityType(str, enum.Enum):
    AGENT = "agent"
    WORKFLOW = "workflow"
    LEAD = "lead"
    INTEGRATION = "integration"
    TEAM = "team"
    SYSTEM = "system"


class ActivityLog(BaseModel):
    __tablename__ = "activity_logs"

    # Multi-tenant
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Activity Info
    activity_type = Column(SQLEnum(ActivityType), nullable=False)
    action = Column(String(100), nullable=False)  # created, updated, deleted, executed, etc.
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Status Badge
    status = Column(String(20), nullable=True)  # completed, failed, pending, etc.

    # Entity Reference
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    entity_type = Column(String(50), nullable=True)  # agent, workflow, lead, etc.

    # Metadata
    metadata = Column(JSON, nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="activity_logs")
    user = relationship("User", back_populates="activity_logs")

    def __repr__(self):
        return f"<ActivityLog {self.title}>"
