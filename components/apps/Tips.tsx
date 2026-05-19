'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  Monitor, 
  UserCheck, 
  Terminal, 
  BookOpen,
  ArrowRight,
  Plus,
  Compass,
  FileText,
  Clock,
  CheckCircle,
  Cpu,
  Bookmark
} from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';

export default function Tips() {
  const { systemState, openApp } = useOSStore();
  const [activeCategory, setActiveCategory] = useState<'welcome' | 'navigation' | 'aicore' | 'widgets' | 'windowing' | 'changelog'>('welcome');

  const changelogs = [
    {
      version: "ArcOS Pro v2.1.0",
      date: "June 2026",
      status: "Latest Update",
      changes: [
        "Added Out-of-Box Experience (OOBE) Setup sequence: 7 complete customizable visual pages for credentials, protection, styling presets, OS purposes, and automated compiler loaders.",
        "Created native 16-second bootloader screen with modern system-status animations on every startup load.",
        "Expanded AI Core capabilities: Deep integration of Kai Conversational Systems Assistant and automated Gemini-powered HTML app compilers into the operating system.",
        "Integrated an AI Search Finder inside the File Explorer app to locate and list file types using natural language commands.",
        "Engineered automatic App Boot Screens and Update Splash alerts in all windows to streamline application loading experiences.",
        "Created Tips App as a detailed instruction manual and dynamic changelog tracker."
      ]
    },
    {
      version: "ArcOS v1.8.4",
      date: "May 2026",
      status: "Stable Patch",
      changes: [
        "Added Personalized Right-Click menu option displaying 20 unsplash backgrounds and calendar/music desktop widgets.",
        "Optimized Neural Core diagnostic models to display localized resource parameters and CPU throttle logs.",
        "Integrated custom PIN protection configurations inside the visual Settings layout.",
        "Fixed cursor selection bubbles and browser-level default contextual popups for desktop layers."
      ]
    },
    {
      version: "ArcOS Base v1.0.0",
      date: "April 2026",
      status: "Initial Kernel Core",
      changes: [
        "Implemented original window management system with drag, minimize, maximize, and resize controls.",
        "Engineered basic File Explorer with navigation history, folders, and native file creation tools.",
        "Added web browser app with iframe execution and address bar simulation.",
        "Established Zustand central OS State Store synchronized with client-side localStorage properties."
      ]
    }
  ];

  const guides = {
    welcome: {
      title: "Welcome to ArcOS Pro",
      subtitle: "The next-generation intelligent web operating system.",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Welcome, <span className="text-blue-400 font-bold">{systemState.userAccount.name}</span>! ArcOS is designed to bring a high-fidelity, fully functioning Windows 11-style desktop experience directly to your browser page.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">System Diagnostics</span>
              <p className="text-[11px] text-zinc-400">Your OS is running on an active <span className="text-zinc-300 font-medium">Neural Core Sandbox</span> with activated performance boosters.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">AI Integrations</span>
              <p className="text-[11px] text-zinc-400">AI Core is currently <span className="text-green-400 font-bold">{systemState.aiCoreEnabled ? "ONLINE" : "OFFLINE"}</span>. Chatbot Kai and the HTML Maker are ready to assist.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 border border-blue-500/20 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Need high-intelligence answers?</span>
              <span className="text-[10px] text-zinc-400 block">Launch Kai Chat inside AI Core to ask any technical diagnostic, general conversation, or app-building questions.</span>
            </div>
            <button onClick={() => openApp('neuralcore', 'Neural AI Core')} className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 text-xs font-bold transition-all shrink-0">
              <span>Open AI Core</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )
    },
    navigation: {
      title: "Interface Navigation & Quick Settings",
      subtitle: "Effortlessly control systems audio, brightness, and applications.",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">1. The Start Menu</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">Click the central Start icon on the taskbar to summon the applications drawer. Here, you can search for Settings, Browser, Terminal, Files, or Neural Core instantly.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">2. Quick Settings Dashboard</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">Click on the battery, volume, or network icons on the bottom-right clock bar. It displays a visual popover to toggle Wi-Fi, control sound volume, adjust screen brightness, enable night light filters, or view battery percentages.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">3. Personalized Right Click</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">Right-click on the desktop. The personalizer option displays a panel of 20 high-definition backgrounds and modular widgets (Music, Calendars, Notes) that can be instantly drag-mounted on the desktop.</p>
          </div>
        </div>
      )
    },
    aicore: {
      title: "Explaining the AI Core Suite",
      subtitle: "Kai conversational helper, file searching assistants, and dynamic app compilation.",
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-zinc-300 leading-relaxed">Enabled in settings, the **Intelligence AI Core** empowers your operating system with highly synchronized tools:</p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center space-x-1">
              <Sparkles size={14}/> <span>Chatbot Kai</span>
            </span>
            <p className="text-zinc-400 leading-normal">A witty, conversational, and helper chatbot built directly inside the Neural AI Core app. Kai can talk about systems engineering, explain physics, tell stories, and assist in running virtual ArcOS nodes.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center space-x-1">
              <Cpu size={14}/> <span>HTML Application Compiler</span>
            </span>
            <p className="text-zinc-400 leading-normal">Unlocks a prompt-powered App Creator in AI Core. Type what you need, e.g., <span className="text-zinc-300 font-mono italic">&quot;create a painting app&quot;</span> or <span className="text-zinc-300 font-mono italic">&quot;create a calculator&quot;</span>. It will build code, display a live-rendered visual preview in an iframe, and provide an <span className="text-blue-400 font-bold">Install App</span> shortcut directly on the workspace desktop!</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center space-x-1">
              <FileText size={14}/> <span>File Explorer AI Assistant</span>
            </span>
            <p className="text-zinc-400 leading-normal">Located in the left sidebar of the Files app, you can write natural commands like <span className="text-zinc-300 font-mono italic">&quot;find images&quot;</span>, <span className="text-zinc-300 font-mono italic">&quot;list txt documents&quot;</span>, or <span className="text-zinc-300 font-mono italic">&quot;what files are in doc_dir?&quot;</span> to immediately filter, match, and open documents.</p>
          </div>
        </div>
      )
    },
    widgets: {
      title: "Desktop Widgets & Customization",
      subtitle: "Inject widgets and change styles to make ArcOS yours.",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300 leading-relaxed">A beautifully synchronized desktop layout keeps your workflow organized. Personalize it perfectly with these widgets:</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Battery Meter</span>
              <p className="text-[10px] text-zinc-500">Track power diagnostics on the desktop grid.</p>
            </div>
            <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block">Weather Panel</span>
              <p className="text-[10px] text-zinc-500 font-medium">Real-time localized meteorological forecasts.</p>
            </div>
            <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block">Custom Photos</span>
              <p className="text-[10px] text-zinc-500">Embed specific, premium graphics and photos directly.</p>
            </div>
          </div>
          <p className="text-xs text-zinc-400">Simply right-click on the desktop, select <span className="text-zinc-200 font-semibold">Personalize</span>, select wallpaper, or click on default widgets cards to pop them on the screen!</p>
        </div>
      )
    },
    windowing: {
      title: "Advanced Windowing & Snapping Grid",
      subtitle: "Hover over controls or drag to tiles to resize.",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300 leading-relaxed">
            Boost your productivity by multitasking across multiple applications with Windows snapping:
          </p>
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
            <span className="text-xs font-bold text-blue-400 uppercase block">Snap Split Commands:</span>
            <ul className="list-disc pl-4 space-y-2 text-[11px] text-zinc-400 leading-relaxed">
              <li><span className="text-zinc-200 font-semibold">Half-Screen Tiles:</span> Drag the window toward the left or right edges. A semi-transparent overlay preview expands indicating a 50% split. Let go to snap instantly!</li>
              <li><span className="text-zinc-200 font-semibold">Hover Maximize Shortcut:</span> Right-click the header bar of any window to select Snap Left, Snap Right, or Maximize tiles.</li>
              <li><span className="text-zinc-200 font-semibold">Quadrant Tiles:</span> Drag windows toward top-left, top-right, bottom-left, or bottom-right corners to divide the display screen into 4 quad quadrants.</li>
            </ul>
          </div>
        </div>
      )
    },
    changelog: {
      title: "OS Changelog Directory",
      subtitle: "Chronological documentation of added features, patches, and integrations.",
      content: (
        <div className="space-y-5 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {changelogs.map((cl, idx) => (
            <div key={idx} className="border-l-2 border-blue-500/30 pl-4 space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-white block">{cl.version}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-800 py-0.5 px-2 rounded">{cl.date}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#93c5fd] bg-blue-500/10 py-0.5 px-2 rounded">{cl.status}</span>
              </div>
              <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-zinc-400 leading-normal">
                {cl.changes.map((change, cIdx) => (
                  <li key={cIdx}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
    }
  };

  const activeGuide = guides[activeCategory];

  return (
    <div className="flex h-full bg-zinc-950 text-white font-sans overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <div className="w-60 border-r border-white/5 bg-zinc-900/40 flex flex-col p-4 shrink-0">
        <div className="flex items-center space-x-2.5 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
            <Lightbulb size={22} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Tips Guide</span>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">SYS_DOCS_v2.1</span>
            </div>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          <button 
            onClick={() => setActiveCategory('welcome')}
            className={`flex w-full items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeCategory === 'welcome' ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass size={16} />
            <span>Welcome Setup</span>
          </button>

          <button 
            onClick={() => setActiveCategory('navigation')}
            className={`flex w-full items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeCategory === 'navigation' ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers size={16} />
            <span>Navigation</span>
          </button>

          <button 
            onClick={() => setActiveCategory('aicore')}
            className={`flex w-full items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeCategory === 'aicore' ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles size={16} />
            <span>AI Core Suite</span>
          </button>

          <button 
            onClick={() => setActiveCategory('widgets')}
            className={`flex w-full items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeCategory === 'widgets' ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor size={16} />
            <span>Widgets Panel</span>
          </button>

          <button 
            onClick={() => setActiveCategory('windowing')}
            className={`flex w-full items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeCategory === 'windowing' ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HelpCircle size={16} />
            <span>Window Snapping</span>
          </button>

          <button 
            onClick={() => setActiveCategory('changelog')}
            className={`flex w-full items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeCategory === 'changelog' ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen size={16} />
            <span>What was added</span>
          </button>
        </nav>

        <div className="mt-auto p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center gap-3">
          <CheckCircle size={18} className="text-amber-400 shrink-0" />
          <div className="min-w-0">
             <span className="text-[10px] uppercase font-bold text-amber-500 block">Verified Build</span>
             <span className="text-[9px] text-zinc-500 block truncate font-mono">22621.1702_PRO</span>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="flex-1 overflow-y-auto p-10 flex flex-col justify-between bg-gradient-to-b from-transparent to-amber-950/5 min-w-0">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 mb-1">
             <Bookmark size={14} className="text-amber-500" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Official ArcDoc Reference</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{activeGuide.title}</h1>
          <p className="text-xs text-zinc-400 mb-8 mt-1 pr-6 font-medium">{activeGuide.subtitle}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeGuide.content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 border-t border-white/5 pt-4 flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest font-mono shrink-0">
           <span>ArcOS documentation terminal</span>
           <span>v2.1Stable_Active</span>
        </div>
      </div>
    </div>
  );
}
