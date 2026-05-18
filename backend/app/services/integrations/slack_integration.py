"""
Slack integration service for messaging and notifications
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


class SlackIntegration(BaseIntegration):
    """Slack messaging and notifications integration"""

    provider = IntegrationProvider.SLACK
    name = "Slack"
    description = "Send messages and notifications to Slack"

    def __init__(self, api_key: str, **kwargs):
        super().__init__(api_key, **kwargs)
        self.base_url = "https://slack.com/api"

    async def verify_credentials(self) -> bool:
        """Verify Slack API key is valid"""
        try:
            response = requests.get(
                f"{self.base_url}/auth.test",
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=5
            )
            if response.status_code == 200 and response.json().get("ok"):
                return True
            else:
                raise IntegrationAuthError("Invalid Slack API key")
        except requests.RequestException as e:
            raise IntegrationError(f"Failed to verify Slack credentials: {str(e)}")

    async def test_connection(self) -> Dict[str, Any]:
        """Test Slack connection"""
        try:
            response = requests.get(
                f"{self.base_url}/auth.test",
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("ok"):
                    return {
                        "status": "connected",
                        "user_id": data.get("user_id"),
                        "team_name": data.get("team_name"),
                        "team_id": data.get("team_id")
                    }
                else:
                    raise IntegrationConnectionError(data.get("error", "Unknown error"))
            else:
                raise IntegrationConnectionError(f"Slack API returned {response.status_code}")
        except Exception as e:
            raise IntegrationConnectionError(f"Failed to connect to Slack: {str(e)}")

    async def execute(self, action: str, **kwargs) -> Dict[str, Any]:
        """
        Execute Slack action

        Supported actions:
        - send_message: Send a message
        - send_direct_message: Send a direct message
        - post_to_channel: Post message to channel
        - upload_file: Upload a file
        - get_channels: List channels
        - get_users: List users
        """
        try:
            if action == "send_message":
                return await self._send_message(**kwargs)
            elif action == "send_direct_message":
                return await self._send_direct_message(**kwargs)
            elif action == "post_to_channel":
                return await self._post_to_channel(**kwargs)
            elif action == "upload_file":
                return await self._upload_file(**kwargs)
            elif action == "get_channels":
                return await self._get_channels(**kwargs)
            elif action == "get_users":
                return await self._get_users(**kwargs)
            else:
                raise IntegrationExecutionError(f"Unknown Slack action: {action}")
        except Exception as e:
            if isinstance(e, IntegrationExecutionError):
                raise
            raise IntegrationExecutionError(f"Slack action failed: {str(e)}")

    async def _send_message(
        self,
        channel: str,
        text: str,
        blocks: Optional[List[Dict[str, Any]]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Send a message to a channel"""
        payload = {
            "channel": channel,
            "text": text
        }
        if blocks:
            payload["blocks"] = blocks

        response = requests.post(
            f"{self.base_url}/chat.postMessage",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json=payload
        )

        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                return {
                    "channel": data.get("channel"),
                    "message_ts": data.get("ts"),
                    "status": "sent"
                }
            else:
                raise IntegrationExecutionError(data.get("error", "Unknown error"))
        else:
            raise IntegrationExecutionError(f"Failed to send message: {response.text}")

    async def _send_direct_message(
        self,
        user_id: str,
        text: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Send a direct message to a user"""
        # First, open DM channel with user
        response = requests.post(
            f"{self.base_url}/conversations.open",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={"users": user_id}
        )

        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                channel_id = data.get("channel", {}).get("id")
                return await self._send_message(channel=channel_id, text=text, **kwargs)
            else:
                raise IntegrationExecutionError(data.get("error", "Failed to open DM"))
        else:
            raise IntegrationExecutionError(f"Failed to open DM: {response.text}")

    async def _post_to_channel(
        self,
        channel_name: str,
        text: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Post message to a named channel"""
        # Convert channel name to ID
        channel_id = f"#{channel_name}" if not channel_name.startswith("#") else channel_name
        return await self._send_message(channel=channel_id, text=text, **kwargs)

    async def _upload_file(
        self,
        file_path: str,
        channel: str,
        title: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Upload a file to a channel"""
        with open(file_path, "rb") as f:
            files = {"file": f}
            data = {
                "channels": channel,
                "title": title or file_path.split("/")[-1]
            }

            response = requests.post(
                f"{self.base_url}/files.upload",
                headers={"Authorization": f"Bearer {self.api_key}"},
                files=files,
                data=data
            )

        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                return {
                    "file_id": data.get("file", {}).get("id"),
                    "status": "uploaded"
                }
            else:
                raise IntegrationExecutionError(data.get("error", "Upload failed"))
        else:
            raise IntegrationExecutionError(f"Failed to upload file: {response.text}")

    async def _get_channels(self, limit: int = 100, **kwargs) -> Dict[str, Any]:
        """Get list of channels"""
        response = requests.get(
            f"{self.base_url}/conversations.list",
            headers={"Authorization": f"Bearer {self.api_key}"},
            params={"limit": limit, "types": "public_channel"}
        )

        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                return {
                    "channels": [
                        {
                            "id": ch["id"],
                            "name": ch["name"],
                            "is_member": ch.get("is_member", False)
                        }
                        for ch in data.get("channels", [])
                    ],
                    "total": len(data.get("channels", []))
                }
            else:
                raise IntegrationExecutionError(data.get("error", "Failed to list channels"))
        else:
            raise IntegrationExecutionError(f"Failed to get channels: {response.text}")

    async def _get_users(self, limit: int = 100, **kwargs) -> Dict[str, Any]:
        """Get list of users"""
        response = requests.get(
            f"{self.base_url}/users.list",
            headers={"Authorization": f"Bearer {self.api_key}"},
            params={"limit": limit}
        )

        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                return {
                    "users": [
                        {
                            "id": user["id"],
                            "name": user["name"],
                            "real_name": user.get("real_name", ""),
                            "is_bot": user.get("is_bot", False)
                        }
                        for user in data.get("members", [])
                        if not user.get("deleted", False)
                    ],
                    "total": len(data.get("members", []))
                }
            else:
                raise IntegrationExecutionError(data.get("error", "Failed to list users"))
        else:
            raise IntegrationExecutionError(f"Failed to get users: {response.text}")

    def get_schema(self) -> Dict[str, Any]:
        """Get Slack integration schema"""
        return {
            "provider": self.provider.value,
            "name": self.name,
            "description": self.description,
            "fields": [
                {
                    "name": "api_key",
                    "type": "password",
                    "label": "Slack Bot Token",
                    "required": True,
                    "placeholder": "xoxb-..."
                }
            ],
            "actions": [
                {
                    "name": "send_message",
                    "label": "Send Message",
                    "description": "Send a message to a channel"
                },
                {
                    "name": "send_direct_message",
                    "label": "Send Direct Message",
                    "description": "Send a direct message to a user"
                },
                {
                    "name": "post_to_channel",
                    "label": "Post to Channel",
                    "description": "Post message to named channel"
                },
                {
                    "name": "upload_file",
                    "label": "Upload File",
                    "description": "Upload file to channel"
                },
                {
                    "name": "get_channels",
                    "label": "List Channels",
                    "description": "Get list of channels"
                },
                {
                    "name": "get_users",
                    "label": "List Users",
                    "description": "Get list of users"
                }
            ]
        }
