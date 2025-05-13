import { LoginCredentials, RegisterData, User } from "@/types/auth";
import { api } from "./api";

/**
 * Authentication utilities
 */

// Store auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem("authToken");
};

// Check if user has the required role
export const hasRole = (
  user: User | null,
  requiredRoles: string[],
): boolean => {
  if (!user) return false;
  return requiredRoles.includes(user.role);
};

// Authentication API calls
export const authApi = {
  // Log in user
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<{ token: string; user: User }>(
      "/auth/login",
      credentials,
    );
    setAuthToken(response.token);
    return response.user;
  },

  // Register user
  register: async (data: RegisterData) => {
    const response = await api.post<{ token: string; user: User }>(
      "/auth/register",
      data,
    );
    setAuthToken(response.token);
    return response.user;
  },

  // Get current user profile
  getCurrentUser: async () => {
    return await api.get<User>("/auth/me");
  },

  // Logout user
  logout: () => {
    removeAuthToken();
  },
};

// Protected route utility
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};
