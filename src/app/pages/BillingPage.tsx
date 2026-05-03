import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  CreditCard,
  Download,
  Check,
  Zap,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "5,000 AI credits/month",
      "3 AI agents",
      "5 workflows",
      "Basic integrations",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    features: [
      "50,000 AI credits/month",
      "Unlimited AI agents",
      "Unlimited workflows",
      "All integrations",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    features: [
      "Unlimited AI credits",
      "White-label solution",
      "Dedicated infrastructure",
      "SSO & advanced security",
      "24/7 phone support",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
];

const invoices = [
  {
    id: "INV-2026-04-001",
    date: "Apr 1, 2026",
    amount: "$49.00",
    status: "paid",
    plan: "Pro",
  },
  {
    id: "INV-2026-03-001",
    date: "Mar 1, 2026",
    amount: "$49.00",
    status: "paid",
    plan: "Pro",
  },
  {
    id: "INV-2026-02-001",
    date: "Feb 1, 2026",
    amount: "$49.00",
    status: "paid",
    plan: "Pro",
  },
  {
    id: "INV-2026-01-001",
    date: "Jan 1, 2026",
    amount: "$49.00",
    status: "paid",
    plan: "Pro",
  },
];

const usageStats = [
  { name: "AI Credits", used: 28543, total: 50000, icon: Zap },
  { name: "Workflows", used: 24, total: Infinity, icon: TrendingUp },
  { name: "AI Agents", used: 12, total: Infinity, icon: Check },
];

export function BillingPage() {
  const { tenant } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your subscription, usage, and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                {tenant?.plan.charAt(0).toUpperCase() +
                  tenant?.plan.slice(1)}{" "}
                Plan
              </span>
              <Badge className="text-xs">Active</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Next billing date: May 1, 2026
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-purple-600">$49</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">per month</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button>Upgrade Plan</Button>
          <Button variant="outline">Cancel Subscription</Button>
        </div>
      </Card>

      {/* Usage Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Usage This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {usageStats.map((stat) => {
            const Icon = stat.icon;
            const percentage =
              stat.total === Infinity
                ? 100
                : (stat.used / stat.total) * 100;
            return (
              <Card key={stat.name} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="size-5 text-purple-600" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.total === Infinity
                      ? "Unlimited"
                      : `${stat.used.toLocaleString()} / ${stat.total.toLocaleString()}`}
                  </span>
                </div>
                <h4 className="font-semibold mb-2">{stat.name}</h4>
                <Progress value={percentage} className="h-2" />
                {stat.total !== Infinity && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {Math.round(percentage)}% used
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 relative ${
                plan.popular
                  ? "border-2 border-purple-600 shadow-lg"
                  : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">
                  Current Plan
                </Badge>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  / {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                disabled={plan.popular}
              >
                {plan.popular ? "Current Plan" : "Select Plan"}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Payment Method</h3>
          <Button variant="outline">Update</Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
            <CreditCard className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="font-medium">Visa ending in 4242</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Expires 12/2027
            </p>
          </div>
        </div>
      </Card>

      {/* Invoices */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Billing History</h3>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Download All
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.plan}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge variant="default">{invoice.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="size-4 mr-2" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
