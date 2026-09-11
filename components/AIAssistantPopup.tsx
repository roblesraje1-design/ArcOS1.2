'use client';

import { useState, useRef, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Zap,
  CheckCircle2,
  Settings,
  Volume2,
  Sun,
  Moon,
  Wifi,
  Trash2,
  Laptop
} from 'lucide-react';

interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionExecuted?: string;
}

export default function AIAssistantPopup() {
  const {
    isAIAssistantOpen,
    closeAIAssistant,
    systemState,
    updateSystemState,
    openApp,
    setLockScreenVisible,
    setWallpaper,
  } = useOSStore();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hi! I'm Arc AI, your system assistant. I can answer any question, or control your operating system (toggle dark mode, set volume, launch apps, adjust settings, etc.). What can I do for you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAIAssistantOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isAIAssistantOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isAIAssistantOpen) return null;

  // Execute system action dispatched by AI
  const executeOSAction = (action: { type: string; payload?: any }): string | undefined => {
    if (!action || !action.type) return undefined;

    switch (action.type) {
      case 'OPEN_APP': {
        const appId = action.payload?.appId || 'settings';
        const title = action.payload?.title || appId.charAt(0).toUpperCase() + appId.slice(1);
        openApp(appId, title);
        return `Opened ${title}`;
      }
      case 'TOGGLE_DARK_MODE': {
        const newTheme = systemState.theme === 'dark' ? 'light' : 'dark';
        updateSystemState('theme', newTheme);
        return `Theme set to ${newTheme}`;
      }
      case 'SET_THEME': {
        const theme = action.payload?.theme || 'dark';
        updateSystemState('theme', theme);
        return `Theme switched to ${theme}`;
      }
      case 'SET_VOLUME': {
        const vol = Math.max(0, Math.min(100, Number(action.payload?.volume ?? 70)));
        updateSystemState('volume', vol);
        return `Volume set to ${vol}%`;
      }
      case 'SET_BRIGHTNESS': {
        const br = Math.max(10, Math.min(100, Number(action.payload?.brightness ?? 100)));
        updateSystemState('brightness', br);
        return `Brightness set to ${br}%`;
      }
      case 'TOGGLE_WIFI': {
        const nextWifi = !systemState.wifi;
        updateSystemState('wifi', nextWifi);
        return `Wi-Fi turned ${nextWifi ? 'ON' : 'OFF'}`;
      }
      case 'TOGGLE_BLUETOOTH': {
        const nextBt = !systemState.bluetooth;
        updateSystemState('bluetooth', nextBt);
        return `Bluetooth turned ${nextBt ? 'ON' : 'OFF'}`;
      }
      case 'TOGGLE_NIGHT_LIGHT': {
        const nextNl = !systemState.nightLight;
        updateSystemState('nightLight', nextNl);
        return `Night Shift turned ${nextNl ? 'ON' : 'OFF'}`;
      }
      case 'TOGGLE_AUTOHIDE_DOCK': {
        const nextAh = !systemState.autoHideDock;
        updateSystemState('autoHideDock', nextAh);
        return `Dock auto-hide turned ${nextAh ? 'ON' : 'OFF'}`;
      }
      case 'SET_WALLPAPER': {
        if (action.payload?.url) {
          setWallpaper(action.payload.url);
          return `Changed wallpaper to ${action.payload?.name || 'custom image'}`;
        }
        return undefined;
      }
      case 'LOCK_SCREEN': {
        setLockScreenVisible(true);
        return 'Screen locked';
      }
      default:
        return undefined;
    }
  };

  const handleSend = async (userPrompt?: string) => {
    const textToSend = (userPrompt || input).trim();
    if (!textToSend || loading) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          systemState: {
            theme: systemState.theme,
            volume: systemState.volume,
            brightness: systemState.brightness,
            wifi: systemState.wifi,
            bluetooth: systemState.bluetooth,
            nightLight: systemState.nightLight,
            autoHideDock: systemState.autoHideDock,
            battery: systemState.battery,
          },
        }),
      });

      const data = await res.json();
      let executedActionText: string | undefined = undefined;

      if (data.action) {
        executedActionText = executeOSAction(data.action);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || "Done! Is there anything else you need?",
          actionExecuted: executedActionText,
        },
      ]);
    } catch (err: any) {
      // Intelligent local fallback if offline
      let replyText = "I processed your command locally!";
      let actionText: string | undefined = undefined;
      const lower = textToSend.toLowerCase();

      if (lower.includes('dark mode') || lower.includes('light mode') || lower.includes('theme')) {
        const nextTheme = systemState.theme === 'dark' ? 'light' : 'dark';
        updateSystemState('theme', nextTheme);
        actionText = `Theme switched to ${nextTheme}`;
        replyText = `Switched theme to ${nextTheme} mode for you.`;
      } else if (lower.includes('wifi') || lower.includes('wi-fi')) {
        const nextWifi = !systemState.wifi;
        updateSystemState('wifi', nextWifi);
        actionText = `Wi-Fi turned ${nextWifi ? 'ON' : 'OFF'}`;
        replyText = `Toggled Wi-Fi to ${nextWifi ? 'ON' : 'OFF'}.`;
      } else if (lower.includes('settings')) {
        openApp('settings', 'Settings');
        actionText = 'Opened Settings';
        replyText = "Opened System Settings for you.";
      } else if (lower.includes('weather')) {
        openApp('weather', 'Weather');
        actionText = 'Opened Weather';
        replyText = "Opened the Weather forecast.";
      } else if (lower.includes('volume')) {
        const match = lower.match(/\d+/);
        const val = match ? parseInt(match[0]) : 75;
        updateSystemState('volume', val);
        actionText = `Volume set to ${val}%`;
        replyText = `Set your system volume to ${val}%.`;
      } else if (lower.includes('dock')) {
        const nextAh = !systemState.autoHideDock;
        updateSystemState('autoHideDock', nextAh);
        actionText = `Dock auto-hide turned ${nextAh ? 'ON' : 'OFF'}`;
        replyText = `Dock auto-hide is now ${nextAh ? 'active' : 'disabled'}.`;
      } else {
        replyText = `I heard: "${textToSend}". I can control your system settings, launch apps, or answer any technical or general knowledge questions!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          actionExecuted: actionText,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Turn on Night Light', icon: Moon, action: 'Turn on Night Light' },
    { label: 'Set Volume to 80%', icon: Volume2, action: 'Set volume to 80%' },
    { label: 'Open Settings', icon: Settings, action: 'Open Settings app' },
    { label: 'Toggle Wi-Fi', icon: Wifi, action: 'Toggle Wi-Fi' },
    { label: 'Toggle Dark Mode', icon: Sun, action: 'Toggle dark mode' },
    { label: 'Auto-hide Dock', icon: Laptop, action: 'Toggle auto hide dock' },
  ];

  return (
    <div
      id="macos-ai-assistant-popup"
      className="fixed top-9 right-4 w-96 max-w-[92vw] h-[520px] z-[130] flex flex-col overflow-hidden rounded-2xl border border-purple-500/30 bg-zinc-900/90 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-purple-900/40 via-zinc-900/40 to-indigo-900/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/30">
            <Sparkles size={15} className="text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-white tracking-wide">Arc AI Assistant</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                Pro
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">OS Actions & General Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setMessages([messages[0]])}
            title="Clear Chat"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={closeAIAssistant}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[85%] ${
                m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 shadow ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                }`}
              >
                {m.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>

              <div className="flex flex-col space-y-1">
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed font-normal break-words ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800/80 border border-white/10 text-zinc-100 shadow-sm'
                  }`}
                >
                  {m.text}
                </div>

                {m.actionExecuted && (
                  <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-medium px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 w-fit">
                    <CheckCircle2 size={12} />
                    <span>{m.actionExecuted}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-purple-300">
              <Sparkles size={13} className="animate-spin text-purple-400" />
              <span>Thinking & processing OS request...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-3 py-1.5 border-t border-white/5 bg-zinc-950/40 flex items-center space-x-1.5 overflow-x-auto custom-scrollbar shrink-0">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.action)}
            disabled={loading}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-purple-600/30 hover:border-purple-500/40 border border-white/10 text-[10px] text-zinc-300 whitespace-nowrap transition-all active:scale-95 shrink-0"
          >
            <q.icon size={11} className="text-purple-400" />
            <span>{q.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-white/10 bg-zinc-950/70 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything or control the OS..."
            className="w-full bg-zinc-800/70 border border-white/15 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-zinc-400 outline-none focus:border-purple-500/70 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white transition-all shadow-md active:scale-90"
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}
