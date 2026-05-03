import { WorkflowNode, WorkflowNodeData } from "./WorkflowNode";
import { Connection } from "./WorkflowBuilder";
import { ConnectionLines } from "./ConnectionLines";

interface WorkflowCanvasProps {
  nodes: WorkflowNodeData[];
  connections: Connection[];
  zoom: number;
  offset: { x: number; y: number };
  selectedNodeId: string | null;
  connectingFromId: string | null;
  onNodeSelect: (id: string) => void;
  onNodeDelete: (id: string) => void;
  onNodeDragStart: (id: string, e: React.DragEvent) => void;
  onNodeDragEnd: () => void;
  onConnect: (sourceId: string) => void;
  onNodeMove?: (nodeId: string, x: number, y: number) => void;
  onDeleteConnection?: (connectionId: string) => void;
}

export function WorkflowCanvas({
  nodes,
  connections,
  zoom,
  offset,
  selectedNodeId,
  connectingFromId,
  onNodeSelect,
  onNodeDelete,
  onNodeDragStart,
  onNodeDragEnd,
  onConnect,
  onNodeMove,
  onDeleteConnection,
}: WorkflowCanvasProps) {

  return (
    <div className="w-full h-full relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px]">
      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: "top left",
          transition: "transform 0.1s ease-out",
        }}
        className="absolute"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <ConnectionLines
            nodes={nodes}
            connections={connections}
            connectingFromId={connectingFromId}
            onDeleteConnection={onDeleteConnection}
          />
        </svg>

        <div className="relative w-full h-full">
          {nodes.map((node) => (
            <WorkflowNode
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              onSelect={onNodeSelect}
              onDelete={onNodeDelete}
              onDragStart={onNodeDragStart}
              onDragEnd={onNodeDragEnd}
              onConnect={onConnect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
