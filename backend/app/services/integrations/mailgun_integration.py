"""
Mailgun integration service for email delivery
"""
import requests
from typing import Dict, Any, Optional, List
from app.services.integrations.base import (
    BaseIntegration,
    IntegrationProvider,
    IntegrationError,
    IntegrationAuthError,
    IntegrationConnectionError,
    IntegrationExecutionError
)


class MailgunIntegration(BaseIntegration):
    """Mailgun email delivery integration"""

    provider = IntegrationProvider.MAILGUN
    name = "Mailgun"
    description = "Email delivery and management service"

    def __init__(self, api_key: str, domain: str = "", **kwargs):
        super().__init__(api_key, **kwargs)
        self.domain = domain or kwargs.get("domain", "")
        self.base_url = f"https://api.mailgun.net/v3/{self.domain}" if self.domain else ""

    async def verify_credentials(self) -> bool:
        """Verify Mailgun API key is valid"""
        try:
            response = requests.get(
                f"https://api.mailgun.net/v3/domains",
                auth=("api", self.api_key),
                timeout=5
            )
            if response.status_code == 200:
                return True
            else:
                raise IntegrationAuthError("Invalid Mailgun API key")
        except requests.RequestException as e:
            raise IntegrationError(f"Failed to verify Mailgun credentials: {str(e)}")

    async def test_connection(self) -> Dict[str, Any]:
        """Test Mailgun connection"""
        try:
            response = requests.get(
                f"https://api.mailgun.net/v3/domains",
                auth=("api", self.api_key),
                timeout=5
            )
            if response.status_code == 200:
                domains = response.json().get("items", [])
                return {
                    "status": "connected",
                    "domain_count": len(domains),
                    "domains": [d["name"] for d in domains]
                }
            else:
                raise IntegrationConnectionError(f"Mailgun API returned {response.status_code}")
        except Exception as e:
            raise IntegrationConnectionError(f"Failed to connect to Mailgun: {str(e)}")

    async def execute(self, action: str, **kwargs) -> Dict[str, Any]:
        """
        Execute Mailgun action

        Supported actions:
        - send_email: Send an email
        - send_batch: Send batch emails
        - list_events: List email events
        - get_stats: Get sending statistics
        - validate_email: Validate email address
        """
        try:
            if action == "send_email":
                return await self._send_email(**kwargs)
            elif action == "send_batch":
                return await self._send_batch(**kwargs)
            elif action == "list_events":
                return await self._list_events(**kwargs)
            elif action == "get_stats":
                return await self._get_stats(**kwargs)
            elif action == "validate_email":
                return await self._validate_email(**kwargs)
            else:
                raise IntegrationExecutionError(f"Unknown Mailgun action: {action}")
        except Exception as e:
            if isinstance(e, IntegrationExecutionError):
                raise
            raise IntegrationExecutionError(f"Mailgun action failed: {str(e)}")

    async def _send_email(
        self,
        to: str,
        subject: str,
        text: Optional[str] = None,
        html: Optional[str] = None,
        from_email: Optional[str] = None,
        cc: Optional[List[str]] = None,
        bcc: Optional[List[str]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Send an email"""
        if not self.domain:
            raise IntegrationExecutionError("Mailgun domain not configured")

        data = {
            "from": from_email or f"noreply@{self.domain}",
            "to": to,
            "subject": subject
        }
        if text:
            data["text"] = text
        if html:
            data["html"] = html
        if cc:
            data["cc"] = cc
        if bcc:
            data["bcc"] = bcc

        response = requests.post(
            f"https://api.mailgun.net/v3/{self.domain}/messages",
            auth=("api", self.api_key),
            data=data
        )

        if response.status_code == 200:
            result = response.json()
            return {
                "message_id": result.get("id"),
                "status": "sent",
                "recipient": to
            }
        else:
            raise IntegrationExecutionError(f"Failed to send email: {response.text}")

    async def _send_batch(
        self,
        recipients: List[str],
        subject: str,
        text: Optional[str] = None,
        html: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Send batch emails"""
        results = []
        for recipient in recipients:
            try:
                result = await self._send_email(
                    to=recipient,
                    subject=subject,
                    text=text,
                    html=html,
                    **kwargs
                )
                results.append(result)
            except Exception as e:
                results.append({
                    "recipient": recipient,
                    "status": "failed",
                    "error": str(e)
                })

        return {
            "total": len(recipients),
            "sent": len([r for r in results if r.get("status") == "sent"]),
            "failed": len([r for r in results if r.get("status") == "failed"]),
            "results": results
        }

    async def _list_events(
        self,
        limit: int = 100,
        begin_index: int = 0,
        **kwargs
    ) -> Dict[str, Any]:
        """List email events"""
        if not self.domain:
            raise IntegrationExecutionError("Mailgun domain not configured")

        params = {
            "limit": limit,
            "begin_index": begin_index
        }

        response = requests.get(
            f"https://api.mailgun.net/v3/{self.domain}/events",
            auth=("api", self.api_key),
            params=params
        )

        if response.status_code == 200:
            data = response.json()
            return {
                "items": data.get("items", []),
                "paging": data.get("paging", {})
            }
        else:
            raise IntegrationExecutionError(f"Failed to list events: {response.text}")

    async def _get_stats(self, **kwargs) -> Dict[str, Any]:
        """Get sending statistics"""
        if not self.domain:
            raise IntegrationExecutionError("Mailgun domain not configured")

        response = requests.get(
            f"https://api.mailgun.net/v3/{self.domain}/stats/total",
            auth=("api", self.api_key),
            params={"event": ["accepted", "delivered", "failed"]}
        )

        if response.status_code == 200:
            return response.json()
        else:
            raise IntegrationExecutionError(f"Failed to get stats: {response.text}")

    async def _validate_email(self, email: str, **kwargs) -> Dict[str, Any]:
        """Validate an email address"""
        response = requests.get(
            "https://api.mailgun.net/v4/address/validate",
            auth=("api", self.api_key),
            params={"address": email}
        )

        if response.status_code == 200:
            return response.json()
        else:
            raise IntegrationExecutionError(f"Failed to validate email: {response.text}")

    def get_schema(self) -> Dict[str, Any]:
        """Get Mailgun integration schema"""
        return {
            "provider": self.provider.value,
            "name": self.name,
            "description": self.description,
            "fields": [
                {
                    "name": "api_key",
                    "type": "password",
                    "label": "Mailgun API Key",
                    "required": True
                },
                {
                    "name": "domain",
                    "type": "text",
                    "label": "Mailgun Domain",
                    "required": True
                }
            ],
            "actions": [
                {
                    "name": "send_email",
                    "label": "Send Email",
                    "description": "Send a single email"
                },
                {
                    "name": "send_batch",
                    "label": "Send Batch",
                    "description": "Send emails to multiple recipients"
                },
                {
                    "name": "list_events",
                    "label": "List Events",
                    "description": "List email events"
                },
                {
                    "name": "get_stats",
                    "label": "Get Statistics",
                    "description": "Get sending statistics"
                },
                {
                    "name": "validate_email",
                    "label": "Validate Email",
                    "description": "Validate email address"
                }
            ]
        }
