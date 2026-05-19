'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOSStore } from '@/store/useOSStore';
import { 
  User, 
  Lock, 
  Sun, 
  Moon, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Monitor, 
  Gamepad, 
  Code, 
  PenTool, 
  GraduationCap, 
  Tv, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  HardDrive,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';

export default function OOBEScreen() {
  const { systemState, updateSystemState, setWallpaper, setAccentColor, wallpaper } = useOSStore();
  
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState('Jack Purton');
  const [uemail, setUemail] = useState('jack.purton@arcos.io');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'glass'>('dark');
  
  // Wallpapers matching Settings
  const wallpapers = [
    { name: 'Abstract Glow', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', color: '#8b5cf6' },
    { name: 'Emerald Flow', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2548&auto=format&fit=crop', color: '#10b981' },
    { name: 'Ocean Mist', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop', color: '#0ea5e9' },
    { name: 'Dark Aurora', url: 'https://images.unsplash.com/photo-1541450805268-4822a3a774ce?q=80&w=2670&auto=format&fit=crop', color: '#4f46e5' },
    { name: 'Deep Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop', color: '#312e81' },
    { name: 'Sunset Gradient', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop', color: '#f59e0b' },
  ];
  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapers[0]);

  // Optional features state
  const [aiCore, setAiCore] = useState(true);
  const [widgetsCenter, setWidgetsCenter] = useState(true);
  const [perfBoost, setPerfBoost] = useState(true);
  const [devTools, setDevTools] = useState(false);

  // Purposes (At least 7 options)
  const purposes = [
    { id: 'gaming', label: 'Gaming & Performance', desc: 'Optimize high frame rates and gaming services', icon: Gamepad },
    { id: 'dev', label: 'Software Development', desc: 'Pre-compile shells, text compiler, and debugger', icon: Code },
    { id: 'creative', label: 'Creative Design & Arts', desc: 'Calibrate canvas colors, workspace, and vector rendering', icon: PenTool },
    { id: 'study', label: 'Study & Academic Research', desc: 'Configure document libraries and reference notes helper', icon: GraduationCap },
    { id: 'entertainment', label: 'Video Streaming & Media', desc: 'Fine-tune surround audio, Dolby layout, and player tools', icon: Tv },
    { id: 'web', label: 'General Web Browsing', desc: 'Set up ad blockers, private search, and cloud links', icon: Globe },
    { id: 'ai', label: 'AI & Machine Intelligence', desc: 'Activate Kai assistance, html model generators, and diagnostic agents', icon: BrainCircuit },
  ];
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(['ai', 'web']);

  // Loading phase for Page 7
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips = [
    "Tip: Look to the right side of the taskbar. Quick Settings gives easy access to Wi-Fi, volume, brightness and battery states!",
    "Tip: Enable AI Core in Settings to unlock Kai, your smart systems helper, inside the AI Core suite and File Explorer!",
    "Tip: Did you know? You can snap any active window to halves or quadrant tiles by hovering over the maximize window button!",
    "Tip: Double-click any compiled HTML app file in File Explorer to install it directly as a shortcut on your OS Workspace.",
    "Tip: You can change the desktop background and theme tone with the Personalization Center inside Settings.",
    "Tip: Press the Start Button on the central taskbar to access the systems utility index, launch Terminal, and search files.",
    "Tip: ArcOS contains a native Tips Guide App built to assist you in mastering the operational commands.",
    "Tip: Finalizing kernel compilation blocks and syncing user synchronization profiles to local state database."
  ];

  useEffect(() => {
    if (page !== 7) return;

    // Load progress of exactly 20 seconds (20000ms)
    // 20000ms / 100% = 200ms per 1% increment
    const interval = setInterval(() => {
      setLoadPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Commiting OOBE Configuration to useOSStore
            updateSystemState('username', username);
            updateSystemState('uemail', uemail);
            updateSystemState('password', pin || null);
            updateSystemState('theme', themeMode);
            updateSystemState('aiCoreEnabled', aiCore);
            updateSystemState('widgetsVisible', widgetsCenter);
            updateSystemState('developerMode', devTools);
            updateSystemState('osPurpose', selectedPurposes);
            
            // Set wallpaper
            setWallpaper(selectedWallpaper.url);
            setAccentColor(selectedWallpaper.color);

            // Complete OOBE
            updateSystemState('isOOBECompleted', true);
          }, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 200);

    // Tip slider every 3.3 seconds (3300ms)
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 3300);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, [page]);

  const togglePurpose = (id: string) => {
    if (selectedPurposes.includes(id)) {
      setSelectedPurposes(selectedPurposes.filter(p => p !== id));
    } else {
      setSelectedPurposes([...selectedPurposes, id]);
    }
  };

  const handleNextPage = () => {
    if (page === 2) {
      if (pin && pin !== confirmPin) {
        setPinError("Passwords/PINs do not match. Please verify.");
        return;
      }
      setPinError('');
    }
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (systemState.isOOBECompleted) return null;

  return (
    <div id="oobe-setup-screen" className="fixed inset-0 z-[200000] bg-zinc-950 text-white font-sans flex items-center justify-center overflow-auto p-4 md:p-12 select-none">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden h-auto md:h-[650px]">
        
        {/* Left Side: Progress & Info */}
        <div className="w-full md:w-80 bg-zinc-900/60 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
          <div>
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
                <div className="bg-blue-600 rounded-sm" />
                <div className="bg-blue-500 rounded-sm" />
                <div className="bg-blue-400 rounded-sm" />
                <div className="bg-blue-300 rounded-sm" />
              </div>
              <span className="font-bold tracking-widest text-[#bfdbfe] uppercase text-sm">ArcOS Core</span>
            </div>

            <h2 className="text-xl font-bold text-zinc-100 mb-2">OS Personalization</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">Let&apos;s personalize your operating system environment. This takes only a minute.</p>
          </div>

          {page < 7 && (
            <div className="mt-8 md:mt-0 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Installation Setup Progress</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      page >= idx ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-zinc-800'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-xs text-blue-400 font-bold">Step {page} of 6</span>
            </div>
          )}

          <div className="hidden md:block text-[10px] text-zinc-600 font-mono tracking-wide mt-4">
            ArcOS_SETUP_KERNEL_VER_10.0
          </div>
        </div>

        {/* Right Side: Page Contents */}
        <div className="flex-1 flex flex-col justify-between p-8 md:p-12 min-w-0">
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {/* PAGE 1: Username & Setup Identity */}
                {page === 1 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center space-x-3">
                      <User className="text-blue-400" size={24} />
                      <span>Establish User Profile</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mb-8">Type your primary username and system email to personalize accounts and directories.</p>
                    
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 ml-1">Username</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                          <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Type user account name"
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 ml-1">Associated Email (Optional)</label>
                        <input 
                          type="email" 
                          value={uemail} 
                          onChange={(e) => setUemail(e.target.value)}
                          placeholder="your-name@arcos.io"
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 2: Password protection */}
                {page === 2 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center space-x-3">
                      <Lock className="text-blue-400" size={24} />
                      <span>Set Secure Login PIN</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mb-8">Secure your desktop session with a password lock screen. Keep it empty to log in directly.</p>

                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 ml-1">PIN / Password</label>
                        <input 
                          type="password" 
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          placeholder="Password (e.g., 1234)"
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 ml-1">Confirm PIN / Password</label>
                        <input 
                          type="password" 
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          placeholder="Confirm security PIN"
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                        />
                      </div>

                      {pinError && (
                        <p className="text-xs text-red-400 font-bold bg-red-500/5 border border-red-500/10 rounded-lg p-2.5 mt-2">{pinError}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* PAGE 3: Dark/Light Theme selection */}
                {page === 3 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center space-x-3">
                      <Sun className="text-yellow-400" size={24} />
                      <span>Choose Operational Theme</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mb-8">Pick your preferred interface aesthetic. This can be re-calibrated any time.</p>

                    <div className="grid grid-cols-2 gap-4 max-w-md">
                      <button 
                        onClick={() => {
                          setThemeMode('dark');
                          updateSystemState('theme', 'dark');
                        }}
                        className={`flex flex-col items-center justify-center p-6 border rounded-2xl gap-3 transition-all ${
                          themeMode === 'dark' 
                            ? 'bg-blue-500/10 border-blue-500 shadow-xl' 
                            : 'bg-black/20 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-blue-400">
                          <Moon size={24} />
                        </div>
                        <span className="text-sm font-bold">Dark Mode</span>
                        <span className="text-[10px] text-zinc-500">Premium contrast</span>
                      </button>

                      <button 
                        onClick={() => {
                          setThemeMode('light');
                          updateSystemState('theme', 'light');
                        }}
                        className={`flex flex-col items-center justify-center p-6 border rounded-2xl gap-3 transition-all ${
                          themeMode === 'light' 
                            ? 'bg-blue-500/10 border-blue-500 shadow-xl' 
                            : 'bg-black/20 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800">
                          <Sun size={24} />
                        </div>
                        <span className="text-sm font-bold">Light Mode</span>
                        <span className="text-[10px] text-zinc-500">Crisp and vibrant</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PAGE 4: Wallpaper set */}
                {page === 4 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center space-x-3">
                      <Monitor className="text-blue-400" size={24} />
                      <span>Select Desk Wallpaper</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mb-6">Choose a backdrop that fits your personality.</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {wallpapers.map((w) => (
                        <button
                          key={w.name}
                          onClick={() => setSelectedWallpaper(w)}
                          className={`group flex flex-col text-left space-y-1.5 focus:outline-none`}
                        >
                          <div className={`aspect-video w-full rounded-xl overflow-hidden border duration-200 relative ${
                            selectedWallpaper.name === w.name ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-white/10 hover:border-white/20'
                          }`}>
                            <img src={w.url} alt={w.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            {selectedWallpaper.name === w.name && (
                              <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">{w.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PAGE 5: Optional Features */}
                {page === 5 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center space-x-3">
                      <Sparkles className="text-blue-400" size={24} />
                      <span>Optional Enhancements</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mb-6 font-medium">Activate auxiliary features for intelligent experiences, widgets, and sandbox compilers.</p>

                    <div className="space-y-3 max-w-xl">
                      {/* AI CORE TOGGLE */}
                      <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl">
                        <div className="flex items-start space-x-3.5 pr-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles size={20} />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">Intelligence AI Core (Highly Recommended)</span>
                            <span className="text-[11px] text-zinc-400 leading-relaxed block">Unlocks chatbot Kai, file assistants, HTML generators, and custom installations across the system.</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setAiCore(!aiCore)}
                          className={`w-12 h-6 rounded-full p-1 shrink-0 transition-colors relative ${aiCore ? 'bg-purple-600' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${aiCore ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* WIDGETS TOGGLE */}
                      <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl">
                        <div className="flex items-start space-x-3.5 pr-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Monitor size={20} />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">Desktop Widget Space</span>
                            <span className="text-[11px] text-zinc-400 block">Deploy responsive monitors on the desk workspace (Weather, CPU, Power, Custom Images).</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setWidgetsCenter(!widgetsCenter)}
                          className={`w-12 h-6 rounded-full p-1 shrink-0 transition-colors relative ${widgetsCenter ? 'bg-blue-600' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${widgetsCenter ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* THERMALS FOR PERFORMANCE */}
                      <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl">
                        <div className="flex items-start space-x-3.5 pr-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Cpu size={20} />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">Hyper Performance Booster</span>
                            <span className="text-[11px] text-zinc-400 block">Allocate maximum memory buffers for browser rendering and app compilation modules.</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setPerfBoost(!perfBoost)}
                          className={`w-12 h-6 rounded-full p-1 shrink-0 transition-colors relative ${perfBoost ? 'bg-blue-600' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${perfBoost ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 6: What are you going to use this OS for options (7 Options Checklist) */}
                {page === 6 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center space-x-3">
                      <ShieldCheck className="text-blue-400" size={24} />
                      <span>Select Operating Purpose</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mb-6">Choose how you plan to navigate this terminal. Select at least 1 or multiple options (7 available).</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-2">
                      {purposes.map((p) => {
                        const Icon = p.icon;
                        const isSelected = selectedPurposes.includes(p.id);
                        return (
                          <div 
                            key={p.id}
                            onClick={() => togglePurpose(p.id)}
                            className={`flex items-start space-x-3.5 p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-blue-600/10 border-blue-500 shadow-sm' 
                                : 'bg-black/10 border-white/5 hover:bg-white/5'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-white block leading-tight truncate">{p.label}</span>
                              <span className="text-[10px] text-zinc-400 leading-tight block line-clamp-1 mt-0.5">{p.desc}</span>
                            </div>
                            <div className={`w-4 shadow-inner h-4 border rounded mt-1 flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-blue-600 border-blue-500' : 'border-zinc-700 bg-black/20'
                            }`}>
                              {isSelected && <Check size={11} className="text-white" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PAGE 7: loading device screen (Takes exactly 20 seconds, rotating tips) */}
                {page === 7 && (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="relative w-24 h-24 mb-6">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 border-l-2 border-r-2 border-transparent"
                      />
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-white">
                        {loadPercentage}%
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-100 mb-2">Compiling System Components...</h3>
                    <p className="text-xs text-zinc-500 font-mono mb-8">BUILD_NUMBER {systemState.buildNumber} / TARGET_SPEC: {username.toUpperCase()}_PC</p>

                    <div className="w-full max-w-md bg-zinc-800/50 h-2 rounded-full overflow-hidden mb-6 shadow-inner border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full duration-200 shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-[width]" 
                        style={{ width: `${loadPercentage}%` }}
                      />
                    </div>

                    <div className="min-h-12 max-w-lg bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex items-start space-x-3.5 mx-auto">
                      <Lightbulb className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={currentTipIndex}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-left text-xs text-zinc-300 leading-relaxed font-medium"
                        >
                          {tips[currentTipIndex]}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          {page < 7 && (
            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6 shrink-0">
              <button 
                onClick={handlePrevPage}
                disabled={page === 1}
                className="flex items-center space-x-2 text-xs font-bold text-zinc-500 hover:text-white disabled:opacity-0 cursor-pointer disabled:pointer-events-none transition-colors border border-transparent px-4 py-2.5 rounded-xl hover:bg-white/5 uppercase tracking-widest"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <button 
                onClick={handleNextPage}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
              >
                <span>{page === 6 ? "Finish Setup" : "Next"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
