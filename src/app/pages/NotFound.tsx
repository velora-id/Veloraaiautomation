import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-purple-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button>
            <Home className="size-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
