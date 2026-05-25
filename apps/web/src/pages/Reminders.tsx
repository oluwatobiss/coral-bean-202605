import { useState } from 'react'
import {
  remindersStatsList,
  remindersUrgentList,
  remindersActiveList,
  remindersUpcomingList,
  remindersAiInsightsList
} from '../data/mockData'

interface RemindersProps {
  isDark: boolean
}

export default function Reminders({ isDark }: RemindersProps) {
  // Interactive state for reminders checkboxes
  const [completedList, setCompletedList] = useState<string[]>([])
  // Interactive state for actions triggered
  const [actionTriggered, setActionTriggered] = useState<Record<string, string>>({})
  // Urgent overdue count state
  const [urgentVisible, setUrgentVisible] = useState(true)

  const toggleComplete = (id: string) => {
    if (completedList.includes(id)) {
      setCompletedList(completedList.filter(item => item !== id))
    } else {
      setCompletedList([...completedList, id])
    }
  }

  const handleAction = (id: string, type: 'snooze' | 'pay' | 'apply') => {
    if (type === 'pay') {
      setActionTriggered(prev => ({ ...prev, [id]: 'Processing Payout...' }))
      setTimeout(() => {
        setActionTriggered(prev => ({ ...prev, [id]: 'Paid ✓' }))
        // Auto complete after short delay
        setTimeout(() => toggleComplete(id), 1000)
      }, 1500)
    } else if (type === 'snooze') {
      setActionTriggered(prev => ({ ...prev, [id]: 'Snoozed to Afternoon' }))
      setTimeout(() => {
        setActionTriggered(prev => {
          const updated = { ...prev }
          delete updated[id]
          return updated
        })
      }, 3000)
    }
  }

  return (
    <div className="pt-20 px-6 pb-12 max-w-[1440px] mx-auto grid grid-cols-12 gap-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <header className="col-span-12 mb-4 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Reminders & Flow</h2>
          <p className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} mt-1 text-sm font-medium`}>
            Task reminders linked automatically to emails, bills, calendar markers, and local retail systems.
          </p>
        </div>
        <div className={`border shadow-sm flex items-center gap-2 px-4 py-2 rounded-2xl ${
          isDark ? 'bg-[#18181b] border-zinc-850' : 'bg-white border-slate-100'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span className={`text-xs font-bold ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>
            3 Critical Reminders Pending
          </span>
        </div>
      </header>

      {/* KPI Stats Block */}
      <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        {remindersStatsList.map((stat, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border shadow-sm flex items-center space-x-4 hover:-translate-y-0.5 transition-transform duration-200 ${
            isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
          }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? stat.darkColor : stat.lightColor}`}>
              <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
            </div>
            <div>
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</span>
              <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{stat.title}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Reminders List & Active Triggers (Col-span 8) */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        
        {/* Urgent/Overdue Notifications */}
        {urgentVisible && remindersUrgentList.map((urg, idx) => (
          <section 
            key={idx}
            className="p-5 rounded-2xl border bg-gradient-to-r from-rose-500/10 to-red-500/5 dark:from-rose-950/20 dark:to-red-950/10 border-rose-500/20 dark:border-rose-900/40 shadow-sm relative overflow-hidden flex flex-wrap justify-between items-center gap-4 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px] animate-bounce">warning</span>
              </div>
              <div>
                <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase bg-rose-500/10 text-rose-500 border border-rose-500/25`}>
                  {urg.tag} • OVERDUE ACTION REQUIRED
                </span>
                <h4 className={`text-sm font-bold mt-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {urg.title}
                </h4>
                <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  {urg.overdue}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setActionTriggered(prev => ({ ...prev, 'urgent-budget': 'Updating Draft...' }))
                  setTimeout(() => {
                    setActionTriggered(prev => ({ ...prev, 'urgent-budget': 'Saved to Calendar ✓' }))
                    setTimeout(() => setUrgentVisible(false), 800)
                  }, 1200)
                }}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
                  isDark 
                    ? 'bg-rose-600 text-white hover:bg-rose-700' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {actionTriggered['urgent-budget'] || 'Resolve Now'}
              </button>
              <button 
                onClick={() => setUrgentVisible(false)}
                className={`p-2 rounded-xl border border-transparent transition-all ${
                  isDark ? 'text-zinc-500 hover:bg-white/5' : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </section>
        ))}

        {/* Active Reminders Block */}
        <section className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>checklist</span>
              Active Reminders
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {remindersActiveList.length - completedList.length} remaining today
            </span>
          </div>

          <div className="space-y-3">
            {remindersActiveList.map((rem) => {
              const isCompleted = completedList.includes(rem.id)
              const hasTrigger = actionTriggered[rem.id]

              return (
                <div 
                  key={rem.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-300 ${
                    isCompleted
                      ? isDark 
                        ? 'bg-zinc-900/40 border-zinc-850 opacity-40' 
                        : 'bg-slate-50/50 border-slate-100 opacity-50'
                      : isDark
                        ? 'bg-zinc-900 border-zinc-800 hover:border-violet-500/20'
                        : 'bg-white border-slate-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Custom Circle Checkbox */}
                    <button 
                      onClick={() => toggleComplete(rem.id)}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isDark
                            ? 'border-zinc-700 hover:border-violet-500 bg-[#0a0a0c]/80'
                            : 'border-slate-300 hover:border-purple-600 bg-slate-50'
                      }`}
                    >
                      {isCompleted && (
                        <span className="material-symbols-outlined text-[16px] font-extrabold">check</span>
                      )}
                    </button>

                    <div className="min-w-0">
                      <p className={`text-xs font-bold leading-normal transition-all ${
                        isCompleted 
                          ? 'text-slate-400 line-through font-medium' 
                          : isDark ? 'text-white' : 'text-slate-800'
                      }`}>
                        {rem.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>
                          {rem.time}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">•</span>
                        <span className={`px-2 py-0.2 rounded text-[8px] font-bold uppercase ${
                          isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-50 text-slate-600'
                        }`}>
                          {rem.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Snooze / Pay Now) */}
                  {!isCompleted && (
                    <div className="flex items-center gap-2 shrink-0">
                      {rem.actionType === 'pay' ? (
                        <button 
                          onClick={() => handleAction(rem.id, 'pay')}
                          disabled={!!hasTrigger}
                          className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                            hasTrigger
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : isDark
                                ? 'bg-violet-600 text-white hover:bg-violet-700'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {hasTrigger || rem.actionLabel}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAction(rem.id, 'snooze')}
                          disabled={!!hasTrigger}
                          className={`py-1.5 px-3 border rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                            hasTrigger
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : isDark
                                ? 'border-zinc-850 text-zinc-350 hover:bg-zinc-800 hover:text-white'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                          }`}
                        >
                          {hasTrigger || rem.actionLabel}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* AI Smart Suggest and Batches */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>auto_awesome</span>
              AI Suggested Smart Workflows
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remindersAiInsightsList.map((ins, idx) => {
              const isSp = ins.isSpecial
              const hasTrigger = actionTriggered[`suggest-${idx}`]

              return (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border shadow-sm relative overflow-hidden group flex flex-col justify-between transition-all duration-300 ${
                    isSp 
                      ? isDark 
                        ? 'bg-gradient-to-br from-violet-950/40 via-zinc-900 to-[#18181b] border-violet-500/30 hover:border-violet-500/50' 
                        : 'bg-gradient-to-br from-purple-100/50 via-white to-slate-50 border-purple-500/20 hover:border-purple-550/40'
                      : isDark
                        ? 'bg-[#18181b] border-zinc-800 hover:border-zinc-700'
                        : 'bg-white border-slate-100 hover:border-purple-200/50'
                  }`}
                >
                  {isSp && (
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-105 transition-transform duration-300 select-none">
                      <span className={`material-symbols-outlined text-[80px] ${isDark ? 'text-violet-500 opacity-20' : 'text-purple-600'}`}>redeem</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`material-symbols-outlined text-[15px] ${isSp ? 'text-purple-600 dark:text-violet-400 animate-pulse' : 'text-slate-400'}`}>
                        {ins.icon}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        isSp 
                          ? 'text-purple-600 dark:text-violet-400 font-extrabold' 
                          : 'text-slate-400'
                      }`}>
                        {ins.type}
                      </span>
                    </div>
                    
                    <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {ins.title}
                    </h4>
                    <p className={`text-[11px] leading-relaxed mt-1.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                      {ins.desc}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {isSp ? (
                      <button 
                        onClick={() => {
                          setActionTriggered(prev => ({ ...prev, [`suggest-${idx}`]: 'Opening Florist Drawer...' }))
                          setTimeout(() => {
                            setActionTriggered(prev => ({ ...prev, [`suggest-${idx}`]: 'Order Complete ✓' }))
                            setTimeout(() => {
                              setActionTriggered(prev => {
                                const u = { ...prev }
                                delete u[`suggest-${idx}`]
                                return u
                              })
                            }, 3000)
                          }, 1500)
                        }}
                        className={`w-full py-2 text-white text-[11px] font-bold rounded-xl transition-all active:scale-[0.98] ${
                          isDark 
                            ? 'bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-600/20' 
                            : 'bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20'
                        }`}
                      >
                        {hasTrigger || ins.action}
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setActionTriggered(prev => ({ ...prev, [`suggest-${idx}`]: 'Optimizing Calendar...' }))
                          setTimeout(() => {
                            setActionTriggered(prev => ({ ...prev, [`suggest-${idx}`]: 'Optimized ✓' }))
                            setTimeout(() => {
                              setActionTriggered(prev => {
                                const u = { ...prev }
                                delete u[`suggest-${idx}`]
                                return u
                              })
                            }, 3000)
                          }, 1200)
                        }}
                        className={`w-full py-2 border bg-transparent text-[11px] font-bold rounded-xl transition-all active:scale-[0.98] ${
                          isDark 
                            ? 'border-violet-500 text-violet-400 hover:bg-violet-500/10' 
                            : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        {hasTrigger || ins.action}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </div>

      {/* Focus Gauge & Upcoming ledger (Col-span 4) */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        
        {/* Custom Weekly Focus Efficiency SVG Gauge Widget */}
        <section className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>query_stats</span>
              Weekly Flow Efficiency
            </h3>
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">Excellent</span>
          </div>

          <div className="flex flex-col items-center py-4">
            {/* SVG Circular Gauge */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke={isDark ? '#27272a' : '#f1f5f9'} 
                  strokeWidth="10" 
                  fill="transparent" 
                />
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                {/* Progress Ring */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="url(#gaugeGrad)" 
                  strokeWidth="10" 
                  strokeDasharray="263.8" 
                  strokeDashoffset="31.6" /* 88% remaining filled */
                  strokeLinecap="round"
                  fill="transparent" 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Central Text Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`}>88%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Flow score</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 w-full text-center border-t pt-4 border-slate-200/50 dark:border-zinc-800/80">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Focus Blocks</p>
                <p className={`text-sm font-extrabold mt-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>12 / 14</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Snoozed Tasks</p>
                <p className={`text-sm font-extrabold mt-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>2 / 24</p>
              </div>
            </div>

            <div className={`mt-4 p-2.5 rounded-xl border w-full text-center text-[10px] font-semibold ${
              isDark ? 'bg-[#0a0a0c]/80 border-zinc-850 text-violet-400' : 'bg-purple-50/50 border-purple-100 text-purple-700'
            }`}>
              ⚡ Flow is 8% higher than last Monday
            </div>
          </div>
        </section>

        {/* Upcoming Week Ledger */}
        <section className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-5">
            <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>calendar_today</span>
              Upcoming This Week
            </h4>
          </div>

          <div className="space-y-3.5">
            {remindersUpcomingList.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border flex items-center gap-3.5 transition-colors ${
                  isDark ? 'bg-[#0a0a0c]/80 border-zinc-850' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/50'
                }`}
              >
                <div className={`w-10 py-1.5 rounded-lg flex flex-col items-center justify-center shrink-0 border ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-slate-100 text-slate-500'
                }`}>
                  <span className="text-[9px] font-bold uppercase leading-none">{item.date.split(' ')[0]}</span>
                  <span className="text-xs font-extrabold leading-none mt-1">{item.date.split(' ')[1]}</span>
                </div>
                
                <div className="min-w-0">
                  <p className={`text-xs font-bold leading-normal truncate ${isDark ? 'text-white' : 'text-slate-850'}`}>
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Synced calendar event</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  )
}
export { Reminders }
