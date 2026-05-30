

import { useState, useEffect } from 'react'
import { useSources } from '../context/SourcesContext'

interface HeaderProps {
  activePage: string
  setActivePage: (page: string) => void
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export default function Header({ activePage, setActivePage, isDark, setIsDark }: HeaderProps) {
  const { sources } = useSources();
  const gmailSource = sources.find(s => s.id === 'gmail');
  const userEmail = gmailSource?.email || 'alex@gmail.com';
  const userName = gmailSource?.userName || (userEmail !== 'alex@gmail.com' 
    ? userEmail.split('@')[0].split(/[._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') 
    : 'Alex');
  const avatarUrl = (gmailSource as any)?.avatarUrl;

  const [notifCount, setNotifCount] = useState(0)

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await fetch('http://localhost:3000/api/ai/notifications')
        if (res.ok) {
          const data = await res.json()
          setNotifCount(data.length || 0)
        }
      } catch (e) {
        setNotifCount(0)
      }
    }
    fetchNotifs()
  }, [])
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
        <button className={`relative p-2 rounded-full transition-all ${
          isDark ? 'text-zinc-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'
        }`}>
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#0a0a0c]">
              {notifCount}
            </span>
          )}
        </button>

        <button className={`p-2 rounded-full transition-all ${
          isDark ? 'text-zinc-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'
        }`}>
          <span className="material-symbols-outlined text-[20px]">history</span>
        </button>

        {/* Profile Info & Avatar */}
        <div 
          onClick={() => setActivePage('settings')}
          className="flex items-center gap-3 cursor-pointer group hover:scale-[1.02] transition-transform animate-in fade-in duration-300"
        >
          <div className="hidden sm:flex flex-col text-right">
            <span className={`text-xs font-bold leading-none ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{userName}</span>
            <span className="text-[9px] text-zinc-400 font-semibold mt-0.5">{userEmail}</span>
          </div>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner transition-transform group-hover:scale-105 overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-650 text-white border border-violet-500/30' 
              : 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white border border-purple-500/30'
          }`}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
