import { useState } from 'react'
import { toneLabels } from '../data/mockData'

interface SettingsProps {
  isDark: boolean
}

export default function Settings({ isDark }: SettingsProps) {
  const [retention, setRetention] = useState('90 Days')
  const [aiLearning, setAiLearning] = useState(true)
  const [tone, setTone] = useState(4)
  const [insightFrequency, setInsightFrequency] = useState('Normal')
  const [emailSummary, setEmailSummary] = useState(true)
  const [pushNotify, setPushNotify] = useState(false)
  const [calendarReminder, setCalendarReminder] = useState(true)

  return (
    <div className="pt-20 px-6 pb-12 max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* Header Info */}
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Settings</h2>
        <p className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} text-sm font-medium`}>Manage your digital intelligence workspace and personalization preferences.</p>
      </div>

      {/* Settings Sections Grid */}
      <div className="space-y-8">
        
        {/* Privacy Controls Section */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-purple-600 text-[20px]">shield_person</span>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Privacy Controls</h3>
          </div>
          <div className={`p-6 rounded-2xl border shadow-sm space-y-5 ${
            isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
          }`}>
            
            {/* Retention Dropdown */}
            <div className={`flex items-center justify-between py-2 pb-4 border-b ${isDark ? 'border-zinc-800/80' : 'border-slate-50'}`}>
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Data Retention</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Specify how long your intelligence data is stored.</p>
              </div>
              <select 
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className={`border rounded-xl text-xs font-bold px-4 py-2.5 outline-none transition-colors ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-750 text-white focus:border-violet-500/30' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-purple-600/30'
                }`}
              >
                <option>30 Days</option>
                <option>90 Days</option>
                <option>1 Year</option>
                <option>Forever</option>
              </select>
            </div>

            {/* AI Learning Toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>AI Learning</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Allow NeverLate to learn from your daily interactions to improve accuracy.</p>
              </div>
              <button 
                onClick={() => setAiLearning(!aiLearning)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                  aiLearning 
                    ? isDark ? 'bg-violet-600' : 'bg-purple-600'
                    : isDark ? 'bg-zinc-800' : 'bg-slate-200'
                }`}
              >
                <span className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${
                  aiLearning ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>
        </section>

        {/* AI Personalization Section */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-purple-600 text-[20px]">auto_awesome</span>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>AI Personalization</h3>
          </div>
          <div className={`p-6 rounded-2xl border shadow-sm space-y-6 ${
            isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
          }`}>
            
            {/* Range Slider for Tone */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>AI Interaction Tone</h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Adjust how the AI Agent communicates with you.</p>
                </div>
                <span className={`font-semibold text-xs px-3 py-1 rounded-full ${
                  isDark ? 'text-violet-400 bg-violet-500/10' : 'text-purple-600 bg-purple-50'
                }`}>
                  {toneLabels[tone - 1]}
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="1"
                value={tone}
                onChange={(e) => setTone(parseInt(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-zinc-800 accent-violet-500' : 'bg-slate-100 accent-purple-600'
                }`}
              />
              <div className="flex justify-between mt-2 px-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                {toneLabels.map((lbl, idx) => (
                  <span key={idx} className={tone === idx + 1 ? (isDark ? 'text-violet-450' : 'text-purple-600') : ''}>{lbl}</span>
                ))}
              </div>
            </div>

            {/* Frequency button group */}
            <div className={`flex items-center justify-between pt-5 border-t ${isDark ? 'border-zinc-800/80' : 'border-slate-50'}`}>
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Insight Frequency</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">How often should AI push proactive insights?</p>
              </div>
              <div className={`border p-1 rounded-xl flex ${
                isDark ? 'bg-[#0a0a0c]/80 border-zinc-800' : 'bg-slate-50 border-slate-100'
              }`}>
                {['Low', 'Normal', 'High'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setInsightFrequency(freq)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      insightFrequency === freq 
                        ? isDark
                          ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/10'
                          : 'bg-purple-600 text-white shadow-sm shadow-purple-600/10' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Notification Preferences Section */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-purple-600 text-[20px]">notifications_active</span>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Notification Preferences</h3>
          </div>
          <div className={`rounded-2xl border shadow-sm overflow-hidden divide-y ${
            isDark 
              ? 'bg-[#18181b] border-zinc-800 divide-zinc-800/50' 
              : 'bg-white border-slate-100 divide-slate-50'
          }`}>
            
            {/* Email preference */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-50/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-zinc-850 text-violet-400' : 'bg-purple-50 text-purple-600'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Email Summaries</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Daily digest of your scheduled tasks.</p>
                </div>
              </div>
              <button 
                onClick={() => setEmailSummary(!emailSummary)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                  emailSummary 
                    ? isDark ? 'bg-violet-600' : 'bg-purple-600'
                    : isDark ? 'bg-zinc-800' : 'bg-slate-200'
                }`}
              >
                <span className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${
                  emailSummary ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Push notifications */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-50/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-zinc-850 text-violet-400' : 'bg-purple-50 text-purple-600'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">smartphone</span>
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Push Notifications</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Real-time alerts for urgent intelligence updates.</p>
                </div>
              </div>
              <button 
                onClick={() => setPushNotify(!pushNotify)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                  pushNotify 
                    ? isDark ? 'bg-violet-600' : 'bg-purple-600'
                    : isDark ? 'bg-zinc-800' : 'bg-slate-200'
                }`}
              >
                <span className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${
                  pushNotify ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Calendar Sync sync preference */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-50/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-zinc-850 text-violet-400' : 'bg-purple-50 text-purple-600'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Calendar Reminders</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Sync intelligent reminders directly to your Google Calendar.</p>
                </div>
              </div>
              <button 
                onClick={() => setCalendarReminder(!calendarReminder)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                  calendarReminder 
                    ? isDark ? 'bg-violet-600' : 'bg-purple-600'
                    : isDark ? 'bg-zinc-800' : 'bg-slate-200'
                }`}
              >
                <span className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${
                  calendarReminder ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>
        </section>

        {/* Account Management & Subscription Section */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-purple-600 text-[20px]">account_circle</span>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Account Management</h3>
          </div>
          <div className={`p-6 rounded-2xl border shadow-sm ${
            isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
          }`}>
            
            {/* Premium Subscription Card */}
            <div className={`p-4 border rounded-2xl flex flex-wrap items-center justify-between gap-4 mb-6 ${
              isDark 
                ? 'bg-violet-500/5 border-violet-500/10' 
                : 'bg-purple-600/5 border-purple-600/10'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-purple-600/10 text-purple-600'
                }`}>
                  <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-violet-400' : 'text-purple-600'}`}>Pro Subscription Active</h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-semibold">Your next billing date is December 14, 2024.</p>
                </div>
              </div>
              <button className={`px-4 py-2 border text-xs font-bold rounded-xl transition-all active:scale-[0.98] ${
                isDark 
                  ? 'border-violet-500 text-violet-455 hover:bg-violet-500/10' 
                  : 'border-purple-600 text-purple-600 hover:bg-purple-50'
              }`}>
                Manage Billing
              </button>
            </div>

            {/* Quick credentials actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className={`p-4 border rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-[0.98] ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-350 hover:bg-zinc-850' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-600'
              }`}>
                <span className="material-symbols-outlined text-[16px] text-purple-600">password</span>
                <span>Change Password</span>
              </button>
              <button className="p-4 bg-red-50 hover:bg-red-100/60 border border-red-100 text-red-600 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Delete Account</span>
              </button>
            </div>

          </div>
        </section>

      </div>

      {/* Footer Section */}
      <footer className={`w-full py-6 border-t flex flex-wrap justify-between items-center bg-transparent mt-16 text-[9px] font-semibold text-slate-400 uppercase tracking-widest gap-4 ${
        isDark ? 'border-zinc-800' : 'border-slate-100'
      }`}>
        <p>© 2024 NeverLate AI Intelligence</p>
        <div className="flex gap-6">
          <a className="hover:text-purple-600 transition-colors" href="#">Terms</a>
          <a className="hover:text-purple-600 transition-colors" href="#">Privacy</a>
          <a className="hover:text-purple-600 transition-colors" href="#">Support</a>
        </div>
      </footer>

    </div>
  )
}
export { Settings }
