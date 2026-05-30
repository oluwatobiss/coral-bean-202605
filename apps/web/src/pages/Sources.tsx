
import PlatformIcon from '../components/PlatformIcon'
import { useSources } from '../context/SourcesContext'

interface SourcesProps {
  isDark: boolean
}

export default function Sources({ isDark }: SourcesProps) {
  const { sources, loadingId, handleToggle } = useSources();

  return (
    <div className="pt-20 px-6 pb-12 max-w-[1440px] mx-auto animate-in fade-in duration-500">
      
      {/* Header Info */}
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Your Connected Sources</h2>
        <p className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} text-sm leading-relaxed max-w-3xl font-medium`}>
          Manage the data streams that power your AI-driven schedule and insights. Connected sources are scanned securely in the background with private-by-design context layers.
        </p>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {sources.map((src: any) => (
          <div key={src.id} className={`p-6 rounded-2xl border shadow-sm flex flex-col h-full hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${
            isDark 
              ? 'bg-[#18181b] border-zinc-800 hover:border-violet-500/20' 
              : 'bg-white border-slate-100 hover:border-purple-600/10'
          }`}>
            <div className="flex justify-between items-start mb-6">
              <PlatformIcon id={src.id} connected={src.connected} isDark={isDark} size="large" />

              {/* Connected Badge Toggle */}
              {src.connected ? (
                <span className={`px-3 py-1 font-bold text-[9px] uppercase tracking-wider rounded-full flex items-center gap-1.5 border ${
                  isDark 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  CONNECTED
                </span>
              ) : (
                <span className={`px-3 py-1 font-bold text-[9px] uppercase tracking-wider rounded-full flex items-center gap-1.5 border ${
                  isDark 
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-500' 
                    : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  DISCONNECTED
                </span>
              )}
            </div>

            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-1`}>{src.name}</h3>
            {src.email && <p className="text-[10px] text-slate-400 font-semibold mb-3">{src.email}</p>}
            <p className={`text-xs leading-relaxed mb-6 flex-1 font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{src.desc}</p>

            {/* Sync actions bottom bar */}
            <div className={`flex items-center justify-between pt-4 border-t mt-auto ${isDark ? 'border-zinc-800/80' : 'border-slate-50'}`}>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Sync</span>
                <span className={`text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{src.lastSync}</span>
              </div>

              <button 
                onClick={() => handleToggle(src.id)}
                disabled={loadingId !== null}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-[0.98] min-w-[80px] flex items-center justify-center gap-1.5 ${
                  isDark 
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400' 
                    : 'bg-slate-50 hover:bg-slate-100/80 hover:text-purple-600 text-slate-600'
                }`}
              >
                {loadingId === src.id ? (
                  <span className="w-3.5 h-3.5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  src.connected ? 'Disable' : 'Connect'
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Add Source CTA Card */}
        <div className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer border-2 border-dashed transition-all duration-200 ${
          isDark 
            ? 'bg-[#18181b] border-zinc-800 hover:border-violet-500/30 hover:bg-violet-500/5' 
            : 'bg-purple-50/5 border-purple-200/50 hover:bg-purple-50/15'
        }`}>
          <div className={`w-16 h-16 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${
            isDark ? 'bg-zinc-800 text-violet-400' : 'bg-white text-purple-600'
          }`}>
            <span className="material-symbols-outlined text-[36px]">add</span>
          </div>
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-1`}>Add New Source</h3>
          <p className="text-xs text-slate-400 leading-relaxed px-4 font-semibold">
            Connect Notion, Outlook, Trello or custom Webhooks to your intelligence feed.
          </p>
        </div>

      </div>

      {/* Footer Section */}
      <footer className={`w-full py-6 border-t flex flex-wrap justify-between items-center bg-transparent mt-16 text-[9px] font-semibold text-slate-400 uppercase tracking-widest gap-4 ${
        isDark ? 'border-zinc-800' : 'border-slate-100'
      }`}>
        <p>© {new Date().getFullYear()} NeverLate AI Intelligence</p>
        <div className="flex gap-6">
          <a className="hover:text-purple-600 transition-colors" href="#">Terms</a>
          <a className="hover:text-purple-600 transition-colors" href="#">Privacy</a>
          <a className="hover:text-purple-600 transition-colors" href="#">Support</a>
        </div>
      </footer>

    </div>
  )
}
export { Sources }
