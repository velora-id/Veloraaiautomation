import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  Star,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";

const leads = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
    company: "TechCorp Inc",
    phone: "+1 (555) 123-4567",
    score: 92,
    stage: "qualified",
    source: "Website Form",
    lastContact: "2 days ago",
    notes: 3,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@innovate.io",
    company: "Innovate.io",
    phone: "+1 (555) 234-5678",
    score: 85,
    stage: "contacted",
    source: "LinkedIn",
    lastContact: "5 days ago",
    notes: 1,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@growth.co",
    company: "Growth Co",
    phone: "+1 (555) 345-6789",
    score: 78,
    stage: "new",
    source: "AI Generated",
    lastContact: "1 day ago",
    notes: 0,
  },
  {
    id: 4,
    name: "David Park",
    email: "d.park@scaleup.com",
    company: "ScaleUp LLC",
    phone: "+1 (555) 456-7890",
    score: 95,
    stage: "qualified",
    source: "Referral",
    lastContact: "3 hours ago",
    notes: 5,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa@future.ai",
    company: "Future AI",
    phone: "+1 (555) 567-8901",
    score: 88,
    stage: "contacted",
    source: "Cold Outreach",
    lastContact: "1 week ago",
    notes: 2,
  },
];

const stageColors: Record<string, string> = {
  new: "secondary",
  contacted: "default",
  qualified: "default",
  won: "default",
  lost: "secondary",
};

const stats = [
  { label: "Total Leads", value: "1,247", icon: Users, trend: "+12.5%" },
  { label: "Qualified Leads", value: "342", icon: Star, trend: "+8.2%" },
  { label: "Avg. Score", value: "84", icon: TrendingUp, trend: "+3.1%" },
  { label: "Response Rate", value: "68%", icon: MessageSquare, trend: "+5.4%" },
];

export function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "all" || lead.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leads & CRM</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your AI-generated leads and customer relationships
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
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="size-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Leads Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer"
                onClick={() => setSelectedLead(lead)}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lead.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600"
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{lead.score}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={stageColors[lead.stage] as any}>
                    {lead.stage}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {lead.source}
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {lead.lastContact}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Mail className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Phone className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Lead Details Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedLead.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Building className="size-4" />
                      {selectedLead.company}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="size-4" />
                      {selectedLead.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-4" />
                      {selectedLead.phone}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {selectedLead.score}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Lead Score
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Stage</Label>
                  <Select defaultValue={selectedLead.stage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Source</Label>
                  <Input value={selectedLead.source} readOnly />
                </div>
              </div>

              <div>
                <Label>Add Note</Label>
                <Textarea placeholder="Add a note about this lead..." rows={3} />
                <Button className="mt-2">Save Note</Button>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <Mail className="size-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="size-4 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
