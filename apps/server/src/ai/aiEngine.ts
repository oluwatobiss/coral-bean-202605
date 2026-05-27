import { 
  extractInsights, 
  buildTimeline, 
  generateMetrics, 
  generateMemory, 
  chatHeuristic,
  type Email,
  type CalendarEvent
} from "./heuristicEngine.js";

// Flag to switch to LLM engine in the future when API keys are available
const USE_LLM = false;

export async function processDashboardData(emails: Email[], events: CalendarEvent[]) {
  // If USE_LLM is true, we would call the LLM engine here instead.
  // For now, we use the local heuristic engine.

  const insights = extractInsights(emails, events);
  const timeline = buildTimeline(emails, events, insights);
  const metrics = generateMetrics(events, emails);
  const memory = generateMemory(events, emails);

  // Generate a top-level summary string
  const todayEvents = events.filter(e => e.start && new Date(e.start).toDateString() === new Date().toDateString()).length;
  const interviewEmails = insights.filter(i => i.type === 'Interview').length;
  const conflictCount = insights.filter(i => i.type === 'Conflict').length;
  
  let summary = `You have ${interviewEmails} interview-related emails, ${todayEvents} meetings today`;
  if (conflictCount > 0) {
    summary += `, and ${conflictCount} possible scheduling conflict.`;
  } else {
    summary += `, and a smooth schedule.`;
  }
  summary += ` Your intelligence feed is updated.`;

  return {
    summary,
    insights,
    timeline,
    metrics,
    memory
  };
}

export async function processChat(query: string, emails: Email[], events: CalendarEvent[]) {
  if (USE_LLM) {
    // return await chatLLM(query, events, emails);
  }
  
  return chatHeuristic(query, events, emails);
}

export function getActiveNotifications(emails: Email[], events: CalendarEvent[]) {
  const insights = extractInsights(emails, events);
  return insights.map(ins => ({
    id: ins.id,
    message: ins.text,
    type: ins.severity === 'High Risk' ? 'alert' : 'info',
    time: 'Just Now'
  }));
}
