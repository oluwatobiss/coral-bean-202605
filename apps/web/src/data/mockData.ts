export interface KPIItem {
  title: string;
  value: string;
  desc: string;
  icon: string;
  lightColor: string;
  darkColor: string;
}

export interface InsightItem {
  type: string;
  text: string;
  desc: string;
  action: string;
  lightColor: string;
  darkColor: string;
}

export interface SourceStream {
  id: string;
  name: string;
  desc: string;
  email?: string;
  lastSync: string;
  connected: boolean;
  icon: string;
  lightColor: string;
  darkColor: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  type: string;
  dotColorLight: string;
  dotColorDark: string;
  isFlight?: boolean;
}

export interface CounterItem {
  type: string;
  value: string;
  desc: string;
  icon: string;
  lightBorder: string;
  darkBorder: string;
}

export interface RiskItem {
  title: string;
  text: string;
  p: string;
  time: string;
  icon: string;
  lightColor: string;
  darkColor: string;
}

export interface SuggestionItem {
  title: string;
  desc: string;
  action: string;
  outline: boolean;
}

export interface MessageItem {
  sender: "ai" | "user";
  time: string;
  text: string;
  proactive?: boolean;
  buttons?: string[];
  draftCard?: { title: string; content: string };
}

// === Dashboard Data ===
export const dashboardKpis: KPIItem[] = [
  {
    title: "Upcoming Events",
    value: "3",
    desc: "Today",
    icon: "calendar_month",
    lightColor: "text-purple-600 bg-purple-50",
    darkColor: "text-violet-400 bg-violet-500/10",
  },
  {
    title: "High Priority",
    value: "2",
    desc: "Needs attention",
    icon: "warning",
    lightColor: "text-red-500 bg-red-50",
    darkColor: "text-red-400 bg-red-500/10",
  },
  {
    title: "Reminders",
    value: "2",
    desc: "Upcoming",
    icon: "notifications_active",
    lightColor: "text-amber-500 bg-amber-50",
    darkColor: "text-amber-400 bg-amber-500/10",
  },
  {
    title: "All Clear",
    value: "98%",
    desc: "No conflicts",
    icon: "check_circle",
    lightColor: "text-emerald-500 bg-emerald-50",
    darkColor: "text-emerald-400 bg-emerald-500/10",
  },
];

export const dashboardInsights: InsightItem[] = [
  {
    type: "High Risk",
    text: "Flight on May 28 overlaps with Team meeting at 10 AM",
    desc: "Potential conflict",
    action: "Resolve",
    lightColor: "text-red-600 bg-red-50",
    darkColor: "text-red-400 bg-red-500/10",
  },
  {
    type: "Important",
    text: "Passport expires in 60 days",
    desc: "Take action soon",
    action: "Set Reminder",
    lightColor: "text-amber-600 bg-amber-50",
    darkColor: "text-amber-400 bg-amber-500/10",
  },
  {
    type: "Heads Up",
    text: "Travel time to airport ~ 45 mins",
    desc: "Plan ahead for traffic",
    action: "View Details",
    lightColor: "text-blue-600 bg-blue-50",
    darkColor: "text-blue-400 bg-blue-500/10",
  },
];

export const dashboardSources: SourceStream[] = [
  {
    id: "gmail",
    name: "Gmail",
    desc: "Aggregating meeting requests, travel confirmations, and high-priority threads.",
    email: "war1kittu@gmail.com",
    lastSync: "2 mins ago",
    connected: true,
    icon: "mail",
    lightColor: "bg-red-50 text-red-600",
    darkColor: "bg-red-500/10 text-red-400",
  },
  {
    id: "calendar",
    name: "Google Calendar",
    desc: "Syncing primary and shared calendars for schedule optimization.",
    email: "war1kittu@gmail.com",
    lastSync: "5 mins ago",
    connected: true,
    icon: "calendar_today",
    lightColor: "bg-blue-50 text-blue-600",
    darkColor: "bg-blue-500/10 text-blue-400",
  },
  {
    id: "keep",
    name: "Google Keep",
    desc: "Syncing personal ideation and scratchpads for long-term goal alignment.",
    email: "war1kittu@gmail.com",
    lastSync: "12 mins ago",
    connected: true,
    icon: "sticky_note_2",
    lightColor: "bg-yellow-50 text-yellow-600",
    darkColor: "bg-yellow-500/10 text-yellow-400",
  },
];

export const dashboardAgenda: AgendaItem[] = [
  {
    time: "10:00 AM",
    title: "Team Standup",
    type: "Google Calendar",
    dotColorLight: "bg-purple-600",
    dotColorDark: "bg-violet-500",
  },
  {
    time: "12:30 PM",
    title: "Design Review",
    type: "Google Calendar",
    dotColorLight: "bg-purple-600",
    dotColorDark: "bg-violet-500",
  },
  {
    time: "02:30 PM",
    title: "Client Call",
    type: "Google Calendar",
    dotColorLight: "bg-emerald-400",
    dotColorDark: "bg-emerald-400",
  },
  {
    time: "06:30 PM",
    title: "Flight to Nairobi",
    type: "Gmail (Booking)",
    dotColorLight: "bg-orange-400",
    dotColorDark: "bg-orange-400",
    isFlight: true,
  },
];

// === Insights Data ===
export const insightsVelocity = [
  { day: "MON", val: "h-2/3", label: "66%" },
  { day: "TUE", val: "h-1/2", label: "50%" },
  { day: "WED", val: "h-3/4", label: "75%" },
  { day: "THU", val: "h-1/3", label: "33%" },
  { day: "FRI", val: "h-5/6", label: "83%" },
  { day: "SAT", val: "h-1/2", label: "50%" },
  { day: "SUN", val: "h-3/4", label: "75%", active: true },
];

export const insightsCounters: CounterItem[] = [
  {
    type: "CRITICAL",
    value: "03",
    desc: "Urgent conflicts requiring immediate action.",
    icon: "warning",
    lightBorder: "border-l-red-500 text-red-500 bg-white border-slate-100",
    darkBorder: "border-l-red-500 text-red-400 bg-[#18181b] border-zinc-800",
  },
  {
    type: "MEDIUM",
    value: "12",
    desc: "Potential bottlenecks in late-week flow.",
    icon: "bolt",
    lightBorder: "border-l-slate-400 text-slate-500 bg-white border-slate-100",
    darkBorder: "border-l-zinc-500 text-zinc-400 bg-[#18181b] border-zinc-800",
  },
  {
    type: "LOW",
    value: "08",
    desc: "Minor schedule optimizations available.",
    icon: "check_circle",
    lightBorder: "border-l-purple-500 text-purple-600 bg-white border-slate-100",
    darkBorder: "border-l-violet-500 text-violet-400 bg-[#18181b] border-zinc-800",
  },
];

export const insightsRisks: RiskItem[] = [
  {
    title: "Flight overlap",
    text: "LHR Departure (14:30) conflicts with Strategic Review meeting.",
    p: "P1 PRIORITY",
    time: "4m ago",
    icon: "flight_takeoff",
    lightColor: "bg-red-50 text-red-600",
    darkColor: "bg-red-500/10 text-red-400",
  },
  {
    title: "Unsent deliverable",
    text: "Project 'Zenith' Alpha deck hasn't been shared with stakeholders.",
    p: "P2 PRIORITY",
    time: "12m ago",
    icon: "pending_actions",
    lightColor: "bg-purple-50 text-purple-600",
    darkColor: "bg-violet-500/10 text-violet-400",
  },
  {
    title: "Low Buffer Zone",
    text: "Back-to-back meetings tomorrow (09:00 - 13:00) leave no room for transit.",
    p: "P3 PRIORITY",
    time: "1h ago",
    icon: "schedule",
    lightColor: "bg-slate-100 text-slate-600",
    darkColor: "bg-zinc-800 text-zinc-400",
  },
];

export const insightsSuggestions: SuggestionItem[] = [
  {
    title: "Reschedule Review Meeting",
    desc: "Move Strategic Review to Wednesday 10:00 AM to resolve flight conflict.",
    action: "Apply Optimization",
    outline: false,
  },
  {
    title: "Automate Status Report",
    desc: "Intelligence can draft the 'Zenith' report based on recent Slack updates.",
    action: "Apply",
    outline: true,
  },
];

// === AI Chat Data ===
export const initialChatMessages: MessageItem[] = [
  {
    sender: "ai",
    time: "09:42 AM",
    text: "Good morning. I noticed a potential conflict on Tuesday, Oct 24th. Your 'Product Strategy Sync' overlaps with the 'Client Q3 Review'. Both are marked high priority. Should I reschedule the internal sync to 3:00 PM when you have an open slot?",
    proactive: true,
    buttons: ["Reschedule Sync", "Remind me later", "Ignore conflict"],
  },
  {
    sender: "user",
    time: "09:44 AM",
    text: "Can you also check if I have any pending emails regarding the Client Q3 Review? If so, draft a quick status update for them.",
  },
  {
    sender: "ai",
    time: "Just Now",
    text: "I've found 3 related emails from Sarah and Tom. I've drafted a concise status update focusing on the performance metrics they requested.",
    draftCard: {
      title: "Draft Email",
      content:
        "Hi Team, regarding the Q3 Review, we've finalized the core metrics for user growth and retention. We're currently ahead of target by 12%...",
    },
    buttons: ["Draft Email", "Review Draft"],
  },
];

export const chatChips = [
  "✨ Summarize today's meetings",
  "📅 Schedule 1:1 with Jane",
  "📧 Draft follow-up for client",
  "🔍 Check Q4 goals",
];

// === Connected Sources Data ===
export const initialSourcesList: SourceStream[] = [
  {
    id: "gmail",
    name: "Gmail",
    desc: "Aggregating meeting requests, travel confirmations, and high-priority threads.",
    email: "war1kittu@gmail.com",
    lastSync: "2 mins ago",
    connected: true,
    icon: "mail",
    lightColor: "bg-red-50 text-red-600",
    darkColor: "bg-red-500/10 text-red-400",
  },
  {
    id: "calendar",
    name: "Google Calendar",
    desc: "Syncing primary and shared calendars for schedule optimization.",
    email: "war1kittu@gmail.com",
    lastSync: "5 mins ago",
    connected: true,
    icon: "calendar_today",
    lightColor: "bg-blue-50 text-blue-600",
    darkColor: "bg-blue-500/10 text-blue-400",
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Extracting action items and deadline mentions from active workspace channels.",
    email: "workspace-war1kittu",
    lastSync: "Just now",
    connected: true,
    icon: "forum",
    lightColor: "bg-purple-50 text-purple-600",
    darkColor: "bg-purple-500/10 text-purple-400",
  },
  {
    id: "drive",
    name: "Google Drive",
    desc: "Scanning PDFs, Docs, and spreadsheets for project context and data points.",
    email: "war1kittu@gmail.com",
    lastSync: "1 hour ago",
    connected: true,
    icon: "drive_file_move",
    lightColor: "bg-yellow-50 text-yellow-600",
    darkColor: "bg-yellow-500/10 text-yellow-400",
  },
  {
    id: "keep",
    name: "Google Keep",
    desc: "Syncing personal ideation and scratchpads for long-term goal alignment.",
    email: "war1kittu@gmail.com",
    lastSync: "12 mins ago",
    connected: true,
    icon: "sticky_note_2",
    lightColor: "bg-indigo-50 text-indigo-600",
    darkColor: "bg-indigo-500/10 text-indigo-400",
  },
];

// === Settings Tone Labels ===
export const toneLabels = ["Casual", "Concise", "Balanced", "Professional", "Academic"];

// === Events Page Data ===
export interface EventsStatItem {
  title: string;
  value: string;
  percent: string;
  icon: string;
  lightColor: string;
  darkColor: string;
  positive: boolean;
}

export const eventsStatsList: EventsStatItem[] = [
  {
    title: "Focus Time",
    value: "14.5 hrs",
    percent: "+12%",
    icon: "timer",
    lightColor: "bg-purple-50 text-purple-600",
    darkColor: "bg-violet-500/10 text-violet-400",
    positive: true,
  },
  {
    title: "Meeting Time",
    value: "8.2 hrs",
    percent: "-5%",
    icon: "groups",
    lightColor: "bg-blue-50 text-blue-500",
    darkColor: "bg-blue-500/10 text-blue-400",
    positive: false,
  },
  {
    title: "Peak Energy",
    value: "9AM - 11AM",
    percent: "Optimal",
    icon: "bolt",
    lightColor: "bg-orange-50 text-orange-500",
    darkColor: "bg-orange-500/10 text-orange-455",
    positive: true,
  },
];

export interface EventsNextUpItem {
  time: string;
  day: string;
  title: string;
  location: string;
  icon: string;
  avatars: string[];
  hasBriefing: boolean;
  priority?: string;
}

export const eventsNextUpList: EventsNextUpItem[] = [
  {
    time: "14:00",
    day: "Today",
    title: "Weekly Product Sync",
    location: "Google Meet",
    icon: "video_camera_front",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNxL6VtMEIK5weYlv1UrqIJy2sKYGZ56zmu40LdmyaWsnfPy_d13I5KJjJrOjB2UHN38jzj5Of9qBWgT7xIisdxJFgZa-pRIUmaVuYfgSWQkDKP1htNHXXbwXUhbCRe3-qPweaIGykAsgHTx-orTpIBIENS4Uni5QZFdJJpObPnNyCX3uH_3SRJdUtJ04sbugCZKTbdwFbimmAijgo16uVyJlmWlrC8Z285rfNJvEdMhEKLn2dROT-RAZf0Z42aQasMl-YLIIxbuky",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGZSoNovOg-Jnu2tLjdSUdqvA_TZbsm4vrIb4Z0BD4F6H56XICba7IM5Mjlj-BDgMFPjyjb6nWleSkMcrl8qlN7l2vFNuDn8uVM8ZLzzpzY92WQyVeRBVJ-ooznTpaS2yF01sWLoiULlW45_srV8Sy_OPI7x4aicHfLBwz8lD80oRn5q74rn6m6c1lE1VRe6ibo6NGTyr5ekG0BW4NS5xEnPWtSoCEnrzLEwfIi9p3oUt4kzOubYSYbLXuXPPDpzDaQwOvPRRWzDii",
    ],
    hasBriefing: true,
  },
  {
    time: "16:30",
    day: "Today",
    title: "Investor Outreach Session",
    location: "Soho House, London",
    icon: "location_on",
    avatars: [],
    hasBriefing: true,
    priority: "High Priority",
  },
];

// === Reminders Page Data ===
export interface RemindersStatItem {
  title: string;
  value: string;
  icon: string;
  lightColor: string;
  darkColor: string;
}

export const remindersStatsList: RemindersStatItem[] = [
  {
    title: "Pending",
    value: "12",
    icon: "pending_actions",
    lightColor: "bg-orange-50 text-orange-600",
    darkColor: "bg-orange-500/10 text-orange-400",
  },
  {
    title: "Completed Today",
    value: "8",
    icon: "task_alt",
    lightColor: "bg-green-50 text-green-600",
    darkColor: "bg-green-500/10 text-green-400",
  },
  {
    title: "High Priority",
    value: "3",
    icon: "priority_high",
    lightColor: "bg-red-50 text-red-600",
    darkColor: "bg-red-500/10 text-red-400",
  },
];

export interface RemindersUrgentItem {
  title: string;
  overdue: string;
  tag: string;
}

export const remindersUrgentList: RemindersUrgentItem[] = [
  { title: "Finalize Q3 Budget Strategy", overdue: "Overdue 2h", tag: "Finance" },
];

export interface RemindersActiveItem {
  id: string;
  title: string;
  time: string;
  tag: string;
  actionType: "snooze" | "pay";
  actionLabel: string;
}

export const remindersActiveList: RemindersActiveItem[] = [
  {
    id: "rem-1",
    title: "Client Presentation Review",
    time: "2:00 PM",
    tag: "Work",
    actionType: "snooze",
    actionLabel: "Snooze until clear",
  },
  {
    id: "rem-2",
    title: "Renew Software Licenses",
    time: "4:30 PM",
    tag: "Operations",
    actionType: "pay",
    actionLabel: "Pay Now",
  },
];

export interface RemindersUpcomingItem {
  date: string;
  title: string;
}

export const remindersUpcomingList: RemindersUpcomingItem[] = [
  { date: "Oct 14", title: "Monthly Team Sync preparation" },
  { date: "Oct 15", title: "Review Health Insurance Options" },
  { date: "Oct 17", title: "Quarterly performance reports" },
];

export interface RemindersAiInsightItem {
  type: string;
  title: string;
  desc: string;
  action: string;
  icon: string;
  isSpecial?: boolean;
}

export const remindersAiInsightsList: RemindersAiInsightItem[] = [
  {
    type: "Smart Suggestion",
    title: "Buy flowers for anniversary",
    desc: `Based on your calendar event "10th Anniversary" on Sunday. I've found three local florists with 10% discounts for NeverLate users.`,
    action: "Order Now",
    icon: "redeem",
    isSpecial: true,
  },
  {
    type: "Workflow Optimization",
    title: "Consolidate Errands",
    desc: 'You have "Dry Cleaning" and "Post Office" pending. Traffic is light near both between 2-3 PM today.',
    action: "Batch these tasks",
    icon: "directions_car",
  },
  {
    type: "Health & Focus",
    title: "Schedule Deep Work",
    desc: "Your focus scores are highest on Tuesday mornings. Should I block 9-11 AM for your Project Delta?",
    action: "Block time",
    icon: "event",
  },
];

// === Actions Page Data ===
export interface ActionsStatItem {
  title: string;
  value: string;
  badge: string;
  icon: string;
  lightColor: string;
  darkColor: string;
  badgeClassLight: string;
  badgeClassDark: string;
}

export const actionsStatsList: ActionsStatItem[] = [
  {
    title: "High Impact Pending",
    value: "12",
    badge: "Urgent",
    icon: "error",
    lightColor: "bg-red-50 text-red-500",
    darkColor: "bg-red-500/10 text-red-400",
    badgeClassLight: "bg-red-50 text-red-500",
    badgeClassDark: "bg-red-500/10 text-red-400",
  },
  {
    title: "Time Saved This Week",
    value: "12.5 hrs",
    badge: "+2.4h",
    icon: "bolt",
    lightColor: "bg-purple-50 text-primary",
    darkColor: "bg-violet-500/10 text-violet-400",
    badgeClassLight: "bg-purple-50 text-primary",
    badgeClassDark: "bg-violet-550/10 text-violet-400",
  },
  {
    title: "Success Rate",
    value: "94%",
    badge: "Optimal",
    icon: "verified",
    lightColor: "bg-emerald-50 text-emerald-600",
    darkColor: "bg-emerald-500/10 text-emerald-400",
    badgeClassLight: "bg-emerald-50 text-emerald-600",
    badgeClassDark: "bg-emerald-500/10 text-emerald-400",
  },
];

export interface ActionsPendingItem {
  id: string;
  title: string;
  desc: string;
  tag: string;
  bgLight: string;
  icon: string;
  iconColorLight: string;
  iconColorDark: string;
  actionLabel: string;
  dismissLabel: string;
}

export const actionsPendingList: ActionsPendingItem[] = [
  {
    id: "act-1",
    title: "Reschedule Marketing Sync",
    desc: "Conflict detected with 'Executive Review'. Suggest moving to Thursday at 10:00 AM.",
    tag: "Calendar",
    bgLight: "bg-amber-50",
    icon: "calendar_month",
    iconColorLight: "text-amber-500",
    iconColorDark: "text-amber-400",
    actionLabel: "Approve Auto-Reschedule",
    dismissLabel: "Dismiss",
  },
  {
    id: "act-2",
    title: "Draft Investor Follow-up",
    desc: "Ready based on yesterday's 'Q3 Planning' meeting notes. Action required: Final review.",
    tag: "Email",
    bgLight: "bg-blue-50",
    icon: "mail",
    iconColorLight: "text-blue-500",
    iconColorDark: "text-blue-400",
    actionLabel: "Review Draft",
    dismissLabel: "Ignore",
  },
  {
    id: "act-3",
    title: "Optimize Focus Blocks",
    desc: "Consolidate 3 fragmented 30-min gaps into a single 1.5h deep work session.",
    tag: "Optimization",
    bgLight: "bg-purple-50",
    icon: "auto_fix_high",
    iconColorLight: "text-purple-50",
    iconColorDark: "text-violet-400",
    actionLabel: "Consolidate Now",
    dismissLabel: "View Schedule",
  },
];

export interface ActionsChartItem {
  day: string;
  suggestedPercent: string;
  executedPercent: string;
}

export const actionsWeeklyChart: ActionsChartItem[] = [
  { day: "Mon", suggestedPercent: "60%", executedPercent: "35%" },
  { day: "Tue", suggestedPercent: "85%", executedPercent: "70%" },
  { day: "Wed", suggestedPercent: "45%", executedPercent: "20%" },
  { day: "Thu", suggestedPercent: "75%", executedPercent: "55%" },
  { day: "Fri", suggestedPercent: "95%", executedPercent: "80%" },
];
