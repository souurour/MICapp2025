import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  Clock,
  Filter,
  MoreHorizontal,
  Settings,
  Trash2,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Notification types
type NotificationType = "alert" | "maintenance" | "system" | "prediction";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: Date;
  isRead: boolean;
  relatedId?: string;
  priority?: "low" | "medium" | "high";
  actionUrl?: string;
}

// Helper to get notification type icon
const getNotificationIcon = (type: NotificationType, priority?: string) => {
  switch (type) {
    case "alert":
      return (
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            priority === "high"
              ? "bg-red-100"
              : priority === "medium"
                ? "bg-yellow-100"
                : "bg-blue-100",
          )}
        >
          <AlertTriangle
            className={cn(
              "h-5 w-5",
              priority === "high"
                ? "text-red-600"
                : priority === "medium"
                  ? "text-yellow-600"
                  : "text-blue-600",
            )}
          />
        </div>
      );
    case "maintenance":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
          <Wrench className="h-5 w-5 text-green-600" />
        </div>
      );
    case "prediction":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
          <Clock className="h-5 w-5 text-purple-600" />
        </div>
      );
    case "system":
    default:
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
          <Settings className="h-5 w-5 text-gray-600" />
        </div>
      );
  }
};

// Format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else {
    return new Date(date).toLocaleDateString();
  }
};

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "alert",
    title: "Critical Alert: Laser Cutter A",
    description:
      "Temperature exceeding safe operating levels. Immediate attention required.",
    createdAt: new Date("2023-10-21T09:30:00"),
    isRead: false,
    relatedId: "a1",
    priority: "high",
    actionUrl: "/alerts/a1",
  },
  {
    id: "n2",
    type: "maintenance",
    title: "Maintenance Completed",
    description:
      "Scheduled maintenance for Washing Machine B has been completed by John Technician.",
    createdAt: new Date("2023-10-21T08:15:00"),
    isRead: false,
    relatedId: "m1",
    actionUrl: "/maintenance/m1",
  },
  {
    id: "n3",
    type: "prediction",
    title: "Maintenance Prediction: Drying Unit C",
    description:
      "Heating element predicted to fail within 7 days. Schedule maintenance soon.",
    createdAt: new Date("2023-10-20T14:45:00"),
    isRead: true,
    relatedId: "p3",
    priority: "medium",
    actionUrl: "/prediction",
  },
  {
    id: "n4",
    type: "system",
    title: "Weekly Report Generated",
    description: "The weekly performance report is now available for download.",
    createdAt: new Date("2023-10-20T09:00:00"),
    isRead: true,
    actionUrl: "/reports",
  },
  {
    id: "n5",
    type: "alert",
    title: "Alert: Stitching Machine D",
    description: "Thread tension needs adjustment. Performance degrading.",
    createdAt: new Date("2023-10-19T15:30:00"),
    isRead: true,
    relatedId: "a4",
    priority: "low",
    actionUrl: "/alerts/a4",
  },
  {
    id: "n6",
    type: "maintenance",
    title: "Maintenance Scheduled",
    description:
      "Laser calibration and lens cleaning for Laser Cutter A scheduled for tomorrow at 9:00 AM.",
    createdAt: new Date("2023-10-19T11:20:00"),
    isRead: true,
    relatedId: "m3",
    actionUrl: "/maintenance/m3",
  },
  {
    id: "n7",
    type: "system",
    title: "New User Registered",
    description: "A new technician account has been created by Admin.",
    createdAt: new Date("2023-10-18T16:45:00"),
    isRead: true,
  },
  {
    id: "n8",
    type: "prediction",
    title: "Efficiency Alert: Cutting Table E",
    description:
      "Efficiency metrics dropping below baseline. Investigating cause recommended.",
    createdAt: new Date("2023-10-18T09:30:00"),
    isRead: true,
    relatedId: "p4",
    priority: "low",
    actionUrl: "/prediction",
  },
];

export default function NotificationList() {
  const { user } = useAuth();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    [],
  );
  const [filter, setFilter] = useState<string>("all");

  // Filter notifications based on filter and read status
  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    if (filter !== "all") {
      filtered = filtered.filter(
        (notification) => notification.type === filter,
      );
    }

    return filtered;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications = getFilteredNotifications();

  const handleMarkAsRead = (ids: string[]) => {
    // In a real app, this would be an API call
    const updatedNotifications = notifications.map((notification) =>
      ids.includes(notification.id)
        ? { ...notification, isRead: true }
        : notification,
    );

    setNotifications(updatedNotifications);
    setSelectedNotifications([]);
  };

  const handleMarkAllAsRead = () => {
    // In a real app, this would be an API call
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));

    setNotifications(updatedNotifications);
    setSelectedNotifications([]);
  };

  const handleDeleteNotifications = (ids: string[]) => {
    // In a real app, this would be an API call
    const updatedNotifications = notifications.filter(
      (notification) => !ids.includes(notification.id),
    );
    setNotifications(updatedNotifications);
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const isAllSelected =
    filteredNotifications.length > 0 &&
    filteredNotifications.every((n) => selectedNotifications.includes(n.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with alerts, maintenance activities and system
            notifications
          </p>
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all" className="relative">
                All
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="alert">Alerts</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="prediction">Predictions</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notification Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleMarkAllAsRead}>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Mark all as read
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={selectedNotifications.length === 0}
                    onClick={() => handleMarkAsRead(selectedNotifications)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark selected as read
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={selectedNotifications.length === 0}
                    onClick={() =>
                      handleDeleteNotifications(selectedNotifications)
                    }
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all" className="pt-4">
            <Card>
              <CardHeader className="border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={isAllSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm cursor-pointer"
                    >
                      Select All
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredNotifications.length === 0 ? (
                  <div className="flex h-[400px] items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Bell className="h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">
                        No notifications
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You don't have any notifications at the moment.
                      </p>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "flex items-start gap-4 p-4 hover:bg-muted/50",
                            !notification.isRead && "bg-blue-50/50",
                          )}
                        >
                          <Checkbox
                            id={`select-${notification.id}`}
                            checked={selectedNotifications.includes(
                              notification.id,
                            )}
                            onCheckedChange={() =>
                              toggleSelectNotification(notification.id)
                            }
                            className="mt-1.5"
                          />

                          {getNotificationIcon(
                            notification.type,
                            notification.priority,
                          )}

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4
                                  className={cn(
                                    "text-sm font-medium",
                                    !notification.isRead && "font-bold",
                                  )}
                                >
                                  {notification.title}
                                </h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {notification.description}
                                </p>
                              </div>
                              <div className="flex flex-shrink-0 flex-col items-end gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <Badge className="h-1.5 w-1.5 rounded-full bg-blue-500 p-0" />
                                )}
                              </div>
                            </div>

                            {notification.actionUrl && (
                              <div className="mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs text-blue-600"
                                  onClick={() => {
                                    // In a real app, this would be a navigate
                                    window.alert(
                                      `Navigating to: ${notification.actionUrl}`,
                                    );
                                    handleMarkAsRead([notification.id]);
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs use the same structure but with filtered data */}
          <TabsContent value="alert" className="pt-4">
            <Card>
              <CardHeader className="border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Alert Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all-alerts"
                      checked={isAllSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                    <label
                      htmlFor="select-all-alerts"
                      className="text-sm cursor-pointer"
                    >
                      Select All
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredNotifications.length === 0 ? (
                  <div className="flex h-[400px] items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <AlertTriangle className="h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">
                        No alert notifications
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You don't have any alert notifications at the moment.
                      </p>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "flex items-start gap-4 p-4 hover:bg-muted/50",
                            !notification.isRead && "bg-blue-50/50",
                          )}
                        >
                          <Checkbox
                            id={`select-${notification.id}`}
                            checked={selectedNotifications.includes(
                              notification.id,
                            )}
                            onCheckedChange={() =>
                              toggleSelectNotification(notification.id)
                            }
                            className="mt-1.5"
                          />

                          {getNotificationIcon(
                            notification.type,
                            notification.priority,
                          )}

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4
                                  className={cn(
                                    "text-sm font-medium",
                                    !notification.isRead && "font-bold",
                                  )}
                                >
                                  {notification.title}
                                </h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {notification.description}
                                </p>
                              </div>
                              <div className="flex flex-shrink-0 flex-col items-end gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <Badge className="h-1.5 w-1.5 rounded-full bg-blue-500 p-0" />
                                )}
                              </div>
                            </div>

                            {notification.actionUrl && (
                              <div className="mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs text-blue-600"
                                  onClick={() => {
                                    // In a real app, this would be a navigate
                                    window.alert(
                                      `Navigating to: ${notification.actionUrl}`,
                                    );
                                    handleMarkAsRead([notification.id]);
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance, Prediction, and System tabs would follow the same pattern */}
          {/* They are omitted for brevity but would use the same structure */}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
