import { useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Zap,
  Bot,
  Workflow,
  Users,
} from "lucide-react";

// Custom toast templates
export const showSuccessToast = (title: string, description?: string) => {
  toast.success(title, {
    description,
    icon: <CheckCircle2 className="size-5" />,
    duration: 4000,
  });
};

export const showErrorToast = (title: string, description?: string) => {
  toast.error(title, {
    description,
    icon: <XCircle className="size-5" />,
    duration: 5000,
  });
};

export const showWarningToast = (title: string, description?: string) => {
  toast.warning(title, {
    description,
    icon: <AlertCircle className="size-5" />,
    duration: 4500,
  });
};

export const showInfoToast = (title: string, description?: string) => {
  toast.info(title, {
    description,
    icon: <Info className="size-5" />,
    duration: 4000,
  });
};

// Specialized workflow/agent toasts
export const showWorkflowCompletedToast = (workflowName: string, results?: string) => {
  toast.success(`Workflow Completed: ${workflowName}`, {
    description: results || "Your workflow has finished successfully",
    icon: <Workflow className="size-5" />,
    duration: 5000,
    action: {
      label: "View Details",
      onClick: () => console.log("View workflow details"),
    },
  });
};

export const showWorkflowFailedToast = (workflowName: string, error?: string) => {
  toast.error(`Workflow Failed: ${workflowName}`, {
    description: error || "Your workflow encountered an error",
    icon: <Workflow className="size-5" />,
    duration: 6000,
    action: {
      label: "View Logs",
      onClick: () => console.log("View error logs"),
    },
  });
};

export const showAgentActivityToast = (agentName: string, activity: string) => {
  toast.info(`${agentName}`, {
    description: activity,
    icon: <Bot className="size-5" />,
    duration: 4000,
  });
};

export const showLeadsGeneratedToast = (count: number, source: string) => {
  toast.success(`${count} New Leads Generated`, {
    description: `From ${source}`,
    icon: <Users className="size-5" />,
    duration: 5000,
    action: {
      label: "View Leads",
      onClick: () => console.log("View leads"),
    },
  });
};

export const showApiLimitToast = (percentage: number) => {
  toast.warning("API Usage Limit Warning", {
    description: `You've used ${percentage}% of your monthly credits`,
    icon: <Zap className="size-5" />,
    duration: 6000,
    action: {
      label: "Upgrade Plan",
      onClick: () => console.log("Go to billing"),
    },
  });
};

// Provider component that simulates real-time events
export function ToastNotificationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Simulate real-time workflow completion after 5 seconds
    const timer1 = setTimeout(() => {
      showWorkflowCompletedToast("Lead Generation", "150 new leads added to database");
    }, 5000);

    // Simulate agent activity after 10 seconds
    const timer2 = setTimeout(() => {
      showAgentActivityToast("Customer Support Agent", "Processed 12 customer inquiries");
    }, 10000);

    // Simulate API warning after 15 seconds
    const timer3 = setTimeout(() => {
      showApiLimitToast(85);
    }, 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "var(--background)",
            border: "1px solid var(--border)",
          },
          className: "toast-custom",
        }}
      />
      {children}
    </>
  );
}

// Manual trigger functions for testing
export const testToastNotifications = () => {
  setTimeout(() => showSuccessToast("Test Success", "This is a success message"), 500);
  setTimeout(() => showErrorToast("Test Error", "This is an error message"), 1500);
  setTimeout(() => showWarningToast("Test Warning", "This is a warning message"), 2500);
  setTimeout(() => showInfoToast("Test Info", "This is an info message"), 3500);
  setTimeout(() => showWorkflowCompletedToast("Test Workflow", "Completed successfully"), 4500);
  setTimeout(() => showLeadsGeneratedToast(42, "LinkedIn Campaign"), 5500);
};
