/**
 * API client for interacting with the backend
 */

// Base API URL - would come from environment variables in a real app
// For demo purposes, we're using a mock API
const API_BASE_URL = "https://mockapi.micservicelaser.dev/api";
// Set this to false to use mock data instead of real API calls
const USE_REAL_API = false;

// Default headers for JSON API requests
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Add auth token to headers if available
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  if (token) {
    return {
      ...defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }
  return defaultHeaders;
};

// Mock data for demo purposes
const MOCK_USERS = [
  {
    id: "user1",
    email: "user@example.com",
    name: "Regular User",
    role: "user",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20"),
  },
  {
    id: "tech1",
    email: "technician@example.com",
    name: "John Technician",
    role: "technician",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-06-15"),
  },
];

// Mock API implementation
async function mockApiRequest<T>(
  endpoint: string,
  method: string = "GET",
  data?: unknown,
): Promise<T> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Auth endpoints
  if (endpoint === "/auth/login") {
    const { email, password } = data as any;
    const user = MOCK_USERS.find((u) => u.email === email);

    if (user && password === "password123") {
      return {
        token: `mock-token-${user.id}`,
        user,
      } as unknown as T;
    }

    throw new Error("Invalid email or password");
  }

  if (endpoint === "/auth/register") {
    const { email, name, role, password } = data as any;

    if (MOCK_USERS.some((u) => u.email === email)) {
      throw new Error("Email already in use");
    }

    const newUser = {
      id: `user${MOCK_USERS.length + 1}`,
      email,
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    MOCK_USERS.push(newUser);

    return {
      token: `mock-token-${newUser.id}`,
      user: newUser,
    } as unknown as T;
  }

  if (endpoint === "/auth/me") {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const userId = token.split("-").pop();
    const user = MOCK_USERS.find((u) => u.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user as unknown as T;
  }

  // Default response for unhandled endpoints
  return {} as T;
}

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  data?: unknown,
): Promise<T> {
  // Use mock implementation if USE_REAL_API is false
  if (!USE_REAL_API) {
    return mockApiRequest<T>(endpoint, method, data);
  }

  // Real API implementation
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();

  const config: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "An error occurred");
      }

      return result as T;
    } else {
      if (!response.ok) {
        throw new Error("An error occurred");
      }

      return response as unknown as T;
    }
  } catch (error) {
    console.error("API request failed:", error);
    // Fall back to mock implementation if real API fails
    return mockApiRequest<T>(endpoint, method, data);
  }
}

/**
 * Typed API request methods
 */
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, "GET"),

  post: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, "POST", data),

  put: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, "PUT", data),

  patch: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, "PATCH", data),

  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, "DELETE"),

  // Special method for file downloads
  getBlob: async (endpoint: string): Promise<Blob> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getAuthHeaders();

    const response = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    return await response.blob();
  },
};
