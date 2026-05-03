from sqlalchemy import Column, String, Boolean, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSON
import enum
from app.models.base import BaseModel


class IntegrationType(str, enum.Enum):
    LINKEDIN = "linkedin"
    GMAIL = "gmail"
    SLACK = "slack"
    HUBSPOT = "hubspot"
    SALESFORCE = "salesforce"
    STRIPE = "stripe"
    ZAPIER = "zapier"
    WEBHOOK = "webhook"
    CUSTOM_API = "custom_api"


class IntegrationStatus(str, enum.Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    PENDING = "pending"


class Integration(BaseModel):
    __tablename__ = "integrations"

    # Multi-tenant
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)

    # Basic Info
    name = Column(String(255), nullable=False)
    integration_type = Column(SQLEnum(IntegrationType), nullable=False)

    # Status
    status = Column(SQLEnum(IntegrationStatus), default=IntegrationStatus.DISCONNECTED, nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)

    # Configuration
    config = Column(JSON, nullable=True)  # Integration-specific settings
    credentials = Column(Text, nullable=True)  # Encrypted credentials

    # OAuth (if applicable)
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    token_expires_at = Column(String(50), nullable=True)

    # Webhook (if applicable)
    webhook_url = Column(String(500), nullable=True)
    webhook_secret = Column(String(255), nullable=True)

    # Usage Stats
    total_syncs = Column(String(10), default="0", nullable=False)
    last_sync_at = Column(String(50), nullable=True)
    last_error = Column(Text, nullable=True)

    # Metadata
    icon = Column(String(50), nullable=True)
    color = Column(String(20), nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="integrations")

    def __repr__(self):
        return f"<Integration {self.name}>"
