import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Settings, CheckCircle } from "lucide-react";
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

// Form validation schema
const machineFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  model: z.string().min(2, { message: "Model must be at least 2 characters" }),
  serialNumber: z
    .string()
    .min(4, { message: "Serial number must be at least 4 characters" }),
  location: z.string().min(1, { message: "Location is required" }),
  description: z.string().optional(),
  installationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  manufacturer: z.string().optional(),
  maintenanceInterval: z.string().optional(),
  status: z
    .enum(["operational", "maintenance", "error", "offline"])
    .default("operational"),
  notes: z.string().optional(),
});

type MachineFormValues = z.infer<typeof machineFormSchema>;

export default function CreateMachinePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize form
  const form = useForm<MachineFormValues>({
    resolver: zodResolver(machineFormSchema),
    defaultValues: {
      name: "",
      model: "",
      serialNumber: "",
      location: "",
      description: "",
      installationDate: new Date().toISOString().split("T")[0],
      manufacturer: "",
      maintenanceInterval: "90",
      status: "operational",
      notes: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: MachineFormValues) => {
    setIsSubmitting(true);
    setSuccess(false);

    try {
      // In a real application, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create machine object
      const machine = {
        id: `m${Date.now()}`,
        name: data.name,
        model: data.model,
        serialNumber: data.serialNumber,
        location: data.location,
        description: data.description,
        status: data.status,
        installationDate: new Date(data.installationDate),
        manufacturer: data.manufacturer,
        maintenanceInterval: data.maintenanceInterval,
        lastMaintenance: new Date(),
        nextScheduledMaintenance: new Date(
          new Date().setDate(
            new Date().getDate() + parseInt(data.maintenanceInterval || "90"),
          ),
        ),
        metrics: { performance: 100, availability: 100, quality: 100 },
        createdBy: user?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: data.notes,
      };

      console.log("Machine created:", machine);

      // Mock API storage in localStorage
      const storedMachines = JSON.parse(
        localStorage.getItem("machines") || "[]",
      );
      storedMachines.push(machine);
      localStorage.setItem("machines", JSON.stringify(storedMachines));

      // Show success message
      setSuccess(true);

      // Show success toast
      toast({
        title: "Machine Created",
        description: "The machine has been created successfully.",
      });

      // Wait briefly before redirecting
      setTimeout(() => {
        navigate("/machines");
      }, 2000);
    } catch (error) {
      console.error("Error creating machine:", error);
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description:
          "There was an error creating the machine. Please try again.",
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
              onClick={() => navigate("/machines")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Add Machine</h1>
          </div>
        </div>

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              Machine has been created successfully. Redirecting to machine
              list...
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Machine Information</CardTitle>
            <CardDescription>
              Add a new machine to the management system. Fill in all required
              information to properly track and maintain the equipment.
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Machine Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter machine name"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          The display name for this machine
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter model number"
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
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serial Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter serial number"
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Hall A">Hall A</SelectItem>
                            <SelectItem value="Hall B">Hall B</SelectItem>
                            <SelectItem value="Hall C">Hall C</SelectItem>
                            <SelectItem value="Production Floor">
                              Production Floor
                            </SelectItem>
                            <SelectItem value="Warehouse">Warehouse</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturer</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter manufacturer"
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
                    name="installationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Installation Date</FormLabel>
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
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter detailed description of the machine"
                          className="min-h-24"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Status</FormLabel>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="operational">
                              Operational
                            </SelectItem>
                            <SelectItem value="maintenance">
                              Maintenance
                            </SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maintenanceInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Interval (Days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="90"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          How often this machine needs maintenance (in days)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes or special instructions"
                          className="min-h-16"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/machines")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Creating Machine...</>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Machine
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
