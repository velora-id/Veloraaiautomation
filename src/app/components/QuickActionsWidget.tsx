import { Plus, Zap, FileText, UserPlus, Calendar, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export type QuickAction = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
};

const defaultActions: QuickAction[] = [
  {
    id: "create-agent",
    label: "Create AI Agent",
    description: "Build a custom AI agent",
    icon: <Plus className="size-5" />,
    color: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900",
    onClick: () => console.log("Create agent"),
  },
  {
    id: "create-workflow",
    label: "New Workflow",
    description: "Design automation workflow",
    icon: <Zap className="size-5" />,
    color: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900",
    onClick: () => console.log("Create workflow"),
  },
  {
    id: "add-integration",
    label: "Add Integration",
    description: "Connect external service",
    icon: <LinkIcon className="size-5" />,
    color: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900",
    onClick: () => console.log("Add integration"),
  },
  {
    id: "invite-member",
    label: "Invite Member",
    description: "Add team member",
    icon: <UserPlus className="size-5" />,
    color: "bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900",
    onClick: () => console.log("Invite member"),
  },
];

export function QuickActionsWidget({
  actions = defaultActions,
  showHeader = true,
}: {
  actions?: QuickAction[];
  showHeader?: boolean;
}) {
  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "" : "p-6"}>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex flex-col items-start gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md ${action.color}`}
            >
              <div className="flex items-center gap-2 w-full">
                {action.icon}
                <span className="font-medium text-sm">{action.label}</span>
              </div>
              <p className="text-xs opacity-80">{action.description}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Floating Quick Action Button (FAB)
export function QuickActionFAB() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        className="size-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        <Plus className="size-6" />
      </Button>
    </div>
  );
}
