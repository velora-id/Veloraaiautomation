import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Bot,
  Workflow,
  Users,
  DollarSign,
  Activity,
  Zap,
  Target,
  Clock,
} from "lucide-react";
import { MetricStatsCard } from "../components/StatsCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

const stats = [
  {
    name: "Total Automation Runs",
    value: "12,453",
    change: "+18.2%",
    trend: "up",
    icon: Workflow,
  },
  {
    name: "AI Credits Consumed",
    value: "285,430",
    change: "+12.5%",
    trend: "up",
    icon: Bot,
  },
  {
    name: "Leads Generated",
    value: "1,247",
    change: "+24.7%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Cost Savings",
    value: "$24,320",
    change: "+15.3%",
    trend: "up",
    icon: DollarSign,
  },
];

const usageOverTime = [
  { date: "Apr 1", credits: 8400, workflows: 145 },
  { date: "Apr 5", credits: 9200, workflows: 168 },
  { date: "Apr 10", credits: 11800, workflows: 192 },
  { date: "Apr 15", credits: 13100, workflows: 215 },
  { date: "Apr 20", credits: 12400, workflows: 203 },
  { date: "Apr 25", credits: 14900, workflows: 247 },
  { date: "Apr 27", credits: 15200, workflows: 256 },
];

const agentPerformance = [
  { name: "Lead Gen", runs: 3245, success: 98 },
  { name: "Email Writer", runs: 2892, success: 95 },
  { name: "Support Bot", runs: 4123, success: 92 },
  { name: "Content Gen", runs: 1534, success: 96 },
  { name: "Research", runs: 1659, success: 94 },
];

const workflowSuccess = [
  { name: "Success", value: 11847, color: "#10b981" },
  { name: "Failed", value: 423, color: "#ef4444" },
  { name: "Pending", value: 183, color: "#f59e0b" },
];

const topWorkflows = [
  { name: "Lead Enrichment Pipeline", runs: 1247, avgTime: "2.3s" },
  { name: "Email Follow-up Campaign", runs: 892, avgTime: "1.8s" },
  { name: "Customer Support Automation", runs: 2341, avgTime: "3.1s" },
  { name: "Content Publishing Workflow", runs: 534, avgTime: "5.2s" },
  { name: "Invoice Processing", runs: 678, avgTime: "4.7s" },
];

const performanceMetrics = [
  { metric: "Speed", value: 85 },
  { metric: "Reliability", value: 92 },
  { metric: "Efficiency", value: 88 },
  { metric: "Accuracy", value: 95 },
  { metric: "Cost Savings", value: 78 },
];

const hourlyActivity = [
  { hour: "00:00", activity: 12 },
  { hour: "03:00", activity: 8 },
  { hour: "06:00", activity: 45 },
  { hour: "09:00", activity: 234 },
  { hour: "12:00", activity: 312 },
  { hour: "15:00", activity: 287 },
  { hour: "18:00", activity: 156 },
  { hour: "21:00", activity: 89 },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track performance and optimize your AI automation
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricStatsCard
          label="Total Automation Runs"
          value="12,453"
          change={18.2}
          icon={Workflow}
          color="purple"
        />
        <MetricStatsCard
          label="AI Credits Consumed"
          value="285,430"
          change={12.5}
          icon={Zap}
          color="blue"
        />
        <MetricStatsCard
          label="Leads Generated"
          value="1,247"
          change={24.7}
          icon={Users}
          color="green"
        />
        <MetricStatsCard
          label="Cost Savings"
          value="$24,320"
          change={15.3}
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <Target className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <h3 className="text-2xl font-bold">94.8%</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="size-4 text-green-600" />
            <span className="text-green-600">+2.3% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Clock className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <h3 className="text-2xl font-bold">2.3s</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown className="size-4 text-green-600" />
            <span className="text-green-600">-0.5s improvement</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Activity className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Agents</p>
              <h3 className="text-2xl font-bold">18</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="size-4 text-green-600" />
            <span className="text-green-600">+4 this month</span>
          </div>
        </Card>
      </div>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Usage Over Time */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Usage Over Time</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={usageOverTime}>
                <defs>
                  <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWorkflows" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="credits"
                  stroke="#9333ea"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCredits)"
                  name="AI Credits"
                />
                <Area
                  type="monotone"
                  dataKey="workflows"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWorkflows)"
                  name="Workflow Runs"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="runs" fill="#9333ea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Workflow Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={workflowSuccess}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {workflowSuccess.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                  <PolarRadiusAxis stroke="#9ca3af" />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#9333ea"
                    fill="#9333ea"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Success Rate by Agent</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={agentPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="success" fill="#10b981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Activity by Hour</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke="#9333ea"
                  strokeWidth={3}
                  dot={{ fill: "#9333ea", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Workflows Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Workflows</h3>
        <div className="space-y-4">
          {topWorkflows.map((workflow, index) => (
            <div
              key={workflow.name}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex items-center gap-4">
                <div className="size-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{workflow.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {workflow.runs.toLocaleString()} runs
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary">Avg: {workflow.avgTime}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}