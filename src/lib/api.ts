import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// Define API base URL based on environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle session expiration or unauthorized access
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // Optionally redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// API request helper functions
export const api = {
  // GET request
  get: async <T = any>(endpoint: string, params: any = {}): Promise<T> => {
    try {
      const config: AxiosRequestConfig = { params };
      const response: AxiosResponse<T> = await axiosInstance.get(
        endpoint,
        config,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // POST request
  post: async <T = any>(endpoint: string, data: any = {}): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(
        endpoint,
        data,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // PUT request
  put: async <T = any>(endpoint: string, data: any = {}): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(
        endpoint,
        data,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // DELETE request
  delete: async <T = any>(endpoint: string): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // File upload with multipart/form-data
  upload: async <T = any>(endpoint: string, formData: FormData): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(
        endpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Error handling helper
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data as any;

    // Extract error message
    const errorMessage =
      responseData?.message ||
      axiosError.message ||
      "An error occurred with the request";

    console.error("API Error:", errorMessage);

    // Additional error handling can be added here
    // e.g., showing a toast notification or logging to a service
  } else {
    console.error("Unexpected error:", error);
  }
};
