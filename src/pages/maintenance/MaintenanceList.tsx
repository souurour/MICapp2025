import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Filter,
  Wrench,
  ArrowUpDown,
  MoreHorizontal,
  Clock,
  Calendar,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MaintenanceRecord } from "@/types/maintenance";
import { useAuth } from "@/context/AuthContext";

// Helper to format duration
const formatDuration = (startDate: Date, endDate?: Date) => {
  if (!endDate) return "In progress";

  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end.getTime() - start.getTime();

  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

// Helper to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

// Mock maintenance data
const mockMaintenance: MaintenanceRecord[] = [
  {
    id: "m1",
    machineId: "m2",
    machineName: "Washing Machine B",
    problemDescription: "Regular maintenance check and filter cleaning",
    startTime: new Date("2023-10-21T10:00:00"),
    endTime: new Date("2023-10-21T11:30:00"),
    status: "completed",
    technicianId: "u2",
    technicianName: "John Technician",
    notes: "Cleaned filters and checked all systems. Operating normally.",
    partsReplaced: ["Water filter", "Drainage seal"],
    createdAt: new Date("2023-10-20T15:00:00"),
    updatedAt: new Date("2023-10-21T11:35:00"),
  },
  {
    id: "m2",
    machineId: "m3",
    machineName: "Drying Unit C",
    problemDescription: "Heating element replacement",
    startTime: new Date("2023-10-21T13:00:00"),
    status: "in_progress",
    technicianId: "u3",
    technicianName: "Sarah Engineer",
    notes: "Replacing faulty heating element.",
    partsReplaced: ["Main heating element"],
    createdAt: new Date("2023-10-20T09:30:00"),
    updatedAt: new Date("2023-10-21T13:05:00"),
  },
  {
    id: "m3",
    machineId: "m1",
    machineName: "Laser Cutter A",
    problemDescription: "Laser calibration and lens cleaning",
    startTime: new Date("2023-10-22T09:00:00"),
    status: "scheduled",
    technicianId: "u2",
    technicianName: "John Technician",
    createdAt: new Date("2023-10-20T11:15:00"),
    updatedAt: new Date("2023-10-20T11:15:00"),
  },
  {
    id: "m4",
    machineId: "m5",
    machineName: "Cutting Table E",
    problemDescription: "Belt tension adjustment",
    startTime: new Date("2023-10-19T14:00:00"),
    endTime: new Date("2023-10-19T15:45:00"),
    status: "completed",
    technicianId: "u3",
    technicianName: "Sarah Engineer",
    notes: "Adjusted belt tension and aligned cutting head.",
    createdAt: new Date("2023-10-18T16:30:00"),
    updatedAt: new Date("2023-10-19T15:50:00"),
  },
  {
    id: "m5",
    machineId: "m4",
    machineName: "Stitching Machine D",
    problemDescription: "Thread tensioner repair",
    startTime: new Date("2023-10-18T10:00:00"),
    endTime: new Date("2023-10-18T12:30:00"),
    status: "completed",
    technicianId: "u2",
    technicianName: "John Technician",
    notes: "Replaced damaged thread tensioner and calibrated.",
    partsReplaced: ["Thread tensioner", "Feed dog"],
    createdAt: new Date("2023-10-17T09:45:00"),
    updatedAt: new Date("2023-10-18T12:35:00"),
  },
];

export default function MaintenanceList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isTechnician = user?.role === "technician";

  const [maintenanceRecords, setMaintenanceRecords] =
    useState<MaintenanceRecord[]>(mockMaintenance);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter maintenance records based on search query and status filter
  const filteredRecords = maintenanceRecords.filter((record) => {
    const matchesSearch =
      record.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.problemDescription
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (record.notes &&
        record.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      record.technicianName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // If user is technician, only show their records
  const userRecords =
    isTechnician && !isAdmin && user
      ? filteredRecords.filter((record) => record.technicianId === user.id)
      : filteredRecords;

  const handleCreateMaintenance = () => {
    navigate("/maintenance/create");
  };

  const handleViewMaintenance = (id: string) => {
    navigate(`/maintenance/${id}`);
  };

  const handleCompleteMaintenance = (id: string) => {
    // In a real app, this would be an API call
    const updatedRecords = maintenanceRecords.map((record) =>
      record.id === id
        ? {
            ...record,
            status: "completed" as "scheduled" | "in_progress" | "completed",
            endTime: new Date(),
            updatedAt: new Date(),
          }
        : record,
    );
    setMaintenanceRecords(updatedRecords);
  };

  const handleStartMaintenance = (id: string) => {
    // In a real app, this would be an API call
    const updatedRecords = maintenanceRecords.map((record) =>
      record.id === id
        ? {
            ...record,
            status: "in_progress" as "scheduled" | "in_progress" | "completed",
            updatedAt: new Date(),
          }
        : record,
    );
    setMaintenanceRecords(updatedRecords);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
            <p className="text-muted-foreground">
              Track and manage machine maintenance activities
            </p>
          </div>
          {(isTechnician || isAdmin) && (
            <Button onClick={handleCreateMaintenance}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Maintenance
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search maintenance..."
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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {userRecords.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
            <div className="flex flex-col items-center justify-center text-center">
              <Wrench className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No maintenance records found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No maintenance records match your search criteria. Try adjusting
                your filters or schedule new maintenance.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">
                    <div className="flex items-center gap-1">
                      Description
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Duration
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="font-medium">
                        {record.problemDescription}
                      </div>
                      {record.partsReplaced &&
                        record.partsReplaced.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Parts: {record.partsReplaced.join(", ")}
                          </div>
                        )}
                    </TableCell>
                    <TableCell>{record.machineName}</TableCell>
                    <TableCell>{record.technicianName}</TableCell>
                    <TableCell>
                      {new Date(record.startTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {formatDuration(record.startTime, record.endTime)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </Badge>
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
                            onClick={() => handleViewMaintenance(record.id)}
                          >
                            View Details
                          </DropdownMenuItem>

                          {isTechnician && record.status === "scheduled" && (
                            <DropdownMenuItem
                              onClick={() => handleStartMaintenance(record.id)}
                            >
                              Start Maintenance
                            </DropdownMenuItem>
                          )}

                          {isTechnician && record.status === "in_progress" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleCompleteMaintenance(record.id)
                              }
                            >
                              Complete Maintenance
                            </DropdownMenuItem>
                          )}

                          {isAdmin && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/maintenance/edit/${record.id}`)
                                }
                              >
                                Edit Record
                              </DropdownMenuItem>
                            </>
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
    </DashboardLayout>
  );
}
