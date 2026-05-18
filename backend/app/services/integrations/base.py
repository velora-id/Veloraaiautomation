"""
Base integration service for handling third-party API integrations
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from enum import Enum


class IntegrationProvider(str, Enum):
    """Supported integration providers"""
    STRIPE = "stripe"
    MAILGUN = "mailgun"
    SLACK = "slack"
    TWILIO = "twilio"
    SENDGRID = "sendgrid"
    ZAPIER = "zapier"
    GITHUB = "github"
    CUSTOM = "custom"


class BaseIntegration(ABC):
    """Abstract base class for all integrations"""

    provider: IntegrationProvider
    name: str
    description: str

    def __init__(self, api_key: str, **kwargs):
        """
        Initialize integration with API key

        Args:
            api_key: API key for the service
            **kwargs: Additional configuration parameters
        """
        self.api_key = api_key
        self.config = kwargs

    @abstractmethod
    async def verify_credentials(self) -> bool:
        """Verify that the API credentials are valid"""
        pass

    @abstractmethod
    async def test_connection(self) -> Dict[str, Any]:
        """Test connection to the service"""
        pass

    @abstractmethod
    async def execute(self, action: str, **kwargs) -> Dict[str, Any]:
        """
        Execute an action with the integration

        Args:
            action: Action to execute
            **kwargs: Action parameters

        Returns:
            Result of the action
        """
        pass

    def get_schema(self) -> Dict[str, Any]:
        """Get schema for integration configuration"""
        return {
            "provider": self.provider.value,
            "name": self.name,
            "description": self.description,
            "fields": []
        }


class IntegrationError(Exception):
    """Base exception for integration errors"""
    pass


class IntegrationAuthError(IntegrationError):
    """Authentication error with integration"""
    pass


class IntegrationConnectionError(IntegrationError):
    """Connection error with integration"""
    pass


class IntegrationExecutionError(IntegrationError):
    """Error executing action with integration"""
    pass
