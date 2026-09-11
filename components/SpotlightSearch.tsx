'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useOSStore } from '@/store/useOSStore';
import {
  Search,
  Settings as SettingsIcon,
  Globe,
  TerminalSquare,
  Folder,
  Brain,
  LayoutGrid,
  FileText,
  Wifi,
  Bluetooth,
  Moon,
  Volume2,
  Sun,
  Shield,
  HardDrive,
  User,
  Sparkles,
  Calculator,
  ArrowRight,
  ExternalLink,
  Laptop,
  CheckCircle,
  Cloud,
  Clock,
  CloudSun,
  Image as ImageIcon,
  Compass,
} from 'lucide-react';

interface WebResult {
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

interface ImageResult {
  title: string;
  url: string;
  source: string;
  searchUrl?: string;
}

interface IndexItem {
  id: string;
  category: 'Applications' | 'Settings' | 'Files' | 'Calculator' | 'AI Intelligence';
  title: string;
  subtitle: string;
  icon: any;
  color?: string;
  action: () => void;
  badge?: string;
  isToggle?: boolean;
  toggleValue?: boolean;
}

export default function SpotlightSearch() {
  const {
    isSpotlightOpen,
    closeSpotlight,
    openApp,
    systemState,
    updateSystemState,
    setLockScreenVisible,
  } = useOSStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Google & Gemini Search States
  const [webResults, setWebResults] = useState<WebResult[]>([]);
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [geminiSummary, setGeminiSummary] = useState<string | null>(null);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  // Auto focus input on open
  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setAiAnswer(null);
    } else {
      setWebResults([]);
      setImageResults([]);
      setGeminiSummary(null);
    }
  }, [isSpotlightOpen]);

  const handleOnlineSearch = useCallback(async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    setIsSearchingOnline(true);
    try {
      const res = await fetch('/api/gemini/spotlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (data.summary) setGeminiSummary(data.summary);
      if (data.webResults) setWebResults(data.webResults);
      if (data.imageResults) setImageResults(data.imageResults);
    } catch (e) {
      console.error('Spotlight Google/Gemini search error:', e);
    } finally {
      setIsSearchingOnline(false);
    }
  }, [query]);

  // Debounced online search to Google and Gemini
  useEffect(() => {
    const q = query.trim();
    if (!q || q.length < 2) {
      setWebResults([]);
      setImageResults([]);
      setGeminiSummary(null);
      return;
    }

    const timer = setTimeout(() => {
      handleOnlineSearch(q);
    }, 550);

    return () => clearTimeout(timer);
  }, [query, handleOnlineSearch]);

  // Global hotkey Cmd+Space or Ctrl+Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        const state = useOSStore.getState();
        if (state.isSpotlightOpen) {
          state.closeSpotlight();
        } else {
          state.toggleSpotlight();
        }
      } else if (e.key === 'Escape' && useOSStore.getState().isSpotlightOpen) {
        closeSpotlight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSpotlight]);

  // Evaluate simple math calculations (e.g. 24 * 15, 100 / 4, 15% of 300)
  const mathResult = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return null;

    // Handle "X% of Y"
    const percentMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)$/i);
    if (percentMatch) {
      const p = parseFloat(percentMatch[1]);
      const v = parseFloat(percentMatch[2]);
      return ((p / 100) * v).toString();
    }

    // Only attempt arithmetic if query contains valid math chars
    if (/^[0-9+\-*/().\s^%]+$/.test(trimmed) && /[0-9]/.test(trimmed) && /[+\-*/^%]/.test(trimmed)) {
      try {
        // Safe math evaluator using Function with sanitized input
        // Replace ^ with **
        const sanitized = trimmed.replace(/\^/g, '**');
        const res = Function(`'use strict'; return (${sanitized})`)();
        if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
          return res.toLocaleString('en-US', { maximumFractionDigits: 6 });
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [query]);

  // Full Index of Apps, Settings, and Files
  const allIndexedItems: IndexItem[] = useMemo(() => {
    return [
      // --- APPLICATIONS ---
      {
        id: 'app-browser',
        category: 'Applications',
        title: 'Rammerhead Browser',
        subtitle: 'Fast web browsing and proxy',
        icon: Globe,
        color: 'text-blue-400',
        action: () => {
          openApp('browser', 'Browser');
          closeSpotlight();
        },
      },
      {
        id: 'app-settings',
        category: 'Applications',
        title: 'System Settings',
        subtitle: 'Configure Wi-Fi, displays, wallpaper, dock & system',
        icon: SettingsIcon,
        color: 'text-zinc-300',
        action: () => {
          openApp('settings', 'Settings');
          closeSpotlight();
        },
      },
      {
        id: 'app-files',
        category: 'Applications',
        title: 'File Explorer',
        subtitle: 'Browse local files, documents & media',
        icon: Folder,
        color: 'text-amber-400',
        action: () => {
          openApp('files', 'File Explorer');
          closeSpotlight();
        },
      },
      {
        id: 'app-terminal',
        category: 'Applications',
        title: 'Terminal',
        subtitle: 'Command-line bash shell & dev utilities',
        icon: TerminalSquare,
        color: 'text-emerald-400',
        action: () => {
          openApp('terminal', 'Terminal');
          closeSpotlight();
        },
      },
      {
        id: 'app-weather',
        category: 'Applications',
        title: 'Weather',
        subtitle: 'Forecasts, temperature & radar',
        icon: CloudSun,
        color: 'text-sky-400',
        action: () => {
          openApp('weather', 'Weather');
          closeSpotlight();
        },
      },
      {
        id: 'app-clock',
        category: 'Applications',
        title: 'Clock',
        subtitle: 'World clock, stopwatch & timers',
        icon: Clock,
        color: 'text-orange-400',
        action: () => {
          openApp('clock', 'Clock');
          closeSpotlight();
        },
      },
      {
        id: 'app-neuralcore',
        category: 'Applications',
        title: 'Arc AI Neural Core',
        subtitle: 'AI companion, code generator & system diagnostics',
        icon: Brain,
        color: 'text-purple-400',
        action: () => {
          openApp('neuralcore', 'Arc AI');
          closeSpotlight();
        },
      },
      {
        id: 'app-drive',
        category: 'Applications',
        title: 'Google Drive',
        subtitle: 'Cloud storage and synced files',
        icon: Cloud,
        color: 'text-yellow-400',
        action: () => {
          openApp('drive', 'Google Drive');
          closeSpotlight();
        },
      },
      {
        id: 'app-docs',
        category: 'Applications',
        title: 'Google Docs',
        subtitle: 'Document editor & word processing',
        icon: FileText,
        color: 'text-blue-500',
        action: () => {
          openApp('docs', 'Google Docs');
          closeSpotlight();
        },
      },
      {
        id: 'app-slides',
        category: 'Applications',
        title: 'Google Slides',
        subtitle: 'Presentations & slide decks',
        icon: LayoutGrid,
        color: 'text-amber-500',
        action: () => {
          openApp('slides', 'Google Slides');
          closeSpotlight();
        },
      },
      {
        id: 'app-devstudio',
        category: 'Applications',
        title: 'App Dev Studio',
        subtitle: 'Build and run custom sandbox web apps',
        icon: LayoutGrid,
        color: 'text-cyan-400',
        action: () => {
          openApp('devstudio', 'App Dev Studio');
          closeSpotlight();
        },
      },

      // --- SETTINGS (Direct OS Controls) ---
      {
        id: 'setting-wifi',
        category: 'Settings',
        title: 'Wi-Fi Network',
        subtitle: `Currently: ${systemState.wifi ? 'Connected (ArcOS_5G)' : 'Turned Off'}`,
        icon: Wifi,
        color: systemState.wifi ? 'text-blue-400' : 'text-zinc-500',
        badge: systemState.wifi ? 'ON' : 'OFF',
        isToggle: true,
        toggleValue: systemState.wifi,
        action: () => updateSystemState('wifi', !systemState.wifi),
      },
      {
        id: 'setting-bluetooth',
        category: 'Settings',
        title: 'Bluetooth',
        subtitle: `Currently: ${systemState.bluetooth ? 'Discoverable' : 'Disabled'}`,
        icon: Bluetooth,
        color: systemState.bluetooth ? 'text-blue-400' : 'text-zinc-500',
        badge: systemState.bluetooth ? 'ON' : 'OFF',
        isToggle: true,
        toggleValue: systemState.bluetooth,
        action: () => updateSystemState('bluetooth', !systemState.bluetooth),
      },
      {
        id: 'setting-theme',
        category: 'Settings',
        title: 'Appearance & Dark Mode',
        subtitle: `Current Mode: ${systemState.theme.toUpperCase()}`,
        icon: Sun,
        color: 'text-yellow-400',
        badge: systemState.theme === 'dark' ? 'Dark' : 'Light',
        action: () => {
          updateSystemState('theme', systemState.theme === 'dark' ? 'light' : 'dark');
        },
      },
      {
        id: 'setting-nightlight',
        category: 'Settings',
        title: 'Night Shift / Eye Comfort',
        subtitle: `Blue light filter: ${systemState.nightLight ? 'Active' : 'Off'}`,
        icon: Moon,
        color: systemState.nightLight ? 'text-amber-400' : 'text-zinc-500',
        badge: systemState.nightLight ? 'ON' : 'OFF',
        action: () => updateSystemState('nightLight', !systemState.nightLight),
      },
      {
        id: 'setting-dock-autohide',
        category: 'Settings',
        title: 'Auto-hide Dock',
        subtitle: `Dock automatically hides when windows are active: ${systemState.autoHideDock ? 'Enabled' : 'Disabled'}`,
        icon: Laptop,
        color: 'text-indigo-400',
        badge: systemState.autoHideDock ? 'Active' : 'Off',
        action: () => updateSystemState('autoHideDock', !systemState.autoHideDock),
      },
      {
        id: 'setting-wallpaper',
        category: 'Settings',
        title: 'Desktop Wallpapers & Customization',
        subtitle: 'Change wallpapers, Monterey/Sonoma waves, or custom upload',
        icon: LayoutGrid,
        color: 'text-pink-400',
        action: () => {
          openApp('settings', 'Settings');
          closeSpotlight();
        },
      },
      {
        id: 'setting-volume',
        category: 'Settings',
        title: 'Sound & Audio Volume',
        subtitle: `Current Volume Level: ${systemState.volume}%`,
        icon: Volume2,
        color: 'text-emerald-400',
        badge: `${systemState.volume}%`,
        action: () => {
          openApp('settings', 'Settings');
          closeSpotlight();
        },
      },
      {
        id: 'setting-storage',
        category: 'Settings',
        title: 'Storage & Disk Management',
        subtitle: `Using ${systemState.storageUsed} GB of ${systemState.storageTotal} GB`,
        icon: HardDrive,
        color: 'text-purple-400',
        badge: `${systemState.storageUsed}GB`,
        action: () => {
          openApp('settings', 'Settings');
          closeSpotlight();
        },
      },
      {
        id: 'setting-privacy',
        category: 'Settings',
        title: 'Privacy & Security',
        subtitle: 'Camera, Microphone & Location access permissions',
        icon: Shield,
        color: 'text-red-400',
        action: () => {
          openApp('settings', 'Settings');
          closeSpotlight();
        },
      },
      {
        id: 'setting-user',
        category: 'Settings',
        title: 'User Profile & Accounts',
        subtitle: `${systemState.userAccount.name} (${systemState.userAccount.email})`,
        icon: User,
        color: 'text-blue-400',
        action: () => {
          openApp('settings', 'Settings');
          closeSpotlight();
        },
      },
      {
        id: 'setting-beta-blob',
        category: 'Settings',
        title: 'Beta Features & Chrome Blob Mode',
        subtitle: 'Offline Chromium Blob execution & experimental flags',
        icon: Sparkles,
        color: 'text-amber-400',
        badge: 'BETA',
        action: () => {
          openApp('settings', 'Settings');
          closeSpotlight();
        },
      },
      {
        id: 'setting-dock-styles',
        category: 'Settings',
        title: 'Dock Styles (Glass, Big Sur, Neumorphic, Cyberpunk)',
        subtitle: `Current Style: ${systemState.dockStyle || 'macos-glass'}`,
        icon: Laptop,
        color: 'text-indigo-400',
        badge: systemState.dockStyle || 'macos-glass',
        action: () => {
          openApp('settings', 'Settings');
          closeSpotlight();
        },
      },

      // --- DOCUMENTS & FILES ---
      {
        id: 'file-guidelines',
        category: 'Files',
        title: 'System Guidelines.pdf',
        subtitle: 'ArcOS architectural manual & operating principles',
        icon: FileText,
        color: 'text-red-400',
        action: () => {
          openApp('files', 'File Explorer');
          closeSpotlight();
        },
      },
      {
        id: 'file-config',
        category: 'Files',
        title: 'ArcOS Configuration.json',
        subtitle: 'System registry values & settings profile',
        icon: FileText,
        color: 'text-blue-400',
        action: () => {
          openApp('files', 'File Explorer');
          closeSpotlight();
        },
      },
      {
        id: 'file-proposal',
        category: 'Files',
        title: 'Project Proposal.docx',
        subtitle: 'Quarterly technology innovation proposal',
        icon: FileText,
        color: 'text-emerald-400',
        action: () => {
          openApp('docs', 'Google Docs');
          closeSpotlight();
        },
      },
      {
        id: 'file-financials',
        category: 'Files',
        title: 'Financials.xlsx',
        subtitle: 'Operating budget and forecasts',
        icon: FileText,
        color: 'text-green-500',
        action: () => {
          openApp('files', 'File Explorer');
          closeSpotlight();
        },
      },
      {
        id: 'file-welcome',
        category: 'Files',
        title: 'Welcome.txt',
        subtitle: 'Getting started guide for ArcOS Sonoma Edition',
        icon: FileText,
        color: 'text-zinc-300',
        action: () => {
          openApp('files', 'File Explorer');
          closeSpotlight();
        },
      },
    ];
  }, [systemState, updateSystemState, openApp, closeSpotlight]);

  // Filter items according to search query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default recommended top apps & settings
      return allIndexedItems.slice(0, 8);
    }

    return allIndexedItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, allIndexedItems]);

  // Handle AI Search with Gemini
  const handleAskAI = async (customPrompt?: string) => {
    const q = (customPrompt || query).trim();
    if (!q) return;

    setIsAiLoading(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          systemState: {
            theme: systemState.theme,
            volume: systemState.volume,
            wifi: systemState.wifi,
            bluetooth: systemState.bluetooth,
            autoHideDock: systemState.autoHideDock,
          },
        }),
      });

      const data = await res.json();
      setAiAnswer(data.reply || "I analyzed your question.");

      // If AI dispatched an action, execute it!
      if (data.action) {
        if (data.action.type === 'OPEN_APP') {
          openApp(data.action.payload?.appId || 'settings', data.action.payload?.title || 'Settings');
        } else if (data.action.type === 'TOGGLE_DARK_MODE') {
          updateSystemState('theme', systemState.theme === 'dark' ? 'light' : 'dark');
        }
      }
    } catch (e) {
      setAiAnswer(
        `Here is quick information about "${q}": ArcOS is equipped with neural processing and integrated apps. You can launch tools or adjust any system parameters directly from Spotlight!`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (mathResult) {
        // Copy to clipboard or acknowledge
        navigator.clipboard?.writeText(mathResult);
        return;
      }
      if (filteredItems.length > 0 && selectedIndex < filteredItems.length) {
        filteredItems[selectedIndex].action();
      } else if (query.trim()) {
        handleAskAI();
      }
    }
  };

  if (!isSpotlightOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[140] flex items-start justify-center pt-24 bg-black/35 backdrop-blur-sm"
      onClick={closeSpotlight}
    >
      <div
        id="macos-spotlight-window"
        className="w-[660px] max-w-[94vw] bg-zinc-900/85 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 bg-white/5">
          <Search className="text-zinc-400 mr-3.5 shrink-0" size={22} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
              setAiAnswer(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Spotlight Search: search apps, system settings, files, math, or ask AI..."
            className="w-full bg-transparent text-lg text-white placeholder-zinc-400 font-normal outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setAiAnswer(null);
              }}
              className="text-xs text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/10"
            >
              Clear
            </button>
          )}
        </div>

        {/* Live Math Calculator Result */}
        {mathResult !== null && (
          <div className="p-4 bg-purple-950/30 border-b border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Calculator size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest block">
                  Calculation Result
                </span>
                <span className="text-2xl font-bold font-mono text-white tracking-wide">
                  {mathResult}
                </span>
              </div>
            </div>
            <span className="text-xs text-zinc-400 font-mono">Press Enter to copy</span>
          </div>
        )}

        {/* AI Answer Card if active */}
        {aiAnswer && (
          <div className="p-4 bg-gradient-to-br from-purple-900/30 via-zinc-900/40 to-indigo-900/30 border-b border-purple-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles size={16} className="text-purple-400 animate-pulse" />
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Arc AI Spotlight Answer
              </span>
            </div>
            <p className="text-xs text-zinc-100 leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
          </div>
        )}

        {/* Gemini Online Summary Card */}
        {geminiSummary && !aiAnswer && (
          <div className="p-3.5 mx-3 mt-2 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-purple-950/40 border border-blue-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                  Google & Gemini Intelligence
                </span>
              </div>
              {isSearchingOnline && (
                <span className="text-[10px] text-zinc-400 font-mono animate-pulse">
                  Updating live...
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed">{geminiSummary}</p>
          </div>
        )}

        {/* Google Images Result Previews */}
        {imageResults.length > 0 && (
          <div className="px-3 pt-2 pb-1">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <ImageIcon size={13} className="text-pink-400" />
                <span>Google Image Results</span>
              </div>
              <button
                onClick={() => {
                  window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`, '_blank');
                }}
                className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <span>View More</span>
                <ExternalLink size={10} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {imageResults.map((img, idx) => (
                <a
                  key={idx}
                  href={img.searchUrl || `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(img.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-blue-400/50 transition-all bg-zinc-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-16 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5 opacity-90 group-hover:opacity-100">
                    <span className="text-[10px] text-white font-medium line-clamp-1 truncate">
                      {img.title}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-white/5 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-300 border border-white/5'
                      }`}
                    >
                      <Icon size={18} className={isSelected ? 'text-white' : item.color} />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium tracking-tight truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-zinc-800 text-zinc-400 border border-white/5'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <span
                        className={`text-xs truncate ${
                          isSelected ? 'text-white/80' : 'text-zinc-400'
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-3">
                    {item.badge && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-zinc-800 text-zinc-300 border border-white/10'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isSelected && <ArrowRight size={14} className="text-white" />}
                  </div>
                </div>
              );
            })
          ) : null}

          {/* Web Search Results from Google */}
          {webResults.length > 0 && (
            <div className="pt-2">
              <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <div className="flex items-center space-x-1.5">
                  <Compass size={13} className="text-blue-400" />
                  <span>Google & Web Search</span>
                </div>
                <span className="text-[10px] font-normal text-zinc-500 lowercase">
                  powered by Gemini
                </span>
              </div>
              {webResults.map((web, idx) => (
                <a
                  key={idx}
                  href={web.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-400 group-hover:underline font-medium truncate">
                        {web.title}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono truncate">
                        {web.domain}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 line-clamp-2 mt-0.5 leading-snug">
                      {web.snippet}
                    </p>
                  </div>
                  <ExternalLink size={14} className="text-zinc-500 group-hover:text-white shrink-0 mt-1" />
                </a>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && webResults.length === 0 && !isSearchingOnline && (
            <div className="py-8 px-4 text-center">
              <p className="text-sm text-zinc-400 mb-3">
                No local results found for &quot;{query}&quot;
              </p>
              <button
                onClick={() => handleOnlineSearch()}
                disabled={isSearchingOnline}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg transition-all active:scale-95"
              >
                <Sparkles size={14} className={isSearchingOnline ? 'animate-spin' : ''} />
                <span>{isSearchingOnline ? 'Searching Google & Gemini...' : `Search Google & Gemini: "${query}"`}</span>
              </button>
            </div>
          )}
        </div>

        {/* Spotlight Footer */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-zinc-950/60 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-white/10 mr-1">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-white/10 mr-1">
                ↓
              </kbd>
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-white/10 mr-1">
                ↵
              </kbd>
              Open / Execute
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-white/10 mr-1">
                Esc
              </kbd>
              Close
            </span>
          </div>

          <button
            onClick={() => handleAskAI()}
            disabled={isAiLoading || !query.trim()}
            className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 disabled:opacity-40 transition-colors"
          >
            <Sparkles size={12} />
            <span>Ask Gemini AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
