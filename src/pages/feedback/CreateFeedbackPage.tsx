import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, SendHorizontal, FileText } from "lucide-react";
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

// Feedback type definitions
type FeedbackType = "suggestion" | "issue" | "praise" | "other";
type FeedbackPriority = "low" | "medium" | "high";

// Form validation schema
const feedbackFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  type: z.enum(["suggestion", "issue", "praise", "other"]),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string().optional(),
  attachments: z.any().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export default function CreateFeedbackPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "suggestion",
      priority: "medium",
      category: "System",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real application, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create feedback object
      const feedback = {
        id: `feedback_${Date.now()}`,
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        category: data.category,
        createdBy: user?.id || "anonymous",
        createdByName: user?.name || "Anonymous User",
        createdAt: new Date(),
        status: "open",
      };

      console.log("Feedback submitted:", feedback);

      // Mock API storage in localStorage
      const storedFeedback = JSON.parse(
        localStorage.getItem("feedback") || "[]",
      );
      storedFeedback.push(feedback);
      localStorage.setItem("feedback", JSON.stringify(storedFeedback));

      // Show success toast
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });

      // Redirect back to feedback list
      navigate("/feedback");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description:
          "There was an error submitting your feedback. Please try again.",
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
              onClick={() => navigate("/feedback")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Submit Feedback
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Form</CardTitle>
            <CardDescription>
              Share your thoughts, suggestions, or report issues with the
              system. Your feedback helps us improve our services.
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a clear title for your feedback"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief title that describes your feedback
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feedback Type</FormLabel>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select feedback type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="suggestion">
                              Suggestion
                            </SelectItem>
                            <SelectItem value="issue">Issue Report</SelectItem>
                            <SelectItem value="praise">Praise</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
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
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="System">System</SelectItem>
                          <SelectItem value="Interface">
                            User Interface
                          </SelectItem>
                          <SelectItem value="Machines">Machines</SelectItem>
                          <SelectItem value="Reports">Reports</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide detailed information about your feedback"
                          className="min-h-32"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Please include any relevant details, steps to reproduce
                        issues, or specific suggestions for improvements
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attachments (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          disabled={isSubmitting}
                          onChange={(e) => {
                            field.onChange(e.target.files);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        You can attach screenshots, documents, or other relevant
                        files (max 5MB each)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/feedback")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <SendHorizontal className="mr-2 h-4 w-4" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col border-t px-6 py-4">
            <Alert className="bg-blue-50 border-blue-200">
              <FileText className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">
                Your feedback matters
              </AlertTitle>
              <AlertDescription className="text-blue-700">
                All feedback is reviewed by our team and helps prioritize system
                improvements. Thank you for contributing to make our platform
                better!
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
