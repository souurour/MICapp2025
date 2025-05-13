import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types/auth";
import { authApi } from "@/lib/auth";

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create authentication context
const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

// Auth context provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check for admin user in localStorage first
        const adminUserJson = localStorage.getItem("user");
        if (adminUserJson) {
          const adminUser = JSON.parse(adminUserJson);
          setState({
            isLoading: false,
            isAuthenticated: true,
            user: adminUser,
            error: null,
          });
          return;
        }

        // Otherwise try to load from API
        const user = await authApi.getCurrentUser();
        setState({
          isLoading: false,
          isAuthenticated: true,
          user,
          error: null,
        });
      } catch (error) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: null,
        });
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = async (credentials: LoginCredentials) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const user = await authApi.login(credentials);
      setState({
        isLoading: false,
        isAuthenticated: true,
        user,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    }
  };

  // Register user
  const register = async (data: RegisterData) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const user = await authApi.register(data);
      setState({
        isLoading: false,
        isAuthenticated: true,
        user,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      });
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    authApi.logout();
    // Also remove admin user from localStorage
    localStorage.removeItem("user");
    setState({
      isLoading: false,
      isAuthenticated: false,
      user: null,
      error: null,
    });
  };

  // Clear error
  const clearError = () => {
    setState({
      ...state,
      error: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
