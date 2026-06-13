export interface EmailSpool {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string;
  status: "QUEUED" | "SENT" | "DELIVERED";
  timestamp: string;
  aiResponse?: string;
  sentryBreadcrumbTraceId?: string;
}

export interface SentryIssue {
  id: string;
  title: string;
  type: string;
  message: string;
  level: "fatal" | "error" | "warning" | "info";
  timestamp: string;
  resolved: boolean;
  breadcrumbs: string[];
  resolvedAt?: string;
  stackTrace?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  tag: string;
  tech: string;
  desc: string;
  status: "ACTIVE" | "DEPRECATED" | "STANDBY";
  sentryErrorsCount: number;
}
