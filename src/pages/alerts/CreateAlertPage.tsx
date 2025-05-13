import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, BellRing } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { AlertPriority, AlertStatus } from "@/types/alert";

// Form validation schema
const alertFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  machineId: z.string({
    required_error: "Please select a machine",
  }),
  priority: z.enum(["critical", "medium", "low"]),
  photos: z.any().optional(),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

// Helper to get alert priority color
const getAlertPriorityColor = (priority: AlertPriority) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

// Mock machine data
const mockMachines = [
  { id: "m1", name: "Laser Cutter A", location: "Hall A" },
  { id: "m2", name: "Washing Machine B", location: "Hall B" },
  { id: "m3", name: "Drying Unit C", location: "Hall A" },
  { id: "m4", name: "Stitching Machine D", location: "Hall C" },
  { id: "m5", name: "Cutting Table E", location: "Hall B" },
];

export default function CreateAlertPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [machineOptions, setMachineOptions] = useState(mockMachines);

  // Load machines from localStorage if available
  useState(() => {
    const storedMachines = JSON.parse(localStorage.getItem("machines") || "[]");
    if (storedMachines.length > 0) {
      // Convert to the format we need
      const formattedMachines = storedMachines.map((machine: any) => ({
        id: machine.id,
        name: machine.name,
        location: machine.location,
      }));
      // Combine with mock machines, avoiding duplicates
      const combinedMachines = [...mockMachines];
      formattedMachines.forEach((machine: any) => {
        if (!mockMachines.some((m) => m.id === machine.id)) {
          combinedMachines.push(machine);
        }
      });
      setMachineOptions(combinedMachines);
    }
  }, []);

  // Initialize form
  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      title: "",
      description: "",
      machineId: "",
      priority: "medium",
    },
  });

  // Watch the priority field to show the appropriate badge
  const watchPriority = form.watch("priority") as AlertPriority;

  // Watch the machine field to get the machine name
  const watchMachineId = form.watch("machineId");
  const selectedMachine = machineOptions.find((m) => m.id === watchMachineId);

  // Form submission handler
  const onSubmit = async (data: AlertFormValues) => {
    setIsSubmitting(true);
    setSuccess(false);

    try {
      // In a real application, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get the machine name from the selected machine id
      const machineName =
        machineOptions.find((m) => m.id === data.machineId)?.name ||
        "Unknown Machine";

      // Create alert object
      const alert = {
        id: `a${Date.now()}`,
        title: data.title,
        description: data.description,
        machineId: data.machineId,
        machineName: machineName,
        priority: data.priority,
        status: "open" as AlertStatus,
        createdBy: user?.id || "anonymous",
        createdByName: user?.name || "Anonymous User",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Alert created:", alert);

      // Mock API storage in localStorage
      const storedAlerts = JSON.parse(localStorage.getItem("alerts") || "[]");
      storedAlerts.push(alert);
      localStorage.setItem("alerts", JSON.stringify(storedAlerts));

      // Show success message
      setSuccess(true);

      // Show success toast
      toast({
        title: "Alert Created",
        description: "Your alert has been created successfully.",
      });

      // Wait briefly before redirecting
      setTimeout(() => {
        navigate("/alerts");
      }, 2000);
    } catch (error) {
      console.error("Error creating alert:", error);
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "There was an error creating the alert. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/alerts")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Create Alert</h1>
          </div>
        </div>

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <BellRing className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Alert Created</AlertTitle>
            <AlertDescription className="text-green-700">
              Your alert has been created successfully. Technicians will be
              notified. Redirecting to alert list...
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Alert Information</CardTitle>
            <CardDescription>
              Create a new alert to report machine issues or maintenance needs.
              Provide as much detail as possible to help technicians address the
              problem efficiently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief description of the issue"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, concise title for the alert
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="machineId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Machine</FormLabel>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select machine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {machineOptions.map((machine) => (
                              <SelectItem key={machine.id} value={machine.id}>
                                {machine.name} ({machine.location})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the machine that needs attention
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority Level</FormLabel>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="critical">
                              Critical - Immediate attention required
                            </SelectItem>
                            <SelectItem value="medium">
                              Medium - Needs attention soon
                            </SelectItem>
                            <SelectItem value="low">
                              Low - Can be addressed during regular maintenance
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="mt-2">
                          <Badge
                            className={getAlertPriorityColor(watchPriority)}
                          >
                            {watchPriority === "critical" && (
                              <AlertTriangle className="mr-1 h-3 w-3" />
                            )}
                            {watchPriority.charAt(0).toUpperCase() +
                              watchPriority.slice(1)}
                          </Badge>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide detailed information about the issue"
                          className="min-h-32"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Please describe the issue in detail. Include any
                        relevant observations, when it started, and how it's
                        affecting production.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photos (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={isSubmitting}
                          onChange={(e) => {
                            field.onChange(e.target.files);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload photos of the issue to help technicians identify
                        the problem
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedMachine && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">
                      Selected Machine: {selectedMachine.name}
                    </AlertTitle>
                    <AlertDescription className="text-blue-700">
                      Located in {selectedMachine.location}. Make sure this is
                      the correct machine before submitting the alert.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/alerts")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Creating Alert...</>
                    ) : (
                      <>
                        <BellRing className="mr-2 h-4 w-4" />
                        Create Alert
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col border-t px-6 py-4">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">
                Critical alerts are prioritized
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                Critical alerts will be immediately sent to technicians. Use
                this priority level only for urgent issues that require
                immediate attention.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
