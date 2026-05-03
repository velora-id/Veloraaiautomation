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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Handshake,
  DollarSign,
  Users,
  TrendingUp,
  Copy,
  Share2,
  Check,
} from "lucide-react";
import { toast } from "sonner";

const stats = [
  {
    label: "Total Earnings",
    value: "$12,450",
    change: "+24.5%",
    icon: DollarSign,
  },
  {
    label: "Active Referrals",
    value: "87",
    change: "+12.3%",
    icon: Users,
  },
  {
    label: "Conversion Rate",
    value: "32%",
    change: "+5.2%",
    icon: TrendingUp,
  },
  {
    label: "Pending Payout",
    value: "$2,340",
    change: "",
    icon: Handshake,
  },
];

const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2400 },
  { month: "Apr", revenue: 2100 },
  { month: "May", revenue: 2900 },
  { month: "Jun", revenue: 3200 },
];

const referrals = [
  {
    id: 1,
    company: "TechStart Inc",
    email: "contact@techstart.com",
    plan: "Pro",
    status: "active",
    commission: "$49",
    joinedDate: "2026-04-15",
  },
  {
    id: 2,
    company: "GrowthCo",
    email: "hello@growthco.com",
    plan: "Enterprise",
    status: "active",
    commission: "$199",
    joinedDate: "2026-04-10",
  },
  {
    id: 3,
    company: "ScaleUp LLC",
    email: "info@scaleup.com",
    plan: "Pro",
    status: "pending",
    commission: "$49",
    joinedDate: "2026-04-20",
  },
  {
    id: 4,
    company: "Innovate.io",
    email: "team@innovate.io",
    plan: "Pro",
    status: "active",
    commission: "$49",
    joinedDate: "2026-04-05",
  },
];

const commissionTiers = [
  { referrals: "1-10", rate: "20%", recurring: true },
  { referrals: "11-50", rate: "25%", recurring: true },
  { referrals: "51+", rate: "30%", recurring: true },
];

export function PartnerPortalPage() {
  const referralLink = "https://velora.ai/ref/PARTNER123";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Partner Portal</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your referrals, earnings, and commission
        </p>
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
        <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#9333ea"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Referral Link */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
        <div className="flex gap-3">
          <Input value={referralLink} readOnly className="flex-1" />
          <Button onClick={handleCopyLink}>
            <Copy className="size-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline">
            <Share2 className="size-4 mr-2" />
            Share
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Share this link to earn commission on every signup. You'll earn
          recurring revenue as long as they stay subscribed.
        </p>
      </Card>

      {/* Commission Structure */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Commission Structure</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referrals</TableHead>
              <TableHead>Commission Rate</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissionTiers.map((tier) => (
              <TableRow key={tier.referrals}>
                <TableCell className="font-medium">{tier.referrals}</TableCell>
                <TableCell>
                  <Badge variant="default" className="text-lg">
                    {tier.rate}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-green-600" />
                    <span className="text-sm">Recurring Monthly</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Referrals Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Your Referrals</h3>
          <Button variant="outline">Export</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{referral.company}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {referral.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{referral.plan}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      referral.status === "active" ? "default" : "secondary"
                    }
                  >
                    {referral.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  {referral.commission}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {referral.joinedDate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Marketing Materials</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Download logos, banners, and promotional content
          </p>
          <Button variant="outline" className="w-full">
            Download Assets
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Partner Agreement</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Review terms and conditions of the partner program
          </p>
          <Button variant="outline" className="w-full">
            View Agreement
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Get help from our partner success team
          </p>
          <Button variant="outline" className="w-full">
            Contact Support
          </Button>
        </Card>
      </div>
    </div>
  );
}
