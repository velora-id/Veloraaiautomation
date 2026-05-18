"""
Integration manager to manage all integrations
"""
from typing import Dict, Any, Optional, Type
from app.services.integrations.base import (
    BaseIntegration,
    IntegrationProvider,
    IntegrationError
)
from app.services.integrations.stripe_integration import StripeIntegration
from app.services.integrations.mailgun_integration import MailgunIntegration
from app.services.integrations.slack_integration import SlackIntegration


class IntegrationManager:
    """Manager for handling all integrations"""

    # Map of provider to integration class
    PROVIDERS: Dict[IntegrationProvider, Type[BaseIntegration]] = {
        IntegrationProvider.STRIPE: StripeIntegration,
        IntegrationProvider.MAILGUN: MailgunIntegration,
        IntegrationProvider.SLACK: SlackIntegration,
    }

    _instances: Dict[str, BaseIntegration] = {}

    @classmethod
    def get_provider(cls, provider: IntegrationProvider) -> Type[BaseIntegration]:
        """Get integration class for provider"""
        if provider not in cls.PROVIDERS:
            raise IntegrationError(f"Unsupported provider: {provider}")
        return cls.PROVIDERS[provider]

    @classmethod
    def create_integration(
        cls,
        provider: IntegrationProvider,
        api_key: str,
        **kwargs
    ) -> BaseIntegration:
        """Create integration instance"""
        integration_class = cls.get_provider(provider)
        return integration_class(api_key, **kwargs)

    @classmethod
    async def get_or_create(
        cls,
        integration_id: str,
        provider: IntegrationProvider,
        api_key: str,
        **kwargs
    ) -> BaseIntegration:
        """Get or create integration instance with caching"""
        if integration_id not in cls._instances:
            cls._instances[integration_id] = cls.create_integration(
                provider, api_key, **kwargs
            )
        return cls._instances[integration_id]

    @classmethod
    def clear_cache(cls, integration_id: Optional[str] = None) -> None:
        """Clear integration cache"""
        if integration_id:
            cls._instances.pop(integration_id, None)
        else:
            cls._instances.clear()

    @classmethod
    def list_providers(cls) -> Dict[str, Dict[str, Any]]:
        """List all available providers and their schemas"""
        result = {}
        for provider in IntegrationProvider:
            try:
                integration_class = cls.get_provider(provider)
                # Create dummy instance to get schema
                dummy_instance = integration_class("dummy_key")
                result[provider.value] = dummy_instance.get_schema()
            except Exception:
                pass
        return result

    @classmethod
    async def verify_integration(
        cls,
        provider: IntegrationProvider,
        api_key: str,
        **kwargs
    ) -> bool:
        """Verify integration credentials"""
        integration = cls.create_integration(provider, api_key, **kwargs)
        return await integration.verify_credentials()

    @classmethod
    async def test_integration(
        cls,
        provider: IntegrationProvider,
        api_key: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Test integration connection"""
        integration = cls.create_integration(provider, api_key, **kwargs)
        return await integration.test_connection()

    @classmethod
    async def execute_action(
        cls,
        integration_id: str,
        provider: IntegrationProvider,
        api_key: str,
        action: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Execute action on integration"""
        integration = await cls.get_or_create(
            integration_id, provider, api_key, **kwargs
        )
        return await integration.execute(action, **kwargs)


# Singleton instance
integration_manager = IntegrationManager()
