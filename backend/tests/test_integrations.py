"""
Test suite for integration services
"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
import json

from app.services.integrations.base import (
    IntegrationProvider,
    IntegrationError,
    IntegrationAuthError,
    IntegrationConnectionError
)
from app.services.integrations.manager import IntegrationManager
from app.services.integrations.stripe_integration import StripeIntegration
from app.services.integrations.mailgun_integration import MailgunIntegration
from app.services.integrations.slack_integration import SlackIntegration


class TestIntegrationManager:
    """Test IntegrationManager"""

    def test_get_provider_stripe(self):
        """Test getting Stripe provider"""
        provider_class = IntegrationManager.get_provider(IntegrationProvider.STRIPE)
        assert provider_class == StripeIntegration

    def test_get_provider_mailgun(self):
        """Test getting Mailgun provider"""
        provider_class = IntegrationManager.get_provider(IntegrationProvider.MAILGUN)
        assert provider_class == MailgunIntegration

    def test_get_provider_slack(self):
        """Test getting Slack provider"""
        provider_class = IntegrationManager.get_provider(IntegrationProvider.SLACK)
        assert provider_class == SlackIntegration

    def test_get_unsupported_provider(self):
        """Test getting unsupported provider raises error"""
        with pytest.raises(IntegrationError):
            IntegrationManager.get_provider(IntegrationProvider.CUSTOM)

    def test_create_integration(self):
        """Test creating integration instance"""
        integration = IntegrationManager.create_integration(
            IntegrationProvider.STRIPE,
            "sk_test_123"
        )

        assert isinstance(integration, StripeIntegration)
        assert integration.api_key == "sk_test_123"

    @pytest.mark.asyncio
    async def test_get_or_create_caching(self):
        """Test get_or_create caching"""
        IntegrationManager.clear_cache()

        integration1 = await IntegrationManager.get_or_create(
            "integration_1",
            IntegrationProvider.STRIPE,
            "sk_test_123"
        )

        integration2 = await IntegrationManager.get_or_create(
            "integration_1",
            IntegrationProvider.STRIPE,
            "sk_test_123"
        )

        assert integration1 is integration2

    def test_clear_cache(self):
        """Test clearing cache"""
        # First, clear all cache to ensure clean state
        IntegrationManager.clear_cache()

        # Create some integrations
        IntegrationManager.create_integration(IntegrationProvider.STRIPE, "sk_test_123")

        # Clear specific integration by ID
        IntegrationManager.clear_cache("some_id")

        # Clear all cache
        IntegrationManager.clear_cache()
        assert len(IntegrationManager._instances) == 0

    def test_list_providers(self):
        """Test listing all providers"""
        providers = IntegrationManager.list_providers()

        assert "stripe" in providers
        assert "mailgun" in providers
        assert "slack" in providers

        assert "name" in providers["stripe"]
        assert "fields" in providers["stripe"]
        assert "actions" in providers["stripe"]


class TestStripeIntegration:
    """Test Stripe integration"""

    @pytest.fixture
    def stripe_integration(self):
        """Create Stripe integration instance"""
        return StripeIntegration("sk_test_123")

    def test_stripe_provider(self, stripe_integration):
        """Test Stripe provider"""
        assert stripe_integration.provider == IntegrationProvider.STRIPE
        assert stripe_integration.name == "Stripe"

    def test_stripe_schema(self, stripe_integration):
        """Test Stripe schema"""
        schema = stripe_integration.get_schema()

        assert schema["provider"] == "stripe"
        assert len(schema["fields"]) > 0
        assert len(schema["actions"]) > 0

        field_names = [f["name"] for f in schema["fields"]]
        assert "api_key" in field_names


class TestMailgunIntegration:
    """Test Mailgun integration"""

    @pytest.fixture
    def mailgun_integration(self):
        """Create Mailgun integration instance"""
        return MailgunIntegration("mg_test_123", domain="example.com")

    def test_mailgun_provider(self, mailgun_integration):
        """Test Mailgun provider"""
        assert mailgun_integration.provider == IntegrationProvider.MAILGUN
        assert mailgun_integration.name == "Mailgun"
        assert mailgun_integration.domain == "example.com"

    def test_mailgun_schema(self, mailgun_integration):
        """Test Mailgun schema"""
        schema = mailgun_integration.get_schema()

        assert schema["provider"] == "mailgun"
        assert len(schema["fields"]) == 2  # api_key + domain
        assert len(schema["actions"]) > 0


class TestSlackIntegration:
    """Test Slack integration"""

    @pytest.fixture
    def slack_integration(self):
        """Create Slack integration instance"""
        return SlackIntegration("xoxb_test_token")

    def test_slack_provider(self, slack_integration):
        """Test Slack provider"""
        assert slack_integration.provider == IntegrationProvider.SLACK
        assert slack_integration.name == "Slack"

    def test_slack_schema(self, slack_integration):
        """Test Slack schema"""
        schema = slack_integration.get_schema()

        assert schema["provider"] == "slack"
        assert len(schema["fields"]) > 0
        assert len(schema["actions"]) > 0

        action_names = [a["name"] for a in schema["actions"]]
        assert "send_message" in action_names
        assert "get_channels" in action_names


class TestIntegrationErrors:
    """Test integration error handling"""

    def test_integration_error(self):
        """Test IntegrationError"""
        with pytest.raises(IntegrationError):
            raise IntegrationError("Test error")

    def test_integration_auth_error(self):
        """Test IntegrationAuthError"""
        with pytest.raises(IntegrationAuthError):
            raise IntegrationAuthError("Auth failed")

    def test_integration_connection_error(self):
        """Test IntegrationConnectionError"""
        with pytest.raises(IntegrationConnectionError):
            raise IntegrationConnectionError("Connection failed")


class TestIntegrationMocking:
    """Test integration behavior with mocking"""

    @pytest.mark.asyncio
    async def test_mocked_stripe_payment_creation(self):
        """Test mocked Stripe payment creation"""
        integration = StripeIntegration("sk_test_123")

        with patch('app.services.integrations.stripe_integration.stripe') as mock_stripe:
            mock_stripe.PaymentIntent.create.return_value = Mock(
                id="pi_test_123",
                amount=1000,
                currency="usd",
                status="succeeded",
                client_secret="secret_123"
            )

            result = await integration._create_payment(
                amount=10.0,
                currency="usd",
                description="Test payment"
            )

            assert result["id"] == "pi_test_123"
            assert result["amount"] == 10.0
            assert result["status"] == "succeeded"

    @pytest.mark.asyncio
    async def test_mocked_mailgun_send_email(self):
        """Test mocked Mailgun email sending"""
        integration = MailgunIntegration("mg_test_123", domain="example.com")

        with patch('app.services.integrations.mailgun_integration.requests') as mock_requests:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {"id": "msg_test_123"}
            mock_requests.post.return_value = mock_response

            result = await integration._send_email(
                to="user@example.com",
                subject="Test",
                text="Test message"
            )

            assert result["status"] == "sent"
            assert result["recipient"] == "user@example.com"

    @pytest.mark.asyncio
    async def test_mocked_slack_send_message(self):
        """Test mocked Slack message sending"""
        integration = SlackIntegration("xoxb_test_token")

        with patch('app.services.integrations.slack_integration.requests') as mock_requests:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {"ok": True, "channel": "C123", "ts": "1234567890.123456"}
            mock_requests.post.return_value = mock_response

            result = await integration._send_message(
                channel="#general",
                text="Hello Slack!"
            )

            assert result["status"] == "sent"
            assert result["channel"] == "C123"
