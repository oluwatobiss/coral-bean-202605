import { getDashboardContext } from "./getDashboardContext.ts";
import { extractInsights } from "../../ai/heuristicEngine.ts";
import type { MCPTool, TravelIssuesOutput } from "../interfaces.ts";

export const getTravelIssues: MCPTool<void, TravelIssuesOutput> = {
  name: "get_travel_issues",
  description: "Detects travel-related alerts or schedule items.",
  execute: async () => {
    const { emails, events } = await getDashboardContext.execute();
    const insights = extractInsights(emails, events);

    return {
      issues: insights.filter(i => i.type === 'Travel'),
    };
  },
};
