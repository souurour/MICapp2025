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

// Store user in localStorage
export const setUser = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Remove user from localStorage
export const removeUser = (): void => {
  localStorage.removeItem("user");
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
    setUser(response.user);
    return response.user;
  },

  // Register user
  register: async (data: RegisterData) => {
    const response = await api.post<{ token: string; user: User }>(
      "/auth/register",
      data,
    );
    setAuthToken(response.token);
    setUser(response.user);
    return response.user;
  },

  // Admin registration (creating users with admin privileges)
  adminRegister: async (data: RegisterData) => {
    return await api.post<User>("/auth/admin-register", data);
  },

  // Get current user profile
  getCurrentUser: async () => {
    return await api.get<User>("/auth/me");
  },

  // Update user profile
  updateProfile: async (data: Partial<User>) => {
    return await api.put<User>("/auth/profile", data);
  },

  // Logout user
  logout: () => {
    removeAuthToken();
    removeUser();
  },
};

// Protected route utility
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

// Helper for admin login creation (development only)
export const createDevAdminLogin = (email: string, name: string): void => {
  const adminUser = {
    id: "admin",
    email,
    name,
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  setAuthToken("admin-token");
  setUser(adminUser);
  console.log("Developer admin login created:", email);
};
