import { getDashboardContext } from "./getDashboardContext.ts";
import { extractInsights } from "../../ai/heuristicEngine.ts";
import type { MCPTool, ProductivitySummaryOutput } from "../interfaces.ts";

export const getProductivitySummary: MCPTool<void, ProductivitySummaryOutput> = {
  name: "get_productivity_summary",
  description: "Aggregates key productivity metrics for dashboard KPI widgets.",
  execute: async () => {
    const { emails, events } = await getDashboardContext.execute();
    const insights = extractInsights(emails, events);

    const todayEvents = events.filter(e => e.start && new Date(e.start).toDateString() === new Date().toDateString()).length;
    let focusScore = 95 - (todayEvents * 5);
    if (focusScore < 40) focusScore = 40;

    let importantEmails = 0;
    emails.forEach(e => {
      if (e.subject.toLowerCase().includes('urgent') || e.snippet.toLowerCase().includes('deadline')) {
        importantEmails++;
      }
    });

    const conflicts = insights.filter(i => i.type === 'Conflict').length;

    let recommendation = "Your schedule is clear. Great time for deep work!";
    if (conflicts > 0) recommendation = "You have back-to-back meetings. Remember to take a break.";
    else if (importantEmails > 0) recommendation = "Tackle your urgent emails before starting new tasks.";

    return {
      focusScore,
      upcomingMeetings: todayEvents,
      importantEmails,
      conflicts,
      recommendation,
    };
  },
};
