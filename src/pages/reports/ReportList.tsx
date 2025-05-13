import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Filter,
  FileText,
  ArrowUpDown,
  MoreHorizontal,
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  FileIcon,
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
import { Report, ReportType } from "@/types/report";

// Helper functions
const getReportTypeIcon = (type: ReportType) => {
  switch (type) {
    case "performance":
      return <BarChart3 className="h-4 w-4" />;
    case "maintenance":
      return <Calendar className="h-4 w-4" />;
    case "alerts":
      return <FileText className="h-4 w-4" />;
    case "prediction":
      return <BarChart3 className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getReportTypeColor = (type: ReportType) => {
  switch (type) {
    case "performance":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "maintenance":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "alerts":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "prediction":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

const getFormatIcon = (format: string) => {
  switch (format.toLowerCase()) {
    case "pdf":
      return <FileIcon className="h-4 w-4" />; // Changed from FilePdf to FileIcon
    case "excel":
      return <FileSpreadsheet className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

// Helper to generate initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Mock report data
const mockReports: Report[] = [
  {
    id: "r1",
    config: {
      type: "performance",
      title: "Monthly Performance Report",
      description: "Performance metrics for all machines",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-09-30"),
      includeCharts: true,
      format: "pdf",
    },
    generatedBy: "u1",
    generatedByName: "Admin User",
    fileUrl: "/reports/performance-report-sept-2023.pdf",
    createdAt: new Date("2023-10-02T09:30:00"),
  },
  {
    id: "r2",
    config: {
      type: "maintenance",
      title: "Quarterly Maintenance Summary",
      description: "Maintenance activities and costs for Q3",
      startDate: new Date("2023-07-01"),
      endDate: new Date("2023-09-30"),
      includeCharts: true,
      format: "excel",
    },
    generatedBy: "u1",
    generatedByName: "Admin User",
    fileUrl: "/reports/maintenance-report-q3-2023.xlsx",
    createdAt: new Date("2023-10-05T14:15:00"),
  },
  {
    id: "r3",
    config: {
      type: "alerts",
      title: "Critical Alerts Report",
      description: "Summary of all critical alerts",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-09-30"),
      includeCharts: false,
      format: "pdf",
    },
    generatedBy: "u1",
    generatedByName: "Admin User",
    fileUrl: "/reports/critical-alerts-sept-2023.pdf",
    createdAt: new Date("2023-10-01T11:45:00"),
  },
  {
    id: "r4",
    config: {
      type: "prediction",
      title: "Predictive Maintenance Forecast",
      description: "6-month prediction for maintenance needs",
      startDate: new Date("2023-10-01"),
      endDate: new Date("2024-03-31"),
      includeCharts: true,
      format: "pdf",
    },
    generatedBy: "u1",
    generatedByName: "Admin User",
    fileUrl: "/reports/prediction-oct2023-mar2024.pdf",
    createdAt: new Date("2023-10-10T16:20:00"),
  },
  {
    id: "r5",
    config: {
      type: "performance",
      title: "Machine Efficiency Analysis",
      description: "Detailed efficiency metrics by machine",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2023-09-30"),
      machineIds: ["m1", "m2", "m3", "m4", "m5"],
      includeCharts: true,
      format: "excel",
    },
    generatedBy: "u1",
    generatedByName: "Admin User",
    fileUrl: "/reports/efficiency-aug-sept-2023.xlsx",
    createdAt: new Date("2023-10-08T10:10:00"),
  },
];

export default function ReportList() {
  const navigate = useNavigate();

  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter reports based on search query and type filter
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.config.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.config.description &&
        report.config.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      report.generatedByName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || report.config.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleCreateReport = () => {
    navigate("/reports/create");
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleDownloadReport = (report: Report) => {
    // In a real app, this would trigger a file download
    console.log(`Downloading report: ${report.fileUrl}`);

    // Simulate download with alert
    window.alert(
      `Downloading ${report.config.title} (${report.config.format.toUpperCase()})`,
    );
  };

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate and view reports for machine performance, maintenance,
              and more
            </p>
          </div>
          <Button onClick={handleCreateReport}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Type</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="alerts">Alerts</SelectItem>
                <SelectItem value="prediction">Prediction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
            <div className="flex flex-col items-center justify-center text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No reports found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No reports match your search criteria. Try adjusting your
                filters or generate a new report.
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
                      Report
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Generated By</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFormatIcon(report.config.format)}
                        <div>
                          <div className="font-medium">
                            {report.config.title}
                          </div>
                          {report.config.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {report.config.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getReportTypeColor(report.config.type)}>
                        {getReportTypeIcon(report.config.type)}
                        <span className="ml-1">
                          {report.config.type.charAt(0).toUpperCase() +
                            report.config.type.slice(1)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDateRange(
                        report.config.startDate,
                        report.config.endDate,
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-indigo-100 text-indigo-800">
                            {getInitials(report.generatedByName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {report.generatedByName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
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
                            onClick={() => handleViewReport(report.id)}
                          >
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadReport(report)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download ({report.config.format.toUpperCase()})
                          </DropdownMenuItem>
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
    </DashboardLayout>
  );
}
