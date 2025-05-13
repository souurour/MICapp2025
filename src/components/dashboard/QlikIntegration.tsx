import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface QlikIntegrationProps {
  dashboardId?: string;
  title: string;
  description?: string;
  height?: string;
}

export function QlikIntegration({
  dashboardId = "default-dashboard",
  title,
  description,
  height = "600px",
}: QlikIntegrationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Qlik Sense dashboards URLs - in a real app, these would come from your backend
  const dashboards = {
    performance: "https://embed.charts.dev/demo/performance",
    maintenance: "https://embed.charts.dev/demo/maintenance",
    availability: "https://embed.charts.dev/demo/availability",
    prediction: "https://embed.charts.dev/demo/prediction",
  };

  useEffect(() => {
    // Simulate loading the Qlik Sense dashboard
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError("Failed to load dashboard. Please try again later.");
    setIsLoading(false);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="performance">
          <div className="px-6 pt-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="prediction">Prediction</TabsTrigger>
            </TabsList>
          </div>

          {Object.entries(dashboards).map(([key, url]) => (
            <TabsContent key={key} value={key} className="p-0 pt-2">
              <div className="relative" style={{ height }}>
                {isLoading && (
                  <div className="absolute inset-0 p-6">
                    <div className="mb-4 space-y-2">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-40 rounded-md" />
                      <Skeleton className="h-40 rounded-md" />
                    </div>
                    <div className="mt-4">
                      <Skeleton className="h-64 rounded-md" />
                    </div>
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="text-center text-red-500">
                      <p className="text-lg font-semibold">{error}</p>
                      <button
                        className="mt-4 rounded bg-primary px-4 py-2 text-white"
                        onClick={() => {
                          setError(null);
                          setIsLoading(true);
                          setTimeout(() => setIsLoading(false), 2000);
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
                {!error && (
                  <iframe
                    src={url}
                    title={`${key} Dashboard`}
                    className="h-full w-full rounded-b-lg border-0"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    style={{ visibility: isLoading ? "hidden" : "visible" }}
                  />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
