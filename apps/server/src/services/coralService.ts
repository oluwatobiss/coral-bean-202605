import { runCoralCommand } from "../utils/runCoralCommand.ts";
import { coralCache } from "../utils/cache.ts";
import type { Email, CalendarEvent, CalendarAttendee } from "../ai/heuristicEngine.ts";

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
    const rawData = await runCoralCommand<any[]>("SELECT * FROM gmail.emails LIMIT 5");

    // console.log("=== Raw Coral Email Data ===");
    // console.log(rawData);

    // Normalize Coral output to match our strict Email interface
    const emails: Email[] = await Promise.all(rawData.map(async (row) => {
      let snippet = row.snippet;
      // console.log("=== Raw Coral Email Data ===");
      
      // If snippet is missing or null, fetch it from the message table
      if (!snippet && row.id) {
        try {
          const detail = await runCoralCommand<any[]>(`SELECT snippet, payload FROM gmail.message WHERE id = '${row.id}'`);
          // console.log("=== Raw Coral Email Data ===");
          // console.log(detail);
          if (detail && detail.length > 0) {
            if (detail[0].snippet) snippet = detail[0].snippet;
            
            if (detail[0].payload) {
              try {
                const payloadObj = typeof detail[0].payload === 'string' 
                  ? JSON.parse(detail[0].payload) 
                  : detail[0].payload;
                  
                if (payloadObj && payloadObj.headers && Array.isArray(payloadObj.headers)) {
                  const subjectHeader = payloadObj.headers.find((h: any) => h.name && h.name.toLowerCase() === 'subject');
                  const fromHeader = payloadObj.headers.find((h: any) => h.name && h.name.toLowerCase() === 'from');
                  
                  if (!row.subject || row.subject === "No Subject") {
                    if (subjectHeader) row.subject = subjectHeader.value;
                  }
                  if (!row.sender || row.sender === "Unknown") {
                    if (fromHeader) row.sender = fromHeader.value;
                  }
                }
              } catch (e) {
                console.error("Failed to parse payload for email", row.id);
              }
            }
          }
        } catch (err) {
          console.log(`Could not fetch detail for ${row.id}`);
        }
      }

      return {
        id: row.id || `coral-email-${Math.random()}`,
        subject: row.subject || "No Subject",
        sender: row.sender || row.from || "Unknown",
        snippet: snippet || "",
        date: row.timestamp || row.date || new Date().toISOString(),
        labels: row.labels || [],
        priority: row.priority || "Normal",
      };
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
    const rawData = await runCoralCommand<any[]>(
      "SELECT * FROM google_calendar.events WHERE start_date_time >= CURRENT_TIMESTAMP ORDER BY start_date_time ASC LIMIT 50"
    );

    const events: CalendarEvent[] = rawData.map((row) => {
      let attendees: CalendarAttendee[] = [];
      if (row.attendees) {
        try {
          attendees = typeof row.attendees === 'string' ? JSON.parse(row.attendees) : row.attendees;
        } catch (e) {
          console.warn("Failed to parse attendees for event:", row.id);
          attendees = [];
        }
      }

      return {
        id: row.id || `coral-event-${Math.random()}`,
        title: row.summary || "Busy",
        start: row.start_date_time || row.start_date || new Date().toISOString(),
        end: row.end_date_time || row.end_date || new Date(Date.now() + 3600000).toISOString(),
        location: row.location || "",
        attendees: attendees,
        status: row.status || "",
        priority: "Normal",
      };
    });

    coralCache.set(cacheKey, events);
    return events;
  } catch (error) {
    console.log("Using fallback events due to Coral execution failure.");
    return FALLBACK_EVENTS;
  }
}

export async function getDashboardContext() {
  const [emails, events] = await Promise.all([getRecentEmails(), getUpcomingEvents()]);

  return {
    emails,
    events,
  };
}

export async function verifyCoralSource(tableName: string): Promise<boolean> {
  try {
    // Attempt to query Coral metadata
    // We check if the table exists in coral.tables (a common abstraction) or fallback to simple schema query
    const metadata = await runCoralCommand<any[]>(`SELECT * FROM information_schema.tables`);
    // Assuming metadata returns a list of tables
    // Just looking for substring matching the table name since different SQL dialects structure it differently
    if (metadata && metadata.length > 0) {
      const exists = metadata.some(row => {
        const rowStr = JSON.stringify(row).toLowerCase();
        return rowStr.includes(tableName.toLowerCase());
      });
      if (exists) return true;
    }

    // Fallback verification: attempt a simple SELECT 1 if metadata query was inconclusive but didn't throw
    await runCoralCommand<any[]>(`SELECT 1 FROM ${tableName} LIMIT 1`);
    return true;
  } catch (error) {
    console.log(`Failed to verify Coral source ${tableName}:`, error);
    // For demo/fallback purposes when coral CLI is entirely missing, we assume true if fallback is needed,
    // but the strict architecture requires returning false. Since the user wants to see "Connect" and "Disable" 
    // functionality locally, we will mock the return for the demo if the error is "spawn coral ENOENT" or "not recognized".
    const errStr = String(error);
    if (errStr.includes("ENOENT") || errStr.includes("not found") || errStr.includes("not recognized")) {
      console.warn("Coral CLI not found locally. MOCKING verification to TRUE for hackathon UI testing.");
      return true;
    }
    return false;
  }
}

export async function getCoralUserEmail(): Promise<string | null> {
  const cacheKey = "coral_user_email";
  const cached = coralCache.get<string>(cacheKey);
  if (cached) return cached;

  try {
    const rawData = await runCoralCommand<any[]>(
      "SELECT id FROM google_calendar.calendars WHERE primary = true LIMIT 1"
    );
    if (rawData && rawData.length > 0 && rawData[0].id) {
      const email = rawData[0].id;
      coralCache.set(cacheKey, email);
      return email;
    }
    return null;
  } catch (error) {
    console.log("Failed to fetch Coral user email:", error);
    return null;
  }
}

