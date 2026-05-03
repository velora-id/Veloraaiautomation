import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Search,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

const stats = [
  {
    label: "Total Tenants",
    value: "1,247",
    change: "+18.2%",
    icon: Users,
  },
  {
    label: "Monthly Revenue",
    value: "$124,450",
    change: "+24.5%",
    icon: DollarSign,
  },
  {
    label: "Active Users",
    value: "8,932",
    change: "+12.3%",
    icon: Activity,
  },
  {
    label: "System Health",
    value: "99.9%",
    change: "",
    icon: CheckCircle,
  },
];

const tenants = [
  {
    id: 1,
    name: "Acme Corp",
    plan: "enterprise",
    users: 45,
    mrr: "$999",
    status: "active",
    credits: 450000,
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    name: "TechStart Inc",
    plan: "pro",
    users: 8,
    mrr: "$49",
    status: "active",
    credits: 48000,
    createdAt: "2026-02-20",
  },
  {
    id: 3,
    name: "GrowthCo",
    plan: "pro",
    users: 12,
    mrr: "$49",
    status: "active",
    credits: 52000,
    createdAt: "2026-03-10",
  },
  {
    id: 4,
    name: "ScaleUp LLC",
    plan: "free",
    users: 3,
    mrr: "$0",
    status: "trial",
    credits: 4500,
    createdAt: "2026-04-15",
  },
  {
    id: 5,
    name: "Innovate.io",
    plan: "pro",
    users: 6,
    mrr: "$49",
    status: "suspended",
    credits: 0,
    createdAt: "2026-04-01",
  },
];

const revenueData = [
  { month: "Jan", revenue: 98000 },
  { month: "Feb", revenue: 105000 },
  { month: "Mar", revenue: 112000 },
  { month: "Apr", revenue: 124450 },
];

const planColors: Record<string, string> = {
  free: "secondary",
  pro: "default",
  enterprise: "default",
};

const statusColors: Record<string, string> = {
  active: "default",
  trial: "secondary",
  suspended: "destructive",
};

export function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "all" || tenant.plan === planFilter;
    const matchesStatus =
      statusFilter === "all" || tenant.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900 flex items-center justify-center">
          <Shield className="size-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            System-wide overview and tenant management
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className="size-5 text-purple-600" />
                {stat.change && (
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Platform Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#9333ea" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* System Alerts */}
      <Card className="p-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-4">
          <AlertTriangle className="size-6 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1 text-yellow-900 dark:text-yellow-100">
              System Alerts
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              3 tenants approaching their credit limits. Consider reaching out
              for upgrades.
            </p>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>
        </div>
      </Card>

      {/* Tenant Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Tenant Management</h3>
          <Button>Create Tenant</Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search tenants..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tenants Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead>Credits Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>
                  <Badge variant={planColors[tenant.plan] as any}>
                    {tenant.plan}
                  </Badge>
                </TableCell>
                <TableCell>{tenant.users}</TableCell>
                <TableCell className="font-semibold">{tenant.mrr}</TableCell>
                <TableCell>{tenant.credits.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={statusColors[tenant.status] as any}>
                    {tenant.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {tenant.createdAt}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">System Logs</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            View detailed system activity and audit logs
          </p>
          <Button variant="outline" className="w-full">
            View Logs
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Support Tickets</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Manage customer support requests
          </p>
          <Button variant="outline" className="w-full">
            View Tickets
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">System Settings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Configure platform-wide settings
          </p>
          <Button variant="outline" className="w-full">
            Manage Settings
          </Button>
        </Card>
      </div>
    </div>
  );
}
