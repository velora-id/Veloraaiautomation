import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export type StatsCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  description?: string;
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  color?: "purple" | "blue" | "green" | "yellow" | "red" | "pink" | "cyan";
  onClick?: () => void;
};

const colorClasses = {
  purple: {
    bg: "bg-purple-100 dark:bg-purple-950",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    gradient: "from-purple-500 to-purple-600",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    gradient: "from-blue-500 to-blue-600",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-950",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    gradient: "from-green-500 to-green-600",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
    gradient: "from-yellow-500 to-yellow-600",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    gradient: "from-red-500 to-red-600",
  },
  pink: {
    bg: "bg-pink-100 dark:bg-pink-950",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800",
    gradient: "from-pink-500 to-pink-600",
  },
  cyan: {
    bg: "bg-cyan-100 dark:bg-cyan-950",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800",
    gradient: "from-cyan-500 to-cyan-600",
  },
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  progress,
  badge,
  color = "purple",
  onClick,
}: StatsCardProps) {
  const colors = colorClasses[color];

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case "up":
        return <TrendingUp className="size-3" />;
      case "down":
        return <TrendingDown className="size-3" />;
      default:
        return <Minus className="size-3" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "";
    switch (trend.direction) {
      case "up":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950";
      case "down":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800";
    }
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient}`} />

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
              {badge && (
                <Badge variant={badge.variant || "secondary"} className="text-xs">
                  {badge.text}
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">{value}</h3>
            </div>
          </div>

          <div className={`size-12 rounded-xl flex items-center justify-center border ${colors.bg} ${colors.text} ${colors.border}`}>
            <Icon className="size-6" />
          </div>
        </div>

        <div className="space-y-3">
          {trend && (
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {trend.label}
              </span>
            </div>
          )}

          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}

          {progress && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  {progress.label || "Progress"}
                </span>
                <span className="font-medium">
                  {progress.value} / {progress.max}
                </span>
              </div>
              <Progress
                value={(progress.value / progress.max) * 100}
                className="h-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Pre-configured stat card variants
export function MetricStatsCard({
  label,
  value,
  change,
  changeLabel = "vs last month",
  icon: Icon,
  color = "purple",
}: {
  label: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: StatsCardProps["color"];
}) {
  return (
    <StatsCard
      title={label}
      value={value}
      icon={Icon}
      color={color}
      trend={{
        value: change,
        label: changeLabel,
        direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
      }}
    />
  );
}

export function UsageStatsCard({
  label,
  used,
  total,
  icon: Icon,
  color = "purple",
}: {
  label: string;
  used: number;
  total: number;
  icon: LucideIcon;
  color?: StatsCardProps["color"];
}) {
  const percentage = Math.round((used / total) * 100);
  const isNearLimit = percentage >= 80;

  return (
    <StatsCard
      title={label}
      value={used.toLocaleString()}
      icon={Icon}
      color={isNearLimit ? "red" : color}
      progress={{
        value: used,
        max: total,
        label: `${percentage}% used`,
      }}
      badge={
        isNearLimit
          ? { text: "Near Limit", variant: "destructive" }
          : undefined
      }
    />
  );
}
