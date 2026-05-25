import { useState, useRef, useEffect } from 'react'
import { initialChatMessages, chatChips } from '../data/mockData'

interface Message {
  sender: 'ai' | 'user'
  time: string
  text: string
  proactive?: boolean
  buttons?: string[]
  draftCard?: { title: string; content: string }
}

interface AIChatProps {
  isDark: boolean
}

export default function AIChat({ isDark }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialChatMessages)
  const [inputVal, setInputVal] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!inputVal.trim()) return
    const newMsg: Message = {
      sender: 'user',
      time: 'Just Now',
      text: inputVal
    }
    setMessages((prev) => [...prev, newMsg])
    setInputVal('')

    // Mock AI response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          time: 'Just Now',
          text: "I've scanned your connected data sources. I see no immediate issues regarding that request. Is there anything else you'd like me to sync or draft?"
        }
      ])
    }, 1500)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="pt-20 px-6 pb-28 max-w-5xl mx-auto flex flex-col h-[calc(100vh-4rem)] relative animate-in fade-in duration-500">
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar pb-6">
        
        {messages.map((msg, idx) => {
          const isAI = msg.sender === 'ai'
          return (
            <div 
              key={idx} 
              className={`flex flex-col gap-2 ${
                isAI ? 'items-start animate-in slide-in-from-left-4' : 'items-end animate-in slide-in-from-right-4'
              } duration-500`}
            >
              {/* Sender Details */}
              <div className="flex items-center gap-2 text-slate-400">
                {isAI && (
                  <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  </div>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isAI ? (msg.proactive ? 'Proactive Insight' : 'AI Agent') : 'Alex'} • {msg.time}
                </span>
              </div>

              {/* Message Bubble */}
              <div className={`p-5 rounded-2xl max-w-2xl border shadow-sm ${
                isAI 
                  ? isDark ? 'bg-[#18181b] border-zinc-800 text-white' : 'bg-white border-slate-100 text-slate-800' 
                  : isDark ? 'bg-violet-600 border-violet-500 text-white' : 'bg-purple-600 border-purple-500 text-white'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Optional Draft Card */}
                {msg.draftCard && (
                  <div className={`mt-4 p-4 rounded-xl border text-left ${
                    isDark 
                      ? 'bg-[#0a0a0c]/80 border-zinc-800/80 text-zinc-300' 
                      : 'bg-slate-50 border-slate-150 text-slate-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-450">
                        {msg.draftCard.title}
                      </span>
                      <span className="material-symbols-outlined text-purple-600 text-[16px]">edit</span>
                    </div>
                    <p className={`text-xs italic leading-normal ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{msg.draftCard.content}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {msg.buttons && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {msg.buttons.map((btn, btnIdx) => (
                      <button 
                        key={btnIdx}
                        onClick={() => {
                          if (btn === 'Reschedule Sync') {
                            setMessages(prev => [...prev, {
                              sender: 'ai',
                              time: 'Just Now',
                              text: "Okay, I've successfully rescheduled 'Product Strategy Sync' to Tuesday at 3:00 PM and sent invitations to the team."
                            }])
                          }
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all active:scale-[0.98] ${
                          btnIdx === 0
                            ? isDark
                              ? 'bg-violet-600 hover:bg-violet-750 text-white shadow-sm shadow-violet-600/10'
                              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/10'
                            : isDark
                              ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex flex-col gap-2 items-start animate-pulse">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Agent • Thinking...</span>
            </div>
            <div className={`p-4 rounded-2xl flex items-center space-x-2 border ${
              isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-slate-100'
            }`}>
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Sticky Bottom Input & Prompt Chips */}
      <div className={`absolute bottom-0 right-0 left-0 pt-6 pb-2 bg-gradient-to-t ${
        isDark ? 'from-[#0a0a0c] via-[#0a0a0c] to-transparent' : 'from-slate-50 via-slate-50 to-transparent'
      }`}>
        <div className="flex flex-col gap-3">
          
          {/* Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {chatChips.map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => setInputVal(chip.replace(/[✨📅📧🔍]\s*/, ''))}
                className={`flex-none px-4 py-2 border rounded-full text-xs font-semibold transition-all whitespace-nowrap active:scale-[0.98] ${
                  isDark 
                    ? 'bg-[#18181b] border-zinc-800 hover:border-violet-500/20 hover:bg-violet-500/10 text-zinc-400' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-purple-50 hover:border-purple-600/20'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className={`shadow-lg rounded-2xl p-2.5 flex items-center gap-2 border transition-all ${
            isDark 
              ? 'bg-zinc-900/50 border-zinc-850 text-white focus-within:ring-2 focus-within:ring-violet-500/10' 
              : 'bg-white border-slate-200 text-slate-700 focus-within:ring-2 focus-within:ring-purple-600/10'
          }`}>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
            
            <input 
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask NeverLate to manage your schedule..."
              className={`flex-1 bg-transparent border-none outline-none text-sm py-2 focus:ring-0 ${
                isDark ? 'text-white placeholder-zinc-550' : 'text-slate-700 placeholder-slate-400'
              }`}
            />

            <button 
              onClick={handleSend}
              className={`p-3 text-white rounded-xl shadow-md transition-all active:scale-[0.95] ${
                isDark 
                  ? 'bg-violet-600 hover:bg-violet-750 shadow-violet-600/10' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/10'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] block">send</span>
            </button>
          </div>

          <p className="text-center text-slate-400 text-[9px] font-bold uppercase tracking-widest">
            NeverLate AI can make mistakes. Verify important appointments.
          </p>
        </div>
      </div>

    </div>
  )
}
export { AIChat }
