import { api } from "@/lib/api";

// Feedback types
export type FeedbackType = "suggestion" | "issue" | "praise" | "other";
export type FeedbackPriority = "low" | "medium" | "high";
export type FeedbackStatus =
  | "open"
  | "under_review"
  | "implemented"
  | "declined"
  | "closed";

export interface Feedback {
  id: string;
  title: string;
  description: string;
  type: FeedbackType;
  priority: FeedbackPriority;
  category?: string;
  status: FeedbackStatus;
  createdBy: string;
  createdByName: string;
  assignedTo?: string;
  assignedToName?: string;
  response?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

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

interface FeedbackResponse extends PaginatedResponse<Feedback> {
  feedback: Feedback[];
}

// Feedback service functions
const feedbackService = {
  // Get all feedback with optional filtering
  getFeedback: async (
    page = 1,
    limit = 10,
    type?: FeedbackType,
    status?: FeedbackStatus,
    search?: string,
  ): Promise<FeedbackResponse> => {
    const params: Record<string, any> = { page, limit };

    if (type) params.type = type;
    if (status) params.status = status;
    if (search) params.search = search;

    return await api.get<FeedbackResponse>("/feedback", params);
  },

  // Get feedback by ID
  getFeedbackById: async (id: string): Promise<Feedback> => {
    return await api.get<Feedback>(`/feedback/${id}`);
  },

  // Submit new feedback
  submitFeedback: async (
    feedbackData: Partial<Feedback>,
  ): Promise<Feedback> => {
    return await api.post<Feedback>("/feedback", feedbackData);
  },

  // Update feedback (admin only)
  updateFeedback: async (
    id: string,
    feedbackData: Partial<Feedback>,
  ): Promise<Feedback> => {
    return await api.put<Feedback>(`/feedback/${id}`, feedbackData);
  },

  // Delete feedback (admin only)
  deleteFeedback: async (id: string): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`/feedback/${id}`);
  },

  // Upload feedback attachments
  uploadAttachments: async (
    feedbackId: string,
    files: FileList,
  ): Promise<{ attachments: string[] }> => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("attachments", file);
    });

    return await api.upload<{ attachments: string[] }>(
      `/feedback/${feedbackId}/attachments`,
      formData,
    );
  },
};

export default feedbackService;
