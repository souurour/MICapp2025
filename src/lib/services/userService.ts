import { api } from "@/lib/api";
import { User } from "@/types/user";
import { UserRole } from "@/types/auth";

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

interface UserResponse extends PaginatedResponse<User> {
  users: User[];
}

// User service functions
const userService = {
  // Get all users with optional filtering (admin only)
  getUsers: async (
    page = 1,
    limit = 10,
    role?: UserRole,
    isActive?: boolean,
    search?: string,
  ): Promise<UserResponse> => {
    const params: Record<string, any> = { page, limit };

    if (role) params.role = role;
    if (isActive !== undefined) params.isActive = isActive;
    if (search) params.search = search;

    return await api.get<UserResponse>("/users", params);
  },

  // Get user by ID (admin only)
  getUserById: async (id: string): Promise<User> => {
    return await api.get<User>(`/users/${id}`);
  },

  // Create a new user (admin only)
  createUser: async (userData: Partial<User>): Promise<User> => {
    return await api.post<User>("/users", userData);
  },

  // Update an existing user (admin only)
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    return await api.put<User>(`/users/${id}`, userData);
  },

  // Delete a user (admin only)
  deleteUser: async (id: string): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`/users/${id}`);
  },

  // Upload user avatar
  uploadAvatar: async (file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);

    return await api.upload<{ avatar: string }>("/auth/avatar", formData);
  },
};

export default userService;
