import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { UserPlus, Trash2, Shield, Key, Settings } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@acmecorp.com",
    role: "owner",
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@acmecorp.com",
    role: "admin",
    status: "active",
    lastActive: "5 hours ago",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@acmecorp.com",
    role: "member",
    status: "active",
    lastActive: "1 day ago",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@acmecorp.com",
    role: "member",
    status: "active",
    lastActive: "3 days ago",
  },
];

const apiKeys = [
  {
    id: 1,
    name: "Production API Key",
    key: "velo_prod_************************abcd",
    created: "2026-04-01",
    lastUsed: "2 hours ago",
  },
  {
    id: 2,
    name: "Development API Key",
    key: "velo_dev_************************xyz1",
    created: "2026-03-15",
    lastUsed: "1 day ago",
  },
];

const roleColors: Record<string, string> = {
  owner: "default",
  admin: "default",
  member: "secondary",
};

export function TeamSettingsPage() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [apiKeyName, setApiKeyName] = useState("");

  const handleInviteMember = () => {
    toast.success(`Invitation sent to ${inviteEmail}`);
    setIsInviteDialogOpen(false);
    setInviteEmail("");
    setInviteRole("member");
  };

  const handleCreateApiKey = () => {
    toast.success("API key created successfully");
    setIsApiKeyDialogOpen(false);
    setApiKeyName("");
  };

  const handleRemoveMember = (name: string) => {
    toast.success(`${name} removed from team`);
  };

  const handleRevokeApiKey = (name: string) => {
    toast.success(`${name} revoked`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Team Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your team members, roles, and API access
        </p>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Team Members</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invite and manage team members
                </p>
              </div>
              <Dialog
                open={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="size-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="invite-role">Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Members can use agents and workflows. Admins can manage
                        team settings.
                      </p>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsInviteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleInviteMember}>
                        Send Invitation
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleColors[member.role] as any}>
                        <Shield className="size-3 mr-1" />
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{member.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {member.lastActive}
                    </TableCell>
                    <TableCell>
                      {member.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.name)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">API Keys</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage API keys for programmatic access
                </p>
              </div>
              <Dialog
                open={isApiKeyDialogOpen}
                onOpenChange={setIsApiKeyDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Key className="size-4 mr-2" />
                    Create API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create API Key</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="api-key-name">Key Name</Label>
                      <Input
                        id="api-key-name"
                        placeholder="e.g., Production Key"
                        value={apiKeyName}
                        onChange={(e) => setApiKeyName(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Give your API key a descriptive name
                      </p>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsApiKeyDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateApiKey}>Create Key</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {apiKey.key}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {apiKey.created}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {apiKey.lastUsed}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRevokeApiKey(apiKey.name)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">
              <Settings className="size-5 inline mr-2" />
              General Settings
            </h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  defaultValue="Acme Corp"
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="workspace-url">Workspace URL</Label>
                <Input
                  id="workspace-url"
                  defaultValue="acme-corp"
                  className="max-w-md"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  velora.ai/acme-corp
                </p>
              </div>
              <div>
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Danger Zone
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Permanently delete this workspace and all its data
            </p>
            <Button variant="destructive">Delete Workspace</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
