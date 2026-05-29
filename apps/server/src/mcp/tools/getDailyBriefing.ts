import { getDashboardContext } from "./getDashboardContext.ts";
import { extractInsights } from "../../ai/heuristicEngine.ts";
import type { MCPTool, DailyBriefingOutput } from "../interfaces.ts";

export const getDailyBriefing: MCPTool<void, DailyBriefingOutput> = {
  name: "get_daily_briefing",
  description: "Generates the hero daily briefing intelligence.",
  execute: async () => {
    const { emails, events } = await getDashboardContext.execute();
    const insights = extractInsights(emails, events);

    const todayEvents = events.filter(e => e.start && new Date(e.start).toDateString() === new Date().toDateString()).length;
    const interviewEmails = insights.filter(i => i.type === 'Interview').length;
    
    let briefing = `You have ${interviewEmails} interview-related emails and ${todayEvents} meetings today.`;
    if (insights.some(i => i.type === 'Conflict')) {
      briefing += ` Please watch out for scheduling conflicts!`;
    }

    const priorities = insights
      .filter(i => i.severity === 'High Risk' || i.severity === 'Important')
      .map(i => i.text);

    const warnings = insights
      .filter(i => i.severity === 'Heads Up' || i.type === 'Conflict')
      .map(i => i.text);

    return {
      briefing,
      priorities,
      warnings,
    };
  },
};
