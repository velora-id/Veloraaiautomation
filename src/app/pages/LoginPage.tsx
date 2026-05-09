import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Bot } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/app");
    } catch (error) {
      toast.error((error as Error).message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="size-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-4">
            <Bot className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your Velora AI account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-600 font-medium hover:underline">
            Sign up
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Demo credentials: any email/password
          </p>
        </div>
      </Card>
    </div>
  );
}
