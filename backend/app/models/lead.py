from sqlalchemy import Column, String, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSON
import enum
from app.models.base import BaseModel


class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    CONVERTED = "converted"
    LOST = "lost"


class LeadSource(str, enum.Enum):
    LINKEDIN = "linkedin"
    EMAIL = "email"
    WEBSITE = "website"
    REFERRAL = "referral"
    MANUAL = "manual"
    AI_AGENT = "ai_agent"
    WORKFLOW = "workflow"
    OTHER = "other"


class Lead(BaseModel):
    __tablename__ = "leads"

    # Multi-tenant
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)

    # Basic Info
    email = Column(String(255), nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    job_title = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)

    # Status & Source
    status = Column(SQLEnum(LeadStatus), default=LeadStatus.NEW, nullable=False)
    source = Column(SQLEnum(LeadSource), default=LeadSource.MANUAL, nullable=False)

    # Location
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)

    # Additional Data
    linkedin_url = Column(String(500), nullable=True)
    website = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)

    # Scoring & Engagement
    lead_score = Column(String(10), default="0", nullable=False)  # 0-100
    last_contacted_at = Column(String(50), nullable=True)

    # Metadata
    custom_fields = Column(JSON, nullable=True)  # Flexible custom data
    tags = Column(JSON, nullable=True)

    # Source Tracking
    workflow_id = Column(UUID(as_uuid=True), nullable=True)
    agent_id = Column(UUID(as_uuid=True), nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="leads")

    def __repr__(self):
        return f"<Lead {self.email}>"
