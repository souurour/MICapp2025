import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QlikIntegration } from "@/components/dashboard/QlikIntegration";
import { UserRole } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

interface DashboardStats {
  machines: {
    total: number;
    operational: number;
    maintenance: number;
    offline: number;
  };
  alerts: {
    total: number;
    critical: number;
    medium: number;
    low: number;
  };
  maintenance: {
    scheduled: number;
    inProgress: number;
    completed: number;
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    machines: {
      total: 24,
      operational: 18,
      maintenance: 4,
      offline: 2,
    },
    alerts: {
      total: 12,
      critical: 2,
      medium: 5,
      low: 5,
    },
    maintenance: {
      scheduled: 6,
      inProgress: 3,
      completed: 15,
    },
  });

  // Simulating data fetching
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDashboardData = async () => {
      // Mock API call
      setTimeout(() => {
        setStats({
          machines: {
            total: 24,
            operational: 18,
            maintenance: 4,
            offline: 2,
          },
          alerts: {
            total: 12,
            critical: 2,
            medium: 5,
            low: 5,
          },
          maintenance: {
            scheduled: 6,
            inProgress: 3,
            completed: 15,
          },
        });
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  const renderRoleSpecificContent = () => {
    if (!user) return null;

    switch (user.role as UserRole) {
      case "admin":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Machines</CardTitle>
                <CardDescription>Machine status overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.machines.total}</div>
                <div className="flex justify-between mt-2 text-sm">
                  <div className="text-green-500">
                    {stats.machines.operational} operational
                  </div>
                  <div className="text-yellow-500">
                    {stats.machines.maintenance} maintenance
                  </div>
                  <div className="text-red-500">
                    {stats.machines.offline} offline
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <CardDescription>Current active alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.alerts.total}</div>
                <div className="flex justify-between mt-2 text-sm">
                  <div className="text-red-500">
                    {stats.alerts.critical} critical
                  </div>
                  <div className="text-yellow-500">
                    {stats.alerts.medium} medium
                  </div>
                  <div className="text-green-500">{stats.alerts.low} low</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Maintenance
                </CardTitle>
                <CardDescription>Maintenance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.maintenance.inProgress + stats.maintenance.scheduled}
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <div className="text-blue-500">
                    {stats.maintenance.scheduled} scheduled
                  </div>
                  <div className="text-yellow-500">
                    {stats.maintenance.inProgress} in progress
                  </div>
                  <div className="text-green-500">
                    {stats.maintenance.completed} completed
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "technician":
        return (
          <div className="space-y-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Maintenance Tasks</CardTitle>
                <CardDescription>
                  Your current maintenance assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Maintenance Required</AlertTitle>
                    <AlertDescription>
                      Machine M1001 (Laser Cutter A) requires scheduled
                      maintenance.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Critical Alert</AlertTitle>
                    <AlertDescription>
                      Machine M1003 (Stitching Machine 2) has a critical error.
                      Immediate attention required.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "user":
        return (
          <div className="space-y-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Current status of the manufacturing system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">
                    All Systems Operational
                  </AlertTitle>
                  <AlertDescription className="text-green-700">
                    Production is running smoothly. No critical issues reported.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "User"}! Here's an overview of your
            system.
          </p>
        </div>

        {renderRoleSpecificContent()}

        <Tabs defaultValue="main">
          <TabsList>
            <TabsTrigger value="main">Main Dashboard</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
          </TabsList>
          <TabsContent value="main" className="pt-4">
            <QlikIntegration
              title="Overview Dashboard"
              description="Key performance indicators and system health"
              dashboardId="main-dashboard"
            />
          </TabsContent>
          <TabsContent value="performance" className="pt-4">
            <QlikIntegration
              title="Performance Metrics"
              description="Detailed performance analysis of all machines"
              dashboardId="performance-dashboard"
            />
          </TabsContent>
          <TabsContent value="maintenance" className="pt-4">
            <QlikIntegration
              title="Maintenance History"
              description="Historical maintenance data and scheduled maintenance"
              dashboardId="maintenance-dashboard"
            />
          </TabsContent>
          <TabsContent value="prediction" className="pt-4">
            <QlikIntegration
              title="Predictive Analytics"
              description="AI-powered predictions for machine maintenance needs"
              dashboardId="prediction-dashboard"
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
