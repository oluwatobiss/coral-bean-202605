

interface HeaderProps {
  activePage: string
  setActivePage: (page: string) => void
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export default function Header({ activePage, setActivePage, isDark, setIsDark }: HeaderProps) {
  const searchPlaceholders: Record<string, string> = {
    'dashboard': 'Ask AI to find anything...',
    'events': 'Search events and schedule...',
    'reminders': 'Search reminders...',
    'actions': 'Search pending actions...',
    'chat': 'Ask NeverLate to manage your schedule...',
    'insights': 'Search insights...',
    'sources': 'Search connected data...',
    'settings': 'Search settings...'
  }

  const placeholder = searchPlaceholders[activePage] || 'Ask AI to find anything...'

  return (
    <header className={`fixed top-0 right-0 left-64 h-16 border-b flex items-center justify-between px-6 z-40 transition-all duration-300 ${
      isDark 
        ? 'bg-[#0a0a0c]/80 border-zinc-800/50 shadow-sm shadow-primary/2' 
        : 'bg-white/80 border-slate-200/50 backdrop-blur-xl shadow-sm shadow-primary/2'
    }`}>
      {/* Search Bar Input */}
      <div className="flex-1 max-w-xl">
        <div className={`relative group flex items-center rounded-full px-4 py-1.5 border transition-all ${
          isDark 
            ? 'bg-white/5 border-white/5 focus-within:border-violet-500/50 focus-within:bg-white/10' 
            : 'bg-slate-50 border-slate-200/50 focus-within:border-purple-600/30 focus-within:bg-white'
        }`}>
          <span className={`material-symbols-outlined text-[20px] mr-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
            search
          </span>
          <input 
            type="text" 
            placeholder={placeholder}
            className={`w-full bg-transparent border-none outline-none text-sm placeholder-zinc-500 focus:ring-0 ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}
          />
        </div>
      </div>

      {/* Header Utility items */}
      <div className="flex items-center gap-4">
        {/* Proactive / AI Monitoring Pill */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
          isDark 
            ? 'bg-violet-950/20 border-violet-800/20 text-violet-300' 
            : 'bg-purple-50 border-purple-100 text-purple-700'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold">AI Agent Monitoring</span>
        </div>

        {/* Global Light/Dark Theme Switcher Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-full transition-all flex items-center justify-center border ${
            isDark 
              ? 'text-yellow-400 bg-zinc-900 border-zinc-800 hover:bg-zinc-850' 
              : 'text-slate-500 bg-slate-50 border-slate-200/50 hover:bg-slate-100'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications and History buttons */}
        <button className={`p-2 rounded-full transition-all ${
          isDark ? 'text-zinc-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'
        }`}>
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>

        <button className={`p-2 rounded-full transition-all ${
          isDark ? 'text-zinc-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'
        }`}>
          <span className="material-symbols-outlined text-[20px]">history</span>
        </button>

        {/* Avatar Profile */}
        <div 
          onClick={() => setActivePage('settings')}
          className={`h-8 w-8 rounded-full overflow-hidden border cursor-pointer hover:scale-105 transition-transform ${
            isDark ? 'border-violet-500/20' : 'border-purple-600/20'
          }`}
        >
          <img 
            alt="User profile avatar" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdYiqAE0lXJpzGr9TKMsQWncjmKkz640A2J4d8fnR7rWHBreCi_LN1hwqtX2ApbdIqasFhJ2LsRMUyJkGs_C5sSOUm5YQUrRF00pKtrpGN2p8Ny9SZe7Ik61g1YI51iWO47cqCsURpYd1oV611D-m9UhknlH2DW0IjQjDm-8TSphpqGz43_xwC5ILc9Glz-OEBozqv_Arti2ZKPa7DjDW0XET4_N7mie7i3Gv484_HuhX5V0KL-nJialMAV-pZtTFaOwbkDUE7BYre"
          />
        </div>
      </div>
    </header>
  )
}
