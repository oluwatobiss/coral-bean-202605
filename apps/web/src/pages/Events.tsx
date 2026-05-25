import { useState } from 'react'
import { eventsStatsList, eventsNextUpList } from '../data/mockData'

interface EventsProps {
  isDark: boolean
}

interface WeekEventItem {
  id: string
  title: string
  time: string
  type: string
  status: string
  location: string
  conflict?: boolean
  conflictMsg?: string
  isFlight?: boolean
}

export default function Events({ isDark }: EventsProps) {
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Wed')
  const [expandedBriefing, setExpandedBriefing] = useState<string | null>(null)
  
  // Custom week schedule items for the interactive grid
  const weekEvents: Record<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun', WeekEventItem[]> = {
    Mon: [
      { id: 'mon-1', title: 'Product Roadmap Planning', time: '09:30 AM - 11:00 AM', type: 'Strategy', status: 'completed', location: 'Meeting Room A' },
      { id: 'mon-2', title: 'Weekly Sync', time: '02:00 PM - 02:30 PM', type: 'Sync', status: 'completed', location: 'Google Meet' }
    ],
    Tue: [
      { id: 'tue-1', title: 'Client Q3 Demo Preparation', time: '11:00 AM - 12:00 PM', type: 'Design', status: 'completed', location: 'Virtual' },
      { id: 'tue-2', title: 'Engineering Backlog Grooming', time: '03:00 PM - 04:00 PM', type: 'Tech', status: 'completed', location: 'Slack Huddle' }
    ],
    Wed: [
      { id: 'wed-1', title: 'Team Meeting & Sync', time: '10:00 AM - 11:30 AM', type: 'Collaboration', status: 'critical', location: 'HQ Conference Room', conflict: true, conflictMsg: 'Overlaps with Travel Window to Heathrow Airport' },
      { id: 'wed-2', title: 'Flight to Nairobi (NBO)', time: '02:30 PM Departure', type: 'Travel', status: 'critical', location: 'LHR Terminal 5', isFlight: true, conflict: true, conflictMsg: 'Flight transit overlaps with Team Meeting travel time' },
      { id: 'wed-3', title: 'Hotel Check-in & Settle', time: '10:30 PM', type: 'Travel', status: 'upcoming', location: 'Nairobi Serena Hotel' }
    ],
    Thu: [
      { id: 'thu-1', title: 'Regional Partner Keynote', time: '09:00 AM - 10:30 AM', type: 'Event', status: 'upcoming', location: 'Nairobi Hub' },
      { id: 'thu-2', title: 'Field Office Tour & Feedback', time: '01:00 PM - 03:00 PM', type: 'Site Visit', status: 'upcoming', location: 'Field Office' }
    ],
    Fri: [
      { id: 'fri-1', title: 'Sub-Saharan Growth Panel', time: '11:00 AM - 01:00 PM', type: 'Presentation', status: 'upcoming', location: 'Auditorium' },
      { id: 'fri-2', title: 'Debrief & Happy Hour', time: '05:00 PM - 07:00 PM', type: 'Social', status: 'upcoming', location: 'Tribeka Lounge' }
    ],
    Sat: [
      { id: 'sat-1', title: 'Weekend Focus / Sightseeing', time: 'All Day', type: 'Personal', status: 'upcoming', location: 'Nairobi National Park' }
    ],
    Sun: [
      { id: 'sun-1', title: 'Return Flight to London (LHR)', time: '08:00 AM Departure', type: 'Travel', status: 'upcoming', location: 'NBO Airport' }
    ]
  }

  // Pre-configured AI briefing content for items
  const aiBriefings: Record<string, { summary: string; actions: string[]; docs: string[] }> = {
    'Weekly Product Sync': {
      summary: 'Product design updates and Q3 milestones validation. Sally will present the revamped user engagement funnel and highlight the recent 12% drop in conversion rate during the trial period.',
      actions: [
        'Review the Figma file (Zenith V2) beforehand',
        'Verify Q3 billing integration deadline with Engineering team',
        'Address retention drops in onboarding stage'
      ],
      docs: ['Zenith Product Spec V2.pdf', 'Q3 Analytics Report.xlsx']
    },
    'Investor Outreach Session': {
      summary: 'Strategy presentation to local venture partners at Soho House. Objective is to secure pre-commitments for Series A extension. Partner bio details emphasize focus on Fintech and Sub-Saharan logistics.',
      actions: [
        'Bring printed Pitch Deck and Executive Summary sheets',
        'Prepare talking points on regional market expansion analytics',
        'Highlight Coral-Beans integration capability'
      ],
      docs: ['NeverLate Pitch Deck May.pdf', 'Growth Projections Model.xlsx']
    }
  }

  const activeDayEvents = weekEvents[selectedDay] || []

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
        <div className={`border shadow-sm flex items-center gap-2 px-4 py-2 rounded-2xl ${
          isDark ? 'bg-[#18181b] border-zinc-850' : 'bg-white border-slate-100'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className={`text-xs font-bold ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>
            Connected to Google Calendar & Gmail
          </span>
        </div>
      </header>

      {/* KPI Stats Section */}
      <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        {eventsStatsList.map((stat, idx) => (
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
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">May 2025</span>
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day) => {
              const isActive = selectedDay === day
              const dayEvs = weekEvents[day] || []
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
                    {day === 'Mon' && '26'}
                    {day === 'Tue' && '27'}
                    {day === 'Wed' && '28'}
                    {day === 'Thu' && '29'}
                    {day === 'Fri' && '30'}
                    {day === 'Sat' && '31'}
                    {day === 'Sun' && '01'}
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
                {selectedDay === 'Wed' ? 'Wednesday, May 28 (Conflicts Found)' : `${selectedDay}'s Daily Timeline`}
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
                {activeDayEvents.map((event) => (
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
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Airport Buffer & Commute Intelligence Map mockup */}
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
                  Departure trigger recommended at 12:45 PM to guarantee terminal check-in.
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
            {eventsNextUpList.map((item, idx) => {
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
                        {item.avatars.map((av, avIdx) => (
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
        <section className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <h4 className={`text-sm font-bold flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <span className={`material-symbols-outlined text-[18px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>schedule</span>
            Timezone Navigator
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">London (Local)</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>08:28 AM BST</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Nairobi (Flight destination)</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-850'}`}>10:28 AM EAT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">New York (Investor HQ)</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-850'}`}>03:28 AM EDT</span>
            </div>
          </div>
        </section>

      </div>

    </div>
  )
}
export { Events }
