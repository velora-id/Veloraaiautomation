import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  Calendar,
  Search,
  Sliders,
  Globe,
  Send,
} from "lucide-react";
import { useState } from "react";

interface NodeTemplate {
  id: string;
  type: "trigger" | "action" | "condition" | "delay";
  category: string;
  name: string;
  description: string;
  icon: any;
}

const nodeTemplates: NodeTemplate[] = [
  // Triggers
  {
    id: "webhook-trigger",
    type: "trigger",
    category: "webhook",
    name: "Webhook",
    description: "Trigger workflow via HTTP request",
    icon: Webhook,
  },
  {
    id: "schedule-trigger",
    type: "trigger",
    category: "schedule",
    name: "Schedule",
    description: "Run on a schedule (cron)",
    icon: Calendar,
  },
  {
    id: "email-trigger",
    type: "trigger",
    category: "email",
    name: "New Email",
    description: "When new email arrives",
    icon: Mail,
  },
  {
    id: "form-trigger",
    type: "trigger",
    category: "form",
    name: "Form Submission",
    description: "When form is submitted",
    icon: FileText,
  },
  
  // Actions
  {
    id: "ai-agent-action",
    type: "action",
    category: "ai_agent",
    name: "AI Agent",
    description: "Run an AI agent",
    icon: Bot,
  },
  {
    id: "send-email-action",
    type: "action",
    category: "send_email",
    name: "Send Email",
    description: "Send email via SMTP/Gmail",
    icon: Send,
  },
  {
    id: "database-action",
    type: "action",
    category: "database",
    name: "Database Query",
    description: "Query or update database",
    icon: Database,
  },
  {
    id: "http-request-action",
    type: "action",
    category: "http_request",
    name: "HTTP Request",
    description: "Make API call",
    icon: Globe,
  },
  {
    id: "slack-action",
    type: "action",
    category: "slack",
    name: "Send to Slack",
    description: "Post message to Slack",
    icon: MessageSquare,
  },
  
  // Logic
  {
    id: "condition-logic",
    type: "condition",
    category: "condition",
    name: "Condition",
    description: "Branch based on condition",
    icon: GitBranch,
  },
  {
    id: "delay-logic",
    type: "delay",
    category: "delay",
    name: "Delay",
    description: "Wait before continuing",
    icon: Clock,
  },
];

interface NodePaletteProps {
  onNodeDragStart: (template: NodeTemplate, e: React.DragEvent) => void;
}

export function NodePalette({ onNodeDragStart }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = nodeTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderNodeTemplate = (template: NodeTemplate) => {
    const Icon = template.icon;
    
    return (
      <Card
        key={template.id}
        className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        draggable
        onDragStart={(e) => onNodeDragStart(template, e)}
      >
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center flex-shrink-0">
            <Icon className="size-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1 truncate">{template.name}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Card className="w-80 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold mb-3">Node Palette</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search nodes..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-3 grid grid-cols-4">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="triggers" className="text-xs">Triggers</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
          <TabsTrigger value="logic" className="text-xs">Logic</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4">
          <TabsContent value="all" className="space-y-3 mt-3 pb-4">
            {filteredTemplates.map(renderNodeTemplate)}
          </TabsContent>

          <TabsContent value="triggers" className="space-y-3 mt-3 pb-4">
            {filteredTemplates
              .filter((t) => t.type === "trigger")
              .map(renderNodeTemplate)}
          </TabsContent>

          <TabsContent value="actions" className="space-y-3 mt-3 pb-4">
            {filteredTemplates
              .filter((t) => t.type === "action")
              .map(renderNodeTemplate)}
          </TabsContent>

          <TabsContent value="logic" className="space-y-3 mt-3 pb-4">
            {filteredTemplates
              .filter((t) => t.type === "condition" || t.type === "delay")
              .map(renderNodeTemplate)}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
