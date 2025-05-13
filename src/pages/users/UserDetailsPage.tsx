import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  User as UserIcon,
  Edit,
  Trash,
  Mail,
  Phone,
  Calendar,
  Building,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";

// Helper to generate initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Helper to get role color
const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "technician":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "user":
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

// Helper to get role icon
const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case "admin":
      return <Shield className="mr-1 h-4 w-4" />;
    case "technician":
      return <UserIcon className="mr-1 h-4 w-4" />;
    case "user":
    default:
      return null;
  }
};

export default function UserDetailsPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleEditUser = () => {
    navigate(`/users/edit/${userId}`);
  };

  const handleDeleteUser = () => {
    // In a real application, this would be an API call.
    console.log("Deleting user:", userId);

    // Mock deleting from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = storedUsers.filter((u: User) => u.id !== userId);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Close dialog and navigate back to user list
    setIsDeleteDialogOpen(false);
    navigate("/users");
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
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          </div>
          {user && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEditUser}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete User
              </Button>
            </div>
          )}
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>
                  Account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-xl bg-indigo-100 text-indigo-800">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-semibold">{user.name}</h3>
                <Badge
                  className={`mt-2 ${getRoleBadgeColor(user.role as UserRole)}`}
                >
                  {getRoleIcon(user.role as UserRole)}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <Badge
                  variant={user.isActive ? "default" : "outline"}
                  className="mt-2"
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
                <div className="mt-6 w-full space-y-4">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.contactNumber && (
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.contactNumber}</span>
                    </div>
                  )}
                  {user.department && (
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.department}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Member since{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Access Information</CardTitle>
                      <CardDescription>
                        Access level and permissions overview
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Account Status</h4>
                          <p className="text-sm text-muted-foreground">
                            {user.isActive
                              ? "This account is active and can access the system."
                              : "This account is inactive and cannot access the system."}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-medium">
                            Role:{" "}
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {user.role === "admin"
                              ? "Full dashboard access. Can manage machines, users, technicians, alerts, and reports."
                              : user.role === "technician"
                                ? "Can access and manage machines, maintenance, and respond to alerts."
                                : "Basic access to view dashboards and submit alerts."}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-medium">Last Updated</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(user.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="permissions" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Role Permissions</CardTitle>
                      <CardDescription>
                        Detailed permissions for this user's role
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.role === "admin" ? (
                          <>
                            <div className="rounded-md border p-4">
                              <h3 className="font-medium">Admin Permissions</h3>
                              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                                <li>Full dashboard access</li>
                                <li>Manage machines (CRUD operations)</li>
                                <li>Manage users (CRUD operations)</li>
                                <li>Manage technicians and roles</li>
                                <li>View and respond to alerts</li>
                                <li>
                                  Export or generate reports (PDF or Excel)
                                </li>
                                <li>Receive email reports</li>
                                <li>
                                  Access to all dashboards (performance,
                                  availability, maintenance, prediction, etc.)
                                </li>
                              </ul>
                            </div>
                          </>
                        ) : user.role === "technician" ? (
                          <>
                            <div className="rounded-md border p-4">
                              <h3 className="font-medium">
                                Technician Permissions
                              </h3>
                              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                                <li>View and manage machine status</li>
                                <li>Schedule and perform maintenance</li>
                                <li>View and respond to alerts</li>
                                <li>
                                  Access maintenance and performance dashboards
                                </li>
                                <li>Generate maintenance reports</li>
                              </ul>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="rounded-md border p-4">
                              <h3 className="font-medium">User Permissions</h3>
                              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                                <li>View dashboards</li>
                                <li>Create alerts</li>
                                <li>View machine status</li>
                                <li>Submit feedback</li>
                                <li>View notifications</li>
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user "{user?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
