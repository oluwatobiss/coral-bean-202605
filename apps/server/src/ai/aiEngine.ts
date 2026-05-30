import { buildTimeline } from "./heuristicEngine.ts";
import { mcpRegistry } from "../mcp/registry.ts";
import { getPriorityReminders } from "../services/coralService.ts";

export async function processDashboardData() {
  const [
    { emails, events },
    { briefing },
    { focusScore, upcomingMeetings, importantEmails, conflicts, recommendation },
    { risks },
    { conflicts: scheduleConflicts },
    { issues },
    reminders
  ] = await Promise.all([
    mcpRegistry.get_dashboard_context.execute(),
    mcpRegistry.get_daily_briefing.execute(),
    mcpRegistry.get_productivity_summary.execute(),
    mcpRegistry.get_high_risk_commitments.execute(),
    mcpRegistry.get_upcoming_conflicts.execute(),
    mcpRegistry.get_travel_issues.execute(),
    getPriorityReminders()
  ]);

  const allInsights = [...risks, ...scheduleConflicts, ...issues];
  const timeline = buildTimeline(emails, events, allInsights);

  return {
    summary: briefing,
    insights: allInsights.slice(0, 4), // Top 4
    timeline,
    reminders,
    metrics: [
      { title: 'Focus Score', value: `${focusScore}`, desc: 'Optimal', icon: 'center_focus_strong', lightColor: 'bg-emerald-100 text-emerald-600', darkColor: 'bg-emerald-500/20 text-emerald-400' },
      { title: 'Meeting Load', value: `${upcomingMeetings}`, desc: 'Events Today', icon: 'event_busy', lightColor: 'bg-amber-100 text-amber-600', darkColor: 'bg-amber-500/20 text-amber-400' },
      { title: 'Pending Action', value: `${importantEmails}`, desc: 'Important Emails', icon: 'mark_email_unread', lightColor: 'bg-blue-100 text-blue-600', darkColor: 'bg-blue-500/20 text-blue-400' },
      { title: 'Conflicts', value: `${conflicts}`, desc: 'Schedule overlaps', icon: 'warning', lightColor: 'bg-rose-100 text-rose-600', darkColor: 'bg-rose-500/20 text-rose-400' }
    ],
    memory: [recommendation]
  };
}

export async function processChat(query: string) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('sources') || lowerQuery.includes('connected')) {
    const { sources } = await mcpRegistry.get_connected_sources.execute();
    return `Here are your connected sources:\n${sources.map(s => `- ${s.name}: ${s.status}`).join('\n')}`;
  }
  
  if (lowerQuery.includes('briefing') || lowerQuery.includes('today')) {
    const { briefing, priorities, warnings } = await mcpRegistry.get_daily_briefing.execute();
    let reply = `${briefing}\n\n`;
    if (priorities.length) reply += `Priorities:\n${priorities.map(p => `- ${p}`).join('\n')}\n\n`;
    if (warnings.length) reply += `Warnings:\n${warnings.map(w => `- ${w}`).join('\n')}`;
    return reply;
  }
  
  if (lowerQuery.includes('task') || lowerQuery.includes('unfinished')) {
    const { tasks } = await mcpRegistry.get_unfinished_tasks.execute();
    if (!tasks.length) return "You have no unfinished tasks right now!";
    return `Unfinished tasks:\n${tasks.map(t => `- ${t}`).join('\n')}`;
  }

  return "I'm your MCP-powered assistant. Try asking for a 'briefing', 'connected sources', or 'unfinished tasks'.";
}

export async function getActiveNotifications() {
  const { risks } = await mcpRegistry.get_high_risk_commitments.execute();
  const { conflicts } = await mcpRegistry.get_upcoming_conflicts.execute();
  
  const allInsights = [...risks, ...conflicts];
  return allInsights.map(ins => ({
    id: ins.id,
    message: ins.text,
    type: ins.severity === 'High Risk' ? 'alert' : 'info',
    time: 'Just Now'
  }));
}
