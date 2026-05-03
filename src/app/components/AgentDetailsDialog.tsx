import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Activity,
  BarChart3,
  Code2,
  Settings,
  Key,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface AgentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentName: string | null;
  agentType?: "prebuilt" | "custom";
}

export function AgentDetailsDialog({
  open,
  onOpenChange,
  agentName,
  agentType = "prebuilt",
}: AgentDetailsDialogProps) {
  const [apiKey, setApiKey] = useState("velora_sk_xxxxxxxxxxxxxxxxxxxxx");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (!agentName) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="size-5 text-purple-600" />
            {agentName} - Settings & Analytics
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] pr-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Activity className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Runs
                      </p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    +12% this week
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle2 className="size-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Success Rate
                      </p>
                      <p className="text-2xl font-bold">98.5%</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    +2% improvement
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Clock className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Avg Response
                      </p>
                      <p className="text-2xl font-bold">1.2s</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    15% faster
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <AlertCircle className="size-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Errors
                      </p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    -45% reduction
                  </p>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Agent Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                      Agent Name
                    </Label>
                    <p className="font-medium mt-1">{agentName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                      Type
                    </Label>
                    <Badge variant="secondary" className="mt-1">
                      {agentType === "prebuilt" ? "Prebuilt" : "Custom"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                      Model
                    </Label>
                    <p className="font-medium mt-1">Gemini Pro</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </Label>
                    <Badge className="mt-1 bg-green-500">Active</Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                      Created
                    </Label>
                    <p className="font-medium mt-1">April 15, 2026</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                      Last Modified
                    </Label>
                    <p className="font-medium mt-1">April 27, 2026</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    {
                      time: "2 minutes ago",
                      event: "Agent executed successfully",
                      status: "success",
                    },
                    {
                      time: "15 minutes ago",
                      event: "Configuration updated",
                      status: "info",
                    },
                    {
                      time: "1 hour ago",
                      event: "Agent executed successfully",
                      status: "success",
                    },
                    {
                      time: "2 hours ago",
                      event: "API rate limit warning",
                      status: "warning",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`size-2 rounded-full mt-2 ${
                            activity.status === "success"
                              ? "bg-green-500"
                              : activity.status === "warning"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{activity.event}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <Label className="text-sm text-gray-600 dark:text-gray-400">
                    Usage Trend
                  </Label>
                  <p className="text-2xl font-bold mt-2">+15.3%</p>
                  <p className="text-xs text-gray-500 mt-1">vs last week</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Token Usage
                  </Label>
                  <p className="text-2xl font-bold mt-2">482</p>
                  <p className="text-xs text-gray-500 mt-1">tokens per request</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600 dark:text-gray-400">
                    Cost per Run
                  </Label>
                  <p className="text-2xl font-bold mt-2">$0.003</p>
                  <p className="text-xs text-gray-500 mt-1">average cost</p>
                </Card>
              </div>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Performance Over Time</h3>
                  <Select defaultValue="7days">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24h</SelectItem>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="size-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Performance chart visualization
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Top Error Messages</h3>
                  <div className="space-y-3">
                    {[
                      { error: "Rate limit exceeded", count: 8 },
                      { error: "Invalid input format", count: 5 },
                      { error: "Timeout error", count: 3 },
                      { error: "Context length exceeded", count: 2 },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <p className="text-sm">{item.error}</p>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Usage by Hour</h3>
                  <div className="space-y-3">
                    {[
                      { hour: "09:00-10:00", runs: 142 },
                      { hour: "10:00-11:00", runs: 198 },
                      { hour: "11:00-12:00", runs: 156 },
                      { hour: "12:00-13:00", runs: 89 },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <p className="text-sm">{item.hour}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600"
                              style={{ width: `${(item.runs / 200) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">
                            {item.runs}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* API Tab */}
            <TabsContent value="api" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">API Endpoint</h3>
                <div className="space-y-3">
                  <div>
                    <Label>POST Endpoint</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        readOnly
                        value={`https://api.velora.ai/v1/agents/${agentName
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/run`}
                        className="bg-gray-50 dark:bg-gray-900"
                      />
                      <Button
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            `https://api.velora.ai/v1/agents/${agentName
                              .toLowerCase()
                              .replace(/\s+/g, "-")}/run`,
                            "Endpoint"
                          )
                        }
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">API Key</h3>
                  <Button variant="outline" size="sm">
                    Generate New Key
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Current API Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        readOnly
                        type="password"
                        value={apiKey}
                        className="bg-gray-50 dark:bg-gray-900"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(apiKey, "API Key")}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Keep your API key secure. Never share it publicly.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Sample Code</h3>
                <Tabs defaultValue="curl" className="w-full">
                  <TabsList>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  </TabsList>
                  <TabsContent value="curl">
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        {`curl -X POST https://api.velora.ai/v1/agents/${agentName
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/run \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": "Your input text here"
  }'`}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          copyToClipboard(
                            `curl -X POST https://api.velora.ai/v1/agents/${agentName
                              .toLowerCase()
                              .replace(/\s+/g, "-")}/run`,
                            "Code"
                          )
                        }
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="python">
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        {`import requests

url = "https://api.velora.ai/v1/agents/${agentName
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/run"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
data = {
    "input": "Your input text here"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard("Python code", "Code")}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="javascript">
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        {`const response = await fetch(
  "https://api.velora.ai/v1/agents/${agentName
    .toLowerCase()
    .replace(/\s+/g, "-")}/run",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer ${apiKey}",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: "Your input text here"
    })
  }
);

const data = await response.json();
console.log(data);`}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard("JavaScript code", "Code")}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Rate Limits</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Requests per minute</p>
                      <p className="text-sm text-gray-500">Current: 45 / 60</p>
                    </div>
                    <Badge variant="secondary">75%</Badge>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: "75%" }} />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Agent Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Agent Name</Label>
                    <Input defaultValue={agentName} className="mt-1" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      defaultValue="Agent description..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>AI Model</Label>
                    <Select defaultValue="gemini-pro">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        <SelectItem value="gemini-pro-vision">
                          Gemini Pro Vision
                        </SelectItem>
                        <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Advanced Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Enable agent</p>
                      <p className="text-sm text-gray-500">
                        Allow this agent to process requests
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Enable API access</p>
                      <p className="text-sm text-gray-500">
                        Allow external API calls
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Detailed logging</p>
                      <p className="text-sm text-gray-500">
                        Log all requests and responses
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Auto-retry on failure</p>
                      <p className="text-sm text-gray-500">
                        Automatically retry failed requests
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-red-200 dark:border-red-900">
                <h3 className="font-semibold mb-4 text-red-600">Danger Zone</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Delete Agent</p>
                      <p className="text-sm text-gray-500">
                        Permanently delete this agent and all its data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Execution Logs</h3>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Logs</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Errors</SelectItem>
                      <SelectItem value="warning">Warnings</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="size-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {[
                    {
                      timestamp: "2026-04-27 10:45:23",
                      status: "success",
                      message: "Agent executed successfully",
                      duration: "1.2s",
                      tokens: 482,
                    },
                    {
                      timestamp: "2026-04-27 10:43:15",
                      status: "success",
                      message: "Agent executed successfully",
                      duration: "0.9s",
                      tokens: 356,
                    },
                    {
                      timestamp: "2026-04-27 10:40:08",
                      status: "error",
                      message: "Rate limit exceeded",
                      duration: "0.1s",
                      tokens: 0,
                    },
                    {
                      timestamp: "2026-04-27 10:38:42",
                      status: "success",
                      message: "Agent executed successfully",
                      duration: "1.5s",
                      tokens: 623,
                    },
                    {
                      timestamp: "2026-04-27 10:35:19",
                      status: "warning",
                      message: "High token usage detected",
                      duration: "2.1s",
                      tokens: 1024,
                    },
                  ].map((log, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`size-2 rounded-full mt-2 ${
                              log.status === "success"
                                ? "bg-green-500"
                                : log.status === "error"
                                ? "bg-red-500"
                                : "bg-orange-500"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-medium">{log.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {log.timestamp}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{log.duration}</span>
                          <span>{log.tokens} tokens</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}