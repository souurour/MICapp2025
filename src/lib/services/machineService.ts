import { api } from "@/lib/api";
import { Machine, MachineStatus } from "@/types/machine";

// Define types for API responses
interface PaginatedResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  [key: string]: any; // For the data array (machines, alerts, etc.)
}

interface MachineResponse extends PaginatedResponse<Machine> {
  machines: Machine[];
}

// Machine service functions
const machineService = {
  // Get all machines with optional filtering
  getMachines: async (
    page = 1,
    limit = 10,
    status?: MachineStatus,
    location?: string,
    search?: string,
  ): Promise<MachineResponse> => {
    const params: Record<string, any> = { page, limit };

    if (status) params.status = status;
    if (location) params.location = location;
    if (search) params.search = search;

    return await api.get<MachineResponse>("/machines", params);
  },

  // Get machine by ID
  getMachineById: async (id: string): Promise<Machine> => {
    return await api.get<Machine>(`/machines/${id}`);
  },

  // Create a new machine
  createMachine: async (machineData: Partial<Machine>): Promise<Machine> => {
    return await api.post<Machine>("/machines", machineData);
  },

  // Update an existing machine
  updateMachine: async (
    id: string,
    machineData: Partial<Machine>,
  ): Promise<Machine> => {
    return await api.put<Machine>(`/machines/${id}`, machineData);
  },

  // Update machine status
  updateMachineStatus: async (
    id: string,
    status: MachineStatus,
  ): Promise<{ status: MachineStatus }> => {
    return await api.put<{ status: MachineStatus }>(`/machines/${id}/status`, {
      status,
    });
  },

  // Update machine metrics
  updateMachineMetrics: async (
    id: string,
    metrics: { performance?: number; availability?: number; quality?: number },
  ): Promise<Machine["metrics"]> => {
    return await api.put<Machine["metrics"]>(
      `/machines/${id}/metrics`,
      metrics,
    );
  },

  // Delete a machine
  deleteMachine: async (id: string): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`/machines/${id}`);
  },
};

export default machineService;
