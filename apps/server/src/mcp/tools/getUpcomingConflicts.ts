import { getDashboardContext } from "./getDashboardContext.ts";
import { extractInsights } from "../../ai/heuristicEngine.ts";
import type { MCPTool, UpcomingConflictsOutput } from "../interfaces.ts";

export const getUpcomingConflicts: MCPTool<void, UpcomingConflictsOutput> = {
  name: "get_upcoming_conflicts",
  description: "Detects scheduling conflicts in the calendar.",
  execute: async () => {
    const { emails, events } = await getDashboardContext.execute();
    const insights = extractInsights(emails, events);

    return {
      conflicts: insights.filter(i => i.type === 'Conflict'),
    };
  },
};
