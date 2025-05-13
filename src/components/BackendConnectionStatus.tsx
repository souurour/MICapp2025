import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConnectionStatus = "checking" | "connected" | "error";

interface BackendConnectionStatusProps {
  className?: string;
  showDetails?: boolean;
  showRetry?: boolean;
}

export function BackendConnectionStatus({
  className = "",
  showDetails = false,
  showRetry = false,
}: BackendConnectionStatusProps) {
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [message, setMessage] = useState("Checking backend connection...");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [checkCount, setCheckCount] = useState(0);

  const checkBackendConnection = async () => {
    try {
      setStatus("checking");
      setMessage("Checking backend connection...");

      // Get the API URL from environment or use default
      const apiUrl =
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:5000";

      // Set up a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        // Make the request with abort controller to prevent hanging
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          setStatus("connected");
          setMessage("Successfully connected to backend");
          setErrorDetail(null);
        } else {
          setStatus("error");
          setMessage(`Backend responded with status: ${response.status}`);
          setErrorDetail(
            `Server returned ${response.status} ${response.statusText}`,
          );
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      setStatus("error");

      // Extract meaningful error message
      let errorMessage = "Unknown error";
      let detail = null;

      if (error instanceof Error) {
        errorMessage = error.message;

        // Special handling for common connection errors
        if (error.name === "AbortError") {
          errorMessage = "Connection timed out";
          detail =
            "The request to the backend server took too long and was aborted";
        } else if (
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("Network Error")
        ) {
          errorMessage = "Network connection failed";
          detail = "Could not establish a connection to the backend server";
        }
      }

      setMessage(`Failed to connect to backend: ${errorMessage}`);
      setErrorDetail(detail || errorMessage);
    } finally {
      setCheckCount((prev) => prev + 1);
    }
  };

  // Check connection when component mounts
  useEffect(() => {
    // Slight delay before first check to ensure app has initialized properly
    const timer = setTimeout(() => {
      checkBackendConnection();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Render appropriate status badge
  const StatusBadge = () => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Connected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Not Connected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="animate-pulse">
            <AlertCircle className="mr-1 h-3 w-3" />
            Checking...
          </Badge>
        );
    }
  };

  if (status === "checking" && checkCount === 0) {
    return null; // Don't show anything on first check
  }

  if (status === "connected" && !showDetails) {
    return null; // Don't show when connected unless details requested
  }

  return (
    <div className={className}>
      {status === "error" ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            Backend Connection Error <StatusBadge />
          </AlertTitle>
          <AlertDescription>
            <p>{message}</p>
            {errorDetail && (
              <p className="mt-1 text-sm opacity-80">{errorDetail}</p>
            )}
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>
                Make sure the backend server is running at{" "}
                <code>
                  {import.meta.env.VITE_API_URL || "http://localhost:5000/api"}
                </code>
              </li>
              <li>Check your network connection</li>
              <li>Verify that CORS is enabled on the backend</li>
            </ul>
            {showRetry && (
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => checkBackendConnection()}
              >
                Retry Connection
              </Button>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        showDetails && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="flex items-center justify-between">
              Backend Status <StatusBadge />
            </AlertTitle>
            <AlertDescription>
              <p>{message}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Connected to:{" "}
                {import.meta.env.VITE_API_URL || "http://localhost:5000/api"}
              </p>
            </AlertDescription>
          </Alert>
        )
      )}
    </div>
  );
}
