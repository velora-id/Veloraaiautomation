import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Check, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const integrations = [
  {
    id: 1,
    name: "Gmail",
    category: "Email",
    description: "Send automated emails and sync conversations",
    icon: "📧",
    connected: true,
    popular: true,
  },
  {
    id: 2,
    name: "Google Sheets",
    category: "Spreadsheets",
    description: "Read and write data to Google Sheets",
    icon: "📊",
    connected: true,
    popular: true,
  },
  {
    id: 3,
    name: "Slack",
    category: "Communication",
    description: "Send notifications and messages to Slack channels",
    icon: "💬",
    connected: false,
    popular: true,
  },
  {
    id: 4,
    name: "WhatsApp Business",
    category: "Messaging",
    description: "Send automated WhatsApp messages to customers",
    icon: "📱",
    connected: false,
    popular: true,
  },
  {
    id: 5,
    name: "Salesforce",
    category: "CRM",
    description: "Sync leads and contacts with Salesforce",
    icon: "☁️",
    connected: true,
    popular: false,
  },
  {
    id: 6,
    name: "HubSpot",
    category: "CRM",
    description: "Integrate with HubSpot CRM and Marketing Hub",
    icon: "🎯",
    connected: false,
    popular: true,
  },
  {
    id: 7,
    name: "Stripe",
    category: "Payments",
    description: "Process payments and manage subscriptions",
    icon: "💳",
    connected: false,
    popular: false,
  },
  {
    id: 8,
    name: "Zapier",
    category: "Automation",
    description: "Connect to 5,000+ apps via Zapier",
    icon: "⚡",
    connected: false,
    popular: true,
  },
  {
    id: 9,
    name: "Webhook",
    category: "Custom",
    description: "Send data to any HTTP endpoint",
    icon: "🔗",
    connected: true,
    popular: false,
  },
  {
    id: 10,
    name: "LinkedIn",
    category: "Social",
    description: "Automate LinkedIn outreach and lead generation",
    icon: "💼",
    connected: false,
    popular: false,
  },
  {
    id: 11,
    name: "Twitter/X",
    category: "Social",
    description: "Post tweets and monitor mentions",
    icon: "🐦",
    connected: false,
    popular: false,
  },
  {
    id: 12,
    name: "Notion",
    category: "Productivity",
    description: "Create and update Notion pages and databases",
    icon: "📝",
    connected: false,
    popular: false,
  },
];

const categories = [
  "All",
  "Email",
  "CRM",
  "Communication",
  "Messaging",
  "Social",
  "Productivity",
  "Payments",
  "Custom",
];

export function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedIntegrations = filteredIntegrations.filter(
    (i) => i.connected
  );
  const availableIntegrations = filteredIntegrations.filter(
    (i) => !i.connected
  );

  const handleConnect = (name: string) => {
    toast.success(`${name} connected successfully!`);
  };

  const handleDisconnect = (name: string) => {
    toast.success(`${name} disconnected`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect Velora AI with your favorite tools and services
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          placeholder="Search integrations..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All Integrations ({filteredIntegrations.length})
          </TabsTrigger>
          <TabsTrigger value="connected">
            Connected ({connectedIntegrations.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({availableIntegrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
                    {integration.icon}
                  </div>
                  <div className="flex gap-2">
                    {integration.popular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                    {integration.connected && (
                      <Badge className="text-xs gap-1">
                        <Check className="size-3" />
                        Connected
                      </Badge>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {integration.description}
                </p>
                <Badge variant="outline" className="mb-4">
                  {integration.category}
                </Badge>
                <Button
                  className="w-full"
                  variant={integration.connected ? "outline" : "default"}
                  onClick={() =>
                    integration.connected
                      ? handleDisconnect(integration.name)
                      : handleConnect(integration.name)
                  }
                >
                  {integration.connected ? (
                    "Disconnect"
                  ) : (
                    <>
                      <Plus className="size-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connected" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedIntegrations.map((integration) => (
              <Card key={integration.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
                    {integration.icon}
                  </div>
                  <Badge className="text-xs gap-1">
                    <Check className="size-3" />
                    Connected
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {integration.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => handleDisconnect(integration.name)}
                  >
                    Disconnect
                  </Button>
                  <Button className="flex-1">Configure</Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableIntegrations.map((integration) => (
              <Card key={integration.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
                    {integration.icon}
                  </div>
                  {integration.popular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {integration.description}
                </p>
                <Button
                  className="w-full"
                  onClick={() => handleConnect(integration.name)}
                >
                  <Plus className="size-4 mr-2" />
                  Connect
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
