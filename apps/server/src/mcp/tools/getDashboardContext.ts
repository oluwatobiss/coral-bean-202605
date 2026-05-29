import { getRecentEmails, getUpcomingEvents } from "../../services/coralService.ts";
import type { MCPTool, DashboardContextOutput } from "../interfaces.ts";

export const getDashboardContext: MCPTool<void, DashboardContextOutput> = {
  name: "get_dashboard_context",
  description: "Fetches core dashboard context (emails and events) exclusively through Coral.",
  execute: async () => {
    // Only this tool queries coralService directly for dashboard contexts
    const [emails, events] = await Promise.all([
      getRecentEmails(),
      getUpcomingEvents(),
    ]);

    return { emails, events };
  },
};
