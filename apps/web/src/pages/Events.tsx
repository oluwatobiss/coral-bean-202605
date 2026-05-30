import { useState } from 'react'
import { eventsStatsList, eventsNextUpList } from '../data/mockData'
import { useFetchWithFallback } from '../hooks/useFetchWithFallback'

interface EventsProps {
  isDark: boolean
}

import PlatformIcon from '../components/PlatformIcon'

export interface TimelineItem {
  id: string;
  title: string;
  time: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  dateStr: string;
  startTime: Date;
  endTime: Date;
  type: string;
  status: 'completed' | 'critical' | 'upcoming';
  location: string;
  conflict?: boolean;
  conflictMsg?: string;
  isFlight?: boolean;
  priority?: string;
  hasBriefing?: boolean;
  icon?: string;
  avatars?: string[];
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

export interface GmailEvent {
  id: string;
  subject: string;
  sender: string;
  snippet: string;
  date: string;
  labels: string[];
  priority: string;
}

export interface EventPayload {
  weekEvents: Record<string, TimelineItem[]>;
  stats: any[];
  nextUp: TimelineItem[];
  aiBriefings: Record<string, AIBriefing>;
  timezones: TimezoneItem[] | null;
  gmailEvents?: GmailEvent[];
}

export const fallbackGmailEvents: GmailEvent[] = [
  {
    id: "gmail-ev-1",
    subject: "Final Interview Scheduled - Engineering Role",
    sender: "Acme Recruiting <recruiting@acme.inc>",
    snippet: "We are excited to invite you to the final interview stage next week on Tuesday at 10:00 AM SFO time. Please prepare your system and design architecture deck.",
    date: new Date().toISOString(),
    labels: ["IMPORTANT", "WORK"],
    priority: "High",
  },
  {
    id: "gmail-ev-2",
    subject: "Flight Confirmation: SFO to JFK (Delta DL482)",
    sender: "Delta Air Lines <no-reply@delta.com>",
    snippet: "Your flight is confirmed. Departure from SFO at 6:30 PM. Passenger: Alex Kittu. Booking reference: DLX827. Please check in 2 hours prior to departure.",
    date: new Date(Date.now() - 3600000).toISOString(),
    labels: ["TRAVEL"],
    priority: "High",
  },
  {
    id: "gmail-ev-3",
    subject: "ACTION REQUIRED: Invoice #8472 Due Tomorrow",
    sender: "Billing Dept <billing@services.io>",
    snippet: "Your monthly premium service subscription invoice #8472 is due tomorrow. Please review the details and process payment to avoid service interruption.",
    date: new Date(Date.now() - 7200000).toISOString(),
    labels: ["FINANCE"],
    priority: "Medium",
  },
  {
    id: "gmail-ev-4",
    subject: "Weekly Sync Notes and Action Items",
    sender: "Jane Doe <jane@company.org>",
    snippet: "Here are the notes from today's weekly sync. Let's make sure to prepare the Zenith deliverable deck by Thursday and sync up with the product engineering team.",
    date: new Date(Date.now() - 14400000).toISOString(),
    labels: ["TEAM"],
    priority: "Low",
  }
];

export default function Events({ isDark }: EventsProps) {
  // Use today as default if available
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'short' }) as any;
  const defaultDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].includes(todayDay) ? todayDay : 'Wed';

  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>(defaultDay)
  const [expandedBriefing, setExpandedBriefing] = useState<string | null>(null)
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null)
  const [smartDraft, setSmartDraft] = useState<Record<string, string>>({})
  const [showDraftModal, setShowDraftModal] = useState<string | null>(null)
  
  const { data, loading } = useFetchWithFallback<EventPayload>('http://localhost:3000/api/events', {
    stats: eventsStatsList,
    nextUp: eventsNextUpList as TimelineItem[],
    weekEvents: {},
    aiBriefings: {},
    timezones: null,
    gmailEvents: fallbackGmailEvents
  });

  const displayStats = data?.stats || eventsStatsList;
  const displayNextUp = data?.nextUp || eventsNextUpList;
  const aiBriefings: Record<string, AIBriefing> = data?.aiBriefings || {};
  const weekEvents: Record<string, TimelineItem[]> = data?.weekEvents || {};
  const timezones: TimezoneItem[] | null = data?.timezones || null;
  const displayGmailEvents = data?.gmailEvents || fallbackGmailEvents;

  const handleGenerateDraft = (email: GmailEvent) => {
    if (smartDraft[email.id]) {
      return;
    }
    setShowDraftModal(`gen-${email.id}`);
    setTimeout(() => {
      let draftText = "";
      if (email.subject.toLowerCase().includes("interview")) {
        draftText = `Dear Acme Recruiting Team,\n\nThank you for inviting me to the final interview stage. I am excited about this opportunity! Tuesday at 10:00 AM SFO time works perfectly for me. I have blocked my calendar and will prepare the design architecture deck as requested.\n\nLooking forward to speaking with you.\n\nBest regards,\nAlex Kittu`;
      } else if (email.subject.toLowerCase().includes("flight")) {
        draftText = `Hi there,\n\nConfirming receipt of the SFO to JFK flight booking information (Booking Ref: DLX827). I have successfully added the travel transit buffer blocks to my calendar. Thanks!\n\nBest,\nAlex Kittu`;
      } else if (email.subject.toLowerCase().includes("invoice")) {
        draftText = `Billing Support,\n\nI have received invoice #8472 and processed the payment successfully. Please let me know if there are any issues with the transaction.\n\nBest regards,\nAlex Kittu`;
      } else {
        draftText = `Hi ${email.sender.split('<')[0].trim()},\n\nThanks for reaching out! I've reviewed your email regarding "${email.subject}". I will follow up with the requested updates shortly.\n\nBest,\nAlex Kittu`;
      }
      
      setSmartDraft(prev => ({
        ...prev,
        [email.id]: draftText
      }));
      setShowDraftModal(null);
    }, 800);
  };

  const getWeekDayDateStr = (day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'): string => {
    const today = new Date();
    const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
    const currentDayIndex = daysOrder.indexOf(today.toLocaleDateString('en-US', { weekday: 'short' }) as any);
    const targetDayIndex = daysOrder.indexOf(day);
    let diff = targetDayIndex - currentDayIndex;
    const targetDate = new Date(today.getTime() + diff * 24 * 60 * 60 * 1000);
    
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  
  const activeDayEvents = (weekEvents[selectedDay] || []).filter(
    (ev) => ev.dateStr === getWeekDayDateStr(selectedDay)
  );

  if (loading) {
    return (
      <div className="pt-20 px-6 pb-12 max-w-[1440px] mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className={`${isDark ? 'text-zinc-400' : 'text-slate-500'} font-medium animate-pulse`}>Syncing calendar events...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-6 pb-12 max-w-[1440px] mx-auto grid grid-cols-12 gap-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <header className="col-span-12 mb-4 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Agenda & Events</h2>
          <p className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} mt-1 text-sm font-medium`}>
            Predictive travel buffers and automatic meeting coordination is live.
          </p>
        </div>
        <div className={`border shadow-sm flex items-center gap-3 px-4 py-2 rounded-2xl ${
          isDark ? 'bg-[#18181b] border-zinc-850' : 'bg-white border-slate-100'
        }`}>
          <div className="flex -space-x-1">
            <PlatformIcon id="calendar" connected={true} isDark={isDark} size="compact" className={`ring-2 ${isDark ? 'ring-[#18181b]' : 'ring-white'}`} showPulse={false} />
            <PlatformIcon id="gmail" connected={true} isDark={isDark} size="compact" className={`ring-2 ${isDark ? 'ring-[#18181b]' : 'ring-white'}`} showPulse={false} />
          </div>
          <span className={`text-xs font-bold ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>
            Connected Services Active
          </span>
        </div>
      </header>

      {/* KPI Stats Section */}
      <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        {displayStats.map((stat: any, idx: number) => (
          <div key={idx} className={`p-5 rounded-2xl border shadow-sm flex items-center space-x-4 hover:-translate-y-0.5 transition-transform duration-200 ${
            isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
          }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? stat.darkColor : stat.lightColor}`}>
              <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</span>
                <span className={`text-xs font-bold ${stat.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.percent}
                </span>
              </div>
              <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{stat.title}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Interactive Calendar week bento and Daily timeline (Col-span 8) */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        
        {/* Weekly Day Selector / Tracker */}
        <section className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>calendar_view_week</span>
              Weekly Interactive Planner
            </h3>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day) => {
              const isActive = selectedDay === day
              const dayEvs = (weekEvents[day] || []).filter(
                (ev) => ev.dateStr === getWeekDayDateStr(day)
              );
              const hasConflict = dayEvs.some(e => e.conflict)

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`py-3.5 px-2 rounded-xl border flex flex-col items-center justify-between transition-all duration-200 relative ${
                    isActive
                      ? isDark
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300 shadow-md shadow-violet-600/10'
                        : 'bg-purple-100 border-purple-500 text-purple-700 shadow-md shadow-purple-600/5'
                      : isDark
                        ? 'bg-[#0a0a0c]/40 border-zinc-850 hover:bg-zinc-800/50 hover:border-zinc-700'
                        : 'bg-slate-50/50 border-slate-200/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-xs font-semibold ${isActive ? 'font-bold' : 'text-slate-400'}`}>{day}</span>
                  <span className={`text-base font-bold mt-1 ${isDark && !isActive ? 'text-zinc-400' : ''}`}>
                    {(() => {
                      const today = new Date();
                      const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
                      const currentDayIndex = daysOrder.indexOf(today.toLocaleDateString('en-US', { weekday: 'short' }) as any);
                      const targetDayIndex = daysOrder.indexOf(day);
                      let diff = targetDayIndex - currentDayIndex;
                      const targetDate = new Date(today.getTime() + diff * 24 * 60 * 60 * 1000);
                      return targetDate.getDate().toString().padStart(2, '0');
                    })()}
                  </span>
                  
                  {/* Event Indicators */}
                  <div className="flex gap-1 mt-2.5">
                    {dayEvs.map((ev, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          ev.conflict 
                            ? 'bg-rose-500 animate-pulse' 
                            : ev.status === 'completed'
                              ? 'bg-zinc-400/80'
                              : 'bg-emerald-400'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Conflict alert indicator */}
                  {hasConflict && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Daily Timeline Detail */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#0a0a0c]/80 border-zinc-850' : 'bg-slate-50/80 border-slate-200/40'
          }`}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-dashed border-slate-200/60 dark:border-zinc-800">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>
                {`${selectedDay}'s Daily Timeline`}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                {activeDayEvents.length} scheduled event{activeDayEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {activeDayEvents.length === 0 ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-slate-400 text-3xl">event_busy</span>
                <p className="text-xs text-slate-400 font-medium mt-1">No scheduled events for this day.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeDayEvents.map((event) => {
                  const isGmailEvent = (event as any).isGmail;

                  if (isGmailEvent) {
                    const isExpanded = expandedEmail === event.id;
                    const hasDraft = !!smartDraft[event.id];
                    const isGenerating = showDraftModal === `gen-${event.id}`;

                    return (
                      <div
                        key={event.id}
                        onClick={() => setExpandedEmail(isExpanded ? null : event.id)}
                        className={`p-4 rounded-xl border flex flex-col gap-3 transition-all duration-200 cursor-pointer ${
                          isDark
                            ? 'bg-zinc-900/95 border-zinc-800 hover:border-zinc-700'
                            : 'bg-white border-slate-100 hover:border-purple-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500 shrink-0`}>
                              <span className="material-symbols-outlined text-[18px]">
                                mail
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[9px] font-bold text-red-550 dark:text-red-400 uppercase tracking-wider`}>Gmail Communication</span>
                                <span className="text-[10px] text-slate-400 dark:text-zinc-600">•</span>
                                <span className={`text-[10px] font-bold ${isDark ? 'text-zinc-400' : 'text-slate-655'}`}>
                                  {(event as any).sender?.split('<')[0].trim()}
                                </span>
                              </div>
                              <h4 className={`text-xs mt-1 font-bold ${
                                isDark ? 'text-white' : 'text-slate-800'
                              }`}>
                                {event.title.startsWith("Email: ") ? event.title.replace("Email: ", "") : event.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-405 font-bold">{event.time}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {event.priority === 'HIGH' && (
                              <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                HIGH
                              </span>
                            )}
                            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-red-500/10 text-red-550 dark:text-red-400 border border-red-500/10">
                              Gmail
                            </span>
                          </div>
                        </div>

                        <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'} ${isExpanded ? '' : 'line-clamp-1'}`}>
                          {(event as any).snippet}
                        </p>

                        {/* Collapsible Actions and AI Smart Reply Draft */}
                        {isExpanded && (
                          <div className="mt-2 pt-3 border-t border-slate-100 dark:border-zinc-800/80 space-y-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-wrap gap-2 justify-between items-center">
                              <div className="flex flex-wrap gap-1">
                                {((event as any).labels || []).map((lbl: string, idx: number) => (
                                  <span key={idx} className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                                    isDark ? 'bg-zinc-850 text-zinc-400 border border-zinc-800' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {lbl}
                                  </span>
                                ))}
                              </div>

                              <button
                                onClick={() => handleGenerateDraft(event as any)}
                                disabled={isGenerating}
                                className={`py-1.5 px-3 rounded-lg text-[9px] font-bold tracking-wide uppercase flex items-center gap-1.5 transition-all ${
                                  isDark
                                    ? 'bg-violet-600 text-white hover:bg-violet-750 disabled:bg-zinc-850'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-slate-100'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                                {isGenerating ? 'Drafting...' : hasDraft ? 'Close Draft' : 'Draft Smart Reply'}
                              </button>
                            </div>

                            {/* Display Smart Draft Response if exists */}
                            {hasDraft && (
                              <div className={`p-4 rounded-xl border ${
                                isDark ? 'bg-[#0a0a0c]/80 border-zinc-800 text-zinc-350' : 'bg-slate-50 border-slate-150 text-slate-750'
                              } animate-in fade-in slide-in-from-top-2 duration-200`}>
                                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-dashed border-slate-200/60 dark:border-zinc-800">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-violet-400' : 'text-purple-600'} flex items-center gap-1`}>
                                    <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                                    AI Smart Draft Reply
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-semibold">Coral SQL Integrated</span>
                                </div>
                                <p className="text-xs leading-relaxed font-mono whitespace-pre-wrap">{smartDraft[event.id]}</p>
                                <div className="mt-3 flex gap-2 justify-end">
                                  <button
                                    onClick={() => {
                                      const newDrafts = { ...smartDraft };
                                      delete newDrafts[event.id];
                                      setSmartDraft(newDrafts);
                                    }}
                                    className={`px-2.5 py-1.2 rounded-lg text-[9px] font-bold uppercase border ${
                                      isDark ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'border-slate-200 text-slate-650 hover:bg-slate-100'
                                    }`}
                                  >
                                    Discard
                                  </button>
                                  <button
                                    onClick={() => {
                                      alert("Draft response saved to Gmail Drafts successfully via Coral SQL!");
                                    }}
                                    className={`px-2.5 py-1.2 rounded-lg text-[9px] font-bold uppercase ${
                                      isDark ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                                    }`}
                                  >
                                    Sync to Gmail
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Normal Calendar event rendering:
                  return (
                    <div
                      key={event.id}
                      className={`p-4 rounded-xl border flex flex-col gap-3 transition-all duration-200 ${
                        event.conflict
                          ? isDark
                            ? 'bg-rose-950/20 border-rose-900/60'
                            : 'bg-rose-50/50 border-rose-200/70'
                          : isDark
                            ? 'bg-zinc-900 border-zinc-800'
                            : 'bg-white border-slate-100 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            event.conflict
                              ? 'bg-rose-500/10 text-rose-500'
                              : event.status === 'completed'
                                ? isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-400'
                                : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            <span className="material-symbols-outlined text-[18px]">
                              {event.isFlight ? 'flight' : event.status === 'completed' ? 'check_circle' : 'schedule'}
                            </span>
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${
                              event.status === 'completed'
                                ? 'text-slate-400 line-through font-medium'
                                : isDark ? 'text-white' : 'text-slate-800'
                            }`}>
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-semibold">{event.time}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">•</span>
                              <span className="text-[10px] text-slate-400 font-medium">{event.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                            event.conflict
                              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              : 'bg-slate-500/10 text-slate-500 border border-slate-500/10'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                      </div>

                      {/* Conflict Highlight banner */}
                      {event.conflict && (
                        <div className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                          isDark ? 'bg-rose-950/40 border-rose-800/40 text-rose-300' : 'bg-rose-50 border-rose-100 text-rose-700'
                        }`}>
                          <span className="material-symbols-outlined text-[16px] text-rose-500 shrink-0 select-none">warning</span>
                          <div className="text-[10px] font-bold leading-normal">
                            <p>{event.conflictMsg}</p>
                            <button className={`mt-1.5 text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1 hover:underline ${
                              isDark ? 'text-violet-400' : 'text-purple-700'
                            }`}>
                              Resolve overlap options
                              <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Airport Buffer & Commute Intelligence Map mockup */}
        {activeDayEvents.some(e => e.isFlight) && (
        <section className={`p-6 rounded-2xl border shadow-sm relative overflow-hidden ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>commute</span>
              Commute Transit Buffer
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 rounded-full border border-emerald-500/20 animate-pulse">
              Live updates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-[#0a0a0c]/80 border-zinc-850' : 'bg-slate-50 border-slate-100'
            }`}>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destination</p>
                <p className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-850'}`}>Heathrow Airport (LHR)</p>
              </div>
              <span className={`material-symbols-outlined text-[24px] mt-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>local_airport</span>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-[#0a0a0c]/80 border-zinc-850' : 'bg-slate-50 border-slate-100'
            }`}>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transit Duration</p>
                <p className="text-xl font-bold mt-1 text-amber-500 flex items-center gap-1.5">
                  45 mins
                  <span className="material-symbols-outlined text-[16px] text-amber-500">trending_up</span>
                </p>
                <p className="text-[9px] text-slate-400 font-semibold mt-1">Slightly heavy traffic on A4</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-violet-650/10 border-violet-500/20' : 'bg-purple-50/50 border-purple-100'
            }`}>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>AI Smart Alert</p>
                <p className={`text-[11px] font-bold mt-1 leading-normal ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Departure trigger recommended at least 2 hours before flight departure.
                </p>
              </div>
              <button className={`mt-3 py-1.5 px-3 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all w-full text-center ${
                isDark 
                  ? 'bg-violet-600 text-white hover:bg-violet-700' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}>
                Add Buffer block
              </button>
            </div>
          </div>
        </section>
        )}

      </div>

      {/* Next Up Events and AI Briefing drawer (Col-span 4) */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        
        {/* Next Up Header */}
        <section className={`p-6 rounded-2xl border shadow-sm flex flex-col ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>quick_phrases</span>
              AI Agenda Briefings
            </h3>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Today's Focus</span>
          </div>

          <div className="space-y-4">
            {displayNextUp.map((item: any, idx: number) => {
              const isExpanded = expandedBriefing === item.title
              const briefing = aiBriefings[item.title]

              return (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border flex flex-col transition-all duration-200 ${
                    isDark 
                      ? 'bg-[#0a0a0c]/80 border-zinc-850' 
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {item.priority && (
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase mb-2 inline-block ${
                          isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {item.priority}
                        </span>
                      )}
                      <h4 className={`text-xs font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-850'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">{item.icon}</span>
                        {item.time} ({item.day})
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] mt-0.5">{item.location}</p>
                    </div>

                    {/* Participant Avatars */}
                    {item.avatars && item.avatars.length > 0 && (
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {item.avatars.map((av: string, avIdx: number) => (
                          <img
                            key={avIdx}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover"
                            src={av}
                            alt="Attendee profile"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Toggle briefing button */}
                  {item.hasBriefing && (
                    <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-zinc-800/80">
                      <button
                        onClick={() => setExpandedBriefing(isExpanded ? null : item.title)}
                        className={`w-full py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase flex items-center justify-center gap-1.5 border transition-all ${
                          isExpanded
                            ? isDark
                              ? 'bg-zinc-800 text-violet-400 border-zinc-700'
                              : 'bg-purple-50 text-purple-600 border-purple-200'
                            : isDark
                              ? 'bg-transparent text-zinc-300 border-zinc-850 hover:bg-zinc-850'
                              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                        {isExpanded ? 'Hide Briefing Summary' : 'Read Briefing Summary'}
                      </button>
                    </div>
                  )}

                  {/* Expanded Briefing Details */}
                  {isExpanded && briefing && (
                    <div className="mt-3 space-y-3 text-[11px] leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className={`${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{briefing.summary}</p>
                      
                      <div className={`p-2.5 rounded-lg ${isDark ? 'bg-zinc-900/60' : 'bg-white border border-slate-100'}`}>
                        <p className="font-bold text-[9px] uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">playlist_add_check</span>
                          Suggested Actions
                        </p>
                        <ul className="list-disc pl-3.5 space-y-1 text-slate-500">
                          {briefing.actions.map((act, aIdx) => (
                            <li key={aIdx}>{act}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {briefing.docs.map((doc, dIdx) => (
                          <div 
                            key={dIdx} 
                            className={`px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1 border ${
                              isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-750' : 'bg-white text-slate-600 border-slate-200/50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[11px]">description</span>
                            {doc}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Global time check / Travel summary widget */}
        {timezones && timezones.length > 0 && (
        <section className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <h4 className={`text-sm font-bold flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <span className={`material-symbols-outlined text-[18px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>schedule</span>
            Timezone Navigator
          </h4>
          <div className="space-y-3 text-xs">
            {timezones.map((tz, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">{tz.label}</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{tz.timeStr}</span>
              </div>
            ))}
          </div>
        </section>
        )}

      </div>

    </div>
  )
}
export { Events }
