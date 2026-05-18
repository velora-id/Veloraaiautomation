"""
Integration services module
"""
from app.services.integrations.base import (
    BaseIntegration,
    IntegrationProvider,
    IntegrationError,
    IntegrationAuthError,
    IntegrationConnectionError,
    IntegrationExecutionError,
)
from app.services.integrations.stripe_integration import StripeIntegration
from app.services.integrations.mailgun_integration import MailgunIntegration
from app.services.integrations.slack_integration import SlackIntegration
from app.services.integrations.manager import IntegrationManager, integration_manager

__all__ = [
    "BaseIntegration",
    "IntegrationProvider",
    "IntegrationError",
    "IntegrationAuthError",
    "IntegrationConnectionError",
    "IntegrationExecutionError",
    "StripeIntegration",
    "MailgunIntegration",
    "SlackIntegration",
    "IntegrationManager",
    "integration_manager",
]
