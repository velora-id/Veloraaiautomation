import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, Settings, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export type Notification = {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  icon?: React.ReactNode;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Workflow Completed",
    description: "Lead Generation workflow finished processing 150 new leads",
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "New Team Member",
    description: "Sarah Johnson joined your workspace",
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "API Limit Warning",
    description: "You've used 90% of your monthly AI credits",
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: false,
    actionUrl: "/app/billing",
  },
  {
    id: "4",
    type: "success",
    title: "Integration Connected",
    description: "Successfully connected to Salesforce CRM",
    timestamp: new Date(Date.now() - 4 * 3600000),
    read: true,
  },
  {
    id: "5",
    type: "info",
    title: "Agent Update",
    description: "Customer Support Agent was updated with new training data",
    timestamp: new Date(Date.now() - 24 * 3600000),
    read: true,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-400";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400";
      case "error":
        return "text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400";
      default:
        return "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-purple-600 rounded-full px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[400px] p-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 className="font-semibold text-base">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {unreadCount} unread
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-8"
              >
                <CheckCheck className="size-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="size-8">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="read" className="text-xs">
                Read
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[400px]">
            <TabsContent value="all" className="mt-0 p-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <Bell className="size-12 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No notifications</p>
                  <p className="text-xs">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      getNotificationColor={getNotificationColor}
                      formatTimestamp={formatTimestamp}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread" className="mt-0 p-2">
              {unreadNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <CheckCheck className="size-12 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No unread notifications</p>
                  <p className="text-xs">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {unreadNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      getNotificationColor={getNotificationColor}
                      formatTimestamp={formatTimestamp}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="read" className="mt-0 p-2">
              {readNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <Bell className="size-12 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No read notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {readNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      getNotificationColor={getNotificationColor}
                      formatTimestamp={formatTimestamp}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>

          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="size-4 mr-2" />
                  Clear all notifications
                </Button>
              </div>
            </>
          )}
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  getNotificationColor,
  formatTimestamp,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getNotificationColor: (type: Notification["type"]) => string;
  formatTimestamp: (date: Date) => string;
}) {
  return (
    <div
      className={`group relative p-3 rounded-lg border transition-colors cursor-pointer ${
        notification.read
          ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
          : "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-950/50"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`flex-shrink-0 size-10 rounded-lg flex items-center justify-center ${getNotificationColor(
            notification.type
          )}`}
        >
          <Bell className="size-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            {!notification.read && (
              <span className="flex-shrink-0 size-2 bg-purple-600 rounded-full mt-1.5" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {notification.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {formatTimestamp(notification.timestamp)}
            </span>
            {notification.actionUrl && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                View →
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
            >
              <Check className="size-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
          >
            <X className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
