import { runCoralCommand } from "../utils/runCoralCommand.js";
import { coralCache } from "../utils/cache.js";
import type { Email, CalendarEvent } from "../ai/heuristicEngine.js";

// Realistic fallback demo data if Coral execution fails
const FALLBACK_EMAILS: Email[] = [
  {
    id: "demo-email-1",
    subject: "Final Interview Scheduled - Engineering Role",
    sender: "Acme Recruiting <recruiting@acme.inc>",
    snippet: "We are excited to invite you to the final interview stage next week...",
    date: new Date().toISOString(),
    labels: ["IMPORTANT"],
    priority: "High",
  },
  {
    id: "demo-email-2",
    subject: "ACTION REQUIRED: Invoice #8472 Due",
    sender: "Billing Dept <billing@services.io>",
    snippet: "Your monthly subscription invoice is due tomorrow. Please review...",
    date: new Date(Date.now() - 3600000).toISOString(),
    labels: ["FINANCE"],
    priority: "High",
  },
  {
    id: "demo-email-3",
    subject: "Flight Confirmation: SFO to JFK",
    sender: "AirTravel <no-reply@airtravel.com>",
    snippet: "Your flight is confirmed. Booking reference: XYZ123...",
    date: new Date(Date.now() - 7200000).toISOString(),
    labels: ["TRAVEL"],
    priority: "Medium",
  },
  {
    id: "demo-email-4",
    subject: "Weekly Sync Notes",
    sender: "Jane Doe <jane@company.org>",
    snippet: "Here are the notes from today's weekly sync. Let me know if...",
    date: new Date(Date.now() - 14400000).toISOString(),
    labels: [],
    priority: "Low",
  },
];

const FALLBACK_EVENTS: CalendarEvent[] = [
  {
    id: "demo-event-1",
    title: "Final Interview with Acme",
    start: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    end: new Date(Date.now() + 86400000 + 3600000).toISOString(),
    location: "Google Meet",
  },
  {
    id: "demo-event-2",
    title: "Project Alpha Deadline",
    start: new Date(Date.now() + 10800000).toISOString(), // +3 hours
    end: new Date(Date.now() + 14400000).toISOString(),
    location: "Remote",
  },
  {
    id: "demo-event-3",
    title: "Team Lunch",
    start: new Date(Date.now() + 3600000).toISOString(), // +1 hour
    end: new Date(Date.now() + 7200000).toISOString(),
    location: "Cafe",
  },
];

export async function getRecentEmails(): Promise<Email[]> {
  const cacheKey = "coral_recent_emails";
  const cached = coralCache.get<Email[]>(cacheKey);
  if (cached) return cached;

  try {
    const rawData = await runCoralCommand<any[]>(
      "SELECT * FROM gmail.emails ORDER BY timestamp DESC LIMIT 15"
    );

    // Normalize Coral output to match our strict Email interface
    const emails: Email[] = rawData.map((row) => ({
      id: row.id || `coral-email-${Math.random()}`,
      subject: row.subject || "No Subject",
      sender: row.sender || row.from || "Unknown",
      snippet: row.snippet || "",
      date: row.timestamp || row.date || new Date().toISOString(),
      labels: row.labels || [],
      priority: row.priority || "Normal",
    }));

    coralCache.set(cacheKey, emails);
    return emails;
  } catch (error) {
    console.log("Using fallback emails due to Coral execution failure.");
    return FALLBACK_EMAILS;
  }
}

export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  const cacheKey = "coral_upcoming_events";
  const cached = coralCache.get<CalendarEvent[]>(cacheKey);
  if (cached) return cached;

  try {
    // Assuming a future 'calendar.events' source
    const rawData = await runCoralCommand<any[]>(
      "SELECT * FROM calendar.events WHERE start >= CURRENT_TIMESTAMP ORDER BY start ASC LIMIT 15"
    );

    const events: CalendarEvent[] = rawData.map((row) => ({
      id: row.id || `coral-event-${Math.random()}`,
      title: row.title || row.summary || "Busy",
      start: row.start || row.startTime || new Date().toISOString(),
      end: row.end || row.endTime || new Date(Date.now() + 3600000).toISOString(),
      location: row.location || "",
      priority: row.priority || "Normal",
    }));

    coralCache.set(cacheKey, events);
    return events;
  } catch (error) {
    console.log("Using fallback events due to Coral execution failure.");
    return FALLBACK_EVENTS;
  }
}

export async function getDashboardContext() {
  const [emails, events] = await Promise.all([
    getRecentEmails(),
    getUpcomingEvents(),
  ]);

  return {
    emails,
    events,
  };
}
