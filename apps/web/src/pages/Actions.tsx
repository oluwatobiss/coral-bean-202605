import { useState } from 'react'
import {
  actionsStatsList,
  actionsPendingList,
  actionsWeeklyChart,
  type ActionsPendingItem
} from '../data/mockData'

interface ActionsProps {
  isDark: boolean
}

export default function Actions({ isDark }: ActionsProps) {
  // Interactive list of active actions
  const [actionsList, setActionsList] = useState<ActionsPendingItem[]>(actionsPendingList)
  // Toast notifications for action feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [processedActions, setProcessedActions] = useState<string[]>([])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleActionClick = (id: string, title: string, actionLabel: string) => {
    setProcessedActions(prev => [...prev, id])
    triggerToast(`✓ Executed: "${title}" via ${actionLabel}`)
    
    // Animate removal from active cards after delay
    setTimeout(() => {
      setActionsList(prev => prev.filter(item => item.id !== id))
    }, 400)
  }

  const handleDismissClick = (id: string, title: string) => {
    setProcessedActions(prev => [...prev, id])
    triggerToast(`Dismissed: "${title}"`)
    
    setTimeout(() => {
      setActionsList(prev => prev.filter(item => item.id !== id))
    }, 400)
  }

  const handleRestore = () => {
    setActionsList(actionsPendingList)
    setProcessedActions([])
    triggerToast('Restored all mock actions for demo purposes!')
  }

  return (
    <div className="pt-20 px-6 pb-12 max-w-[1440px] mx-auto grid grid-cols-12 gap-6 animate-in fade-in duration-500">
      
      {/* Dynamic Toast Feedback Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl border shadow-xl flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-5 duration-300 ${
          isDark 
            ? 'bg-zinc-900 border-violet-500/30 text-violet-300 shadow-violet-950/10' 
            : 'bg-white border-purple-200 text-purple-700 shadow-purple-600/10'
        }`}>
          <span className="material-symbols-outlined text-[20px] animate-pulse">auto_awesome</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <header className="col-span-12 mb-4 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Pending Actions</h2>
          <p className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} mt-1 text-sm font-medium`}>
            Autonomous scheduling updates, email draft compilations, and flow optimizations awaiting your final clearance.
          </p>
        </div>
        <div className={`border shadow-sm flex items-center gap-2 px-4 py-2 rounded-2xl ${
          isDark ? 'bg-[#18181b] border-zinc-850' : 'bg-white border-slate-100'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className={`text-xs font-bold ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>
            System Health: Optimal
          </span>
        </div>
      </header>

      {/* KPI Stats Block */}
      <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        {actionsStatsList.map((stat, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border shadow-sm flex items-center space-x-4 hover:-translate-y-0.5 transition-transform duration-200 ${
            isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
          }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? stat.darkColor : stat.lightColor}`}>
              <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {stat.title.includes('Impact') ? actionsList.length : stat.value}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isDark ? stat.badgeClassDark : stat.badgeClassLight
                }`}>
                  {stat.badge}
                </span>
              </div>
              <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{stat.title}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Pending Approvals & Workflows (Col-span 8) */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        
        {/* Pending approvals cards list */}
        <section className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>approval_delegation</span>
                Action Clearances
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Please approve or modify pending flow updates.</p>
            </div>
            {actionsList.length === 0 && (
              <button 
                onClick={handleRestore}
                className={`text-[10px] font-bold uppercase tracking-wider underline hover:no-underline ${
                  isDark ? 'text-violet-400' : 'text-purple-600'
                }`}
              >
                Restore Mock Actions
              </button>
            )}
          </div>

          <div className="space-y-4">
            {actionsList.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                  isDark ? 'bg-emerald-950/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <span className="material-symbols-outlined text-[32px]">verified</span>
                </div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>All Clear!</h4>
                <p className="text-xs text-slate-400 font-medium mt-1">No pending actions require authorization.</p>
              </div>
            ) : (
              actionsList.map((action) => {
                const isProcessed = processedActions.includes(action.id)

                return (
                  <div 
                    key={action.id}
                    className={`p-5 rounded-xl border flex flex-col gap-4 transition-all duration-300 transform ${
                      isProcessed 
                        ? 'opacity-0 scale-95 max-h-0 py-0 overflow-hidden' 
                        : 'opacity-100 scale-100'
                    } ${
                      isDark 
                        ? 'bg-zinc-900 border-zinc-800 hover:border-violet-500/20' 
                        : 'bg-white border-slate-100 hover:border-purple-200/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark 
                            ? 'bg-violet-500/10 text-violet-400' 
                            : 'bg-purple-50 text-purple-600'
                        }`}>
                          <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-850'}`}>
                            {action.title}
                          </h4>
                          <p className={`text-[11px] leading-relaxed mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                            {action.desc}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 text-[8px] font-extrabold tracking-wider rounded uppercase shrink-0 border ${
                        isDark 
                          ? 'bg-zinc-800 border-zinc-750 text-zinc-400' 
                          : 'bg-slate-50 border-slate-200/50 text-slate-500'
                      }`}>
                        {action.tag}
                      </span>
                    </div>

                    <div className="flex gap-2.5 mt-2 justify-end">
                      <button 
                        onClick={() => handleDismissClick(action.id, action.title)}
                        className={`px-4 py-2 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] ${
                          isDark 
                            ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-white' 
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        {action.dismissLabel}
                      </button>
                      <button 
                        onClick={() => handleActionClick(action.id, action.title, action.actionLabel)}
                        className={`px-4 py-2 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] ${
                          isDark 
                            ? 'bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-600/15' 
                            : 'bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/15'
                        }`}
                      >
                        {action.actionLabel}
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* Weekly proactivity trigger charts */}
        <section className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>bar_chart</span>
                Proactive Automation Trends
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Suggested system triggers vs executed routines.</p>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-violet-500" />
                <span className="text-slate-400">Suggested</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
                <span className="text-slate-400">Executed</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Grid */}
          <div className="h-48 flex items-end justify-between gap-6 px-4 mt-8 border-b pb-1 dark:border-zinc-800">
            {actionsWeeklyChart.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group">
                
                {/* Bars column wrapper */}
                <div className="flex items-end gap-1.5 h-full w-full justify-center">
                  {/* Suggested percent bar */}
                  <div className="w-4 bg-zinc-800/10 dark:bg-zinc-900 rounded-t-sm h-full flex flex-col justify-end relative">
                    <div 
                      style={{ height: bar.suggestedPercent }}
                      className={`w-full rounded-t-sm bg-gradient-to-t from-violet-600 to-violet-400 group-hover:opacity-90 transition-opacity`}
                    />
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[8px] font-extrabold bg-zinc-850 text-violet-400 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm select-none">
                      {bar.suggestedPercent}
                    </span>
                  </div>

                  {/* Executed percent bar */}
                  <div className="w-4 bg-zinc-800/10 dark:bg-zinc-900 rounded-t-sm h-full flex flex-col justify-end relative">
                    <div 
                      style={{ height: bar.executedPercent }}
                      className={`w-full rounded-t-sm bg-gradient-to-t from-emerald-500 to-emerald-400 group-hover:opacity-90 transition-opacity`}
                    />
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[8px] font-extrabold bg-zinc-850 text-emerald-400 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm select-none">
                      {bar.executedPercent}
                    </span>
                  </div>
                </div>

                {/* Day label */}
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-3">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Autonomy Level and Health Indicators (Col-span 4) */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        
        {/* SVG Circular Autonomy Index Widget */}
        <section className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>smart_toy</span>
              Active Autonomy Index
            </h3>
          </div>

          <div className="flex flex-col items-center py-4">
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
                  <linearGradient id="autGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                {/* Progress Ring representing 68% active autonomy */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="url(#autGrad)" 
                  strokeWidth="10" 
                  strokeDasharray="263.8" 
                  strokeDashoffset="84.4" /* 68% fill */
                  strokeLinecap="round"
                  fill="transparent" 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Central Text Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`}>68%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Autonomy</span>
              </div>
            </div>

            <div className="mt-6 space-y-3 w-full text-xs border-t pt-4 border-slate-200/50 dark:border-zinc-800/80">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Automatic Rescheduling</span>
                <span className="font-bold text-emerald-500">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Proactive Travel Blocks</span>
                <span className="font-bold text-emerald-500">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Direct Email Drafting</span>
                <span className="font-bold text-slate-500">Approval Required</span>
              </div>
            </div>
          </div>
        </section>

        {/* System Health Indicators */}
        <section className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <h4 className={`text-sm font-bold flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>health_and_safety</span>
            Agent Systems Health
          </h4>

          <div className="space-y-3">
            {[
              { name: 'LLM Intent Resolver', status: 'Online', delay: '12ms', color: 'text-emerald-500' },
              { name: 'Predictive Transit Engine', status: 'Online', delay: '42ms', color: 'text-emerald-500' },
              { name: 'Cross-Source Fetch Sync', status: 'Synced', delay: '1.2m ago', color: 'text-emerald-500' },
              { name: 'Secure Sandbox Shield', status: 'Active', delay: 'Guaranteed', color: 'text-purple-500 dark:text-violet-400' }
            ].map((sys, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  isDark ? 'bg-[#0a0a0c]/80 border-zinc-850' : 'bg-slate-50/50 border-slate-100'
                }`}
              >
                <div>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-850'}`}>{sys.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Lag latency / stats: {sys.delay}</p>
                </div>
                <span className={`text-[10px] font-bold ${sys.color}`}>
                  {sys.status}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  )
}
export { Actions }
