import { useState } from "react";
import {
  Bot,
  Workflow,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserPlus,
  Settings,
  Zap,
  Mail,
  Calendar,
  FileText,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";

export type ActivityItem = {
  id: string;
  type: "agent" | "workflow" | "lead" | "integration" | "team" | "system";
  action: string;
  title: string;
  description?: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
  status?: "success" | "warning" | "error" | "info";
  metadata?: Record<string, any>;
};

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "workflow",
    action: "completed",
    title: "Lead Generation workflow completed",
    description: "150 new leads added to database",
    timestamp: new Date(Date.now() - 5 * 60000),
    status: "success",
    metadata: { leadsCount: 150, duration: "2m 34s" },
  },
  {
    id: "2",
    type: "team",
    action: "joined",
    title: "Sarah Johnson joined workspace",
    description: "Assigned as Admin role",
    timestamp: new Date(Date.now() - 30 * 60000),
    user: { name: "Sarah Johnson" },
    status: "info",
  },
  {
    id: "3",
    type: "agent",
    action: "updated",
    title: "Customer Support Agent updated",
    description: "New training data added",
    timestamp: new Date(Date.now() - 1 * 3600000),
    user: { name: "John Doe" },
    status: "success",
  },
  {
    id: "4",
    type: "integration",
    action: "connected",
    title: "Salesforce CRM connected",
    description: "Successfully authenticated and synced 1,234 contacts",
    timestamp: new Date(Date.now() - 2 * 3600000),
    user: { name: "John Doe" },
    status: "success",
    metadata: { contactsCount: 1234 },
  },
  {
    id: "5",
    type: "workflow",
    action: "failed",
    title: "Email Campaign workflow failed",
    description: "API rate limit exceeded",
    timestamp: new Date(Date.now() - 3 * 3600000),
    status: "error",
    metadata: { errorCode: "RATE_LIMIT" },
  },
  {
    id: "6",
    type: "lead",
    action: "converted",
    title: "25 leads converted to customers",
    description: "From Q1 2026 campaign",
    timestamp: new Date(Date.now() - 5 * 3600000),
    status: "success",
    metadata: { conversionRate: "15%" },
  },
  {
    id: "7",
    type: "agent",
    action: "created",
    title: "New AI Agent created",
    description: "Lead Qualifier Agent",
    timestamp: new Date(Date.now() - 8 * 3600000),
    user: { name: "John Doe" },
    status: "success",
  },
  {
    id: "8",
    type: "system",
    action: "warning",
    title: "API usage at 90%",
    description: "Consider upgrading your plan",
    timestamp: new Date(Date.now() - 12 * 3600000),
    status: "warning",
  },
];

export function ActivityFeed({ maxItems = 10, showFilters = true }: { maxItems?: number; showFilters?: boolean }) {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [filter, setFilter] = useState<"all" | ActivityItem["type"]>("all");

  const filteredActivities =
    filter === "all"
      ? activities.slice(0, maxItems)
      : activities.filter((a) => a.type === filter).slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem["type"], status?: ActivityItem["status"]) => {
    const iconClass = "size-5";
    
    switch (type) {
      case "agent":
        return <Bot className={iconClass} />;
      case "workflow":
        return <Workflow className={iconClass} />;
      case "lead":
        return <Users className={iconClass} />;
      case "integration":
        return <Zap className={iconClass} />;
      case "team":
        return <UserPlus className={iconClass} />;
      case "system":
        return status === "warning" ? (
          <AlertCircle className={iconClass} />
        ) : (
          <Settings className={iconClass} />
        );
      default:
        return <FileText className={iconClass} />;
    }
  };

  const getStatusColor = (status?: ActivityItem["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "error":
        return "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {showFilters && (
          <div className="px-6 pb-4">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="agent" className="text-xs">Agents</TabsTrigger>
                <TabsTrigger value="workflow" className="text-xs">Workflows</TabsTrigger>
                <TabsTrigger value="lead" className="text-xs">Leads</TabsTrigger>
                <TabsTrigger value="integration" className="text-xs">Integrations</TabsTrigger>
                <TabsTrigger value="team" className="text-xs">Team</TabsTrigger>
                <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        <ScrollArea className="h-[500px]">
          <div className="space-y-1 px-6 pb-6">
            {filteredActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                <FileText className="size-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">No activity yet</p>
                <p className="text-xs">Activity will appear here</p>
              </div>
            ) : (
              filteredActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex gap-4 py-3 group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-3 px-3 rounded-lg transition-colors">
                    <div
                      className={`flex-shrink-0 size-10 rounded-lg flex items-center justify-center border ${getStatusColor(
                        activity.status
                      )}`}
                    >
                      {getActivityIcon(activity.type, activity.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {activity.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {activity.user && (
                          <div className="flex items-center gap-1.5">
                            <Avatar className="size-5">
                              <AvatarFallback className="text-[10px]">
                                {activity.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.user.name}
                            </span>
                          </div>
                        )}
                        {activity.status && (
                          <Badge variant="secondary" className="text-[10px] h-5">
                            {activity.status}
                          </Badge>
                        )}
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            {Object.entries(activity.metadata).slice(0, 2).map(([key, value]) => (
                              <span key={key} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < filteredActivities.length - 1 && (
                    <div className="h-px bg-gray-200 dark:bg-gray-800 my-1" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
