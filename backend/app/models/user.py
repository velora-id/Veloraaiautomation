from sqlalchemy import Column, String, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import enum
from app.models.base import BaseModel


class UserRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"


class User(BaseModel):
    __tablename__ = "users"

    # Basic Info
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)

    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    # Organization & Role
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(SQLEnum(UserRole), default=UserRole.MEMBER, nullable=False)

    # Profile
    avatar_url = Column(String(500), nullable=True)
    phone = Column(String(20), nullable=True)
    timezone = Column(String(50), default="UTC", nullable=False)

    # Preferences
    theme = Column(String(20), default="light", nullable=False)
    notification_email = Column(Boolean, default=True, nullable=False)
    notification_push = Column(Boolean, default=True, nullable=False)

    # Relationships
    organization = relationship("Organization", back_populates="users")
    ai_agents = relationship("AIAgent", back_populates="created_by_user", foreign_keys="AIAgent.created_by")
    workflows = relationship("Workflow", back_populates="created_by_user", foreign_keys="Workflow.created_by")
    api_keys = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user")

    def __repr__(self):
        return f"<User {self.email}>"
