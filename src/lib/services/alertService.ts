import { api } from "@/lib/api";
import { Alert, AlertPriority, AlertStatus } from "@/types/alert";

// Define types for API responses
interface PaginatedResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  [key: string]: any;
}

interface AlertResponse extends PaginatedResponse<Alert> {
  alerts: Alert[];
}

// Alert service functions
const alertService = {
  // Get all alerts with optional filtering
  getAlerts: async (
    page = 1,
    limit = 10,
    status?: AlertStatus,
    priority?: AlertPriority,
    machineId?: string,
    search?: string,
  ): Promise<AlertResponse> => {
    const params: Record<string, any> = { page, limit };

    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (machineId) params.machineId = machineId;
    if (search) params.search = search;

    return await api.get<AlertResponse>("/alerts", params);
  },

  // Get alert by ID
  getAlertById: async (id: string): Promise<Alert> => {
    return await api.get<Alert>(`/alerts/${id}`);
  },

  // Create a new alert
  createAlert: async (alertData: Partial<Alert>): Promise<Alert> => {
    return await api.post<Alert>("/alerts", alertData);
  },

  // Update an existing alert
  updateAlert: async (
    id: string,
    alertData: Partial<Alert>,
  ): Promise<Alert> => {
    return await api.put<Alert>(`/alerts/${id}`, alertData);
  },

  // Self-assign an alert (for technicians)
  assignToSelf: async (id: string): Promise<Alert> => {
    return await api.put<Alert>(`/alerts/${id}/assign`, {});
  },

  // Delete an alert (admin only)
  deleteAlert: async (id: string): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`/alerts/${id}`);
  },

  // Helper function to upload alert photos
  uploadAlertPhotos: async (
    alertId: string,
    files: FileList,
  ): Promise<{ photoUrls: string[] }> => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("photos", file);
    });

    return await api.upload<{ photoUrls: string[] }>(
      `/alerts/${alertId}/photos`,
      formData,
    );
  },
};

export default alertService;
