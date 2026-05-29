import { getDashboardContext } from "./tools/getDashboardContext.ts";
import { getConnectedSources } from "./tools/getConnectedSources.ts";
import { getDailyBriefing } from "./tools/getDailyBriefing.ts";
import { getProductivitySummary } from "./tools/getProductivitySummary.ts";
import { getUpcomingConflicts } from "./tools/getUpcomingConflicts.ts";
import { getHighRiskCommitments } from "./tools/getHighRiskCommitments.ts";
import { getTravelIssues } from "./tools/getTravelIssues.ts";
import { getUnfinishedTasks } from "./tools/getUnfinishedTasks.ts";

// Exporting as a typed object literal to preserve exact generic typings for each tool
// This avoids Map<string, MCPTool<unknown, unknown>> entirely
export const mcpRegistry = {
  get_dashboard_context: getDashboardContext,
  get_connected_sources: getConnectedSources,
  get_daily_briefing: getDailyBriefing,
  get_productivity_summary: getProductivitySummary,
  get_upcoming_conflicts: getUpcomingConflicts,
  get_high_risk_commitments: getHighRiskCommitments,
  get_travel_issues: getTravelIssues,
  get_unfinished_tasks: getUnfinishedTasks,
};

export type MCPRegistryType = typeof mcpRegistry;
