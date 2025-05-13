import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Filter,
  MessageSquare,
  ArrowUpDown,
  MoreHorizontal,
  Star,
  MessageCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

// Mock feedback data types
type FeedbackStatus = "open" | "in_progress" | "resolved" | "closed";
type FeedbackCategory =
  | "interface"
  | "feature_request"
  | "bug"
  | "suggestion"
  | "other";

interface Feedback {
  id: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  rating?: number;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  assignedToName?: string;
  response?: {
    text: string;
    respondedBy: string;
    respondedByName: string;
    respondedAt: Date;
  };
}

// Helper to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Helper to get status color
const getStatusColor = (status: FeedbackStatus) => {
  switch (status) {
    case "open":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "resolved":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "closed":
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

// Helper to get category color
const getCategoryColor = (category: FeedbackCategory) => {
  switch (category) {
    case "bug":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "feature_request":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "interface":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "suggestion":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "other":
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

// Mock feedback data
const mockFeedback: Feedback[] = [
  {
    id: "f1",
    title: "Dashboard is difficult to navigate",
    description:
      "I find it hard to find the machine metrics I need quickly. Could we have a more customizable dashboard?",
    category: "interface",
    status: "open",
    rating: 2,
    createdBy: "u4",
    createdByName: "Regular User",
    createdAt: new Date("2023-10-15T09:30:00"),
    updatedAt: new Date("2023-10-15T09:30:00"),
  },
  {
    id: "f2",
    title: "Request for mobile alerts",
    description:
      "It would be helpful to receive mobile notifications when a machine requires attention.",
    category: "feature_request",
    status: "in_progress",
    rating: 4,
    createdBy: "u3",
    createdByName: "Sarah Engineer",
    createdAt: new Date("2023-10-10T14:15:00"),
    updatedAt: new Date("2023-10-11T10:30:00"),
    assignedTo: "u1",
    assignedToName: "Admin User",
  },
  {
    id: "f3",
    title: "Error when generating PDF reports",
    description:
      "I'm getting an error message when trying to generate a PDF report for the last week's maintenance.",
    category: "bug",
    status: "resolved",
    rating: 3,
    createdBy: "u2",
    createdByName: "John Technician",
    createdAt: new Date("2023-10-08T11:45:00"),
    updatedAt: new Date("2023-10-09T16:20:00"),
    assignedTo: "u1",
    assignedToName: "Admin User",
    response: {
      text: "This issue has been fixed. We found a problem with the PDF generation library and have updated it. Please try generating your report again.",
      respondedBy: "u1",
      respondedByName: "Admin User",
      respondedAt: new Date("2023-10-09T16:20:00"),
    },
  },
  {
    id: "f4",
    title: "Suggestion for trend analysis",
    description:
      "It would be useful to have trend analysis for machine performance over time, showing when efficiency is declining.",
    category: "suggestion",
    status: "open",
    rating: 5,
    createdBy: "u4",
    createdByName: "Regular User",
    createdAt: new Date("2023-10-05T10:10:00"),
    updatedAt: new Date("2023-10-05T10:10:00"),
  },
  {
    id: "f5",
    title: "Maintenance form is too complex",
    description:
      "The maintenance form has too many fields, and many are unnecessary for simple tasks. Could we have a simplified version?",
    category: "interface",
    status: "closed",
    rating: 2,
    createdBy: "u2",
    createdByName: "John Technician",
    createdAt: new Date("2023-09-28T13:20:00"),
    updatedAt: new Date("2023-10-02T09:45:00"),
    assignedTo: "u1",
    assignedToName: "Admin User",
    response: {
      text: "Thank you for your feedback. We've decided to keep the comprehensive form to ensure all necessary data is captured, but we've added a 'Quick Entry' mode that shows only essential fields. You can toggle this in the form settings.",
      respondedBy: "u1",
      respondedByName: "Admin User",
      respondedAt: new Date("2023-10-02T09:45:00"),
    },
  },
];

export default function FeedbackList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );
  const [responseText, setResponseText] = useState("");

  // Filter feedback based on search query, status and category filters
  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.createdByName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // If user is not admin, only show their feedback
  const userFeedback =
    !isAdmin && user
      ? filteredFeedback.filter((item) => item.createdBy === user.id)
      : filteredFeedback;

  const handleCreateFeedback = () => {
    navigate("/feedback/create");
  };

  const handleViewFeedback = (feedbackId: string) => {
    navigate(`/feedback/${feedbackId}`);
  };

  const openResponseDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.response?.text || "");
    setIsResponseDialogOpen(true);
  };

  const submitResponse = () => {
    if (!selectedFeedback || !user) return;

    // In a real app, this would be an API call
    const updatedFeedback = feedback.map((item) =>
      item.id === selectedFeedback.id
        ? {
            ...item,
            status: "resolved" as FeedbackStatus,
            updatedAt: new Date(),
            response: {
              text: responseText,
              respondedBy: user.id,
              respondedByName: user.name,
              respondedAt: new Date(),
            },
          }
        : item,
    );

    setFeedback(updatedFeedback);
    setIsResponseDialogOpen(false);
    setSelectedFeedback(null);
    setResponseText("");
  };

  // Render star rating
  const renderRating = (rating?: number) => {
    if (!rating) return null;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
            <p className="text-muted-foreground">
              {isAdmin
                ? "Manage user feedback and suggestions for the platform"
                : "Submit and track your feedback and suggestions"}
            </p>
          </div>
          <Button onClick={handleCreateFeedback}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Feedback
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search feedback..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[170px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Category</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="interface">Interface</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {userFeedback.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
            <div className="flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No feedback found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No feedback items match your search criteria. Try adjusting your
                filters or submit new feedback.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">
                    <div className="flex items-center gap-1">
                      Feedback
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userFeedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </div>
                      {item.response && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                          <MessageCircle className="h-3 w-3" />
                          <span>Has response</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-indigo-100 text-indigo-800">
                            {getInitials(item.createdByName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{item.createdByName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{renderRating(item.rating)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewFeedback(item.id)}
                          >
                            View Details
                          </DropdownMenuItem>

                          {isAdmin &&
                            item.status !== "resolved" &&
                            item.status !== "closed" && (
                              <DropdownMenuItem
                                onClick={() => openResponseDialog(item)}
                              >
                                Respond
                              </DropdownMenuItem>
                            )}

                          {isAdmin && item.status === "resolved" && (
                            <DropdownMenuItem
                              onClick={() => {
                                // In a real app, this would be an API call
                                const updatedFeedback = feedback.map(
                                  (feedback) =>
                                    feedback.id === item.id
                                      ? {
                                          ...feedback,
                                          status: "closed" as FeedbackStatus,
                                          updatedAt: new Date(),
                                        }
                                      : feedback,
                                );
                                setFeedback(updatedFeedback);
                              }}
                            >
                              Close Feedback
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Response Dialog */}
      <Dialog
        open={isResponseDialogOpen}
        onOpenChange={setIsResponseDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogDescription>
              Provide a response to the user's feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {selectedFeedback && (
              <>
                <h4 className="font-medium">{selectedFeedback.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedFeedback.description}
                </p>
                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium">Your Response</label>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response here..."
                    className="min-h-32"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResponseDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={!responseText.trim()} onClick={submitResponse}>
              Submit Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
