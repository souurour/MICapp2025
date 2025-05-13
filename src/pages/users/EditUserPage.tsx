import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditUserPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would be an API call.
        // For now, we're just simulating loading from localStorage.
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data from localStorage
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const mockUsers = [
          ...storedUsers,
          {
            id: "u1",
            email: "admin@example.com",
            name: "Admin User",
            role: "admin",
            department: "Management",
            contactNumber: "+1234567890",
            isActive: true,
            createdAt: new Date("2020-01-15"),
            updatedAt: new Date("2023-08-10"),
          },
          {
            id: "u2",
            email: "technician1@example.com",
            name: "John Technician",
            role: "technician",
            department: "Maintenance",
            contactNumber: "+1234567891",
            isActive: true,
            createdAt: new Date("2021-03-20"),
            updatedAt: new Date("2023-07-15"),
          },
          {
            id: "u3",
            email: "technician2@example.com",
            name: "Sarah Engineer",
            role: "technician",
            department: "Engineering",
            contactNumber: "+1234567892",
            isActive: true,
            createdAt: new Date("2021-05-10"),
            updatedAt: new Date("2023-09-01"),
          },
          {
            id: "u4",
            email: "user1@example.com",
            name: "Regular User",
            role: "user",
            department: "Production",
            contactNumber: "+1234567893",
            isActive: true,
            createdAt: new Date("2022-01-05"),
            updatedAt: new Date("2023-06-20"),
          },
          {
            id: "u5",
            email: "user2@example.com",
            name: "Inactive User",
            role: "user",
            department: "Quality Control",
            contactNumber: "+1234567894",
            isActive: false,
            createdAt: new Date("2022-02-15"),
            updatedAt: new Date("2023-04-10"),
          },
        ];

        const foundUser = mockUsers.find((u) => u.id === userId);

        if (foundUser) {
          setUser(foundUser);
        } else {
          setError("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching the user",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Handle form submission
  const handleUpdateUser = async (data: UserFormValues) => {
    setIsSaving(true);
    setError(null);

    try {
      // In a real application, this would be an API call.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!user) {
        throw new Error("User not found");
      }

      // Update user data
      const updatedUser: User = {
        ...user,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department || undefined,
        contactNumber: data.contactNumber || undefined,
        isActive: data.isActive,
        updatedAt: new Date(),
      };

      console.log("Updated user:", updatedUser);

      // Mock updating in localStorage
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = storedUsers.map((u: User) =>
        u.id === updatedUser.id ? updatedUser : u,
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Navigate back to user list page
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while updating the user",
      );
    } finally {
      setIsSaving(false);
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
            <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : user ? (
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Edit user details and permissions. Changes will be applied
                immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserForm
                mode="edit"
                initialData={user}
                onSubmit={handleUpdateUser}
                isLoading={isSaving}
              />
            </CardContent>
          </Card>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>User Not Found</AlertTitle>
            <AlertDescription>
              The requested user could not be found. Please go back to the user
              list.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardLayout>
  );
}
