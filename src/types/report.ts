export type ReportType =
  | "performance"
  | "maintenance"
  | "alerts"
  | "prediction";
export type ReportFormat = "pdf" | "excel";

export interface ReportConfig {
  type: ReportType;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  machineIds?: string[];
  includeCharts: boolean;
  format: ReportFormat;
}

export interface Report {
  id: string;
  config: ReportConfig;
  generatedBy: string;
  generatedByName: string;
  fileUrl: string;
  createdAt: Date;
}
