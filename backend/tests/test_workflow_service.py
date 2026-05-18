"""
Test suite for workflow service
"""
import pytest
from datetime import datetime
from unittest.mock import Mock, AsyncMock, patch
from uuid import uuid4

from app.services.workflow_service import (
    WorkflowService,
    WorkflowExecutionContext
)


class TestWorkflowExecutionContext:
    """Test WorkflowExecutionContext"""

    def test_context_initialization(self):
        """Test context initialization"""
        workflow_id = uuid4()
        input_data = {"name": "test", "value": 100}

        ctx = WorkflowExecutionContext(workflow_id, input_data)

        assert ctx.workflow_id == workflow_id
        assert ctx.input_data == input_data
        assert ctx.current_data == input_data
        assert ctx.results == {}
        assert ctx.execution_log == []
        assert ctx.error is None

    def test_context_logging(self):
        """Test context logging"""
        ctx = WorkflowExecutionContext(uuid4(), {})

        ctx.log("Test message", "info")
        ctx.log("Error occurred", "error")

        assert len(ctx.execution_log) == 2
        assert ctx.execution_log[0]["message"] == "Test message"
        assert ctx.execution_log[0]["level"] == "info"
        assert ctx.execution_log[1]["level"] == "error"

    def test_add_result(self):
        """Test adding result to context"""
        ctx = WorkflowExecutionContext(uuid4(), {})

        result = {
            "type": "trigger",
            "status": "success",
            "data": {"processed": True}
        }

        ctx.add_result("node_1", result)

        assert ctx.results["node_1"] == result
        assert ctx.current_data["processed"] is True

    def test_get_duration(self):
        """Test getting duration"""
        ctx = WorkflowExecutionContext(uuid4(), {})
        duration = ctx.get_duration()

        assert isinstance(duration, float)
        assert duration >= 0


class TestWorkflowService:
    """Test WorkflowService"""

    @pytest.fixture
    def workflow_service(self):
        """Create workflow service instance"""
        return WorkflowService()

    def test_sort_nodes_by_position(self, workflow_service):
        """Test nodes are sorted by position"""
        nodes = [
            {"id": "node_3", "type": "trigger", "position": {"y": 30, "x": 0}},
            {"id": "node_1", "type": "trigger", "position": {"y": 10, "x": 0}},
            {"id": "node_2", "type": "trigger", "position": {"y": 20, "x": 0}},
        ]

        sorted_nodes = workflow_service._sort_nodes(nodes)

        assert sorted_nodes[0]["id"] == "node_1"
        assert sorted_nodes[1]["id"] == "node_2"
        assert sorted_nodes[2]["id"] == "node_3"

    @pytest.mark.asyncio
    async def test_execute_trigger_node(self, workflow_service):
        """Test trigger node execution"""
        config = {"trigger_type": "webhook"}
        ctx = WorkflowExecutionContext(uuid4(), {"key": "value"})

        result = await workflow_service._execute_trigger(config, ctx)

        assert result["type"] == "trigger"
        assert result["status"] == "success"
        assert result["trigger_type"] == "webhook"

    @pytest.mark.asyncio
    async def test_execute_condition_equals(self, workflow_service):
        """Test condition node with equals operator"""
        config = {
            "condition_type": "equals",
            "field": "status",
            "value": "active"
        }
        ctx = WorkflowExecutionContext(uuid4(), {"status": "active"})

        result = workflow_service._execute_condition(config, ctx)

        assert result["type"] == "condition"
        assert result["status"] == "success"
        assert result["result"] is True
        assert result["branch"] == "true"

    @pytest.mark.asyncio
    async def test_execute_condition_contains(self, workflow_service):
        """Test condition node with contains operator"""
        config = {
            "condition_type": "contains",
            "field": "email",
            "value": "@example.com"
        }
        ctx = WorkflowExecutionContext(uuid4(), {"email": "user@example.com"})

        result = workflow_service._execute_condition(config, ctx)

        assert result["result"] is True

    @pytest.mark.asyncio
    async def test_execute_condition_greater_than(self, workflow_service):
        """Test condition node with greater_than operator"""
        config = {
            "condition_type": "greater_than",
            "field": "score",
            "value": 50
        }
        ctx = WorkflowExecutionContext(uuid4(), {"score": 75})

        result = workflow_service._execute_condition(config, ctx)

        assert result["result"] is True

    @pytest.mark.asyncio
    async def test_execute_data_transform(self, workflow_service):
        """Test data transform node"""
        config = {
            "mapping": {
                "new_name": "old_name",
                "new_value": "old_value"
            },
            "values": {
                "status": "processed"
            }
        }
        ctx = WorkflowExecutionContext(
            uuid4(),
            {"old_name": "John", "old_value": 100}
        )

        result = workflow_service._execute_data_transform(config, ctx)

        assert result["type"] == "data_transform"
        assert result["status"] == "success"
        assert result["data"]["new_name"] == "John"
        assert result["data"]["new_value"] == 100
        assert result["data"]["status"] == "processed"

    @pytest.mark.asyncio
    async def test_execute_delay_node(self, workflow_service):
        """Test delay node"""
        config = {"duration": 1}
        ctx = WorkflowExecutionContext(uuid4(), {})

        result = await workflow_service._execute_delay(config, ctx)

        assert result["type"] == "delay"
        assert result["status"] == "success"
        assert result["duration"] == 1

    @pytest.mark.asyncio
    async def test_execute_action_node(self, workflow_service):
        """Test action node"""
        config = {"action_type": "send_email"}
        ctx = WorkflowExecutionContext(uuid4(), {"to": "user@example.com"})

        result = await workflow_service._execute_action_node(config, ctx)

        assert result["type"] == "action"
        assert result["status"] == "success"
        assert result["action_type"] == "send_email"

    def test_extract_api_key_from_json(self, workflow_service):
        """Test extracting API key from JSON credentials"""
        credentials = '{"api_key": "sk_test_123", "other": "value"}'

        api_key = workflow_service._extract_api_key(credentials)

        assert api_key == "sk_test_123"

    def test_extract_api_key_plain_text(self, workflow_service):
        """Test extracting API key from plain text"""
        api_key = workflow_service._extract_api_key("plain_text_key")

        assert api_key == "plain_text_key"

    def test_extract_api_key_none(self, workflow_service):
        """Test extracting API key from None"""
        api_key = workflow_service._extract_api_key(None)

        assert api_key is None


class TestWorkflowIntegration:
    """Integration tests for workflow execution"""

    @pytest.mark.asyncio
    async def test_execute_simple_workflow(self):
        """Test executing a simple workflow"""
        from app.models.workflow import Workflow

        service = WorkflowService()

        # Create mock workflow
        workflow = Mock(spec=Workflow)
        workflow.id = uuid4()
        workflow.name = "Test Workflow"
        workflow.nodes = [
            {
                "id": "node_1",
                "type": "trigger",
                "config": {},
                "position": {"y": 0, "x": 0}
            },
            {
                "id": "node_2",
                "type": "data_transform",
                "config": {
                    "mapping": {"output": "input"},
                    "values": {"status": "done"}
                },
                "position": {"y": 100, "x": 0}
            }
        ]

        # Mock database
        db = AsyncMock()

        # Execute workflow
        result = await service.execute_workflow(
            workflow,
            {"input": "test_data"},
            db
        )

        assert result["status"] == "completed"
        assert result["workflow_id"] == str(workflow.id)
        assert "node_1" in result["results"]
        assert "node_2" in result["results"]

    @pytest.mark.asyncio
    async def test_workflow_with_error_handling(self):
        """Test workflow error handling"""
        from app.models.workflow import Workflow

        service = WorkflowService()

        workflow = Mock(spec=Workflow)
        workflow.id = uuid4()
        workflow.name = "Error Workflow"
        workflow.nodes = [
            {
                "id": "node_1",
                "type": "condition",
                "config": {
                    "condition_type": "equals",
                    "field": "missing_field",
                    "value": "test"
                },
                "stop_on_error": True
            }
        ]

        db = AsyncMock()

        # This should handle gracefully
        result = await service.execute_workflow(workflow, {}, db)

        # Should either succeed (with error in results) or fail gracefully
        assert result["status"] in ["completed", "failed"]
