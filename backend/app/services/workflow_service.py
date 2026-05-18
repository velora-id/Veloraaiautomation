"""Advanced workflow execution service with integration support."""
from typing import Dict, Any, List, Optional
from uuid import UUID
from datetime import datetime
import asyncio
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.workflow import Workflow
from app.models.ai_agent import AIAgent
from app.models.integration import Integration
from app.services.gemini_service import gemini_service
from app.services.integrations import IntegrationManager, IntegrationProvider


class WorkflowExecutionContext:
    """Context for workflow execution"""

    def __init__(self, workflow_id: UUID, input_data: Dict[str, Any]):
        self.workflow_id = workflow_id
        self.input_data = input_data
        self.current_data = input_data.copy()
        self.results = {}
        self.execution_log = []
        self.start_time = datetime.now()
        self.error = None

    def log(self, message: str, level: str = "info") -> None:
        """Log execution message"""
        self.execution_log.append({
            "timestamp": datetime.now().isoformat(),
            "level": level,
            "message": message
        })

    def add_result(self, node_id: str, result: Dict[str, Any]) -> None:
        """Add node execution result"""
        self.results[node_id] = result
        if result.get("status") == "success" and "data" in result:
            self.current_data.update(result["data"])

    def get_duration(self) -> float:
        """Get execution duration in seconds"""
        return (datetime.now() - self.start_time).total_seconds()


class WorkflowService:
    """
    Service for executing workflows with support for AI agents, integrations, and complex logic
    """

    def __init__(self):
        self.integration_manager = IntegrationManager()

    async def execute_workflow(
        self,
        workflow: Workflow,
        input_data: Dict[str, Any],
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Execute a workflow by processing all nodes with proper error handling and logging

        Args:
            workflow: Workflow model instance
            input_data: Input data for the workflow
            db: Database session

        Returns:
            Execution result with outputs from all nodes
        """
        ctx = WorkflowExecutionContext(workflow.id, input_data)
        ctx.log(f"Starting workflow execution for {workflow.name}")

        try:
            # Get nodes sorted by dependencies
            nodes = self._sort_nodes(workflow.nodes)

            # Execute each node
            for node in nodes:
                node_id = node.get("id")
                node_type = node.get("type")
                node_config = node.get("config", {})

                try:
                    ctx.log(f"Executing node {node_id} (type: {node_type})")

                    # Execute based on node type
                    if node_type == "trigger":
                        result = await self._execute_trigger(node_config, ctx)
                    elif node_type == "ai_agent":
                        result = await self._execute_agent_node(node_config, ctx, db)
                    elif node_type == "condition":
                        result = self._execute_condition(node_config, ctx)
                    elif node_type == "integration":
                        result = await self._execute_integration(node_config, ctx, db)
                    elif node_type == "action":
                        result = await self._execute_action_node(node_config, ctx)
                    elif node_type == "delay":
                        result = await self._execute_delay(node_config, ctx)
                    elif node_type == "data_transform":
                        result = self._execute_data_transform(node_config, ctx)
                    else:
                        result = {
                            "type": node_type,
                            "status": "skipped",
                            "message": f"Unknown node type: {node_type}"
                        }

                    ctx.add_result(node_id, result)

                    # Check if execution should stop
                    if result.get("status") == "error" and node_config.get("stop_on_error", True):
                        ctx.error = result.get("error")
                        ctx.log(f"Stopping workflow due to error in node {node_id}", "error")
                        break

                except Exception as e:
                    ctx.log(f"Error executing node {node_id}: {str(e)}", "error")
                    ctx.add_result(node_id, {
                        "type": node_type,
                        "status": "error",
                        "error": str(e)
                    })
                    if node_config.get("stop_on_error", True):
                        ctx.error = str(e)
                        break

            # Determine final status
            status = "failed" if ctx.error else "completed"

            return {
                "status": status,
                "workflow_id": str(workflow.id),
                "workflow_name": workflow.name,
                "results": ctx.results,
                "output": ctx.current_data,
                "execution_log": ctx.execution_log,
                "duration": ctx.get_duration(),
                "error": ctx.error
            }

        except Exception as e:
            ctx.log(f"Fatal error during workflow execution: {str(e)}", "error")
            return {
                "status": "failed",
                "workflow_id": str(workflow.id),
                "workflow_name": workflow.name,
                "error": str(e),
                "results": ctx.results,
                "execution_log": ctx.execution_log
            }

    def _sort_nodes(self, nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Sort nodes by dependencies"""
        # For now, execute top-to-bottom. Can be enhanced with edge dependency resolution.
        def sort_key(node: Dict[str, Any]) -> tuple[int, int]:
            position = node.get("position", {})
            if isinstance(position, dict):
                return int(position.get("y", 0)), int(position.get("x", 0))
            return int(position or 0), 0

        return sorted(nodes, key=sort_key)

    async def _execute_trigger(
        self,
        config: Dict[str, Any],
        ctx: WorkflowExecutionContext
    ) -> Dict[str, Any]:
        """Execute a trigger node."""
        return {
            "type": "trigger",
            "status": "success",
            "trigger_type": config.get("trigger_type", "manual"),
            "data": ctx.current_data
        }

    async def _execute_agent_node(
        self,
        config: Dict[str, Any],
        ctx: WorkflowExecutionContext,
        db: AsyncSession
    ) -> Dict[str, Any]:
        """Execute an AI agent node."""
        try:
            agent_id = config.get("agent_id")
            if not agent_id:
                return {
                    "type": "ai_agent",
                    "status": "error",
                    "error": "Missing agent_id"
                }

            result = await db.execute(
                select(AIAgent).where(AIAgent.id == UUID(str(agent_id)))
            )
            agent = result.scalar_one_or_none()

            if not agent:
                return {
                    "type": "ai_agent",
                    "status": "error",
                    "error": "Agent not found"
                }

            user_input = (
                config.get("prompt")
                or ctx.current_data.get("input")
                or ctx.current_data.get("message")
                or ""
            )
            if not isinstance(user_input, str):
                user_input = json.dumps(user_input)

            response = await gemini_service.generate_text(
                prompt=user_input,
                system_prompt=agent.system_prompt,
                temperature=agent.temperature / 100.0,
                max_tokens=agent.max_tokens
            )

            return {
                "type": "ai_agent",
                "status": "success",
                "agent_id": str(agent.id),
                "agent_name": agent.name,
                "data": {
                    "output": response["text"],
                    "tokens_used": response["tokens_used"]
                }
            }

        except Exception as e:
            return {
                "type": "ai_agent",
                "status": "error",
                "error": str(e)
            }

    def _execute_condition(
        self,
        config: Dict[str, Any],
        ctx: WorkflowExecutionContext
    ) -> Dict[str, Any]:
        """Evaluate a condition node."""
        try:
            condition_type = config.get("condition_type", "equals")
            field = config.get("field")
            value = config.get("value")
            data_value = ctx.current_data.get(field)

            result = False

            if condition_type == "equals":
                result = data_value == value
            elif condition_type == "contains":
                result = value in str(data_value)
            elif condition_type == "greater_than":
                result = float(data_value) > float(value)
            elif condition_type == "less_than":
                result = float(data_value) < float(value)

            return {
                "type": "condition",
                "status": "success",
                "result": result,
                "branch": "true" if result else "false"
            }

        except Exception as e:
            return {
                "type": "condition",
                "status": "error",
                "error": str(e)
            }

    async def _execute_integration(
        self,
        config: Dict[str, Any],
        ctx: WorkflowExecutionContext,
        db: AsyncSession
    ) -> Dict[str, Any]:
        """Execute a configured third-party integration action."""
        try:
            integration_id = config.get("integration_id")
            provider_name = config.get("provider")
            action = config.get("action")

            integration: Optional[Integration] = None
            if integration_id:
                result = await db.execute(
                    select(Integration).where(Integration.id == UUID(str(integration_id)))
                )
                integration = result.scalar_one_or_none()
                if not integration:
                    return {
                        "type": "integration",
                        "status": "error",
                        "error": "Integration not found"
                    }

                provider_name = provider_name or integration.integration_type.value

            if not provider_name or not action:
                return {
                    "type": "integration",
                    "status": "error",
                    "error": "Missing provider or action"
                }

            provider = IntegrationProvider(provider_name)
            integration_config = dict(integration.config or {}) if integration else {}
            integration_config.update(config.get("params", {}))
            integration_config.update({"input_data": ctx.current_data})

            api_key = (
                config.get("api_key")
                or integration_config.pop("api_key", None)
                or (integration.access_token if integration else None)
                or self._extract_api_key(integration.credentials if integration else None)
            )

            if not api_key:
                return {
                    "type": "integration",
                    "status": "error",
                    "error": "Missing integration credentials"
                }

            data = await self.integration_manager.execute_action(
                integration_id=str(integration_id or provider_name),
                provider=provider,
                api_key=api_key,
                action=action,
                **integration_config
            )

            return {
                "type": "integration",
                "status": "success",
                "provider": provider.value,
                "action": action,
                "data": data
            }

        except Exception as e:
            return {
                "type": "integration",
                "status": "error",
                "error": str(e)
            }

    async def _execute_action_node(
        self,
        config: Dict[str, Any],
        ctx: WorkflowExecutionContext
    ) -> Dict[str, Any]:
        """Execute an action node."""
        action_type = config.get("action_type", "unknown")

        return {
            "type": "action",
            "status": "success",
            "action_type": action_type,
            "data": {
                "action_type": action_type,
                "input": ctx.current_data
            },
            "message": f"Action {action_type} executed"
        }

    async def _execute_delay(
        self,
        config: Dict[str, Any],
        ctx: WorkflowExecutionContext
    ) -> Dict[str, Any]:
        """Execute a delay node."""
        duration = min(int(config.get("duration", 0)), 60)
        if duration > 0:
            await asyncio.sleep(duration)

        return {
            "type": "delay",
            "status": "success",
            "duration": duration
        }

    def _execute_data_transform(
        self,
        config: Dict[str, Any],
        ctx: WorkflowExecutionContext
    ) -> Dict[str, Any]:
        """Execute a simple data transform node."""
        mapping = config.get("mapping", {})
        output = {}

        for output_key, input_key in mapping.items():
            output[output_key] = ctx.current_data.get(input_key)

        static_values = config.get("values", {})
        output.update(static_values)

        return {
            "type": "data_transform",
            "status": "success",
            "data": output
        }

    def _extract_api_key(self, credentials: Optional[str]) -> Optional[str]:
        """Extract an API key from plain text or JSON credentials."""
        if not credentials:
            return None

        try:
            parsed = json.loads(credentials)
            if isinstance(parsed, dict):
                return parsed.get("api_key") or parsed.get("token") or parsed.get("access_token")
        except json.JSONDecodeError:
            return credentials

        return None


# Create singleton instance
workflow_service = WorkflowService()
