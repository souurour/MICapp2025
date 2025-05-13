import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QlikIntegration } from "@/components/dashboard/QlikIntegration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ListFilter,
  Settings,
  Share2,
  Zap,
} from "lucide-react";

// Mock prediction data
const mockPredictions = [
  {
    id: "p1",
    machineId: "m1",
    machineName: "Laser Cutter A",
    component: "Laser Tube",
    failureProbability: 0.12,
    predictedFailureDate: new Date("2023-12-15"),
    recommendedAction: "Schedule inspection during next maintenance window",
    severity: "low",
  },
  {
    id: "p2",
    machineId: "m2",
    machineName: "Washing Machine B",
    component: "Water Pump",
    failureProbability: 0.67,
    predictedFailureDate: new Date("2023-11-10"),
    recommendedAction: "Replace water pump within 2 weeks",
    severity: "medium",
  },
  {
    id: "p3",
    machineId: "m3",
    machineName: "Drying Unit C",
    component: "Heating Element",
    failureProbability: 0.89,
    predictedFailureDate: new Date("2023-10-30"),
    recommendedAction: "Immediate replacement required",
    severity: "high",
  },
  {
    id: "p4",
    machineId: "m5",
    machineName: "Cutting Table E",
    component: "Drive Belt",
    failureProbability: 0.34,
    predictedFailureDate: new Date("2023-11-25"),
    recommendedAction: "Monitor closely and order replacement parts",
    severity: "medium",
  },
  {
    id: "p5",
    machineId: "m4",
    machineName: "Stitching Machine D",
    component: "Motor Bearing",
    failureProbability: 0.15,
    predictedFailureDate: new Date("2023-12-10"),
    recommendedAction: "Include in regular maintenance check",
    severity: "low",
  },
];

// Get severity color for badges
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

export default function PredictionDashboard() {
  const [selectedMachine, setSelectedMachine] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  // Filter predictions based on selected machine and severity
  const filteredPredictions = mockPredictions.filter((prediction) => {
    const matchesMachine =
      selectedMachine === "all" || prediction.machineId === selectedMachine;
    const matchesSeverity =
      selectedSeverity === "all" || prediction.severity === selectedSeverity;

    return matchesMachine && matchesSeverity;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Predictive Maintenance
          </h1>
          <p className="text-muted-foreground">
            AI-powered predictions to help you prevent machine failures before
            they happen
          </p>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Prediction Dashboard</TabsTrigger>
            <TabsTrigger value="predictions">Failure Predictions</TabsTrigger>
            <TabsTrigger value="history">Historical Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-4 pt-4">
            <QlikIntegration
              title="Predictive Maintenance Dashboard"
              description="AI-powered predictions for machine maintenance"
              dashboardId="prediction-dashboard"
            />
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Select
                  value={selectedMachine}
                  onValueChange={setSelectedMachine}
                >
                  <SelectTrigger className="w-[200px]">
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Machine</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Machines</SelectItem>
                    <SelectItem value="m1">Laser Cutter A</SelectItem>
                    <SelectItem value="m2">Washing Machine B</SelectItem>
                    <SelectItem value="m3">Drying Unit C</SelectItem>
                    <SelectItem value="m4">Stitching Machine D</SelectItem>
                    <SelectItem value="m5">Cutting Table E</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSeverity}
                  onValueChange={setSelectedSeverity}
                >
                  <SelectTrigger className="w-[200px]">
                    <div className="flex items-center">
                      <ListFilter className="mr-2 h-4 w-4" />
                      <span>Severity</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Predictions
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPredictions.map((prediction) => (
                <Card key={prediction.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getSeverityColor(prediction.severity)}>
                        {prediction.severity === "high" && (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        )}
                        {prediction.severity.charAt(0).toUpperCase() +
                          prediction.severity.slice(1)}{" "}
                        Risk
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Calendar className="h-3 w-3" />
                        {new Date(
                          prediction.predictedFailureDate,
                        ).toLocaleDateString()}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-2">
                      {prediction.machineName}
                    </CardTitle>
                    <CardDescription>
                      Component: {prediction.component}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Failure Probability
                          </span>
                          <span className="font-medium">
                            {Math.round(prediction.failureProbability * 100)}%
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                          <div
                            className={`h-full rounded-full ${
                              prediction.failureProbability > 0.66
                                ? "bg-red-600"
                                : prediction.failureProbability > 0.33
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{
                              width: `${prediction.failureProbability * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">Recommended Action:</span>
                        <p className="mt-1 text-muted-foreground">
                          {prediction.recommendedAction}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <Zap className="h-3.5 w-3.5" />
                          Create Alert
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <Clock className="h-3.5 w-3.5" />
                          Schedule
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <Share2 className="h-3.5 w-3.5" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Accuracy</CardTitle>
                  <CardDescription>
                    Historical accuracy of machine failure predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">
                        Model Performance
                      </AlertTitle>
                      <AlertDescription className="text-green-700">
                        Prediction model is operating with 87% accuracy over the
                        past 90 days.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Washing Machine B
                        </span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-full w-[92%] rounded-full bg-green-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Laser Cutter A
                        </span>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-full w-[88%] rounded-full bg-green-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Drying Unit C
                        </span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-full w-[85%] rounded-full bg-green-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Stitching Machine D
                        </span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-full w-[78%] rounded-full bg-yellow-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Savings</CardTitle>
                  <CardDescription>
                    Maintenance cost reduction through predictive analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-3">
                        <div className="text-2xl font-bold text-green-600">
                          28%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Downtime Reduction
                        </p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-2xl font-bold text-green-600">
                          $42,500
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Cost Savings (YTD)
                        </p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-2xl font-bold text-blue-600">
                          15
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Failures Prevented
                        </p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-2xl font-bold text-blue-600">
                          98.2%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Machine Availability
                        </p>
                      </div>
                    </div>

                    <Alert>
                      <AlertTitle>Prediction Analysis</AlertTitle>
                      <AlertDescription>
                        Predictive maintenance has helped avoid 15 potential
                        machine failures in the last quarter, resulting in
                        approximately 124 hours of saved production time.
                      </AlertDescription>
                    </Alert>

                    <Button className="w-full">View Detailed Report</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <QlikIntegration
              title="Historical Prediction Performance"
              description="Analysis of prediction accuracy over time"
              dashboardId="prediction-history"
              height="400px"
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
