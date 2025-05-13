import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Wrench, CheckCircle2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Form validation schema
const maintenanceFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  machineId: z.string({
    required_error: "Please select a machine",
  }),
  maintenanceType: z.enum([
    "preventive",
    "corrective",
    "predictive",
    "routine",
  ]),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  scheduledDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  estimatedDuration: z.string().min(1, { message: "Duration is required" }),
  requiredParts: z.array(z.string()).optional(),
  assignedTechnicians: z.array(z.string()).optional(),
  priority: z.enum(["high", "medium", "low"]),
  notifyUsers: z.boolean().default(true),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

// Mock machine data
const mockMachines = [
  { id: "m1", name: "Laser Cutter A", location: "Hall A" },
  { id: "m2", name: "Washing Machine B", location: "Hall B" },
  { id: "m3", name: "Drying Unit C", location: "Hall A" },
  { id: "m4", name: "Stitching Machine D", location: "Hall C" },
  { id: "m5", name: "Cutting Table E", location: "Hall B" },
];

// Mock parts data
const availableParts = [
  { id: "p1", value: "belt", label: "Drive Belt" },
  { id: "p2", value: "motor", label: "Motor" },
  { id: "p3", value: "filter", label: "Air Filter" },
  { id: "p4", value: "pump", label: "Water Pump" },
  { id: "p5", value: "bearing", label: "Bearings" },
  { id: "p6", value: "oil", label: "Lubricant Oil" },
  { id: "p7", value: "gasket", label: "Gaskets" },
  { id: "p8", value: "blade", label: "Cutting Blade" },
];

// Mock technicians data
const availableTechnicians = [
  { id: "t1", value: "john", label: "John Smith" },
  { id: "t2", value: "sarah", label: "Sarah Johnson" },
  { id: "t3", value: "mike", label: "Mike Williams" },
  { id: "t4", value: "anna", label: "Anna Brown" },
];

export default function CreateMaintenancePage() {
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

  // Tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // Initialize form
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      title: "",
      machineId: "",
      maintenanceType: "preventive",
      description: "",
      scheduledDate: tomorrowStr,
      estimatedDuration: "2",
      requiredParts: [],
      assignedTechnicians: [],
      priority: "medium",
      notifyUsers: true,
    },
  });

  // Watch the machine field to get the machine name
  const watchMachineId = form.watch("machineId");
  const selectedMachine = machineOptions.find((m) => m.id === watchMachineId);

  // Form submission handler
  const onSubmit = async (data: MaintenanceFormValues) => {
    setIsSubmitting(true);
    setSuccess(false);

    try {
      // In a real application, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get the machine name from the selected machine id
      const machineName =
        machineOptions.find((m) => m.id === data.machineId)?.name ||
        "Unknown Machine";

      // Get the technician names
      const technicianNames =
        data.assignedTechnicians?.map(
          (techId) =>
            availableTechnicians.find((t) => t.value === techId)?.label ||
            techId,
        ) || [];

      // Get the part names
      const partNames =
        data.requiredParts?.map(
          (partId) =>
            availableParts.find((p) => p.value === partId)?.label || partId,
        ) || [];

      // Create maintenance object
      const maintenance = {
        id: `maint_${Date.now()}`,
        title: data.title,
        machineId: data.machineId,
        machineName: machineName,
        maintenanceType: data.maintenanceType,
        description: data.description,
        scheduledDate: new Date(data.scheduledDate),
        estimatedDuration: parseInt(data.estimatedDuration),
        requiredParts: data.requiredParts,
        requiredPartNames: partNames,
        assignedTechnicians: data.assignedTechnicians,
        assignedTechnicianNames: technicianNames,
        priority: data.priority,
        status: "scheduled",
        createdBy: user?.id || "anonymous",
        createdByName: user?.name || "Anonymous User",
        createdAt: new Date(),
        updatedAt: new Date(),
        notifyUsers: data.notifyUsers,
      };

      console.log("Maintenance scheduled:", maintenance);

      // Mock API storage in localStorage
      const storedMaintenance = JSON.parse(
        localStorage.getItem("maintenance") || "[]",
      );
      storedMaintenance.push(maintenance);
      localStorage.setItem("maintenance", JSON.stringify(storedMaintenance));

      // Show success message
      setSuccess(true);

      // Show success toast
      toast({
        title: "Maintenance Scheduled",
        description: "The maintenance task has been scheduled successfully.",
      });

      // Wait briefly before redirecting
      setTimeout(() => {
        navigate("/maintenance");
      }, 2000);
    } catch (error) {
      console.error("Error scheduling maintenance:", error);
      toast({
        variant: "destructive",
        title: "Scheduling Failed",
        description:
          "There was an error scheduling the maintenance. Please try again.",
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
              onClick={() => navigate("/maintenance")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Schedule Maintenance
            </h1>
          </div>
        </div>

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">
              Maintenance Scheduled
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Maintenance has been scheduled successfully. Technicians will be
              notified. Redirecting to maintenance list...
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Information</CardTitle>
            <CardDescription>
              Schedule a maintenance task for a machine. Provide all necessary
              details to ensure proper planning and execution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a descriptive title"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="maintenanceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Type</FormLabel>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="preventive">
                              Preventive
                            </SelectItem>
                            <SelectItem value="corrective">
                              Corrective
                            </SelectItem>
                            <SelectItem value="predictive">
                              Predictive
                            </SelectItem>
                            <SelectItem value="routine">Routine</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Duration (Hours)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0.5"
                            step="0.5"
                            placeholder="2"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
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
                      <FormLabel>Maintenance Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide detailed information about the maintenance task"
                          className="min-h-24"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Include specific instructions, procedures, or any
                        special requirements
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="requiredParts"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Required Parts</FormLabel>
                          <FormDescription>
                            Select all parts needed for this maintenance
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {availableParts.map((part) => (
                            <FormField
                              key={part.id}
                              control={form.control}
                              name="requiredParts"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={part.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          part.value,
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                part.value,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== part.value,
                                                ),
                                              );
                                        }}
                                        disabled={isSubmitting}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {part.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assignedTechnicians"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Assign Technicians</FormLabel>
                          <FormDescription>
                            Select technicians to perform this maintenance
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {availableTechnicians.map((tech) => (
                            <FormField
                              key={tech.id}
                              control={form.control}
                              name="assignedTechnicians"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={tech.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          tech.value,
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                tech.value,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== tech.value,
                                                ),
                                              );
                                        }}
                                        disabled={isSubmitting}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {tech.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            <SelectItem value="high">
                              High - Urgent maintenance
                            </SelectItem>
                            <SelectItem value="medium">
                              Medium - Standard priority
                            </SelectItem>
                            <SelectItem value="low">
                              Low - Can be delayed if needed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notifyUsers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Notify Users</FormLabel>
                          <FormDescription>
                            Send notifications to affected users
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {selectedMachine && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Wrench className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">
                      Selected Machine: {selectedMachine.name}
                    </AlertTitle>
                    <AlertDescription className="text-blue-700">
                      Located in {selectedMachine.location}. Make sure this is
                      the correct machine before scheduling maintenance.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/maintenance")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Scheduling Maintenance...</>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Maintenance
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col border-t px-6 py-4">
            <Alert className="bg-slate-50 border-slate-200">
              <Calendar className="h-4 w-4 text-slate-600" />
              <AlertTitle className="text-slate-800">
                Scheduling Notice
              </AlertTitle>
              <AlertDescription className="text-slate-700">
                Scheduling maintenance will automatically notify assigned
                technicians and may affect production schedules. Please ensure
                all information is accurate before submitting.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
