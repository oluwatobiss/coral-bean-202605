import { insightsVelocity, insightsCounters, insightsRisks, insightsSuggestions } from '../data/mockData'

interface InsightsProps {
  isDark: boolean
}

export default function Insights({ isDark }: InsightsProps) {
  return (
    <div className="pt-20 px-6 pb-12 max-w-[1440px] mx-auto grid grid-cols-12 gap-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <header className="col-span-12 mb-4 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Risk Insights</h2>
          <p className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} mt-1 text-sm font-medium`}>Intelligence engine detected 3 high-priority schedule conflicts.</p>
        </div>
        <div className={`border shadow-sm flex items-center gap-2 px-4 py-2 rounded-2xl hover:scale-[1.01] transition-transform ${
          isDark ? 'bg-[#18181b] border-zinc-850' : 'bg-white border-slate-100'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
          <span className={`text-xs font-bold ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>AI Monitoring Active</span>
        </div>
      </header>

      {/* Risk Velocity Chart */}
      <div className={`p-6 rounded-2xl shadow-sm flex flex-col justify-between h-[320px] hover:-translate-y-0.5 transition-all duration-200 col-span-12 lg:col-span-4 border ${
        isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
      }`}>
        <div>
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Risk Velocity</h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Incident probability trend (7 days)</p>
        </div>

        {/* Mock Chart Bars */}
        <div className="flex-1 flex items-end justify-between gap-3 mt-6 h-36">
          {insightsVelocity.map((bar, idx) => (
            <div 
              key={idx} 
              className={`w-full rounded-t-lg relative group h-full flex flex-col justify-end cursor-pointer ${
                isDark ? 'bg-zinc-800/40' : 'bg-slate-100'
              }`}
            >
              <div 
                className={`w-full rounded-t-lg transition-all duration-300 ${
                  bar.active 
                    ? isDark ? 'bg-violet-500 shadow-md shadow-violet-500/25' : 'bg-purple-600 shadow-md shadow-purple-600/20' 
                    : isDark ? 'bg-zinc-700/60 group-hover:bg-zinc-650' : 'bg-purple-200/60 group-hover:bg-purple-300'
                } ${bar.val}`} 
              />
              <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity px-1 rounded ${
                isDark ? 'bg-zinc-800 text-violet-400' : 'bg-purple-50 text-purple-600'
              }`}>
                {bar.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4 px-1">
          {insightsVelocity.map((bar, idx) => (
            <span key={idx} className={bar.active ? (isDark ? 'text-violet-400' : 'text-purple-600') : ''}>{bar.day}</span>
          ))}
        </div>
      </div>

      {/* Priority Scoring Cards */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 h-auto lg:h-[320px]">
        {insightsCounters.map((c, idx) => (
          <div key={idx} className={`p-6 rounded-2xl shadow-sm flex flex-col justify-between border-l-[5px] border-y border-r hover:-translate-y-0.5 transition-all duration-200 ${
            isDark ? c.darkBorder : c.lightBorder
          }`}>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase mb-2 block">{c.type}</span>
              <p className={`text-5xl font-extrabold tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-800'}`}>{c.value}</p>
              <p className="text-xs mt-3 font-medium leading-relaxed">{c.desc}</p>
            </div>
            <span className="material-symbols-outlined text-[36px] opacity-15 self-end">{c.icon}</span>
          </div>
        ))}
      </div>

      {/* Active Risk List */}
      <div className="col-span-12 lg:col-span-7">
        <h3 className={`text-base font-bold mb-4 px-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Active Risk List</h3>
        <div className="space-y-3">
          {insightsRisks.map((risk, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border shadow-sm flex items-center gap-4 group transition-all duration-200 ${
              isDark 
                ? 'bg-[#18181b] border-zinc-800 hover:border-violet-500/20 hover:shadow-md' 
                : 'bg-white border-slate-100 hover:border-purple-600/10 hover:shadow-md'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${isDark ? risk.darkColor : risk.lightColor}`}>
                <span className="material-symbols-outlined text-[24px]">{risk.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{risk.title}</h4>
                <p className={`text-xs mt-0.5 leading-relaxed truncate ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{risk.text}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-md border ${
                  isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  {risk.p}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">{risk.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Recommendations Cards */}
      <div className="col-span-12 lg:col-span-5">
        <h3 className={`text-base font-bold mb-4 px-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Smart Recommendations</h3>
        <div className="space-y-4">
          {insightsSuggestions.map((sug, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border shadow-sm relative overflow-hidden group transition-all duration-200 ${
              isDark ? 'bg-[#18181b] border-zinc-800 hover:border-violet-500/20' : 'bg-white border-slate-100 hover:border-purple-600/10'
            }`}>
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 text-purple-600 mb-2">
                  <span className="material-symbols-outlined text-[16px] animate-pulse">auto_awesome</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">AI Suggestion</span>
                </div>
                <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{sug.title}</h4>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{sug.desc}</p>
                {sug.outline ? (
                  <button className={`w-full py-2.5 border bg-transparent text-xs font-bold rounded-xl transition-all active:scale-[0.98] ${
                    isDark 
                      ? 'border-violet-500 text-violet-400 hover:bg-violet-500/10' 
                      : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                  }`}>
                    {sug.action}
                  </button>
                ) : (
                  <button className={`w-full py-2.5 text-white text-xs font-bold rounded-xl transition-all active:scale-[0.98] ${
                    isDark 
                      ? 'bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-600/15 hover:shadow-violet-600/20' 
                      : 'bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/15 hover:shadow-purple-600/20'
                  }`}>
                    {sug.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
export { Insights }
