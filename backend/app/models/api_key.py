from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import BaseModel


class APIKey(BaseModel):
    __tablename__ = "api_keys"

    # Multi-tenant
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Key Info
    name = Column(String(255), nullable=False)
    key_hash = Column(String(255), unique=True, index=True, nullable=False)  # Hashed API key
    key_prefix = Column(String(20), nullable=False)  # First 8 chars for display (e.g., "vla_1234...")

    # Status
    is_active = Column(Boolean, default=True, nullable=False)

    # Usage Tracking
    last_used_at = Column(String(50), nullable=True)
    total_requests = Column(String(10), default="0", nullable=False)

    # Expiration
    expires_at = Column(String(50), nullable=True)

    # Relationships
    user = relationship("User", back_populates="api_keys")

    def __repr__(self):
        return f"<APIKey {self.key_prefix}...>"
