// Enhanced UI Components - Export Index
// This file exports all the new advanced frontend components

// Notification System
export { NotificationCenter } from "./NotificationCenter";
export type { Notification } from "./NotificationCenter";

// Command Palette
export { CommandPalette } from "./CommandPalette";

// Activity Feed
export { ActivityFeed } from "./ActivityFeed";
export type { ActivityItem } from "./ActivityFeed";

// Stats Cards
export {
  StatsCard,
  MetricStatsCard,
  UsageStatsCard,
} from "./StatsCard";
export type { StatsCardProps } from "./StatsCard";

// Toast Notifications
export {
  ToastNotificationProvider,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  showWorkflowCompletedToast,
  showWorkflowFailedToast,
  showAgentActivityToast,
  showLeadsGeneratedToast,
  showApiLimitToast,
  testToastNotifications,
} from "./ToastNotificationProvider";

// Quick Actions
export {
  QuickActionsWidget,
  QuickActionFAB,
} from "./QuickActionsWidget";
export type { QuickAction } from "./QuickActionsWidget";

// Agent Dialog
export { AgentDetailsDialog } from "./AgentDetailsDialog";
