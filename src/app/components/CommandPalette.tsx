import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  LayoutDashboard,
  Bot,
  Workflow,
  Users,
  Puzzle,
  BarChart3,
  CreditCard,
  Settings,
  Handshake,
  Shield,
  Search,
  Plus,
  FileText,
  Zap,
  Moon,
  Sun,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "../context/AuthContext";

type CommandAction = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  group: string;
  action: () => void;
  keywords?: string[];
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const commands: CommandAction[] = [
    // Navigation
    {
      id: "nav-dashboard",
      label: "Go to Dashboard",
      icon: <LayoutDashboard className="size-4" />,
      group: "Navigation",
      action: () => {
        navigate("/app");
        setOpen(false);
      },
      keywords: ["home", "overview"],
    },
    {
      id: "nav-agents",
      label: "Go to AI Agents",
      icon: <Bot className="size-4" />,
      group: "Navigation",
      action: () => {
        navigate("/app/agents");
        setOpen(false);
      },
      keywords: ["bot", "ai"],
    },
    {
      id: "nav-workflows",
      label: "Go to Workflows",
      icon: <Workflow className="size-4" />,
      group: "Navigation",
      action: () => {
        navigate("/app/workflows");
        setOpen(false);
      },
      keywords: ["automation", "flow"],
    },
    {
      id: "nav-leads",
      label: "Go to Leads & CRM",
      icon: <Users className="size-4" />,
      group: "Navigation",
      action: () => {
        navigate("/app/leads");
        setOpen(false);
      },
      keywords: ["contacts", "customers", "crm"],
    },
    {
      id: "nav-integrations",
      label: "Go to Integrations",
      icon: <Puzzle className="size-4" />,
      group: "Navigation",
      action: () => {
        navigate("/app/integrations");
        setOpen(false);
      },
      keywords: ["connections", "apps"],
    },
    {
      id: "nav-analytics",
      label: "Go to Analytics",
      icon: <BarChart3 className="size-4" />,
      group: "Navigation",
      action: () => {
        navigate("/app/analytics");
        setOpen(false);
      },
      keywords: ["stats", "reports", "metrics"],
    },
    {
      id: "nav-billing",
      label: "Go to Billing",
      icon: <CreditCard className="size-4" />,
      group: "Navigation",
      action: () => {
        navigate("/app/billing");
        setOpen(false);
      },
      keywords: ["payment", "subscription", "plan"],
    },
    {
      id: "nav-settings",
      label: "Go to Team Settings",
      icon: <Settings className="size-4" />,
      group: "Navigation",
      action: () => {
        navigate("/app/settings/team");
        setOpen(false);
      },
      keywords: ["preferences", "team"],
    },

    // Quick Actions
    {
      id: "action-new-agent",
      label: "Create New AI Agent",
      description: "Build a custom AI agent",
      icon: <Plus className="size-4" />,
      group: "Quick Actions",
      action: () => {
        navigate("/app/agents");
        setOpen(false);
        // In real app, this would trigger the create agent dialog
      },
      keywords: ["new", "create", "bot"],
    },
    {
      id: "action-new-workflow",
      label: "Create New Workflow",
      description: "Design an automation workflow",
      icon: <Plus className="size-4" />,
      group: "Quick Actions",
      action: () => {
        navigate("/app/workflows");
        setOpen(false);
        // In real app, this would trigger the create workflow dialog
      },
      keywords: ["new", "create", "automation"],
    },
    {
      id: "action-invite-member",
      label: "Invite Team Member",
      description: "Add someone to your workspace",
      icon: <UserPlus className="size-4" />,
      group: "Quick Actions",
      action: () => {
        navigate("/app/settings/team");
        setOpen(false);
        // In real app, this would trigger invite dialog
      },
      keywords: ["add", "invite", "team"],
    },

    // Theme
    {
      id: "theme-light",
      label: "Switch to Light Mode",
      icon: <Sun className="size-4" />,
      group: "Appearance",
      action: () => {
        setTheme("light");
        setOpen(false);
      },
      keywords: ["theme", "appearance", "light"],
    },
    {
      id: "theme-dark",
      label: "Switch to Dark Mode",
      icon: <Moon className="size-4" />,
      group: "Appearance",
      action: () => {
        setTheme("dark");
        setOpen(false);
      },
      keywords: ["theme", "appearance", "dark"],
    },

    // Account
    {
      id: "account-logout",
      label: "Logout",
      icon: <LogOut className="size-4" />,
      group: "Account",
      action: () => {
        logout();
        setOpen(false);
      },
      keywords: ["sign out", "exit"],
    },
  ];

  // Group commands by group
  const groupedCommands = commands.reduce((acc, command) => {
    if (!acc[command.group]) {
      acc[command.group] = [];
    }
    acc[command.group].push(command);
    return acc;
  }, {} as Record<string, CommandAction[]>);

  return (
    <>
      {/* Trigger Button - Optional visual trigger */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Search className="size-4" />
        <span>Quick search...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white dark:bg-gray-900 px-1.5 font-mono text-xs text-gray-600 dark:text-gray-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {Object.entries(groupedCommands).map(([groupName, groupCommands], index) => (
            <div key={groupName}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={groupName}>
                {groupCommands.map((command) => (
                  <CommandItem
                    key={command.id}
                    onSelect={() => command.action()}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex items-center justify-center size-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {command.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{command.label}</p>
                      {command.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {command.description}
                        </p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>

        <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              ↑↓
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              ↵
            </kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              Esc
            </kbd>
            <span>Close</span>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
