from typing import Dict, Any, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.workflow import Workflow
from app.models.ai_agent import AIAgent
from app.services.gemini_service import gemini_service


class WorkflowService:
    """
    Service for executing workflows
    """

    async def execute_workflow(
        self,
        workflow: Workflow,
        input_data: Dict[str, Any],
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Execute a workflow by processing all nodes in sequence

        Args:
            workflow: Workflow model instance
            input_data: Input data for the workflow
            db: Database session

        Returns:
            Execution result with outputs from all nodes
        """
        results = {}
        current_data = input_data.copy()

        try:
            # Sort nodes by their position/dependencies
            # For now, execute sequentially
            for node in workflow.nodes:
                node_id = node.get("id")
                node_type = node.get("type")
                node_config = node.get("config", {})

                # Execute based on node type
                if node_type == "trigger":
                    results[node_id] = {
                        "type": "trigger",
                        "status": "success",
                        "data": current_data
                    }

                elif node_type == "ai_agent":
                    # Execute AI agent
                    agent_id = node_config.get("agent_id")
                    if agent_id:
                        agent_result = await self._execute_agent_node(
                            agent_id, current_data, db
                        )
                        results[node_id] = agent_result
                        current_data.update(agent_result.get("data", {}))

                elif node_type == "condition":
                    # Evaluate condition
                    condition_result = self._evaluate_condition(
                        node_config, current_data
                    )
                    results[node_id] = condition_result

                elif node_type == "action":
                    # Execute action (API call, email, etc.)
                    action_result = await self._execute_action(
                        node_config, current_data
                    )
                    results[node_id] = action_result

                elif node_type == "delay":
                    # Add delay
                    results[node_id] = {
                        "type": "delay",
                        "status": "success",
                        "duration": node_config.get("duration", 0)
                    }

                else:
                    results[node_id] = {
                        "type": node_type,
                        "status": "skipped",
                        "message": f"Unknown node type: {node_type}"
                    }

            return {
                "status": "completed",
                "workflow_id": str(workflow.id),
                "results": results,
                "output": current_data
            }

        except Exception as e:
            return {
                "status": "failed",
                "workflow_id": str(workflow.id),
                "error": str(e),
                "results": results
            }

    async def _execute_agent_node(
        self,
        agent_id: str,
        input_data: Dict[str, Any],
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Execute an AI agent node
        """
        try:
            # Get agent from database
            result = await db.execute(
                select(AIAgent).where(AIAgent.id == UUID(agent_id))
            )
            agent = result.scalar_one_or_none()

            if not agent:
                return {
                    "type": "ai_agent",
                    "status": "error",
                    "error": "Agent not found"
                }

            # Prepare prompt
            user_input = input_data.get("input", "")
            if isinstance(user_input, dict):
                user_input = str(user_input)

            # Call Gemini API
            response = await gemini_service.generate_text(
                prompt=user_input,
                system_prompt=agent.system_prompt,
                temperature=agent.temperature / 100.0,  # Convert to 0.0-1.0
                max_tokens=agent.max_tokens
            )

            return {
                "type": "ai_agent",
                "status": "success",
                "agent_id": agent_id,
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

    def _evaluate_condition(
        self,
        config: Dict[str, Any],
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluate a condition node
        """
        try:
            condition_type = config.get("condition_type", "equals")
            field = config.get("field")
            value = config.get("value")
            data_value = data.get(field)

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

    async def _execute_action(
        self,
        config: Dict[str, Any],
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Execute an action node (placeholder)
        """
        action_type = config.get("action_type", "unknown")

        # TODO: Implement actual actions
        # - Send email
        # - Make HTTP request
        # - Update database
        # - Call webhook
        # etc.

        return {
            "type": "action",
            "status": "success",
            "action_type": action_type,
            "message": f"Action {action_type} executed (placeholder)"
        }


# Create singleton instance
workflow_service = WorkflowService()
