export type MachineStatus = "operational" | "maintenance" | "offline" | "error";

export interface Machine {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  location: string;
  status: MachineStatus;
  lastMaintenance?: Date;
  nextScheduledMaintenance?: Date;
  installationDate: Date;
  metrics?: {
    performance: number;
    availability: number;
    quality: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MachineFormData {
  name: string;
  model: string;
  serialNumber: string;
  location: string;
  status: MachineStatus;
  installationDate: Date;
  nextScheduledMaintenance?: Date;
}
