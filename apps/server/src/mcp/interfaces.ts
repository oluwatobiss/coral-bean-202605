import type { Email, CalendarEvent, Insight } from "../ai/heuristicEngine.ts";

export interface MCPTool<Input, Output> {
  name: string;
  description: string;
  execute: (input: Input) => Promise<Output>;
}

// ----------------------------------------------------
// Tool Output Schemas
// ----------------------------------------------------

export interface DashboardContextOutput {
  emails: Email[];
  events: CalendarEvent[];
  // Pre-computed heuristic context if needed, or just raw normalized data
}

export interface ConnectedSource {
  name: string;
  status: "connected" | "disconnected";
}

export interface ConnectedSourcesOutput {
  sources: ConnectedSource[];
}

export interface DailyBriefingOutput {
  briefing: string;
  priorities: string[];
  warnings: string[];
}

export interface ProductivitySummaryOutput {
  focusScore: number;
  upcomingMeetings: number;
  importantEmails: number;
  conflicts: number;
  recommendation: string;
}

export interface HighRiskCommitmentsOutput {
  risks: Insight[];
}

export interface UpcomingConflictsOutput {
  conflicts: Insight[];
}

export interface TravelIssuesOutput {
  issues: Insight[];
}

export interface UnfinishedTasksOutput {
  tasks: string[];
}
