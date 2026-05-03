import { useState, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Save,
  Play,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowLeft,
  LayoutGrid,
  RotateCcw,
} from "lucide-react";
import { WorkflowNode, WorkflowNodeData } from "./WorkflowNode";
import { NodePalette } from "./NodePalette";
import { NodeConfigPanel } from "./NodeConfigPanel";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { toast } from "sonner";

interface NodeTemplate {
  id: string;
  type: "trigger" | "action" | "condition" | "delay";
  category: string;
  name: string;
  description: string;
  icon: any;
}

interface WorkflowBuilderProps {
  workflowId?: string;
  workflowName?: string;
  onBack?: () => void;
  onSave?: (nodes: WorkflowNodeData[], connections: Connection[]) => void;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
}

export function WorkflowBuilder({
  workflowId,
  workflowName = "New Workflow",
  onBack,
  onSave,
}: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<WorkflowNodeData[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 50, y: 50 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const handleNodeDragStart = useCallback((template: NodeTemplate, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(template));
  }, []);

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;

      const template = JSON.parse(data) as NodeTemplate;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - canvasOffset.x) / zoom;
      const y = (e.clientY - rect.top - canvasOffset.y) / zoom;

      const newNode: WorkflowNodeData = {
        id: `node-${Date.now()}`,
        type: template.type,
        category: template.category,
        name: template.name,
        description: template.description,
        position: { x: Math.max(0, x - 128), y: Math.max(0, y - 50) },
        config: {},
        connections: [],
      };

      setNodes((prev) => [...prev, newNode]);
      setSelectedNodeId(newNode.id);
      toast.success(`${template.name} added to workflow`);
    },
    [zoom, canvasOffset]
  );

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleNodeSelect = (id: string) => {
    setSelectedNodeId(id);
  };

  const handleNodeDelete = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) =>
      prev.filter((c) => c.sourceId !== id && c.targetId !== id)
    );
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
    toast.success("Node deleted");
  };

  const handleNodeDragStartOnCanvas = (id: string, e: React.DragEvent) => {
    setDraggedNodeId(id);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleNodeDragEndOnCanvas = () => {
    setIsDragging(false);
    setDraggedNodeId(null);
  };

  const handleNodeDragOnCanvas = useCallback((nodeId: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, position: { x, y } } : node
      )
    );
  }, []);

  const handleConnect = (sourceId: string) => {
    if (connectingFromId === null) {
      setConnectingFromId(sourceId);
      toast.info("Click on another node to connect");
    } else if (connectingFromId !== sourceId) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        sourceId: connectingFromId,
        targetId: sourceId,
      };
      setConnections((prev) => [...prev, newConnection]);
      setConnectingFromId(null);
      toast.success("Nodes connected");
    }
  };

  const handleDeleteConnection = (connectionId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connectionId));
    toast.success("Connection deleted");
  };

  const handleConfigUpdate = (nodeId: string, config: Record<string, any>) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, config } : node
      )
    );
    toast.success("Configuration saved");
  };

  const handleSave = () => {
    if (onSave) {
      onSave(nodes, connections);
    }
    toast.success("Workflow saved successfully");
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleUndo = () => {
    toast.info("Undo - Coming soon");
  };

  const handleRedo = () => {
    toast.info("Redo - Coming soon");
  };

  const handleTest = () => {
    toast.info("Testing workflow - Coming soon");
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      e.preventDefault();
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setCanvasOffset({ x: 50, y: 50 });
    toast.success("View reset");
  };

  const handleAutoLayout = () => {
    const triggerNodes = nodes.filter((n) => n.type === "trigger");
    const otherNodes = nodes.filter((n) => n.type !== "trigger");

    let y = 100;
    const layoutedNodes = [
      ...triggerNodes.map((node, index) => ({
        ...node,
        position: { x: 100, y: y + index * 200 },
      })),
      ...otherNodes.map((node, index) => ({
        ...node,
        position: { x: 450, y: y + index * 200 },
      })),
    ];

    setNodes(layoutedNodes);
    toast.success("Auto layout applied");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <div>
            <h1 className="text-xl font-semibold">{workflowName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                Draft
              </Badge>
              <span className="text-xs text-gray-500">
                {nodes.length} nodes • {connections.length} connections
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleUndo}>
            <Undo className="size-4 mr-2" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={handleRedo}>
            <Redo className="size-4 mr-2" />
            Redo
          </Button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="size-4" />
          </Button>
          <span className="text-sm font-medium min-w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetView}>
            <RotateCcw className="size-4" />
          </Button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />
          <Button variant="outline" size="sm" onClick={handleAutoLayout}>
            <LayoutGrid className="size-4 mr-2" />
            Auto Layout
          </Button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />
          <Button variant="outline" onClick={handleTest}>
            <Play className="size-4 mr-2" />
            Test
          </Button>
          <Button onClick={handleSave}>
            <Save className="size-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <NodePalette onNodeDragStart={handleNodeDragStart} />
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className={`absolute inset-0 ${isPanning ? "cursor-grabbing" : "cursor-default"}`}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            <WorkflowCanvas
              nodes={nodes}
              connections={connections}
              zoom={zoom}
              offset={canvasOffset}
              selectedNodeId={selectedNodeId}
              connectingFromId={connectingFromId}
              onNodeSelect={handleNodeSelect}
              onNodeDelete={handleNodeDelete}
              onNodeDragStart={handleNodeDragStartOnCanvas}
              onNodeDragEnd={handleNodeDragEndOnCanvas}
              onConnect={handleConnect}
              onNodeMove={handleNodeDragOnCanvas}
              onDeleteConnection={handleDeleteConnection}
            />
          </div>

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center max-w-md">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center mx-auto mb-4">
                  <Maximize2 className="size-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Start building your workflow
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop nodes from the left palette to create your
                  automation workflow
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <p>💡 Hold Alt/Option + Drag to pan the canvas</p>
                  <p>🔍 Use toolbar to zoom in/out</p>
                </div>
              </div>
            </div>
          )}

          {/* Helper Text */}
          <div className="absolute bottom-4 left-4 pointer-events-none">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Pan:</span> Alt/Option + Drag •
                <span className="font-medium ml-2">Connect:</span> Click connection points •
                <span className="font-medium ml-2">Select:</span> Click node
              </p>
            </div>
          </div>
        </div>

        {/* Config Panel */}
        <div className="w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <NodeConfigPanel
            node={selectedNode}
            onClose={() => setSelectedNodeId(null)}
            onUpdate={handleConfigUpdate}
          />
        </div>
      </div>
    </div>
  );
}
