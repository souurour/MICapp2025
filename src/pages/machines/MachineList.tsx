import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Filter,
  Settings,
  ArrowUpDown,
  MoreHorizontal,
  AlertTriangle,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Machine, MachineStatus } from "@/types/machine";
import { useAuth } from "@/context/AuthContext";

const getMachineStatusColor = (status: MachineStatus) => {
  switch (status) {
    case "operational":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "error":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "offline":
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

// Mock machine data
const mockMachines: Machine[] = [
  {
    id: "m1",
    name: "Laser Cutter A",
    model: "LC-2000",
    serialNumber: "LC2000-1234",
    location: "Hall A",
    status: "operational",
    lastMaintenance: new Date("2023-09-15"),
    nextScheduledMaintenance: new Date("2023-12-15"),
    installationDate: new Date("2020-05-10"),
    metrics: { performance: 95, availability: 98, quality: 99 },
    createdAt: new Date("2020-05-10"),
    updatedAt: new Date("2023-09-15"),
  },
  {
    id: "m2",
    name: "Washing Machine B",
    model: "WM-3000",
    serialNumber: "WM3000-5678",
    location: "Hall B",
    status: "maintenance",
    lastMaintenance: new Date("2023-08-20"),
    nextScheduledMaintenance: new Date("2023-11-20"),
    installationDate: new Date("2021-02-15"),
    metrics: { performance: 82, availability: 76, quality: 94 },
    createdAt: new Date("2021-02-15"),
    updatedAt: new Date("2023-08-20"),
  },
  {
    id: "m3",
    name: "Drying Unit C",
    model: "DU-1500",
    serialNumber: "DU1500-9012",
    location: "Hall A",
    status: "error",
    lastMaintenance: new Date("2023-09-05"),
    nextScheduledMaintenance: new Date("2023-12-05"),
    installationDate: new Date("2019-11-20"),
    metrics: { performance: 65, availability: 42, quality: 88 },
    createdAt: new Date("2019-11-20"),
    updatedAt: new Date("2023-09-05"),
  },
  {
    id: "m4",
    name: "Stitching Machine D",
    model: "SM-1000",
    serialNumber: "SM1000-3456",
    location: "Hall C",
    status: "offline",
    lastMaintenance: new Date("2023-07-10"),
    nextScheduledMaintenance: new Date("2023-10-10"),
    installationDate: new Date("2022-01-05"),
    metrics: { performance: 0, availability: 0, quality: 0 },
    createdAt: new Date("2022-01-05"),
    updatedAt: new Date("2023-07-10"),
  },
  {
    id: "m5",
    name: "Cutting Table E",
    model: "CT-5000",
    serialNumber: "CT5000-7890",
    location: "Hall B",
    status: "operational",
    lastMaintenance: new Date("2023-09-01"),
    nextScheduledMaintenance: new Date("2023-12-01"),
    installationDate: new Date("2021-06-15"),
    metrics: { performance: 98, availability: 99, quality: 97 },
    createdAt: new Date("2021-06-15"),
    updatedAt: new Date("2023-09-01"),
  },
];

export default function MachineList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);

  // Filter machines based on search query and status filter
  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || machine.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateMachine = () => {
    navigate("/machines/create");
  };

  const handleEditMachine = (machineId: string) => {
    navigate(`/machines/edit/${machineId}`);
  };

  const handleViewMachine = (machineId: string) => {
    navigate(`/machines/${machineId}`);
  };

  const confirmDeleteMachine = (machine: Machine) => {
    setMachineToDelete(machine);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMachine = () => {
    if (machineToDelete) {
      // In a real app, this would be an API call
      setMachines(machines.filter((m) => m.id !== machineToDelete.id));
      setIsDeleteDialogOpen(false);
      setMachineToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Machines</h1>
            <p className="text-muted-foreground">
              Manage and monitor your manufacturing equipment
            </p>
          </div>
          {isAdmin && (
            <Button onClick={handleCreateMachine}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Machine
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search machines..."
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
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredMachines.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
            <div className="flex flex-col items-center justify-center text-center">
              <Settings className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No machines found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No machines match your search criteria. Try adjusting your
                filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Name
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">
                      {machine.name}
                    </TableCell>
                    <TableCell>{machine.model}</TableCell>
                    <TableCell>{machine.location}</TableCell>
                    <TableCell>
                      <Badge className={getMachineStatusColor(machine.status)}>
                        {machine.status === "error" && (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        )}
                        {machine.status.charAt(0).toUpperCase() +
                          machine.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {machine.lastMaintenance
                        ? new Date(machine.lastMaintenance).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {machine.nextScheduledMaintenance
                        ? new Date(
                            machine.nextScheduledMaintenance,
                          ).toLocaleDateString()
                        : "N/A"}
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
                            onClick={() => handleViewMachine(machine.id)}
                          >
                            View Details
                          </DropdownMenuItem>
                          {isAdmin && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleEditMachine(machine.id)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => confirmDeleteMachine(machine)}
                              >
                                Delete
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Machine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the machine "
              {machineToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMachine}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
