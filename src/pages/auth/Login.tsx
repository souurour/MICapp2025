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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  User,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

// Admin login schema
const adminLoginSchema = z.object({
  password: z.string().refine((val) => val === "ADMINmic2025", {
    message: "Invalid admin password",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("user");
  const [adminError, setAdminError] = useState<string | null>(null);

  // Initialize user login form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Initialize admin login form
  const adminForm = useForm<{ password: string }>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      password: "",
    },
  });

  // User form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    clearError();

    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the auth context
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin form submission handler
  const onAdminSubmit = async (data: { password: string }) => {
    setIsLoading(true);
    setAdminError(null);

    try {
      if (data.password === "ADMINmic2025") {
        // Create admin user object
        const adminUser = {
          id: "admin",
          email: "admin@micservicelaser.com",
          name: "Administrator",
          role: "admin" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Store admin user in localStorage
        localStorage.setItem("authToken", "admin-token");
        localStorage.setItem("user", JSON.stringify(adminUser));

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setAdminError("Invalid admin password");
      }
    } catch (error) {
      setAdminError("Admin login failed. Please try again.");
      console.error("Admin login failed:", error);
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
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
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
                <Alert variant="destructive" className="mb-4">
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
                            placeholder="Enter your password"
                            type="password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>

              <div className="text-center text-sm mt-4">
                <Link
                  to="/forgot-password"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Forgot your password?
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="technician" className="mt-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => {
                    // Add role=technician to the form data before submitting
                    onSubmit({ ...data, role: "technician" });
                  })}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your technician email"
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
                            placeholder="Enter your password"
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
                    {isLoading ? "Signing in..." : "Technician Sign In"}
                  </Button>
                </form>
              </Form>

              <div className="text-center text-sm mt-4">
                <Link
                  to="/forgot-password"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Forgot your password?
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="mt-4">
              {adminError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{adminError}</AlertDescription>
                </Alert>
              )}

              <Form {...adminForm}>
                <form
                  onSubmit={adminForm.handleSubmit(onAdminSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={adminForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter admin password"
                            type="password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Admin Sign In"}
                  </Button>
                </form>
              </Form>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                <p className="text-sm text-amber-800">
                  This area is restricted to system administrators only.
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
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
