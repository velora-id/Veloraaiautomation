import { ActivityFeed } from "../components/ActivityFeed";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Download, RefreshCw, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function ActivitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Activity Log</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all activities and events across your workspace
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="size-4" />
          </Button>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Activity Feed with all features */}
      <ActivityFeed maxItems={50} showFilters={true} />
    </div>
  );
}
