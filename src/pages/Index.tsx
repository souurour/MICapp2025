import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to dashboard, others to the home page
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Show loading indicator while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
          <p className="mt-4 text-lg text-indigo-800">Redirecting...</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
