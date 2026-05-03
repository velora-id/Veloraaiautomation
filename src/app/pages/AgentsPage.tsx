import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Bot,
  Mail,
  MessageSquare,
  FileText,
  Search as SearchIcon,
  Plus,
  Play,
  History,
  Settings,
  Copy,
  Upload,
  Sparkles,
  Code,
  Database,
  TestTube,
  FileUp,
  X,
  ChevronRight,
  Zap,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import { AgentDetailsDialog } from "../components/AgentDetailsDialog";

const prebuiltAgents = [
  {
    id: 1,
    name: "Lead Generation Agent",
    description:
      "Automatically find and qualify leads based on your criteria. Enriches contact data and scores lead quality.",
    icon: SearchIcon,
    category: "Sales",
    runs: 1247,
    status: "active",
  },
  {
    id: 2,
    name: "Email Writer Agent",
    description:
      "Generate personalized email campaigns, follow-ups, and outreach messages at scale.",
    icon: Mail,
    category: "Marketing",
    runs: 892,
    status: "active",
  },
  {
    id: 3,
    name: "Customer Support Agent",
    description:
      "Handle customer inquiries, provide instant support, and escalate complex issues to your team.",
    icon: MessageSquare,
    category: "Support",
    runs: 2341,
    status: "active",
  },
  {
    id: 4,
    name: "Content Generator Agent",
    description:
      "Create blog posts, social media content, SEO articles, and marketing copy automatically.",
    icon: FileText,
    category: "Content",
    runs: 534,
    status: "active",
  },
  {
    id: 5,
    name: "Research Agent",
    description:
      "Gather market intelligence, competitive analysis, and industry insights from multiple sources.",
    icon: SearchIcon,
    category: "Research",
    runs: 423,
    status: "active",
  },
];

const customAgents = [
  {
    id: 101,
    name: "Product Review Analyzer",
    description: "Custom agent to analyze product reviews and extract insights",
    prompt: "Analyze product reviews and provide sentiment analysis...",
    runs: 89,
    createdAt: "2026-04-15",
  },
  {
    id: 102,
    name: "Invoice Processor",
    description: "Extract data from invoices and update accounting system",
    prompt: "Process incoming invoices and extract key information...",
    runs: 156,
    createdAt: "2026-04-10",
  },
];

const agentHistory = [
  {
    id: 1,
    agentName: "Lead Generation Agent",
    timestamp: "2026-04-27 10:45 AM",
    result: "Found 23 qualified leads",
    status: "success",
  },
  {
    id: 2,
    agentName: "Email Writer Agent",
    timestamp: "2026-04-27 09:30 AM",
    result: "Generated 15 personalized emails",
    status: "success",
  },
  {
    id: 3,
    agentName: "Customer Support Agent",
    timestamp: "2026-04-27 08:15 AM",
    result: "Handled 42 customer inquiries",
    status: "success",
  },
];

export function AgentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentDescription, setNewAgentDescription] = useState("");
  const [newAgentPrompt, setNewAgentPrompt] = useState("");
  
  // Advanced configuration state
  const [selectedModel, setSelectedModel] = useState("gemini-pro");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([1024]);
  const [topP, setTopP] = useState([0.9]);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [inputVariables, setInputVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Agent details dialog state
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedAgentType, setSelectedAgentType] = useState<"prebuilt" | "custom">("prebuilt");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleCreateAgent = () => {
    toast.success("Custom agent created successfully!");
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewAgentName("");
    setNewAgentDescription("");
    setNewAgentPrompt("");
    setSystemPrompt("");
    setSelectedModel("gemini-pro");
    setTemperature([0.7]);
    setMaxTokens([1024]);
    setTopP([0.9]);
    setInputVariables([]);
    setUploadedFiles([]);
    setTestInput("");
    setTestOutput("");
    setActiveTab("basic");
  };

  const handleAddVariable = () => {
    if (newVariable && !inputVariables.includes(newVariable)) {
      setInputVariables([...inputVariables, newVariable]);
      setNewVariable("");
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setInputVariables(inputVariables.filter((v) => v !== variable));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map((file) => file.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
      toast.success(`${files.length} file(s) uploaded successfully`);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f !== fileName));
  };

  const handleTestAgent = () => {
    setIsTesting(true);
    // Simulate AI processing
    setTimeout(() => {
      setTestOutput(
        `[Simulated Response]\n\nProcessed with model: ${selectedModel}\nTemperature: ${temperature[0]}\n\nThis is a mock response based on your prompt and input. In production, this would be the actual AI-generated output using the Gemini API with your configured settings.\n\nInput received: "${testInput}"\n\nThe agent would process this according to your prompt template and return structured results.`
      );
      setIsTesting(false);
      toast.success("Test completed successfully");
    }, 2000);
  };

  const insertVariable = (variable: string) => {
    setNewAgentPrompt(newAgentPrompt + `{{${variable}}}`);
  };

  const handleRunAgent = (agentName: string) => {
    toast.success(`${agentName} started running`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Agents</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Build and manage AI agents to automate your business tasks
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Create Custom Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-purple-600" />
                Create Advanced AI Agent
              </DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="prompt">Prompt Builder</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                <TabsTrigger value="test">Test & Deploy</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[500px] pr-4">
                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="agent-name">Agent Name *</Label>
                    <Input
                      id="agent-name"
                      placeholder="e.g., Product Review Analyzer"
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="agent-description">Description *</Label>
                    <Textarea
                      id="agent-description"
                      placeholder="Describe what this agent does and when to use it"
                      rows={3}
                      value={newAgentDescription}
                      onChange={(e) => setNewAgentDescription(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Agent Type</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Card className="p-4 cursor-pointer border-2 border-purple-500 bg-purple-50 dark:bg-purple-950">
                        <div className="flex items-start gap-3">
                          <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <Brain className="size-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">Text Agent</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Process and generate text-based content
                            </p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4 cursor-pointer border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700">
                        <div className="flex items-start gap-3">
                          <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Zap className="size-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">Function Agent</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Execute functions and API calls
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setActiveTab("prompt")}>
                      Next: Prompt Builder
                      <ChevronRight className="size-4 ml-2" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Prompt Builder Tab */}
                <TabsContent value="prompt" className="space-y-4">
                  <div>
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea
                      id="system-prompt"
                      placeholder="Define the agent's role, personality, and overall behavior..."
                      rows={4}
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      This sets the context and behavior for your AI agent
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="agent-prompt">User Prompt Template *</Label>
                    <Textarea
                      id="agent-prompt"
                      placeholder="Enter your prompt template. Use {{variable_name}} to insert dynamic variables..."
                      rows={8}
                      value={newAgentPrompt}
                      onChange={(e) => setNewAgentPrompt(e.target.value)}
                    />
                  </div>

                  {/* Variables Section */}
                  <div className="space-y-3">
                    <Label>Input Variables</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Variable name (e.g., customer_name)"
                        value={newVariable}
                        onChange={(e) => setNewVariable(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddVariable()}
                      />
                      <Button onClick={handleAddVariable}>
                        <Plus className="size-4 mr-2" />
                        Add Variable
                      </Button>
                    </div>
                    
                    {inputVariables.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to insert into prompt:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {inputVariables.map((variable) => (
                            <Badge
                              key={variable}
                              variant="secondary"
                              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"
                            >
                              <span onClick={() => insertVariable(variable)}>
                                {`{{${variable}}}`}
                              </span>
                              <X
                                className="size-3 ml-2 cursor-pointer"
                                onClick={() => handleRemoveVariable(variable)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prompt Templates */}
                  <div className="space-y-2">
                    <Label>Quick Templates</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNewAgentPrompt(
                            "Analyze the following {{data_type}} and provide insights:\n\n{{input_data}}\n\nFocus on:\n1. Key findings\n2. Patterns and trends\n3. Actionable recommendations"
                          )
                        }
                      >
                        Analysis Template
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNewAgentPrompt(
                            "Generate {{content_type}} about {{topic}} with the following requirements:\n\n- Tone: {{tone}}\n- Length: {{length}}\n- Target audience: {{audience}}\n\nContent:"
                          )
                        }
                      >
                        Content Generation
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNewAgentPrompt(
                            "Extract the following information from the text:\n\n{{input_text}}\n\nExtract:\n- {{field_1}}\n- {{field_2}}\n- {{field_3}}\n\nProvide output in JSON format."
                          )
                        }
                      >
                        Data Extraction
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNewAgentPrompt(
                            "You are a {{role}} helping with {{task}}. \n\nUser input: {{user_message}}\n\nProvide a helpful, professional response."
                          )
                        }
                      >
                        Conversational
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setActiveTab("basic")}>
                      Back
                    </Button>
                    <Button onClick={() => setActiveTab("config")}>
                      Next: Configuration
                      <ChevronRight className="size-4 ml-2" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Configuration Tab */}
                <TabsContent value="config" className="space-y-6">
                  <div>
                    <Label htmlFor="model-select">AI Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-pro">
                          Gemini Pro - Best for text tasks
                        </SelectItem>
                        <SelectItem value="gemini-pro-vision">
                          Gemini Pro Vision - Supports images
                        </SelectItem>
                        <SelectItem value="gemini-ultra">
                          Gemini Ultra - Most capable
                        </SelectItem>
                        <SelectItem value="gemini-nano">
                          Gemini Nano - Fast & efficient
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Temperature: {temperature[0]}</Label>
                        <span className="text-sm text-gray-500">
                          {temperature[0] < 0.3
                            ? "Precise"
                            : temperature[0] < 0.7
                            ? "Balanced"
                            : "Creative"}
                        </span>
                      </div>
                      <Slider
                        value={temperature}
                        onValueChange={setTemperature}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Lower values = more focused, higher = more creative
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Max Output Tokens: {maxTokens[0]}</Label>
                      </div>
                      <Slider
                        value={maxTokens}
                        onValueChange={setMaxTokens}
                        min={256}
                        max={8192}
                        step={256}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Maximum length of the generated response
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Top P (Nucleus Sampling): {topP[0]}</Label>
                      </div>
                      <Slider
                        value={topP}
                        onValueChange={setTopP}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Controls diversity of responses
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Safety & Moderation</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Content Filtering</p>
                          <p className="text-sm text-gray-500">
                            Block harmful or inappropriate content
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">PII Detection</p>
                          <p className="text-sm text-gray-500">
                            Detect and mask personal information
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Output Format</Label>
                    <Select defaultValue="text">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Plain Text</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setActiveTab("prompt")}>
                      Back
                    </Button>
                    <Button onClick={() => setActiveTab("knowledge")}>
                      Next: Knowledge Base
                      <ChevronRight className="size-4 ml-2" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Knowledge Base Tab */}
                <TabsContent value="knowledge" className="space-y-4">
                  <div>
                    <Label>Upload Knowledge Documents</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Upload documents to provide context to your agent (PDF, TXT, CSV,
                      DOCX)
                    </p>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        multiple
                        accept=".pdf,.txt,.csv,.docx"
                        onChange={handleFileUpload}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FileUp className="size-12 text-gray-400 mb-3" />
                        <p className="font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF, TXT, CSV, DOCX up to 10MB each
                        </p>
                      </label>
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Files ({uploadedFiles.length})</Label>
                      <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="size-5 text-blue-600" />
                              <span className="text-sm font-medium">{file}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFile(file)}
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <Label>Context Settings</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Auto-include context</p>
                          <p className="text-sm text-gray-500">
                            Automatically add relevant documents to prompts
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Semantic search</p>
                          <p className="text-sm text-gray-500">
                            Find relevant content using AI embeddings
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setActiveTab("config")}>
                      Back
                    </Button>
                    <Button onClick={() => setActiveTab("test")}>
                      Next: Test & Deploy
                      <ChevronRight className="size-4 ml-2" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Test & Deploy Tab */}
                <TabsContent value="test" className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <TestTube className="size-4" />
                      Test Your Agent
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Test your agent with sample inputs before deploying
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Test Input</Label>
                      <Textarea
                        placeholder="Enter test input here..."
                        rows={8}
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                      />
                      <Button
                        onClick={handleTestAgent}
                        disabled={isTesting || !testInput}
                        className="w-full"
                      >
                        {isTesting ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <Play className="size-4 mr-2" />
                            Run Test
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Agent Output</Label>
                      <Textarea
                        placeholder="Output will appear here..."
                        rows={8}
                        value={testOutput}
                        readOnly
                        className="bg-gray-50 dark:bg-gray-900"
                      />
                      {testOutput && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            navigator.clipboard.writeText(testOutput);
                            toast.success("Output copied to clipboard");
                          }}
                        >
                          <Copy className="size-4 mr-2" />
                          Copy Output
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>API Endpoint</Label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={`https://api.velora.ai/v1/agents/${newAgentName.toLowerCase().replace(/\s+/g, "-") || "your-agent"}`}
                        className="bg-gray-50 dark:bg-gray-900"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          toast.success("Endpoint copied to clipboard");
                        }}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Use this endpoint to call your agent via API
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label>Deployment Options</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Auto-activate agent</p>
                          <p className="text-sm text-gray-500">
                            Make agent available immediately after creation
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Enable API access</p>
                          <p className="text-sm text-gray-500">
                            Allow external applications to call this agent
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Monitoring & logging</p>
                          <p className="text-sm text-gray-500">
                            Track usage and performance metrics
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setActiveTab("knowledge")}>
                      Back
                    </Button>
                    <Button onClick={handleCreateAgent} className="min-w-32">
                      <Sparkles className="size-4 mr-2" />
                      Create Agent
                    </Button>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="prebuilt" className="w-full">
        <TabsList>
          <TabsTrigger value="prebuilt">Prebuilt Agents</TabsTrigger>
          <TabsTrigger value="custom">Custom Agents</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
        </TabsList>

        <TabsContent value="prebuilt" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prebuiltAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <Card key={agent.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                      <Icon className="size-6 text-purple-600" />
                    </div>
                    <Badge variant="secondary">{agent.category}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {agent.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{agent.runs.toLocaleString()} runs</span>
                    <Badge
                      variant={agent.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleRunAgent(agent.name)}
                    >
                      <Play className="size-4 mr-2" />
                      Run
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedAgent(agent.name);
                        setSelectedAgentType("prebuilt");
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Settings className="size-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          {customAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customAgents.map((agent) => (
                <Card key={agent.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                      <Bot className="size-6 text-purple-600" />
                    </div>
                    <Badge variant="outline">Custom</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {agent.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{agent.runs} runs</span>
                    <span>Created {agent.createdAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleRunAgent(agent.name)}
                    >
                      <Play className="size-4 mr-2" />
                      Run
                    </Button>
                    <Button variant="outline" size="icon">
                      <Copy className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedAgent(agent.name);
                        setSelectedAgentType("custom");
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Settings className="size-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Bot className="size-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No custom agents yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first custom AI agent to get started
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="size-4 mr-2" />
                Create Custom Agent
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {agentHistory.map((run) => (
                <div key={run.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                      <History className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{run.agentName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {run.result}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {run.timestamp}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={run.status === "success" ? "default" : "secondary"}
                  >
                    {run.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AgentDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        agentName={selectedAgent}
        agentType={selectedAgentType}
      />
    </div>
  );
}