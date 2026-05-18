"""
Stripe integration service for payment processing
"""
import stripe
from typing import Dict, Any, Optional, List
from datetime import datetime
from app.services.integrations.base import (
    BaseIntegration,
    IntegrationProvider,
    IntegrationError,
    IntegrationAuthError,
    IntegrationExecutionError
)


class StripeIntegration(BaseIntegration):
    """Stripe payment processing integration"""

    provider = IntegrationProvider.STRIPE
    name = "Stripe"
    description = "Payment processing and subscription management"

    def __init__(self, api_key: str, **kwargs):
        super().__init__(api_key, **kwargs)
        stripe.api_key = api_key

    async def verify_credentials(self) -> bool:
        """Verify Stripe API key is valid"""
        try:
            stripe.Account.retrieve()
            return True
        except stripe.error.AuthenticationError:
            raise IntegrationAuthError("Invalid Stripe API key")
        except Exception as e:
            raise IntegrationError(f"Failed to verify Stripe credentials: {str(e)}")

    async def test_connection(self) -> Dict[str, Any]:
        """Test Stripe connection"""
        try:
            account = stripe.Account.retrieve()
            return {
                "status": "connected",
                "account_id": account.id,
                "email": account.email,
                "country": account.country
            }
        except Exception as e:
            raise IntegrationConnectionError(f"Failed to connect to Stripe: {str(e)}")

    async def execute(self, action: str, **kwargs) -> Dict[str, Any]:
        """
        Execute Stripe action

        Supported actions:
        - create_payment: Create a payment
        - create_customer: Create a customer
        - create_subscription: Create subscription
        - list_payments: List payments
        - list_customers: List customers
        - list_subscriptions: List subscriptions
        """
        try:
            if action == "create_payment":
                return await self._create_payment(**kwargs)
            elif action == "create_customer":
                return await self._create_customer(**kwargs)
            elif action == "create_subscription":
                return await self._create_subscription(**kwargs)
            elif action == "list_payments":
                return await self._list_payments(**kwargs)
            elif action == "list_customers":
                return await self._list_customers(**kwargs)
            elif action == "list_subscriptions":
                return await self._list_subscriptions(**kwargs)
            elif action == "get_payment":
                return await self._get_payment(**kwargs)
            elif action == "get_customer":
                return await self._get_customer(**kwargs)
            elif action == "cancel_subscription":
                return await self._cancel_subscription(**kwargs)
            else:
                raise IntegrationExecutionError(f"Unknown Stripe action: {action}")
        except Exception as e:
            if isinstance(e, IntegrationExecutionError):
                raise
            raise IntegrationExecutionError(f"Stripe action failed: {str(e)}")

    async def _create_payment(
        self,
        amount: float,
        currency: str = "usd",
        description: Optional[str] = None,
        customer_id: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Create a payment intent"""
        payment_data = {
            "amount": int(amount * 100),  # Convert to cents
            "currency": currency,
        }
        if description:
            payment_data["description"] = description
        if customer_id:
            payment_data["customer"] = customer_id

        intent = stripe.PaymentIntent.create(**payment_data)
        return {
            "id": intent.id,
            "amount": intent.amount / 100,
            "currency": intent.currency,
            "status": intent.status,
            "client_secret": intent.client_secret
        }

    async def _create_customer(
        self,
        email: str,
        name: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Create a customer"""
        customer_data = {"email": email}
        if name:
            customer_data["name"] = name

        customer = stripe.Customer.create(**customer_data)
        return {
            "id": customer.id,
            "email": customer.email,
            "name": customer.name,
            "created": customer.created
        }

    async def _create_subscription(
        self,
        customer_id: str,
        price_id: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Create a subscription"""
        subscription = stripe.Subscription.create(
            customer=customer_id,
            items=[{"price": price_id}]
        )
        return {
            "id": subscription.id,
            "customer": subscription.customer,
            "status": subscription.status,
            "current_period_start": subscription.current_period_start,
            "current_period_end": subscription.current_period_end
        }

    async def _list_payments(self, limit: int = 10, **kwargs) -> Dict[str, Any]:
        """List payments"""
        intents = stripe.PaymentIntent.list(limit=limit)
        return {
            "data": [
                {
                    "id": intent.id,
                    "amount": intent.amount / 100,
                    "status": intent.status,
                    "created": intent.created
                }
                for intent in intents.data
            ],
            "total": len(intents.data)
        }

    async def _list_customers(self, limit: int = 10, **kwargs) -> Dict[str, Any]:
        """List customers"""
        customers = stripe.Customer.list(limit=limit)
        return {
            "data": [
                {
                    "id": customer.id,
                    "email": customer.email,
                    "name": customer.name,
                    "created": customer.created
                }
                for customer in customers.data
            ],
            "total": len(customers.data)
        }

    async def _list_subscriptions(self, limit: int = 10, **kwargs) -> Dict[str, Any]:
        """List subscriptions"""
        subscriptions = stripe.Subscription.list(limit=limit)
        return {
            "data": [
                {
                    "id": sub.id,
                    "customer": sub.customer,
                    "status": sub.status,
                    "created": sub.created
                }
                for sub in subscriptions.data
            ],
            "total": len(subscriptions.data)
        }

    async def _get_payment(self, payment_id: str, **kwargs) -> Dict[str, Any]:
        """Get payment details"""
        intent = stripe.PaymentIntent.retrieve(payment_id)
        return {
            "id": intent.id,
            "amount": intent.amount / 100,
            "status": intent.status,
            "created": intent.created
        }

    async def _get_customer(self, customer_id: str, **kwargs) -> Dict[str, Any]:
        """Get customer details"""
        customer = stripe.Customer.retrieve(customer_id)
        return {
            "id": customer.id,
            "email": customer.email,
            "name": customer.name,
            "created": customer.created
        }

    async def _cancel_subscription(self, subscription_id: str, **kwargs) -> Dict[str, Any]:
        """Cancel subscription"""
        subscription = stripe.Subscription.delete(subscription_id)
        return {
            "id": subscription.id,
            "status": subscription.status,
            "canceled_at": subscription.canceled_at
        }

    def get_schema(self) -> Dict[str, Any]:
        """Get Stripe integration schema"""
        return {
            "provider": self.provider.value,
            "name": self.name,
            "description": self.description,
            "fields": [
                {
                    "name": "api_key",
                    "type": "password",
                    "label": "Stripe Secret Key",
                    "required": True
                }
            ],
            "actions": [
                {
                    "name": "create_payment",
                    "label": "Create Payment",
                    "description": "Create a payment intent"
                },
                {
                    "name": "create_customer",
                    "label": "Create Customer",
                    "description": "Create a new customer"
                },
                {
                    "name": "create_subscription",
                    "label": "Create Subscription",
                    "description": "Create a subscription for a customer"
                },
                {
                    "name": "list_payments",
                    "label": "List Payments",
                    "description": "List recent payments"
                },
                {
                    "name": "list_customers",
                    "label": "List Customers",
                    "description": "List customers"
                },
                {
                    "name": "cancel_subscription",
                    "label": "Cancel Subscription",
                    "description": "Cancel a subscription"
                }
            ]
        }
