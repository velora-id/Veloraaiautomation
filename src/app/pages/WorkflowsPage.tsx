import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Settings,
  Trash2,
  Calendar,
  Zap,
  ArrowRight,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { WorkflowBuilder } from "../components/workflow/WorkflowBuilder";

interface WorkflowItem {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  status: string;
  total_executions: number;
  last_executed_at?: string;
}

const workflows = [
  {
    id: "1",
    name: "Lead Enrichment Pipeline",
    description: "Form submission → Enrich lead data → Score lead → Notify sales team",
    trigger: "Form Submission",
    actions: ["Enrich Data", "AI Scoring", "Send Notification"],
    status: "active",
    runs: 1247,
    lastRun: "5 minutes ago",
  },
  {
    id: "2",
    name: "Email Follow-up Campaign",
    description: "New lead → Generate personalized email → Send via Gmail → Log to CRM",
    trigger: "New Lead",
    actions: ["Generate Email", "Send Email", "CRM Update"],
    status: "active",
    runs: 892,
    lastRun: "1 hour ago",
  },
  {
    id: "3",
    name: "Customer Support Automation",
    description: "Support ticket → AI categorize → Auto-respond or escalate",
    trigger: "Support Ticket",
    actions: ["Categorize", "AI Response", "Escalate if needed"],
    status: "active",
    runs: 2341,
    lastRun: "12 minutes ago",
  },
  {
    id: "4",
    name: "Content Publishing Workflow",
    description: "Schedule → AI generate content → Review → Post to social media",
    trigger: "Scheduled",
    actions: ["Generate Content", "Review", "Publish"],
    status: "paused",
    runs: 534,
    lastRun: "2 days ago",
  },
];

const workflowTemplates = [
  {
    name: "Lead Generation Funnel",
    description: "Capture leads and automatically enrich their data",
    category: "Sales",
  },
  {
    name: "Email Drip Campaign",
    description: "Automated email sequences for nurturing leads",
    category: "Marketing",
  },
  {
    name: "Customer Onboarding",
    description: "Welcome new customers with automated workflows",
    category: "Customer Success",
  },
  {
    name: "Invoice Processing",
    description: "Extract data from invoices and update accounting",
    category: "Finance",
  },
];

export function WorkflowsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [triggerType, setTriggerType] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [currentWorkflowName, setCurrentWorkflowName] = useState("");
  const [workflowList, setWorkflowList] = useState<WorkflowItem[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const [creatingWorkflow, setCreatingWorkflow] = useState(false);
  const displayedWorkflows = workflowList.length > 0 ? workflowList : workflows;

  useEffect(() => {
    const loadWorkflows = async () => {
      setLoadingWorkflows(true);
      try {
        const response = await get<PaginatedResponse<WorkflowItem>>("/workflows");
        if (response.data) {
          setWorkflowList(response.data);
        }
      } catch (error) {
        toast.error((error as Error).message || "Failed to load workflows");
      } finally {
        setLoadingWorkflows(false);
      }
    };

    loadWorkflows();
  }, []);

  const handleCreateWorkflow = async () => {
    if (!workflowName || !triggerType) {
      toast.error("Please fill in all fields");
      return;
    }

    setCreatingWorkflow(true);
    try {
      const triggerMap: Record<string, string> = {
        form: "event",
        email: "event",
        webhook: "webhook",
        schedule: "schedule",
        lead: "event",
      };

      const response = await post<APIResponse<WorkflowItem>>("/workflows", {
        name: workflowName,
        description: `Automated workflow created from UI using the ${triggerType} trigger`,
        trigger_type: triggerMap[triggerType] ?? "manual",
        nodes: [
          {
            id: "trigger-node",
            type: "trigger",
            name: "Trigger",
            config: {},
          },
        ],
        edges: [],
      });

      if (!response.data) {
        throw new Error(response.message || "Workflow creation failed");
      }

      setWorkflowList((items) => [response.data, ...items]);
      setCurrentWorkflowName(workflowName);
      setCurrentWorkflowId(response.data.id);
      setShowBuilder(true);
      setWorkflowName("");
      setTriggerType("");
      toast.success("Workflow created successfully");
    } catch (error) {
      toast.error((error as Error).message || "Failed to create workflow");
    } finally {
      setCreatingWorkflow(false);
    }
  };

  const handleToggleWorkflow = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    toast.success(`Workflow ${newStatus === "active" ? "activated" : "paused"}`);
  };

  const handleEditWorkflow = (id: number, name: string) => {
    setCurrentWorkflowId(id.toString());
    setCurrentWorkflowName(name);
    setShowBuilder(true);
  };

  const handleBackToList = () => {
    setShowBuilder(false);
    setCurrentWorkflowId(null);
    setCurrentWorkflowName("");
  };

  const handleSaveWorkflow = (nodes: any[], connections: any[]) => {
    console.log("Saving workflow:", { nodes, connections });
  };

  if (showBuilder) {
    return (
      <WorkflowBuilder
        workflowId={currentWorkflowId || undefined}
        workflowName={currentWorkflowName}
        onBack={handleBackToList}
        onSave={handleSaveWorkflow}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Workflows</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Automate your business processes with AI-powered workflows
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  placeholder="e.g., Lead Enrichment Pipeline"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="trigger">Trigger</Label>
                <Select value={triggerType} onValueChange={setTriggerType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="form">Form Submission</SelectItem>
                    <SelectItem value="email">New Email</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="lead">New Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateWorkflow}>
                  Create & Configure
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Workflows */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Workflows</h2>
        <div className="grid grid-cols-1 gap-4">
          {displayedWorkflows.map((workflow) => (
            <Card key={workflow.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center flex-shrink-0">
                    <Workflow className="size-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{workflow.name}</h3>
                      <Badge
                        variant={workflow.status === "active" ? "default" : "secondary"}
                      >
                        {workflow.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {workflow.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Zap className="size-4" />
                        <span>{workflow.trigger}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="size-4" />
                        <span>{workflow.actions.length} actions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>{workflow.runs.toLocaleString()} runs</span>
                      </div>
                      <span>Last run: {workflow.lastRun}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleToggleWorkflow(workflow.id, workflow.status)
                    }
                  >
                    {workflow.status === "active" ? (
                      <Pause className="size-4" />
                    ) : (
                      <Play className="size-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditWorkflow(workflow.id, workflow.name)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Workflow Steps Visualization */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                  <Zap className="size-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {workflow.trigger}
                  </span>
                </div>
                {workflow.actions.map((action, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ArrowRight className="size-4 text-gray-400" />
                    <div className="px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 whitespace-nowrap">
                      <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                        {action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Templates */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Workflow Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowTemplates.map((template) => (
            <Card
              key={template.name}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <Badge variant="secondary" className="mb-3">
                {template.category}
              </Badge>
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {template.description}
              </p>
              <Button variant="outline" className="w-full">
                Use Template
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
