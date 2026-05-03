import { WorkflowNodeData } from "./WorkflowNode";
import { Connection } from "./WorkflowBuilder";
import { useState } from "react";
import { X } from "lucide-react";

interface ConnectionLinesProps {
  nodes: WorkflowNodeData[];
  connections: Connection[];
  connectingFromId: string | null;
  onDeleteConnection?: (connectionId: string) => void;
}

export function ConnectionLines({
  nodes,
  connections,
  connectingFromId,
  onDeleteConnection,
}: ConnectionLinesProps) {
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null);
  const getNodeConnectionPoint = (node: WorkflowNodeData, position: "top" | "bottom") => {
    const nodeWidth = 256;
    const nodeHeight = position === "bottom" ? 100 : 0;
    return {
      x: node.position.x + nodeWidth / 2,
      y: node.position.y + nodeHeight + (position === "bottom" ? 12 : -12),
    };
  };

  const renderConnection = (connection: Connection) => {
    const sourceNode = nodes.find((n) => n.id === connection.sourceId);
    const targetNode = nodes.find((n) => n.id === connection.targetId);

    if (!sourceNode || !targetNode) return null;

    const source = getNodeConnectionPoint(sourceNode, "bottom");
    const target = getNodeConnectionPoint(targetNode, "top");

    const dx = target.x - source.x;
    const dy = target.y - source.y;

    const controlPointOffset = Math.max(Math.abs(dy) / 3, 50);

    const path = `M ${source.x} ${source.y}
                  C ${source.x} ${source.y + controlPointOffset},
                    ${target.x} ${target.y - controlPointOffset},
                    ${target.x} ${target.y}`;

    const isHovered = hoveredConnectionId === connection.id;
    const midX = (source.x + target.x) / 2;
    const midY = source.y + (target.y - source.y) / 2;

    return (
      <g key={connection.id}>
        <defs>
          <marker
            id={`arrowhead-${connection.id}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#9333ea" />
          </marker>
          <filter id={`glow-${connection.id}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={path}
          stroke="#e9d5ff"
          strokeWidth={isHovered ? 4 : 3}
          fill="none"
          opacity={0.3}
          filter={`url(#glow-${connection.id})`}
        />

        <path
          d={path}
          stroke={isHovered ? "#a855f7" : "#9333ea"}
          strokeWidth={isHovered ? 3 : 2}
          fill="none"
          strokeLinecap="round"
          markerEnd={`url(#arrowhead-${connection.id})`}
          className="transition-all"
        />

        <path
          d={path}
          stroke="transparent"
          strokeWidth={20}
          fill="none"
          className="cursor-pointer pointer-events-auto"
          onMouseEnter={() => setHoveredConnectionId(connection.id)}
          onMouseLeave={() => setHoveredConnectionId(null)}
        />

        {isHovered && onDeleteConnection && (
          <g
            className="cursor-pointer pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteConnection(connection.id);
              setHoveredConnectionId(null);
            }}
          >
            <circle
              cx={midX}
              cy={midY}
              r={12}
              fill="#ef4444"
              className="transition-all hover:r-14"
            />
            <line
              x1={midX - 4}
              y1={midY - 4}
              x2={midX + 4}
              y2={midY + 4}
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1={midX + 4}
              y1={midY - 4}
              x2={midX - 4}
              y2={midY + 4}
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </g>
        )}
      </g>
    );
  };

  const renderConnectingLine = () => {
    if (!connectingFromId) return null;

    const sourceNode = nodes.find((n) => n.id === connectingFromId);
    if (!sourceNode) return null;

    const source = getNodeConnectionPoint(sourceNode, "bottom");

    return (
      <g>
        <defs>
          <marker
            id="arrowhead-connecting"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#9333ea" className="animate-pulse" />
          </marker>
        </defs>
        <line
          x1={source.x}
          y1={source.y}
          x2={source.x}
          y2={source.y + 100}
          stroke="#9333ea"
          strokeWidth={2}
          strokeDasharray="8,4"
          markerEnd="url(#arrowhead-connecting)"
          className="pointer-events-none animate-pulse"
        />
      </g>
    );
  };

  return (
    <>
      {connections.map(renderConnection)}
      {renderConnectingLine()}
    </>
  );
}
