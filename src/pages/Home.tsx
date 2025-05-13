import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");
  const [statusMessage, setStatusMessage] = useState(
    "Checking backend connection...",
  );

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        // Try to connect to the backend with error handling
        const apiUrl =
          import.meta.env.VITE_API_URL?.replace("/api", "") ||
          "http://localhost:5000";

        // Use a try-catch block with a timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            setBackendStatus("connected");
            setStatusMessage("Backend server is running and connected");
          } else {
            setBackendStatus("error");
            setStatusMessage(
              `Backend responded with status: ${response.status}`,
            );
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      } catch (error) {
        setBackendStatus("error");
        setStatusMessage(
          error instanceof Error
            ? error.message
            : "Failed to connect to backend",
        );
      }
    };

    // Use a more reliable approach with setTimeout instead of immediate execution
    const timer = setTimeout(() => {
      checkBackendConnection();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const renderStatusBadge = () => {
    switch (backendStatus) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Connected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Not Connected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Checking...
          </Badge>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-white py-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded bg-indigo-600 p-2">
              <div className="h-6 w-6 text-white">
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
            <span className="text-xl font-bold">MIC Service Laser</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900">
            Manufacturing Intelligence Center
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
            Real-time monitoring, maintenance management, and predictive
            analytics for your manufacturing operations
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="h-12 px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/learn-more">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Backend Status Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                System Status {renderStatusBadge()}
              </CardTitle>
              <CardDescription>
                Check the connection status to the backend API server
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">API Server:</span>{" "}
                  {import.meta.env.VITE_API_URL || "http://localhost:5000/api"}
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  <span className="font-semibold">Status:</span> {statusMessage}
                </p>

                {backendStatus === "error" && (
                  <div className="mt-3 rounded-md bg-red-50 p-3 text-red-800">
                    <p className="text-sm font-medium">
                      Backend Connection Error
                    </p>
                    <ul className="mt-1 list-disc pl-5 text-xs">
                      <li>Make sure the backend server is running</li>
                      <li>
                        Check the VITE_API_URL environment variable in your .env
                        file
                      </li>
                      <li>Verify network connectivity to the backend server</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {backendStatus === "error" ? (
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Retry Connection
                </Button>
              ) : (
                <div className="text-sm text-gray-500">
                  {backendStatus === "connected"
                    ? "The application is ready to use! You can log in or register."
                    : "Checking connection status..."}
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Comprehensive Manufacturing Management
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-3 text-xl font-semibold">Machine Monitoring</h3>
              <p className="text-gray-600">
                Real-time tracking of all equipment status, performance metrics,
                and operational efficiency
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-3 text-xl font-semibold">
                Maintenance Management
              </h3>
              <p className="text-gray-600">
                Schedule, track, and optimize maintenance activities to reduce
                downtime and extend equipment life
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-3 text-xl font-semibold">
                Predictive Analytics
              </h3>
              <p className="text-gray-600">
                AI-powered predictions for maintenance needs, failure
                prevention, and optimal performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded bg-white p-1">
                  <div className="h-6 w-6 text-indigo-600">
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
                <span className="text-xl font-bold text-white">
                  MIC Service Laser
                </span>
              </div>
              <p className="mt-2 max-w-md text-sm text-gray-400">
                Manufacturing Intelligence Center - Empowering your
                manufacturing process with real-time insights and predictive
                analytics
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-16">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase text-white">
                  Product
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/learn-more" className="hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/learn-more" className="hover:text-white">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase text-white">
                  Support
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/learn-more" className="hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link to="/learn-more" className="hover:text-white">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase text-white">
                  Legal
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/learn-more" className="hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link to="/learn-more" className="hover:text-white">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} MIC Service Laser. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
