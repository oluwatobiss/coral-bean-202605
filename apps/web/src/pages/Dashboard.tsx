import {
  dashboardKpis,
  dashboardInsights,
  dashboardAgenda,
} from "../data/mockData";
import { useSources } from "../context/SourcesContext";
import { useFetchWithFallback } from "../hooks/useFetchWithFallback";

interface DashboardProps {
  setActivePage: (page: string) => void;
  isDark: boolean;
}

export default function Dashboard({ setActivePage, isDark }: DashboardProps) {
  const { sources } = useSources();
  const connectedSources = sources.filter(s => s.connected);

  const gmailSource = sources.find(s => s.id === 'gmail');
  const userEmail = gmailSource?.email || 'alex@gmail.com';
  const userName = gmailSource?.userName || (userEmail !== 'alex@gmail.com' 
    ? userEmail.split('@')[0].split(/[._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') 
    : 'Alex');

  const defaultReminders = [
    {
      title: "Passport renewal",
      date: "July 24, 2025",
      priority: "High",
      color: isDark ? "text-red-400 bg-red-500/10" : "text-red-500 bg-red-50",
    },
    {
      title: "Project deadline",
      date: "May 30, 2025",
      priority: "Medium",
      color: isDark ? "text-amber-400 bg-amber-500/10" : "text-amber-500 bg-amber-50",
    },
    {
      title: "Submit expense report",
      date: "May 28, 2025",
      priority: "Low",
      color: isDark ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-500 bg-emerald-50",
    },
  ];

  const { data, loading } = useFetchWithFallback('http://localhost:3000/api/ai/dashboard', {
    metrics: dashboardKpis,
    insights: dashboardInsights,
    timeline: dashboardAgenda,
    reminders: defaultReminders
  });

  const displayKpis = data?.metrics || dashboardKpis;
  
  // The API returns insights that might need a slight map to match the UI precisely if they differ,
  // but we'll try to use them directly or fallback.
  const displayInsights = (data?.insights || dashboardInsights).map((item: any) => ({
    type: item.type || item.severity || 'Insight',
    text: item.text || item.message || '',
    desc: item.desc || item.context || 'Action required',
    action: item.action || 'View Details',
    lightColor: item.lightColor || 'text-blue-600 bg-blue-50',
    darkColor: item.darkColor || 'text-blue-400 bg-blue-500/10'
  }));

  const displayAgenda = data?.timeline || dashboardAgenda;
  const displayReminders = data?.reminders || defaultReminders;

  if (loading) {
    return (
      <div className="pt-20 px-6 pb-12 max-w-[1440px] mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className={`${isDark ? 'text-zinc-400' : 'text-slate-500'} font-medium animate-pulse`}>Syncing intelligence feed...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-6 pb-12 max-w-[1440px] mx-auto grid grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="col-span-12 mb-4">
        <h2 className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
          Good morning, {userName}! 👋
        </h2>
        <p className={`${isDark ? "text-zinc-500" : "text-slate-500"} mt-1 text-sm font-medium`}>
          Here's what's important today.
        </p>
      </div>

      {/* KPI Section */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {displayKpis.map((kpi: any, idx: number) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border shadow-sm flex items-center space-x-4 hover:-translate-y-0.5 transition-transform duration-200 ${
              isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? kpi.darkColor : kpi.lightColor}`}
            >
              <span className="material-symbols-outlined text-[24px]">{kpi.icon}</span>
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                  {kpi.value}
                </span>
                <span
                  className={`text-[11px] font-semibold uppercase ${isDark ? "text-zinc-500" : "text-slate-400"}`}
                >
                  {kpi.desc}
                </span>
              </div>
              <p
                className={`text-xs mt-0.5 font-medium ${isDark ? "text-zinc-400" : "text-slate-500"}`}
              >
                {kpi.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Bento Grid Left (Col-span 8) */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        {/* Interactive Central Chat */}
        <section
          onClick={() => setActivePage("chat")}
          className={`p-8 rounded-2xl border shadow-sm relative overflow-hidden group cursor-pointer transition-all duration-300 ${
            isDark
              ? "bg-zinc-900/50 border-zinc-800 hover:border-violet-500/30"
              : "bg-white border-slate-100 hover:border-purple-600/20"
          }`}
        >
          <div className="absolute top-0 right-0 p-8 pointer-events-none group-hover:scale-110 transition-transform">
            <span
              className={`material-symbols-outlined text-[140px] ${isDark ? "text-violet-500" : "text-purple-600"}`}
            >
              forum
            </span>
          </div>
          <div className="relative z-10 text-center max-w-xl mx-auto">
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>
              How can I help you today?
            </h3>
            <p
              className={`text-sm mb-6 font-medium ${isDark ? "text-zinc-400" : "text-slate-500"}`}
            >
              Ask anything in natural language. I'll search across your apps and help you act.
            </p>

            <div
              className={`relative flex items-center rounded-2xl px-4 py-3 shadow-inner transition-colors border ${
                isDark
                  ? "bg-[#0a0a0c]/80 border-zinc-800 group-hover:bg-[#0a0a0c]/50"
                  : "bg-slate-50 border-slate-200/60 group-hover:bg-slate-50/50"
              }`}
            >
              <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
              <input
                type="text"
                placeholder="What am I likely to miss this week?"
                disabled
                className={`w-full bg-transparent border-none text-sm placeholder-slate-400 outline-none pointer-events-none ${
                  isDark ? "text-zinc-300" : "text-slate-700"
                }`}
              />
              <div className="flex gap-2 text-slate-400">
                <span className="material-symbols-outlined hover:text-purple-600 transition-colors">
                  mic
                </span>
                <span
                  className={`material-symbols-outlined ${isDark ? "text-violet-400" : "text-purple-600"}`}
                >
                  send
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                "What's on my plate this week?",
                "Do I have any travel plans?",
                "What are my top priorities?",
              ].map((chip, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 border rounded-full text-xs font-semibold transition-all active:scale-[0.98] ${
                    isDark
                      ? "bg-[#18181b] border-zinc-800 text-zinc-400 hover:border-violet-500/30 hover:bg-violet-500/10"
                      : "bg-white border-slate-200/60 text-slate-600 hover:border-purple-600/30 hover:bg-purple-50"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Top Insights */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h4
              className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${isDark ? "text-violet-400" : "text-purple-600"}`}
              >
                auto_awesome
              </span>
              Top Insights For You
            </h4>
            <button
              onClick={() => setActivePage("insights")}
              className={`text-xs font-bold uppercase tracking-wider hover:underline ${isDark ? "text-violet-400" : "text-purple-600"}`}
            >
              View all insights →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayInsights.slice(0, 3).map((insight: any, idx: number) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border shadow-sm flex flex-col hover:-translate-y-0.5 transition-transform duration-200 ${
                  isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"
                }`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-md ${isDark ? insight.darkColor : insight.lightColor}`}
                  >
                    {insight.type}
                  </span>
                </div>
                <p
                  className={`text-xs font-bold leading-normal flex-1 mb-4 ${isDark ? "text-white" : "text-slate-800"}`}
                >
                  {insight.text}
                </p>
                <div
                  className={`flex items-center justify-between pt-3 border-t ${isDark ? "border-zinc-800/80" : "border-slate-50"}`}
                >
                  <span className="text-[10px] text-slate-400 font-semibold">{insight.desc}</span>
                  <button
                    onClick={() => setActivePage("insights")}
                    className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-colors ${
                      isDark
                        ? "text-violet-400 bg-violet-500/10 hover:bg-violet-500/20"
                        : "text-purple-600 bg-purple-50 hover:bg-purple-100/80"
                    }`}
                  >
                    {insight.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Connected Sources */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h4
              className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${isDark ? "text-violet-400" : "text-purple-600"}`}
              >
                database
              </span>
              Your Connected Sources
            </h4>
            <button
              onClick={() => setActivePage("sources")}
              className={`text-xs font-bold uppercase tracking-wider hover:underline ${isDark ? "text-violet-400" : "text-purple-600"}`}
            >
              Manage sources →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {connectedSources.slice(0, 3).map((src, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border shadow-sm flex flex-col items-start hover:-translate-y-0.5 transition-transform duration-200 ${
                  isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${isDark ? src.darkColor : src.lightColor}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{src.icon}</span>
                </div>
                <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                  {src.name}
                </span>
                <span className="text-[10px] text-slate-400 mb-4 truncate w-full">{src.email}</span>
                <div className="mt-auto flex items-center text-[10px] text-emerald-500 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                  Connected
                </div>
              </div>
            ))}

            <div
              onClick={() => setActivePage("sources")}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer group transition-all border-2 border-dashed ${
                isDark
                  ? "bg-[#18181b] border-zinc-800 hover:border-violet-500/30 hover:bg-violet-500/5"
                  : "bg-purple-50/10 border-purple-200/50 hover:bg-purple-50/30"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-105 transition-transform ${
                  isDark ? "bg-zinc-800 text-violet-400" : "bg-white text-purple-600"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </div>
              <span
                className={`text-[11px] font-bold ${isDark ? "text-zinc-300" : "text-slate-700"}`}
              >
                Add Source
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">
                Connect Notion, Outlook & more
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column (Col-span 4) */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        {/* Daily Agenda */}
        <section
          className={`p-6 rounded-2xl border shadow-sm flex flex-col ${
            isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h4
              className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${isDark ? "text-violet-400" : "text-purple-600"}`}
              >
                calendar_month
              </span>
              Today's Agenda
            </h4>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              May 25, 2025
            </span>
          </div>

          <div
            className={`space-y-6 relative before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-[1.5px] ${
              isDark ? "before:bg-zinc-800" : "before:bg-slate-100"
            }`}
          >
            {displayAgenda.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex relative pl-5 animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <div
                  className={`absolute left-0 top-[5px] w-2 h-2 rounded-full ${isDark ? (item.dotColorDark || 'bg-violet-500') : (item.dotColorLight || 'bg-purple-600')} shadow-[0_0_8px_rgba(124,58,237,0.3)]`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold ${isDark ? "text-violet-400" : "text-purple-600"}`}
                    >
                      {item.time}
                    </span>
                    {item.isFlight && (
                      <span
                        className={`material-symbols-outlined text-[14px] rotate-45 ${isDark ? "text-violet-400" : "text-purple-500"}`}
                      >
                        flight
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs font-bold mt-0.5 ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.type || item.location || 'Calendar'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Priority Reminders */}
        <section
          className={`p-6 rounded-2xl border shadow-sm ${
            isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h4
              className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${isDark ? "text-violet-400" : "text-purple-600"}`}
              >
                notifications_active
              </span>
              Priority Reminders
            </h4>
          </div>

          <div className="space-y-2.5">
            {displayReminders.map((rem: any, idx: number) => (
              <div
                key={idx}
                className={`p-3 rounded-xl flex items-center justify-between border transition-colors ${
                  isDark
                    ? "bg-[#0a0a0c]/80 border-zinc-800"
                    : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                }`}
              >
                <div>
                  <p className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                    {rem.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{rem.date}</p>
                </div>
                <span
                  className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${rem.color}`}
                >
                  {rem.priority}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section
          className={`p-6 rounded-2xl border shadow-sm ${
            isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"
          }`}
        >
          <h4
            className={`text-base font-bold flex items-center gap-2 mb-4 ${isDark ? "text-white" : "text-slate-800"}`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${isDark ? "text-violet-400" : "text-purple-600"}`}
            >
              bolt
            </span>
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Add Reminder", icon: "add_circle" },
              { label: "Create Event", icon: "event" },
              { label: "Draft Email", icon: "edit_square" },
              { label: "Daily Digest", icon: "article" },
            ].map((act, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (act.label === "Draft Email") setActivePage("chat");
                }}
                className={`p-3 border rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] text-left text-xs font-bold ${
                  isDark
                    ? "bg-[#0a0a0c]/80 border-zinc-800 text-zinc-400 hover:bg-violet-500/10 hover:border-violet-500/20 hover:text-violet-400"
                    : "bg-slate-50 border-slate-100 hover:bg-purple-50/50 hover:border-purple-500/20 hover:text-purple-600 text-slate-600"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${isDark ? "text-violet-400" : "text-purple-600"}`}
                >
                  {act.icon}
                </span>
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Dashboard Status Footer */}
      <footer
        className={`col-span-12 mt-8 pt-4 border-t flex flex-wrap items-center justify-between text-[9px] font-semibold text-slate-400 uppercase tracking-widest gap-4 ${
          isDark ? "border-zinc-800" : "border-slate-100"
        }`}
      >
        <div className="flex flex-wrap items-center gap-6">
          <div
            className={`flex items-center gap-1 ${isDark ? "text-violet-400" : "text-purple-600"}`}
          >
            <span className="material-symbols-outlined text-[14px]">favorite</span>
            <span>Built by Coral</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">database</span>
            <span>Unified Query Feed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span>Private by Design</span>
          </div>
        </div>
        <div>
          <span>© 2024 NeverLate AI</span>
        </div>
      </footer>
    </div>
  );
}
export { Dashboard };
