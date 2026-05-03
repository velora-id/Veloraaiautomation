from sqlalchemy import Column, String, Integer, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.models.base import BaseModel


class BillingPlan(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class Organization(BaseModel):
    __tablename__ = "organizations"

    # Basic Info
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)

    # Billing
    billing_plan = Column(SQLEnum(BillingPlan), default=BillingPlan.FREE, nullable=False)
    stripe_customer_id = Column(String(255), nullable=True)
    stripe_subscription_id = Column(String(255), nullable=True)

    # Usage Limits & Tracking
    api_credits_used = Column(Integer, default=0, nullable=False)
    api_credits_limit = Column(Integer, default=1000, nullable=False)  # Free plan default

    # Feature Limits
    max_ai_agents = Column(Integer, default=3, nullable=False)  # Free plan
    max_workflows = Column(Integer, default=5, nullable=False)  # Free plan
    max_team_members = Column(Integer, default=3, nullable=False)  # Free plan

    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    trial_ends_at = Column(String(50), nullable=True)

    # Settings
    settings = Column(String, nullable=True)  # JSON string

    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    ai_agents = relationship("AIAgent", back_populates="organization", cascade="all, delete-orphan")
    workflows = relationship("Workflow", back_populates="organization", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="organization", cascade="all, delete-orphan")
    integrations = relationship("Integration", back_populates="organization", cascade="all, delete-orphan")
    usage_logs = relationship("UsageLog", back_populates="organization", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="organization", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Organization {self.name}>"
