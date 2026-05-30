import { runCoralCommand } from "../utils/runCoralCommand.ts";
import { getRecentEmails } from "./coralService.ts";

export interface TimelineItem {
  id: string;
  title: string;
  time: string; // e.g., "10:00 AM - 11:30 AM"
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  dateStr: string; // "2025-05-28"
  startTime: Date;
  endTime: Date;
  type: string;
  status: 'completed' | 'critical' | 'upcoming';
  location: string;
  conflict?: boolean;
  conflictMsg?: string;
  isFlight?: boolean;
  priority?: string; // "HIGH", "MEDIUM", "LOW"
  hasBriefing?: boolean;
  icon?: string;
  avatars?: string[];
  isGmail?: boolean;
  sender?: string;
  snippet?: string;
  labels?: string[];
}

export interface AIBriefing {
  summary: string;
  actions: string[];
  docs: string[];
}

export interface TimezoneItem {
  label: string;
  timeStr: string;
}

export interface EventsContext {
  weekEvents: Record<string, TimelineItem[]>;
  stats: any[];
  nextUp: TimelineItem[];
  aiBriefings: Record<string, AIBriefing>;
  timezones: TimezoneItem[] | null;
  gmailEvents: any[];
}

const parseCoralDate = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const formatTime = (d: Date): string => {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const getDayOfWeek = (d: Date): 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun' => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
  return days[d.getDay()] || 'Sun';
};

const getLocalDateString = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const determineTypeAndIcon = (title: string, location: string, row?: any) => {
  if (row?.isHoliday) return { type: 'Holiday', icon: 'celebration' };
  if (row?.isFamily) return { type: 'Family', icon: 'favorite' };
  if (row?.isClassroom) return { type: 'Class', icon: 'school' };

  const lowerTitle = title.toLowerCase();
  const lowerLoc = (location || '').toLowerCase();
  
  if (lowerTitle.includes('flight') || lowerLoc.includes('airport')) return { type: 'Travel', icon: 'flight' };
  if (lowerTitle.includes('sync') || lowerTitle.includes('meeting')) return { type: 'Sync', icon: 'groups' };
  if (lowerTitle.includes('design') || lowerTitle.includes('plan')) return { type: 'Strategy', icon: 'architecture' };
  if (lowerTitle.includes('class') || lowerTitle.includes('lecture')) return { type: 'Education', icon: 'school' };
  if (lowerTitle.includes('lunch') || lowerTitle.includes('dinner')) return { type: 'Social', icon: 'restaurant' };
  return { type: 'Event', icon: 'event' };
};

export async function getEventsContext(): Promise<EventsContext> {
  let calendars: any[] = [];
  try {
    calendars = await runCoralCommand<any[]>(
      `SELECT id, summary FROM google_calendar.calendars`
    ) || [];
  } catch (e) {
    console.error("Failed to fetch calendars:", e);
    calendars = [{ id: 'primary', summary: 'Primary' }];
  }

  let calendarRaw: any[] = [];
  let emailRaw: any[] = [];

  // Fetch events from all calendars in parallel
  await Promise.all(calendars.map(async (cal) => {
    try {
      const safeId = cal.id.replace(/#/g, '%23');
      const events = await runCoralCommand<any[]>(
        `SELECT summary, start_date_time, end_date_time, start_date, end_date, location, event_type, attendees_emails FROM google_calendar.events WHERE calendar_id = '${safeId}' LIMIT 50`
      ) || [];
      
      const isHolidayCal = cal.summary.toLowerCase().includes('holiday') || cal.id.includes('holiday');
      const isFamilyCal = cal.summary.toLowerCase().includes('family') || cal.id.includes('family');
      const isClassroomCal = cal.summary.toLowerCase().includes('classroom') || cal.id.includes('classroom');
      
      events.forEach((row) => {
        row.calendarName = cal.summary;
        row.isHoliday = isHolidayCal;
        row.isFamily = isFamilyCal;
        row.isClassroom = isClassroomCal;
        calendarRaw.push(row);
      });
    } catch (err) {
      console.error(`Failed to fetch events for calendar ${cal.id}:`, err);
    }
  }));

  try {
    emailRaw = await getRecentEmails() || [];
  } catch (e) {
    console.error("Failed to fetch emails:", e);
  }

  const now = new Date();
  // We want past 7 days and future 7 days roughly
  const minDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const maxDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  let timelineEvents: TimelineItem[] = [];

  calendarRaw.forEach((row, i) => {
    let start = parseCoralDate(row.start_date_time);
    let end = parseCoralDate(row.end_date_time);
    const isAllDay = !start && !!row.start_date;

    if (isAllDay) {
      start = new Date(`${row.start_date}T00:00:00`);
      end = row.end_date ? new Date(`${row.end_date}T23:59:59`) : new Date(`${row.start_date}T23:59:59`);
    }

    if (!start || !end) return;
    
    // Filter out very old/far future events
    if (start < minDate || start > maxDate) return;

    const { type, icon } = determineTypeAndIcon(row.summary || 'Untitled Event', row.location || '', row);
    let status: 'completed' | 'critical' | 'upcoming' = 'upcoming';
    if (end < now) {
      status = 'completed';
    } else if (start.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      status = 'critical'; // happening within 24 hours
    }

    const isFlight = type === 'Travel';

    let priority = "LOW";
    const lowerTitle = (row.summary || '').toLowerCase();
    if (lowerTitle.includes('urgent') || lowerTitle.includes('investor') || lowerTitle.includes('flight') || lowerTitle.includes('deadline')) {
      priority = "HIGH";
    } else if (lowerTitle.includes('sync') || lowerTitle.includes('review') || lowerTitle.includes('meeting')) {
      priority = "MEDIUM";
    }

    timelineEvents.push({
      id: `ev-${i}-${Math.random().toString(36).substr(2, 5)}`,
      title: row.summary || 'Untitled Event',
      time: isAllDay ? 'All Day' : `${formatTime(start)} - ${formatTime(end)}`,
      day: getDayOfWeek(start),
      dateStr: getLocalDateString(start),
      startTime: start,
      endTime: end,
      type,
      status,
      location: row.location || (row.isHoliday ? row.calendarName : 'Virtual'),
      isFlight,
      priority,
      icon,
      hasBriefing: false,
      avatars: []
    });
  });

  // Merge Gmail messages as TimelineItems directly inside the Weekly Interactive Planner
  emailRaw.forEach((row, i) => {
    const start = parseCoralDate(row.date) || parseCoralDate(row.timestamp) || now;
    // Gmail events don't block calendar time, so make duration short (e.g., 30 mins)
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    
    if (start < minDate || start > maxDate) return;

    const type = 'Email';
    const icon = 'mail';
    let status: 'completed' | 'critical' | 'upcoming' = 'completed';
    
    // If it arrived today, make it completed or critical/upcoming based on time
    if (start > now) {
      status = 'upcoming';
    }

    let priority = "LOW";
    if (row.priority === "High" || (row.labels && row.labels.includes("IMPORTANT"))) {
      priority = "HIGH";
    } else if (row.priority === "Medium") {
      priority = "MEDIUM";
    }

    timelineEvents.push({
      id: row.id || `gmail-ev-${i}`,
      title: `Email: ${row.subject || 'No Subject'}`,
      time: `${formatTime(start)}`, // Clean timestamp
      day: getDayOfWeek(start),
      dateStr: getLocalDateString(start),
      startTime: start,
      endTime: end,
      type,
      status,
      location: row.sender || row.from || 'Unknown Sender',
      isFlight: false,
      priority,
      icon,
      hasBriefing: false,
      avatars: [],
      isGmail: true,
      sender: row.sender || row.from || 'Unknown Sender',
      snippet: row.snippet || '',
      labels: row.labels || []
    });
  });

  // Sort chronologically
  timelineEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  // Detect conflicts
  for (let i = 0; i < timelineEvents.length; i++) {
    for (let j = i + 1; j < timelineEvents.length; j++) {
      const ev1 = timelineEvents[i];
      const ev2 = timelineEvents[j];
      if (!ev1 || !ev2) continue;
      
      // Stop checking if ev2 starts after ev1 ends (since they are sorted)
      if (ev2.startTime >= ev1.endTime) break;

      // Skip conflict checking if either is an Email/Gmail entry, or an all-day event, or a holiday/family/class event!
      if (ev1.type === 'Email' || ev2.type === 'Email') continue;
      if (ev1.time === 'All Day' || ev2.time === 'All Day') continue;
      if (ev1.type === 'Holiday' || ev2.type === 'Holiday') continue;
      if (ev1.type === 'Family' || ev2.type === 'Family') continue;

      if (ev1.status !== 'completed' && ev2.status !== 'completed') {
        ev1.conflict = true;
        ev1.conflictMsg = `Overlaps with ${ev2.title}`;
        ev1.priority = "HIGH";
        ev2.conflict = true;
        ev2.conflictMsg = `Overlaps with ${ev1.title}`;
        ev2.priority = "HIGH";
      }
    }
  }

  // Calculate Widgets
  const todayStr = getLocalDateString(now);
  const todayEvents = timelineEvents.filter(e => e.dateStr === todayStr);
  const meetingLoad = todayEvents.length;

  let focusTimeHours = 8;
  if (todayEvents.length > 0) {
    let maxGapMs = 0;
    let dayStart = new Date(now);
    dayStart.setHours(9, 0, 0, 0); // 9 AM
    let dayEnd = new Date(now);
    dayEnd.setHours(17, 0, 0, 0); // 5 PM

    let current = dayStart;
    for (const ev of todayEvents) {
      if (ev.startTime > current) {
        const gap = ev.startTime.getTime() - current.getTime();
        if (gap > maxGapMs) maxGapMs = gap;
      }
      if (ev.endTime > current) current = ev.endTime;
    }
    if (dayEnd > current) {
      const gap = dayEnd.getTime() - current.getTime();
      if (gap > maxGapMs) maxGapMs = gap;
    }
    focusTimeHours = Math.round((maxGapMs / (1000 * 60 * 60)) * 10) / 10;
  }

  // Group by day for the weekEvents
  const weekEvents: Record<string, TimelineItem[]> = {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  };

  timelineEvents.forEach(ev => {
    const list = weekEvents[ev.day];
    if (list) {
      list.push(ev);
    }
  });

  // Next up events
  const upcomingEvents = timelineEvents.filter(e => e.startTime >= now && e.dateStr === todayStr);
  const nextUp = upcomingEvents.slice(0, 3);

  // Timezones
  let timezones: TimezoneItem[] | null = null;
  const travelEvents = timelineEvents.filter(e => e.isFlight || e.location.toLowerCase().includes('nairobi') || e.location.toLowerCase().includes('new york'));
  if (travelEvents.length > 0) {
    timezones = [
      { label: 'Local (Current)', timeStr: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) }
    ];
    if (travelEvents.some(e => e.location.toLowerCase().includes('nairobi') || e.title.toLowerCase().includes('nairobi'))) {
      timezones.push({ label: 'Nairobi (Destination)', timeStr: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi', timeZoneName: 'short' }) });
    }
    if (travelEvents.some(e => e.title.toLowerCase().includes('investor') || e.location.toLowerCase().includes('new york'))) {
      timezones.push({ label: 'New York (Investor HQ)', timeStr: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York', timeZoneName: 'short' }) });
    }
  }

  // AI Briefings
  const aiBriefings: Record<string, AIBriefing> = {};
  
  // Create advanced briefings using email context
  nextUp.forEach(ev => {
    const matchingEmails = emailRaw.filter(em => {
      const lowerSubject = (em.subject || '').toLowerCase();
      const lowerSnippet = (em.snippet || '').toLowerCase();
      const lowerTitle = ev.title.toLowerCase();
      
      // Match by title words
      const titleWords = lowerTitle.split(' ').filter(w => w.length > 3);
      for (const w of titleWords) {
        if (lowerSubject.includes(w) || lowerSnippet.includes(w)) return true;
      }
      return false;
    });

    if (matchingEmails.length > 0 || ev.priority === 'HIGH') {
      ev.hasBriefing = true;
      const actions = matchingEmails.slice(0, 2).map(em => `Review email: "${em.subject}"`);
      if (ev.conflict) actions.push("Resolve scheduling conflict immediately.");
      if (ev.isFlight) actions.push("Ensure check-in and travel documents are ready.");
      
      aiBriefings[ev.title] = {
        summary: matchingEmails.length > 0 
          ? `Found ${matchingEmails.length} relevant recent emails. ${matchingEmails[0]?.snippet || ""}`
          : `Upcoming ${(ev.priority || 'low').toLowerCase()} priority event requires preparation.`,
        actions: actions.length > 0 ? actions : ["Review calendar attachments"],
        docs: matchingEmails.length > 0 ? ['Contextual Thread.pdf'] : []
      };
    }
  });

  const stats = [
    { title: 'Meeting Load', value: meetingLoad.toString(), percent: 'Today', positive: meetingLoad < 5, icon: 'event_busy', lightColor: 'bg-amber-100 text-amber-600', darkColor: 'bg-amber-500/20 text-amber-400' },
    { title: 'Peak Energy', value: `${focusTimeHours}h`, percent: 'Max Gap', positive: focusTimeHours >= 2, icon: 'bolt', lightColor: 'bg-emerald-100 text-emerald-600', darkColor: 'bg-emerald-500/20 text-emerald-400' },
    { title: 'Conflicts', value: timelineEvents.filter(e => e.conflict).length.toString(), percent: 'Action Needed', positive: timelineEvents.filter(e => e.conflict).length === 0, icon: 'warning', lightColor: 'bg-rose-100 text-rose-600', darkColor: 'bg-rose-500/20 text-rose-400' }
  ];

  return {
    weekEvents,
    stats,
    nextUp,
    aiBriefings,
    timezones,
    gmailEvents: emailRaw
  };
}
