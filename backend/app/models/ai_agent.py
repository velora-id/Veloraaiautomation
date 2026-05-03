from sqlalchemy import Column, String, Boolean, Integer, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSON
import enum
from app.models.base import BaseModel


class AgentStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRAINING = "training"
    ERROR = "error"


class AgentType(str, enum.Enum):
    CUSTOMER_SUPPORT = "customer_support"
    LEAD_GENERATION = "lead_generation"
    CONTENT_CREATION = "content_creation"
    DATA_ANALYSIS = "data_analysis"
    CUSTOM = "custom"


class AIAgent(BaseModel):
    __tablename__ = "ai_agents"

    # Multi-tenant
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)

    # Basic Info
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    agent_type = Column(SQLEnum(AgentType), default=AgentType.CUSTOM, nullable=False)

    # Status
    status = Column(SQLEnum(AgentStatus), default=AgentStatus.INACTIVE, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Configuration
    system_prompt = Column(Text, nullable=False)
    temperature = Column(Integer, default=70, nullable=False)  # 0-100 scale
    max_tokens = Column(Integer, default=1000, nullable=False)
    ai_model = Column(String(100), default="gemini-pro", nullable=False)

    # Advanced Settings
    config = Column(JSON, nullable=True)  # Additional configuration as JSON
    tools = Column(JSON, nullable=True)  # Available tools/functions
    knowledge_base = Column(JSON, nullable=True)  # Knowledge base references

    # Usage Stats
    total_executions = Column(Integer, default=0, nullable=False)
    total_tokens_used = Column(Integer, default=0, nullable=False)
    success_rate = Column(Integer, default=0, nullable=False)  # Percentage

    # Metadata
    tags = Column(JSON, nullable=True)  # Array of tags
    icon = Column(String(50), default="bot", nullable=False)
    color = Column(String(20), default="purple", nullable=False)

    # Ownership
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="ai_agents")
    created_by_user = relationship("User", back_populates="ai_agents", foreign_keys=[created_by])
    usage_logs = relationship("UsageLog", back_populates="ai_agent", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<AIAgent {self.name}>"
