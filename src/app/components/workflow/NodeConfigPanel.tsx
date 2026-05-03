import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { WorkflowNodeData } from "./WorkflowNode";
import { X, Settings } from "lucide-react";
import { Badge } from "../ui/badge";

interface NodeConfigPanelProps {
  node: WorkflowNodeData | null;
  onClose: () => void;
  onUpdate: (nodeId: string, config: Record<string, any>) => void;
}

export function NodeConfigPanel({ node, onClose, onUpdate }: NodeConfigPanelProps) {
  if (!node) {
    return (
      <Card className="w-96 h-full flex items-center justify-center">
        <div className="text-center p-8">
          <Settings className="size-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select a node to configure
          </p>
        </div>
      </Card>
    );
  }

  const renderConfigFields = () => {
    switch (node.category) {
      case "webhook":
        return (
          <div className="space-y-4">
            <div>
              <Label>Webhook URL</Label>
              <Input
                readOnly
                value={`https://api.velora.ai/webhooks/${node.id}`}
                className="bg-gray-50 dark:bg-gray-900 mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Send POST requests to this URL to trigger the workflow
              </p>
            </div>
            <div>
              <Label>Authentication</Label>
              <Select defaultValue="api_key">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="api_key">API Key</SelectItem>
                  <SelectItem value="oauth">OAuth 2.0</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Validate payload</p>
                <p className="text-xs text-gray-500">Verify request signature</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-4">
            <div>
              <Label>Schedule Type</Label>
              <Select defaultValue="cron">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interval">Interval</SelectItem>
                  <SelectItem value="cron">Cron Expression</SelectItem>
                  <SelectItem value="specific">Specific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cron Expression</Label>
              <Input
                placeholder="0 0 * * *"
                defaultValue="0 9 * * 1-5"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Every weekday at 9:00 AM
              </p>
            </div>
            <div>
              <Label>Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">EST (America/New_York)</SelectItem>
                  <SelectItem value="pst">PST (America/Los_Angeles)</SelectItem>
                  <SelectItem value="gmt">GMT (Europe/London)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "ai_agent":
        return (
          <div className="space-y-4">
            <div>
              <Label>Select AI Agent</Label>
              <Select defaultValue="lead-gen">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead-gen">Lead Generation Agent</SelectItem>
                  <SelectItem value="email-writer">Email Writer Agent</SelectItem>
                  <SelectItem value="support">Customer Support Agent</SelectItem>
                  <SelectItem value="content">Content Generator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Input Data</Label>
              <Textarea
                placeholder="Map input data from previous steps..."
                rows={4}
                defaultValue="{\n  &quot;input&quot;: &quot;{{trigger.data}}&quot;\n}"
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Stream response</p>
                <p className="text-xs text-gray-500">Get real-time output</p>
              </div>
              <Switch />
            </div>
          </div>
        );

      case "send_email":
        return (
          <div className="space-y-4">
            <div>
              <Label>Email Service</Label>
              <Select defaultValue="gmail">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="smtp">SMTP</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="ses">AWS SES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>To</Label>
              <Input
                placeholder="recipient@example.com or {{lead.email}}"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input placeholder="Email subject" className="mt-1" />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea
                placeholder="Email body with {{variables}}"
                rows={6}
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">HTML format</p>
                <p className="text-xs text-gray-500">Send as HTML email</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        );

      case "http_request":
        return (
          <div className="space-y-4">
            <div>
              <Label>Method</Label>
              <Select defaultValue="post">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="get">GET</SelectItem>
                  <SelectItem value="post">POST</SelectItem>
                  <SelectItem value="put">PUT</SelectItem>
                  <SelectItem value="patch">PATCH</SelectItem>
                  <SelectItem value="delete">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>URL</Label>
              <Input
                placeholder="https://api.example.com/endpoint"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Headers (JSON)</Label>
              <Textarea
                placeholder='{"Authorization": "Bearer {{token}}"}'
                rows={3}
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div>
              <Label>Body (JSON)</Label>
              <Textarea
                placeholder='{"data": "{{input}}"}'
                rows={4}
                className="mt-1 font-mono text-sm"
              />
            </div>
          </div>
        );

      case "database":
        return (
          <div className="space-y-4">
            <div>
              <Label>Database Connection</Label>
              <Select defaultValue="postgres">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                  <SelectItem value="supabase">Supabase</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Query</Label>
              <Textarea
                placeholder="SELECT * FROM users WHERE email = {{email}}"
                rows={6}
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Return first row only</p>
                <p className="text-xs text-gray-500">Limit to single result</p>
              </div>
              <Switch />
            </div>
          </div>
        );

      case "condition":
        return (
          <div className="space-y-4">
            <div>
              <Label>Condition Type</Label>
              <Select defaultValue="if">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="if">If/Else</SelectItem>
                  <SelectItem value="switch">Switch/Case</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Left Value</Label>
              <Input placeholder="{{variable}}" className="mt-1" />
            </div>
            <div>
              <Label>Operator</Label>
              <Select defaultValue="equals">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="greater">Greater Than</SelectItem>
                  <SelectItem value="less">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="starts_with">Starts With</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Right Value</Label>
              <Input placeholder="value" className="mt-1" />
            </div>
          </div>
        );

      case "delay":
        return (
          <div className="space-y-4">
            <div>
              <Label>Delay Duration</Label>
              <div className="flex gap-2 mt-1">
                <Input type="number" placeholder="5" defaultValue="5" />
                <Select defaultValue="minutes">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Delay Until</Label>
              <Input
                type="datetime-local"
                className="mt-1"
                placeholder="Or delay until specific time"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center p-4 text-sm text-gray-500">
            Configuration panel for {node.category}
          </div>
        );
    }
  };

  return (
    <Card className="w-96 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">Node Configuration</h3>
            <Badge variant="secondary" className="text-xs">
              {node.type}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{node.name}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <Label>Node Name</Label>
            <Input defaultValue={node.name} className="mt-1" />
          </div>

          <Separator />

          {renderConfigFields()}

          <Separator />

          <div className="space-y-3">
            <Label>Advanced Options</Label>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Continue on error</p>
                <p className="text-xs text-gray-500">Don't stop workflow if fails</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Enable timeout</p>
                <p className="text-xs text-gray-500">Set max execution time</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={() => onUpdate(node.id, {})}>
          Save Changes
        </Button>
      </div>
    </Card>
  );
}
