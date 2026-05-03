import { useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Zap,
  Mail,
  Database,
  Code,
  GitBranch,
  Clock,
  Webhook,
  MessageSquare,
  FileText,
  Bot,
  Settings,
  Trash2,
  GripVertical,
} from "lucide-react";

export interface WorkflowNodeData {
  id: string;
  type: "trigger" | "action" | "condition" | "delay";
  category: string;
  name: string;
  description?: string;
  position: { x: number; y: number };
  config?: Record<string, any>;
  connections?: string[];
}

interface WorkflowNodeProps {
  node: WorkflowNodeData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onConnect: (sourceId: string) => void;
}

const nodeIcons: Record<string, any> = {
  trigger: Zap,
  webhook: Webhook,
  schedule: Clock,
  email: Mail,
  form: FileText,
  ai_agent: Bot,
  send_email: Mail,
  database: Database,
  http_request: Code,
  slack: MessageSquare,
  condition: GitBranch,
  delay: Clock,
};

const nodeColors: Record<string, string> = {
  trigger: "from-blue-500 to-blue-600",
  action: "from-purple-500 to-purple-600",
  condition: "from-orange-500 to-orange-600",
  delay: "from-gray-500 to-gray-600",
};

export function WorkflowNode({
  node,
  isSelected,
  onSelect,
  onDelete,
  onDragStart,
  onDragEnd,
  onConnect,
}: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const Icon = nodeIcons[node.category] || nodeIcons[node.type];

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(node.id, e);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  return (
    <div
      className="absolute"
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        transform: isDragging ? "scale(0.95)" : "scale(1)",
        transition: isDragging ? "none" : "transform 0.2s",
      }}
    >
      <Card
        className={`w-64 cursor-move transition-all ${
          isSelected
            ? "ring-2 ring-purple-500 shadow-lg"
            : "hover:shadow-md"
        }`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => onSelect(node.id)}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div
                className={`size-10 rounded-lg bg-gradient-to-br ${
                  nodeColors[node.type]
                } flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="size-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={node.type === "trigger" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {node.type}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm truncate">{node.name}</h4>
                {node.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {node.description}
                  </p>
                )}
              </div>
            </div>
            <GripVertical className="size-4 text-gray-400 cursor-move" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                // Open settings
              }}
            >
              <Settings className="size-3 mr-1" />
              Configure
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
            >
              <Trash2 className="size-3 text-red-500" />
            </Button>
          </div>

          {/* Connection points */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 size-6 rounded-full bg-purple-500 border-4 border-white dark:border-gray-950 cursor-pointer hover:bg-purple-600 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              onConnect(node.id);
            }}
            title="Connect to next node"
          />
          {node.type !== "trigger" && (
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 size-6 rounded-full bg-gray-300 dark:bg-gray-700 border-4 border-white dark:border-gray-950 z-10"
              title="Input connection"
            />
          )}
        </div>
      </Card>
    </div>
  );
}
