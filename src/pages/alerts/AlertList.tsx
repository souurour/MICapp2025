import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Filter,
  Bell,
  ArrowUpDown,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertPriority, AlertStatus } from "@/types/alert";

// Helper to get alert status color
const getAlertStatusColor = (status: AlertStatus) => {
  switch (status) {
    case "open":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "assigned":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "resolved":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "closed":
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

// Helper to get alert priority color
const getAlertPriorityColor = (priority: AlertPriority) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

// Mock alert data
const mockAlerts: Alert[] = [
  {
    id: "a1",
    title: "Laser Cutter Temperature Warning",
    description:
      "Machine temperature exceeding normal operating range by 15°C.",
    machineId: "m1",
    machineName: "Laser Cutter A",
    priority: "critical",
    status: "open",
    createdBy: "u4",
    createdByName: "Regular User",
    createdAt: new Date("2023-10-21T09:30:00"),
    updatedAt: new Date("2023-10-21T09:30:00"),
  },
  {
    id: "a2",
    title: "Washing Machine B Vibration",
    description: "Unusual vibration detected during spin cycle.",
    machineId: "m2",
    machineName: "Washing Machine B",
    priority: "medium",
    status: "assigned",
    assignedTo: "u2",
    assignedToName: "John Technician",
    createdBy: "u4",
    createdByName: "Regular User",
    createdAt: new Date("2023-10-20T14:15:00"),
    updatedAt: new Date("2023-10-20T16:30:00"),
  },
  {
    id: "a3",
    title: "Drying Unit C Heating Element Failure",
    description: "Heating element not reaching target temperature.",
    machineId: "m3",
    machineName: "Drying Unit C",
    priority: "critical",
    status: "in_progress",
    assignedTo: "u3",
    assignedToName: "Sarah Engineer",
    createdBy: "u4",
    createdByName: "Regular User",
    createdAt: new Date("2023-10-19T11:45:00"),
    updatedAt: new Date("2023-10-19T13:20:00"),
  },
  {
    id: "a4",
    title: "Stitching Machine D Thread Tension",
    description: "Thread tension needs adjustment for optimal performance.",
    machineId: "m4",
    machineName: "Stitching Machine D",
    priority: "low",
    status: "resolved",
    assignedTo: "u2",
    assignedToName: "John Technician",
    createdBy: "u4",
    createdByName: "Regular User",
    createdAt: new Date("2023-10-18T09:10:00"),
    updatedAt: new Date("2023-10-18T14:30:00"),
    resolvedAt: new Date("2023-10-18T14:30:00"),
  },
  {
    id: "a5",
    title: "Cutting Table E Alignment Check",
    description: "Routine alignment check requested after material change.",
    machineId: "m5",
    machineName: "Cutting Table E",
    priority: "low",
    status: "closed",
    assignedTo: "u3",
    assignedToName: "Sarah Engineer",
    createdBy: "u4",
    createdByName: "Regular User",
    createdAt: new Date("2023-10-17T15:20:00"),
    updatedAt: new Date("2023-10-17T17:45:00"),
    resolvedAt: new Date("2023-10-17T17:45:00"),
  },
];

export default function AlertList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isTechnician = user?.role === "technician";

  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [alertToResolve, setAlertToResolve] = useState<Alert | null>(null);

  // Filter alerts based on search query, status and priority filters
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.machineName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || alert.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || alert.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateAlert = () => {
    navigate("/alerts/create");
  };

  const handleViewAlert = (alertId: string) => {
    navigate(`/alerts/${alertId}`);
  };

  const confirmResolveAlert = (alert: Alert) => {
    setAlertToResolve(alert);
    setIsResolveDialogOpen(true);
  };

  const handleResolveAlert = () => {
    if (alertToResolve) {
      // In a real app, this would be an API call
      const updatedAlerts = alerts.map((alert) =>
        alert.id === alertToResolve.id
          ? {
              ...alert,
              status: "resolved" as AlertStatus,
              resolvedAt: new Date(),
              updatedAt: new Date(),
            }
          : alert,
      );
      setAlerts(updatedAlerts);
      setIsResolveDialogOpen(false);
      setAlertToResolve(null);
    }
  };

  const handleAssignToMe = (alertId: string) => {
    if (!user) return;

    // In a real app, this would be an API call
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId
        ? {
            ...alert,
            status: "assigned" as AlertStatus,
            assignedTo: user.id,
            assignedToName: user.name,
            updatedAt: new Date(),
          }
        : alert,
    );
    setAlerts(updatedAlerts);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
            <p className="text-muted-foreground">
              Monitor and manage machine alerts and maintenance requests
            </p>
          </div>
          <Button onClick={handleCreateAlert}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search alerts..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Priority</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
            <div className="flex flex-col items-center justify-center text-center">
              <Bell className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No alerts found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No alerts match your search criteria. Try adjusting your filters
                or create a new alert.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">
                    <div className="flex items-center gap-1">
                      Alert
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {alert.description}
                      </div>
                    </TableCell>
                    <TableCell>{alert.machineName}</TableCell>
                    <TableCell>
                      <Badge className={getAlertPriorityColor(alert.priority)}>
                        {alert.priority === "critical" && (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        )}
                        {alert.priority.charAt(0).toUpperCase() +
                          alert.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getAlertStatusColor(alert.status)}>
                        {alert.status === "resolved" && (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        )}
                        {alert.status
                          .replace("_", " ")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewAlert(alert.id)}
                          >
                            View Details
                          </DropdownMenuItem>

                          {isTechnician && alert.status === "open" && (
                            <DropdownMenuItem
                              onClick={() => handleAssignToMe(alert.id)}
                            >
                              Assign to me
                            </DropdownMenuItem>
                          )}

                          {(isAdmin || isTechnician) &&
                            (alert.status === "assigned" ||
                              alert.status === "in_progress") && (
                              <DropdownMenuItem
                                onClick={() => confirmResolveAlert(alert)}
                              >
                                Mark as Resolved
                              </DropdownMenuItem>
                            )}

                          {isAdmin && alert.status === "resolved" && (
                            <DropdownMenuItem
                              onClick={() => {
                                // In a real app, this would be an API call
                                const updatedAlerts = alerts.map((a) =>
                                  a.id === alert.id
                                    ? {
                                        ...a,
                                        status: "closed" as AlertStatus,
                                        updatedAt: new Date(),
                                      }
                                    : a,
                                );
                                setAlerts(updatedAlerts);
                              }}
                            >
                              Close Alert
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Resolve Alert Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this alert as resolved?
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {alertToResolve && (
              <>
                <h4 className="font-medium">{alertToResolve.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {alertToResolve.description}
                </p>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Machine:</span>{" "}
                  {alertToResolve.machineName}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResolveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={handleResolveAlert}>
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
