export type AlertPriority = "low" | "medium" | "critical";
export type AlertStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed";

export interface Alert {
  id: string;
  title: string;
  description: string;
  machineId: string;
  machineName: string;
  priority: AlertPriority;
  status: AlertStatus;
  assignedTo?: string;
  assignedToName?: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface AlertFormData {
  title: string;
  description: string;
  machineId: string;
  priority: AlertPriority;
}

export interface AlertAssignmentData {
  alertId: string;
  technicianId: string;
}
