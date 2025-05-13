import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  User,
  ShieldCheck,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types/auth";

// Regular user/technician registration schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["user", "technician"]).default("user"),
});

// Admin registration schema with admin code verification
const adminRegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  adminCode: z.string().refine((val) => val === "ADMIN2025", {
    message: "Invalid admin code",
  }),
  department: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;

export default function Register() {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("user");
  const [adminSuccess, setAdminSuccess] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Initialize regular form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  // Initialize admin form
  const adminForm = useForm<AdminRegisterFormValues>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      adminCode: "",
      department: "",
    },
  });

  // Regular user registration submission handler
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    clearError();

    try {
      await register(data);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the auth context
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin registration submission handler
  const onAdminSubmit = async (data: AdminRegisterFormValues) => {
    setIsLoading(true);
    setAdminError(null);
    setAdminSuccess(false);

    try {
      // Create admin user object
      const adminUser = {
        id: `admin_${Date.now()}`,
        email: data.email,
        name: data.name,
        role: "admin" as UserRole,
        department: data.department || "Administration",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store in localStorage for the auth context to find
      localStorage.setItem("authToken", "admin-token");
      localStorage.setItem("user", JSON.stringify(adminUser));

      // Also store in users collection for the admin panel
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      storedUsers.push(adminUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));

      // Show success message
      setAdminSuccess(true);

      // Wait briefly, then navigate
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setAdminError(
        error instanceof Error
          ? error.message
          : "Admin registration failed. Please try again.",
      );
      console.error("Admin registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4 py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <div className="flex justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate("/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span className="sr-only">Back to home</span>
            </Button>
            <div className="rounded bg-indigo-600 p-2">
              <div className="h-8 w-8 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                  <path d="M12 12v5" />
                  <path d="M8 12v5" />
                  <path d="M16 12v5" />
                </svg>
              </div>
            </div>
            <div className="w-8" aria-hidden="true"></div>
          </div>
          <CardTitle className="text-2xl text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>User</span>
              </TabsTrigger>
              <TabsTrigger
                value="technician"
                className="flex items-center gap-2"
              >
                <Wrench className="h-4 w-4" />
                <span>Technician</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="mt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Create a password"
                            type="password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <input type="hidden" name="role" value="user" />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create User Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="technician" className="mt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => {
                    // Set role to technician explicitly
                    onSubmit({ ...data, role: "technician" });
                  })}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Create a password"
                            type="password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Creating account..."
                      : "Create Technician Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="admin" className="mt-4">
              {adminError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{adminError}</AlertDescription>
                </Alert>
              )}

              {adminSuccess && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Success</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Admin account created successfully. Redirecting to
                    dashboard...
                  </AlertDescription>
                </Alert>
              )}

              <Form {...adminForm}>
                <form
                  onSubmit={adminForm.handleSubmit(onAdminSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={adminForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter admin name"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={adminForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter admin email"
                            type="email"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={adminForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Create a strong password"
                            type="password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={adminForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter department"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={adminForm.control}
                    name="adminCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Authorization Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter admin code"
                            type="password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          The admin code is required for security purposes.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Creating admin account..."
                      : "Create Admin Account"}
                  </Button>
                </form>
              </Form>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Admin accounts have full system access.
                  Admin creation requires an authorization code.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
