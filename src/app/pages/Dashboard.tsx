import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Bot,
  Workflow,
  Users,
  DollarSign,
  Activity,
  ArrowRight,
  Zap,
  CreditCard,
  Loader2,
} from "lucide-react";
import { get, APIResponse } from "../services/api";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "../components/ui/badge";
import { MetricStatsCard, UsageStatsCard } from "../components/StatsCard";
import { ActivityFeed } from "../components/ActivityFeed";

const stats = [
  {
    name: "Total AI Credits Used",
    value: "28,543",
    change: "+12.5%",
    trend: "up",
    icon: Activity,
  },
  {
    name: "Active Workflows",
    value: "24",
    change: "+3",
    trend: "up",
    icon: Workflow,
  },
  {
    name: "Leads Generated",
    value: "1,247",
    change: "+18.2%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Cost Savings",
    value: "$4,320",
    change: "+8.1%",
    trend: "up",
    icon: DollarSign,
  },
];

const usageData = [
  { name: "Mon", credits: 2400 },
  { name: "Tue", credits: 3200 },
  { name: "Wed", credits: 2800 },
  { name: "Thu", credits: 4100 },
  { name: "Fri", credits: 3900 },
  { name: "Sat", credits: 2100 },
  { name: "Sun", credits: 2900 },
];

const workflowData = [
  { name: "Lead Gen", runs: 145 },
  { name: "Email", runs: 89 },
  { name: "Support", runs: 234 },
  { name: "Content", runs: 67 },
  { name: "Research", runs: 123 },
];

const agentPerformance = [
  { name: "Lead Generation Agent", value: 35 },
  { name: "Email Writer Agent", value: 25 },
  { name: "Support Agent", value: 20 },
  { name: "Content Generator", value: 12 },
  { name: "Research Agent", value: 8 },
];

const COLORS = ["#9333ea", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const recentActivity = [
  {
    id: 1,
    type: "workflow",
    name: "Lead enrichment workflow",
    status: "completed",
    time: "5 minutes ago",
  },
  {
    id: 2,
    type: "agent",
    name: "Email writer generated 12 emails",
    status: "completed",
    time: "12 minutes ago",
  },
  {
    id: 3,
    type: "integration",
    name: "Google Sheets sync completed",
    status: "completed",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "workflow",
    name: "Customer follow-up automation",
    status: "running",
    time: "2 hours ago",
  },
];

interface UsageData {
  billing_plan: string;
  api_credits: {
    used: number;
    limit: number;
    percentage: number;
  };
  ai_agents: {
    count: number;
    limit: number;
  };
  workflows: {
    count: number;
    limit: number;
  };
  leads: {
    count: number;
  };
}

export function Dashboard() {
  const [usageDataState, setUsageDataState] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await get<APIResponse<UsageData>>("/organizations/usage");
        if (res.success && res.data) {
          setUsageDataState(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch usage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const creditsUsed = usageDataState?.api_credits.used || 0;
  const activeWorkflows = usageDataState?.workflows.count || 0;
  const leadsGenerated = usageDataState?.leads.count || 0;
  const creditsLimit = usageDataState?.api_credits.limit || 50000;
  const workflowsLimit = usageDataState?.workflows.limit || 5000;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your AI automation.
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricStatsCard
          label="Total AI Credits Used"
          value={creditsUsed.toLocaleString()}
          change={12.5}
          icon={Activity}
          color="purple"
        />
        <MetricStatsCard
          label="Active Workflows"
          value={activeWorkflows.toString()}
          change={3}
          changeLabel="+3 this week"
          icon={Workflow}
          color="blue"
        />
        <MetricStatsCard
          label="Leads Generated"
          value={leadsGenerated.toLocaleString()}
          change={18.2}
          icon={Users}
          color="green"
        />
        <MetricStatsCard
          label="Cost Savings"
          value="$4,320"
          change={8.1}
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Usage Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UsageStatsCard
          label="API Credits"
          used={creditsUsed}
          total={creditsLimit}
          icon={Zap}
          color="purple"
        />
        <UsageStatsCard
          label="Workflow Executions"
          used={activeWorkflows}
          total={workflowsLimit}
          icon={Workflow}
          color="blue"
        />
        <UsageStatsCard
          label="Storage Used"
          used={3.2}
          total={10}
          icon={CreditCard}
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">AI Credits Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="credits"
                stroke="#9333ea"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCredits)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Workflow Runs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="runs" fill="#9333ea" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Agent Performance & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Agent Performance Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={agentPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {agentPerformance.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <ActivityFeed maxItems={5} showFilters={false} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
          <Bot className="size-10 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Create AI Agent</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Build a custom AI agent for your specific use case
          </p>
          <Button variant="link" className="p-0 h-auto group-hover:gap-2">
            Get Started
            <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
          <Workflow className="size-10 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Build Workflow</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Automate your business processes with workflows
          </p>
          <Button variant="link" className="p-0 h-auto group-hover:gap-2">
            Get Started
            <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
          <Users className="size-10 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Manage Leads</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            View and manage your AI-generated leads
          </p>
          <Button variant="link" className="p-0 h-auto group-hover:gap-2">
            Get Started
            <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </div>
    </div>
  );
}