import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserForm, UserFormValues } from "@/components/users/UserForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { User } from "@/types/user";
import { useAuth } from "@/context/AuthContext";

export default function CreateUserPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleCreateUser = async (data: UserFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real application, this would be an API call.
      // For now, we're just simulating the API call with a timeout.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate creating a new user
      const newUser: User = {
        id: `u${Date.now()}`, // Generate a unique ID
        email: data.email,
        name: data.name,
        role: data.role,
        department: data.department || undefined,
        contactNumber: data.contactNumber || undefined,
        isActive: data.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Created user:", newUser);

      // Mock storing the user in localStorage for demo purposes
      // In a real app, this would happen on the server
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));

      // Navigate back to user list page
      navigate("/users");
    } catch (error) {
      console.error("Error creating user:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the user",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Only admin users can access this page
  if (currentUser?.role !== "admin") {
    navigate("/unauthorized");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/users")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Create a new user with access to the system. Admin users have full
              access, technicians can manage machines and maintenance, and
              regular users have limited access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm
              mode="create"
              onSubmit={handleCreateUser}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
