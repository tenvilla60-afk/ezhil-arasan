import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, RotateCcw, Headphones, Briefcase, HelpCircle, MessageSquare } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { PLATFORM_IMAGES } from '../types/platform';
import { ResilientImage } from '../components/ResilientImage';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const MODES = [
  { id: 'support', label: 'Customer Support', icon: Headphones },
  { id: 'business', label: 'Business Assistant', icon: Briefcase },
  { id: 'qa', label: 'Technical Q&A', icon: HelpCircle },
  { id: 'sales', label: 'Solutions Concierge', icon: MessageSquare },
] as const;

const QUICK_PROMPTS: Record<string, string[]> = {
  support: [
    'How do I complete a UPI scanner subscription payment?',
    'Where can I check my order verification status?',
    'What is included in the Starter vs Growth plan?',
  ],
  business: [
    'Draft a 90-day customer acquisition roadmap for an apparel brand.',
    'How can AI automation cut weekly support overhead by 40%?',
    'Suggest 3 KPIs to monitor across e-commerce and CRM.',
  ],
  qa: [
    'How does EZ AI WORLD isolate customer data across accounts?',
    'Explain how automated email triage connects to our CRM.',
    'What video script formats work best for product launches?',
  ],
  sales: [
    'Which EZ AI WORLD plan fits a 12-person retail business?',
    'Summarize all five business divisions in one executive brief.',
    'How do affiliate promotions work in Online Shopping?',
  ],
};

export function AiRobotPage() {
  const { incrementAiCredits, authUser, navigate } = usePlatform();
  const [mode, setMode] = useState<'support' | 'business' | 'qa' | 'sales'>('business');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Welcome to the EZ AI WORLD Robot Assistant. Select an assistant role above and ask any customer support, business strategy, or technical question.',
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    setError('');
    const userMsg: ChatMessage = { id: `u_${Date.now()}`, role: 'user', text: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          mode,
          history: nextMessages.slice(-8).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Assistant service returned an error.');
      }

      setMessages((prev) => [
        ...prev,
        { id: `m_${Date.now()}`, role: 'model', text: data.reply },
      ]);
      if (authUser) {
        await incrementAiCredits(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach AI Robot Assistant.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="bg-[#060913] min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-10 border-b border-white/10">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-medium text-blue-400">Division 01 · AI Robot Assistant</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Intelligent conversational systems for support, Q&amp;A, and strategy.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Deploy a multi-role AI Robot Assistant trained on your operations—handling tier-1 customer support, complex question answering, and executive decision support in real time.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0C1324]">
              <ResilientImage
                src={PLATFORM_IMAGES.robotHardware}
                alt="AI Robot Hardware Interface"
                className="w-full h-52 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Interactive Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Rail: Role & Prompts */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5 space-y-3">
              <h2 className="text-sm font-semibold text-white">Assistant Role</h2>
              <div className="space-y-1.5">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const active = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg transition-colors text-left ${
                        active
                          ? 'bg-blue-600 text-white font-medium'
                          : 'bg-[#060913] text-slate-300 hover:bg-white/5 border border-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5 space-y-3">
              <h2 className="text-sm font-semibold text-white">Suggested Queries</h2>
              <div className="space-y-2">
                {QUICK_PROMPTS[mode].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-300 bg-[#060913] hover:bg-white/5 border border-white/10 rounded-lg transition-colors leading-relaxed"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {!authUser && (
              <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sign in to track AI Robot usage credits inside your Customer Dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('auth')}
                  className="w-full px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </aside>

          {/* Right Chat Viewport */}
          <div className="lg:col-span-8 bg-[#0C1324] border border-white/10 rounded-xl flex flex-col h-[580px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-blue-400" />
                <div>
                  <h2 className="text-sm font-semibold text-white">EZ AI Robot Console</h2>
                  <p className="text-xs text-slate-400">
                    Active role: {MODES.find((m) => m.id === mode)?.label}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      id: 'reset',
                      role: 'model',
                      text: 'Conversation cleared. How can EZ AI WORLD assist you now?',
                    },
                  ])
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#060913] border border-white/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#060913] border border-white/10 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#060913] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-400">
                    Generating response...
                  </div>
                </div>
              )}
              {error && (
                <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-500/30 rounded-lg p-3">
                  {error}
                </div>
              )}
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="p-4 border-t border-white/10 flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a customer support, Q&A, or business strategy question..."
                className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
