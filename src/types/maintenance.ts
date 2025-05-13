export interface MaintenanceRecord {
  id: string;
  machineId: string;
  machineName: string;
  problemDescription: string;
  startTime: Date;
  endTime?: Date;
  status: "scheduled" | "in_progress" | "completed";
  technicianId: string;
  technicianName: string;
  notes?: string;
  partsReplaced?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceFormData {
  machineId: string;
  problemDescription: string;
  startTime: Date;
  endTime?: Date;
  status: "scheduled" | "in_progress" | "completed";
  notes?: string;
  partsReplaced?: string[];
}
