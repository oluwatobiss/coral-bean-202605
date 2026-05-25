

interface SidebarProps {
  activePage: string
  setActivePage: (page: string) => void
  isDark: boolean
}

export default function Sidebar({ activePage, setActivePage, isDark }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'events', label: 'Agenda / Events', icon: 'calendar_today' },
    { id: 'reminders', label: 'Reminders', icon: 'notifications_active' },
    { id: 'actions', label: 'Actions', icon: 'bolt' },
    { id: 'chat', label: 'AI Chat', icon: 'chat_spark' },
    { id: 'insights', label: 'Insights', icon: 'insights' },
    { id: 'sources', label: 'Sources', icon: 'database' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ]

  return (
    <aside className={`h-screen w-64 fixed left-0 top-0 border-r flex flex-col p-6 overflow-y-auto z-50 transition-all duration-300 ${
      isDark 
        ? 'bg-[#0a0a0c] border-zinc-850 text-zinc-300 shadow-xl shadow-primary/5' 
        : 'bg-white/80 border-slate-200 backdrop-blur-xl text-slate-800 shadow-xl shadow-primary/5'
    }`}>
      {/* Brand Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/aida/ADBb0uhiu4Mj_TUXhJ0jUydJPdoV4Rbq3S0PNpnaF-0QdBlPmYYhdoFxkUJoP5OTScWfIl88Lvghm3LF_fkw2WbJuaOsKw0plz04shPJjvxus76IpYJCZPfKttjIdJ6YsypHmCb-ZCCEMOrNKgV6DCy-u4PhsGrCYx6L75_nUWZYo0DkoL8SdjU6cXODMCq76290XILPt4WuigtYZKLfu_Ogxu5_q0mg0k4SPVQPKiOhmhIaWNSn7iEfmCllNjY" 
            alt="NeverLate Logo" 
            className={`h-8 w-auto object-contain ${isDark ? 'grayscale invert' : ''}`}
          />
          <span className={isDark ? 'text-violet-500' : 'text-purple-600'}>NeverLate</span>
        </h1>
        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
          Your Personal Life Agent
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? isDark
                    ? 'bg-violet-600/20 text-violet-300'
                    : 'bg-purple-100 text-purple-700'
                  : isDark
                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span 
                className={`material-symbols-outlined text-[20px] transition-transform ${isActive ? 'scale-105' : ''}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Sidebar Footer Details */}
      <div className="mt-auto space-y-4 pt-6">
        {/* Connected Sources Status Widget */}
        <div className={`p-4 rounded-xl border transition-all ${
          isDark 
            ? 'bg-[#18181b] border-zinc-800' 
            : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
              Connected Sources
            </span>
            <span className={`text-xs font-bold ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>
              4 / 6
            </span>
          </div>
          <div className="flex space-x-1.5">
            {['Gmail', 'Calendar', 'Slack', 'Drive'].map((app, idx) => (
              <div 
                key={idx} 
                className={`w-6 h-6 rounded-full flex items-center justify-center border shadow-sm ${
                  isDark ? 'bg-zinc-800 border-white/5' : 'bg-white border-slate-100'
                }`}
                title={app}
              >
                <div className={`w-3.5 h-3.5 rounded-full ${
                  app === 'Gmail' ? 'bg-red-500' :
                  app === 'Calendar' ? 'bg-blue-500' :
                  app === 'Slack' ? 'bg-purple-500' : 'bg-yellow-500'
                }`} />
              </div>
            ))}
            <button 
              onClick={() => setActivePage('sources')}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold hover:scale-105 transition-all ${
                isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              +
            </button>
          </div>
        </div>

        {/* Upgrade Card / Premium Banner */}
        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-violet-600/10 border-violet-500/20' : 'bg-purple-600/5 border-purple-600/10'
        }`}>
          <p className={`font-semibold text-[10px] uppercase tracking-wider ${isDark ? 'text-violet-400' : 'text-purple-700'}`}>
            PRO PLAN
          </p>
          <p className={`text-[11px] mt-1 leading-normal mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
            Unlock predictive analytics & unlimited sources.
          </p>
          <button 
            onClick={() => setActivePage('settings')}
            className={`w-full py-2 text-xs font-bold rounded-lg transition-all active:scale-[0.98] ${
              isDark 
                ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-600/20' 
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/20'
            }`}
          >
            Upgrade to Pro
          </button>
        </div>

        {/* External Links */}
        <div className={`flex flex-col gap-1.5 pt-4 border-t ${isDark ? 'border-zinc-850' : 'border-slate-100'}`}>
          <a href="#" className={`flex items-center gap-3 px-4 py-1.5 text-xs font-medium transition-colors ${
            isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'
          }`}>
            <span className="material-symbols-outlined text-[16px]">help</span>
            <span>Help</span>
          </a>
          <a href="#" className={`flex items-center gap-3 px-4 py-1.5 text-xs font-medium transition-colors ${
            isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'
          }`}>
            <span className="material-symbols-outlined text-[16px]">shield</span>
            <span>Privacy</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
