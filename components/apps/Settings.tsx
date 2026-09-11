'use client';

import { useState } from 'react';
import { useOSStore } from '@/store/useOSStore';
import {
  Monitor,
  Wifi,
  Bluetooth,
  User,
  AppWindow,
  Settings as SettingsIcon,
  Lock,
  Search,
  ChevronRight,
  Sun,
  Moon,
  Volume2,
  Battery,
  HardDrive,
  Info,
  Check,
  RefreshCcw,
  Shield,
  Clock,
  Palette,
  Layout,
  Zap,
  Sparkles,
  Sliders,
  Laptop,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Bell,
  Cpu,
  Radio,
  Eye,
  Key,
  FlaskConical,
  Download,
  Layers,
  Box,
  Terminal,
  Bookmark,
  Globe
} from 'lucide-react';

const ACCENT_COLORS = [
  { name: 'Blue', hex: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Purple', hex: '#a855f7', bg: 'bg-purple-500' },
  { name: 'Pink', hex: '#ec4899', bg: 'bg-pink-500' },
  { name: 'Red', hex: '#ef4444', bg: 'bg-red-500' },
  { name: 'Orange', hex: '#f97316', bg: 'bg-orange-500' },
  { name: 'Yellow', hex: '#eab308', bg: 'bg-yellow-500' },
  { name: 'Green', hex: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Graphite', hex: '#71717a', bg: 'bg-zinc-500' },
];

const WALLPAPERS = [
  {
    name: 'macOS Monterey Wave',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    tag: 'Classic'
  },
  {
    name: 'Sonoma Horizon',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop',
    tag: 'Dynamic'
  },
  {
    name: 'Ventura Bloom',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
    tag: 'Graphic'
  },
  {
    name: 'Emerald Aurora',
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2548&auto=format&fit=crop',
    tag: 'Nature'
  },
  {
    name: 'Deep Space Nebula',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
    tag: 'Space'
  },
  {
    name: 'Dark Minimalist',
    url: 'https://images.unsplash.com/photo-1541450805268-4822a3a774ce?q=80&w=2670&auto=format&fit=crop',
    tag: 'Dark'
  }
];

export default function Settings({ defaultTab }: { defaultTab?: string } = {}) {
  const {
    systemState,
    updateSystemState,
    wallpaper,
    setWallpaper,
    accentColor,
    setAccentColor,
    openApp,
  } = useOSStore();

  const [activeTab, setActiveTab] = useState<
    'appearance' | 'dock' | 'displays' | 'wallpaper' | 'sound' | 'controlcenter' | 'wifi' | 'bluetooth' | 'ai' | 'about' | 'beta' | 'google'
  >((defaultTab as any) || 'appearance');
  const [searchQuery, setSearchQuery] = useState('');
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');
  const [alertSound, setAlertSound] = useState('Boop');
  const [isCleaningStorage, setIsCleaningStorage] = useState(false);
  const [storageCleanMessage, setStorageCleanMessage] = useState<string | null>(null);
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);
  const [googleSyncMsg, setGoogleSyncMsg] = useState<string | null>(null);

  const handleCleanStorage = () => {
    setIsCleaningStorage(true);
    setTimeout(() => {
      setIsCleaningStorage(false);
      const newUsed = Math.max(20, systemState.storageUsed - 8);
      updateSystemState('storageUsed', newUsed);
      setStorageCleanMessage('Cleaned 8.4 GB of system caches & temporary logs!');
      setTimeout(() => setStorageCleanMessage(null), 4000);
    }, 1500);
  };

  const [blobStatus, setBlobStatus] = useState<string | null>(null);

  const handleLaunchBlobMode = () => {
    try {
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      const htmlPayload = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ArcOS (Chromium Blob Sandbox)</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #blob-header {
      position: fixed; top: 0; left: 0; right: 0; height: 32px;
      background: linear-gradient(90deg, #18181b, #09090b);
      border-bottom: 1px solid rgba(255,255,255,0.15);
      color: #38bdf8; font-size: 11px; font-weight: 600;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 16px; z-index: 999999;
    }
    #blob-frame {
      position: absolute; top: 32px; left: 0; right: 0; bottom: 0;
      width: 100%; height: calc(100% - 32px); border: none;
    }
  </style>
</head>
<body>
  <div id="blob-header">
    <span>⚛️ ArcOS Chromium Blob Container (Offline Mode Enabled)</span>
    <span style="color: #94a3b8; font-family: monospace; font-size: 10px;">BLOB_URL: ACTIVE</span>
  </div>
  <iframe id="blob-frame" src="${currentUrl}" allow="fullscreen; camera; microphone; geolocation; clipboard-read; clipboard-write;"></iframe>
</body>
</html>`;

      const blob = new Blob([htmlPayload], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      updateSystemState('blobModeEnabled', true);
      setBlobStatus('Blob created successfully! Opening new window in blob mode...');
      window.open(blobUrl, '_blank');
      setTimeout(() => setBlobStatus(null), 5000);
    } catch (err: any) {
      setBlobStatus('Error creating blob: ' + err.message);
    }
  };

  const handleDownloadBlobSnapshot = () => {
    try {
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      const htmlPayload = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ArcOS Standalone Offline Runtime</title>
  <style>
    * { margin: 0; padding: 0; }
    body { background: #000; overflow: hidden; height: 100vh; width: 100vw; }
    iframe { width: 100vw; height: 100vh; border: none; }
  </style>
</head>
<body>
  <iframe src="${currentUrl}" allow="fullscreen; camera; microphone; geolocation; clipboard-read; clipboard-write;"></iframe>
</body>
</html>`;
      const blob = new Blob([htmlPayload], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'arcos-offline-blob.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBlobStatus('Downloaded arcos-offline-blob.html for offline Chrome execution!');
      setTimeout(() => setBlobStatus(null), 5000);
    } catch (err: any) {
      setBlobStatus('Error downloading blob: ' + err.message);
    }
  };

  const navItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'bg-gradient-to-tr from-pink-500 to-rose-500' },
    { id: 'dock', label: 'Dock & Menu Bar', icon: Laptop, color: 'bg-gradient-to-tr from-indigo-500 to-purple-600' },
    { id: 'wallpaper', label: 'Wallpaper', icon: ImageIcon, color: 'bg-gradient-to-tr from-cyan-500 to-blue-600' },
    { id: 'controlcenter', label: 'Control Center', icon: Sliders, color: 'bg-gradient-to-tr from-blue-500 to-indigo-500' },
    { id: 'displays', label: 'Displays & Night Shift', icon: Monitor, color: 'bg-gradient-to-tr from-amber-500 to-orange-500' },
    { id: 'sound', label: 'Sound', icon: Volume2, color: 'bg-gradient-to-tr from-red-500 to-pink-500' },
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi, color: 'bg-gradient-to-tr from-blue-600 to-sky-500' },
    { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth, color: 'bg-gradient-to-tr from-blue-700 to-indigo-600' },
    { id: 'ai', label: 'Arc AI & Spotlight', icon: Sparkles, color: 'bg-gradient-to-tr from-purple-600 to-fuchsia-600' },
    { id: 'google', label: 'Google Integration', icon: Globe, color: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600' },
    { id: 'beta', label: 'Beta Features & Blob', icon: FlaskConical, color: 'bg-gradient-to-tr from-amber-500 to-rose-600' },
    { id: 'about', label: 'General / About Mac', icon: Info, color: 'bg-gradient-to-tr from-zinc-600 to-zinc-700' },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-zinc-950 text-white select-none overflow-hidden">
      {/* macOS Sidebar */}
      <div className="w-64 sm:w-72 h-full bg-zinc-900/60 border-r border-white/10 flex flex-col p-3.5 backdrop-blur-xl">
        {/* User Account Header */}
        <div className="flex items-center space-x-3 px-2 py-2 mb-3 rounded-xl bg-white/5 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
            {systemState.userAccount.avatar || 'JP'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-zinc-100 truncate">
              {systemState.userAccount.name}
            </span>
            <span className="text-[10px] text-zinc-400 truncate">
              {systemState.userAccount.email}
            </span>
          </div>
        </div>

        {/* Search Settings */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Settings"
            className="w-full bg-zinc-800/80 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-blue-500/60 transition-colors"
          />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
          {filteredNavItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-white shadow-sm shrink-0 ${item.color}`}
                >
                  <Icon size={14} />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-zinc-950/80 custom-scrollbar">
        {/* ================= APPEARANCE TAB ================= */}
        {activeTab === 'appearance' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Appearance</h2>
              <p className="text-xs text-zinc-400">
                Customize how your operating system looks and reacts.
              </p>
            </div>

            {/* Theme Selector: Light vs Dark */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-semibold text-zinc-200 block">Theme Mode</span>
              <div className="grid grid-cols-2 gap-4">
                {/* Light */}
                <div
                  onClick={() => updateSystemState('theme', 'light')}
                  className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center space-y-2 transition-all ${
                    systemState.theme === 'light'
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                      : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800'
                  }`}
                >
                  <div className="w-full h-16 rounded-lg bg-zinc-200 border border-zinc-300 flex items-center justify-center text-zinc-800 shadow-inner">
                    <Sun size={24} className="text-amber-500" />
                  </div>
                  <span className="text-xs font-medium text-zinc-200">Light Mode</span>
                </div>

                {/* Dark */}
                <div
                  onClick={() => updateSystemState('theme', 'dark')}
                  className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center space-y-2 transition-all ${
                    systemState.theme === 'dark'
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                      : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800'
                  }`}
                >
                  <div className="w-full h-16 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-200 shadow-inner">
                    <Moon size={24} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-200">Dark Mode</span>
                </div>
              </div>
            </div>

            {/* Accent Color */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-semibold text-zinc-200 block">Accent Color</span>
              <div className="flex flex-wrap items-center gap-3">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setAccentColor(c.hex);
                      updateSystemState('accentColor', c.hex);
                    }}
                    title={c.name}
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 ${c.bg} ${
                      accentColor === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : ''
                    }`}
                  >
                    {accentColor === c.hex && <Check size={14} className="text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* UI Transparency Effects */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Frosted Glass Transparency</span>
                <span className="text-[11px] text-zinc-400">
                  Enable translucent acrylic blur on Menu Bar, Dock, and Window chrome
                </span>
              </div>
              <input
                type="checkbox"
                checked={systemState.transparency}
                onChange={(e) => updateSystemState('transparency', e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Icon Styles (User requested macOS, Chrome OS, Windows, Stock Android) */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">System App Icon Style</span>
                <span className="text-[11px] text-zinc-400">
                  Choose visual icon aesthetics for Launchpad, Dock, and Desktop
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'macos', label: 'macOS', desc: 'Glossy Squircles' },
                  { id: 'chromeos', label: 'Chrome OS', desc: 'Vibrant Circles' },
                  { id: 'windows', label: 'Windows 11', desc: 'Fluent Tiles' },
                  { id: 'android', label: 'Stock Android', desc: 'Material You' },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateSystemState('iconStyle', style.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer ${
                      (systemState.iconStyle || 'macos') === style.id
                        ? 'border-blue-500 bg-blue-500/15 text-white shadow-lg ring-1 ring-blue-400'
                        : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-semibold">{style.label}</span>
                    <span className="text-[10px] text-zinc-400">{style.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= DOCK & MENU BAR TAB ================= */}
        {activeTab === 'dock' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Dock & Menu Bar</h2>
              <p className="text-xs text-zinc-400">
                Configure auto-hide, magnification, dock style, and dimensions.
              </p>
            </div>

            {/* Dock Theme / Layout Style (User requested Windows style dock with search bar) */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Dock Style & Theme</span>
                <span className="text-[11px] text-zinc-400">
                  Select visual style (macOS Glass, Windows 11 Taskbar with Search, Cyberpunk, etc.)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'macos-glass', label: 'macOS Glass', desc: 'Classic Floating Acrylic' },
                  { id: 'windows-11', label: 'Windows 11 Style', desc: 'Centered + Search Bar' },
                  { id: 'macos-bigsur', label: 'macOS Big Sur', desc: 'High Gloss Blur' },
                  { id: 'pill-compact', label: 'Pill Compact', desc: 'Minimalist Capsule' },
                  { id: 'neumorphic', label: 'Neumorphic', desc: 'Soft 3D Extrusion' },
                  { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon Cyan Glow' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => updateSystemState('dockStyle', d.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer ${
                      systemState.dockStyle === d.id
                        ? 'border-blue-500 bg-blue-500/15 text-white shadow-lg ring-1 ring-blue-400'
                        : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-semibold">{d.label}</span>
                    <span className="text-[10px] text-zinc-400">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-Hide Dock (User explicit request) */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-200 block">
                    Automatically hide and show the Dock
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    The dock smoothly slides off-screen when windows occupy the desktop. Move mouse to screen bottom to reveal.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={systemState.autoHideDock}
                  onChange={(e) => updateSystemState('autoHideDock', e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Dock Size Slider */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-200">
                <span>Dock Size</span>
                <span className="font-mono text-[11px] text-zinc-400">{systemState.dockSize || 54}px</span>
              </div>
              <input
                type="range"
                min="36"
                max="72"
                value={systemState.dockSize || 54}
                onChange={(e) => updateSystemState('dockSize', Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Magnification */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Magnification</span>
                <span className="text-[11px] text-zinc-400">
                  Magnify dock app icons smoothly on cursor hover
                </span>
              </div>
              <input
                type="checkbox"
                checked={systemState.dockMagnification ?? true}
                onChange={(e) => updateSystemState('dockMagnification', e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Window Manager Gesture Sensitivity (User explicit request) */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Window Manager Scroll Sensitivity</span>
                <span className="text-[11px] text-zinc-400">
                  Adjust trackpad wheel scroll force and speed required to trigger Window Manager Mission Control. Set to Low or Off to prevent accidental triggering when scrolling.
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'off', label: 'Off', desc: 'Disabled on scroll' },
                  { id: 'low', label: 'Low (High Force)', desc: 'Requires fast flick' },
                  { id: 'medium', label: 'Medium', desc: 'Standard force' },
                  { id: 'high', label: 'High', desc: 'Sensitive' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => updateSystemState('windowManagerSensitivity', s.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer ${
                      (systemState.windowManagerSensitivity || 'low') === s.id
                        ? 'border-blue-500 bg-blue-500/15 text-white shadow-lg ring-1 ring-blue-400'
                        : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-semibold">{s.label}</span>
                    <span className="text-[10px] text-zinc-400">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= WALLPAPER TAB ================= */}
        {activeTab === 'wallpaper' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Desktop Wallpaper</h2>
              <p className="text-xs text-zinc-400">
                Choose official high-resolution wallpapers or provide a custom image URL.
              </p>
            </div>

            {/* Current Active Wallpaper Preview */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 flex items-center space-x-4">
              <div
                className="w-32 h-20 rounded-xl bg-cover bg-center border border-white/20 shadow-md shrink-0"
                style={{ backgroundImage: `url(${wallpaper})` }}
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-100">Current Desktop Wallpaper</span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  Applied across your desktop with adaptive glassmorphism.
                </span>
              </div>
            </div>

            {/* Wallpaper Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {WALLPAPERS.map((wp) => (
                <div
                  key={wp.url}
                  onClick={() => setWallpaper(wp.url)}
                  className={`group relative h-28 rounded-2xl overflow-hidden border cursor-pointer transition-all shadow-md ${
                    wallpaper === wp.url
                      ? 'ring-2 ring-blue-500 border-transparent scale-[1.02]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform group-hover:scale-105"
                    style={{ backgroundImage: `url(${wp.url})` }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                    <span className="text-[11px] font-medium text-white truncate drop-shadow">
                      {wp.name}
                    </span>
                    {wallpaper === wp.url && (
                      <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom URL */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-semibold text-zinc-200 block">Custom Wallpaper Image URL</span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customWallpaperUrl}
                  onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                  placeholder="https://example.com/wallpaper.jpg"
                  className="flex-1 bg-zinc-800/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    if (customWallpaperUrl.trim()) {
                      setWallpaper(customWallpaperUrl.trim());
                      setCustomWallpaperUrl('');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= CONTROL CENTER TAB ================= */}
        {activeTab === 'controlcenter' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Control Center</h2>
              <p className="text-xs text-zinc-400">
                Manage which quick controls are visible in the top Menu Bar and Control Center.
              </p>
            </div>

            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl divide-y divide-white/10">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wifi size={18} className="text-blue-400" />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">Wi-Fi Status</span>
                    <span className="text-[10px] text-zinc-400">Show Wi-Fi indicator in Menu Bar</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={systemState.wifi}
                  onChange={(e) => updateSystemState('wifi', e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bluetooth size={18} className="text-blue-400" />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">Bluetooth Status</span>
                    <span className="text-[10px] text-zinc-400">Show Bluetooth quick connectivity</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={systemState.bluetooth}
                  onChange={(e) => updateSystemState('bluetooth', e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Battery size={18} className="text-emerald-400" />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">Battery Percentage</span>
                    <span className="text-[10px] text-zinc-400">Display battery percentage next to icon</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-300">{systemState.battery}%</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= DISPLAYS TAB ================= */}
        {activeTab === 'displays' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Displays & Night Shift</h2>
              <p className="text-xs text-zinc-400">
                Adjust screen brightness and blue-light eye comfort.
              </p>
            </div>

            {/* Brightness */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-200">
                <div className="flex items-center space-x-2">
                  <Sun size={15} className="text-amber-400" />
                  <span>Brightness</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-400">{systemState.brightness}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={systemState.brightness}
                onChange={(e) => updateSystemState('brightness', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Night Shift Toggle */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Night Shift (Blue Light Filter)</span>
                <span className="text-[11px] text-zinc-400">
                  Warm the colors of your display to reduce eye strain in evening hours
                </span>
              </div>
              <input
                type="checkbox"
                checked={systemState.nightLight}
                onChange={(e) => updateSystemState('nightLight', e.target.checked)}
                className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ================= SOUND TAB ================= */}
        {activeTab === 'sound' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Sound & Audio</h2>
              <p className="text-xs text-zinc-400">
                Volume output, alert chimes, and audio effects.
              </p>
            </div>

            {/* Master Volume */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-200">
                <div className="flex items-center space-x-2">
                  <Volume2 size={16} className="text-blue-400" />
                  <span>Output Volume</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-400">{systemState.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={systemState.volume}
                onChange={(e) => updateSystemState('volume', Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Alert Sounds */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-semibold text-zinc-200 block">Alert Sound</span>
              <div className="grid grid-cols-3 gap-2">
                {['Boop', 'Breeze', 'Crystal', 'Funk', 'Glass', 'Ping'].map((snd) => (
                  <button
                    key={snd}
                    onClick={() => setAlertSound(snd)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                      alertSound === snd
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-zinc-800/60 border-white/10 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {snd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= WI-FI TAB ================= */}
        {activeTab === 'wifi' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Wi-Fi</h2>
                <p className="text-xs text-zinc-400">Manage wireless network connections.</p>
              </div>
              <input
                type="checkbox"
                checked={systemState.wifi}
                onChange={(e) => updateSystemState('wifi', e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
              />
            </div>

            {systemState.wifi ? (
              <div className="bg-zinc-900/70 border border-white/10 rounded-2xl divide-y divide-white/10">
                <div className="p-4 flex items-center justify-between bg-blue-600/10">
                  <div className="flex items-center space-x-3">
                    <Wifi size={18} className="text-blue-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">ArcOS_5G (Connected)</span>
                      <span className="text-[10px] text-zinc-400">5 GHz • WPA3 Personal • 866 Mbps</span>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">Connected</span>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Wifi size={18} className="text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-300">Office_Guest_HighSpeed</span>
                  </div>
                  <Lock size={13} className="text-zinc-500" />
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Wifi size={18} className="text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-300">Home_Fiber_Optic</span>
                  </div>
                  <Lock size={13} className="text-zinc-500" />
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-8 text-center text-zinc-400 text-xs">
                Wi-Fi is currently turned off. Turn it on above to connect to nearby networks.
              </div>
            )}
          </div>
        )}

        {/* ================= BLUETOOTH TAB ================= */}
        {activeTab === 'bluetooth' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Bluetooth</h2>
                <p className="text-xs text-zinc-400">Pair wireless accessories and audio devices.</p>
              </div>
              <input
                type="checkbox"
                checked={systemState.bluetooth}
                onChange={(e) => updateSystemState('bluetooth', e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
              />
            </div>

            {systemState.bluetooth ? (
              <div className="bg-zinc-900/70 border border-white/10 rounded-2xl divide-y divide-white/10">
                <div className="p-4 flex items-center justify-between bg-blue-600/10">
                  <div className="flex items-center space-x-3">
                    <Bluetooth size={18} className="text-blue-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">AirPods Pro (2nd Gen)</span>
                      <span className="text-[10px] text-zinc-400">Spatial Audio • Battery 94%</span>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">Connected</span>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Bluetooth size={18} className="text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-300">Magic Keyboard with Touch ID</span>
                  </div>
                  <span className="text-xs text-zinc-500">Not Connected</span>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-8 text-center text-zinc-400 text-xs">
                Bluetooth is disabled. Turn it on above to connect accessories.
              </div>
            )}
          </div>
        )}

        {/* ================= ARC AI & SPOTLIGHT TAB ================= */}
        {activeTab === 'ai' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Arc AI & Spotlight</h2>
              <p className="text-xs text-zinc-400">
                Configure global neural search, system command dispatch, and Gemini intelligence.
              </p>
            </div>

            <div className="bg-zinc-900/70 border border-purple-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Sparkles size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Gemini 3.8 Neural Engine</span>
                  <span className="text-[11px] text-purple-300">
                    Active • Real-time OS Action Execution & Knowledge Base
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-200 block">AI Spotlight Indexing</span>
                  <span className="text-[10px] text-zinc-400">Index apps, settings toggles, files & math</span>
                </div>
                <input
                  type="checkbox"
                  checked={systemState.aiCoreEnabled}
                  onChange={(e) => updateSystemState('aiCoreEnabled', e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= GENERAL / ABOUT TAB ================= */}
        {activeTab === 'about' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">About This Mac</h2>
              <p className="text-xs text-zinc-400">
                System hardware, architecture, and storage diagnostics.
              </p>
            </div>

            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-6 flex items-center space-x-6">
              {/* Apple Silhouette Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center shadow-2xl border border-white/10 shrink-0">
                <svg className="w-10 h-10 fill-current text-white/90" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.93-12.24-14.54-5.9-8.71-10.42-18.78-13.56-30.22-3.14-11.44-4.71-22.18-4.71-32.22 0-14.28 3.52-26.04 10.55-35.29 7.03-9.25 16.03-13.98 27.01-14.19 5.86 0 12.03 1.62 18.52 4.86 6.48 3.24 10.55 4.92 12.22 5.03 1.45 0 5.66-1.74 12.63-5.21 6.97-3.48 13.06-5.06 18.28-4.76 14.06.84 25.13 6.09 33.22 15.75-12.35 7.45-18.42 17.65-18.2 30.6.22 10.19 4.09 18.73 11.62 25.62 7.53 6.89 16.36 10.85 26.49 11.89-2.28 7.04-5.23 14.53-8.86 22.48zM119.22 31.84c0-7.39 2.68-14.45 8.04-21.19 5.36-6.74 12.03-10.65 20.02-11.74.11.87.16 1.85.16 2.94 0 7.39-2.83 14.73-8.49 22.01-5.66 7.28-12.56 11.36-20.7 12.23-.22-1.3-.33-2.3-.33-4.25z" />
                </svg>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-lg font-bold text-white tracking-tight">
                  MacBook Pro (16-inch, ArcOS Edition)
                </span>
                <span className="text-xs text-zinc-400">Chip: Apple M3 Max / Neural Engine</span>
                <span className="text-xs text-zinc-400">Memory: 36 GB Unified Memory</span>
                <span className="text-xs text-zinc-400">macOS: ArcOS Sonoma 14.5</span>
              </div>
            </div>

            {/* Storage Management & Cleanup */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-200 block">Macintosh HD Storage</span>
                  <span className="text-[11px] text-zinc-400">
                    {systemState.storageUsed} GB used of {systemState.storageTotal} GB
                  </span>
                </div>
                <button
                  onClick={handleCleanStorage}
                  disabled={isCleaningStorage}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-white/10 transition-colors"
                >
                  {isCleaningStorage ? 'Cleaning...' : 'Clean Cache'}
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(systemState.storageUsed / systemState.storageTotal) * 100}%` }}
                />
              </div>

              {storageCleanMessage && (
                <div className="text-xs text-emerald-400 font-medium animate-in fade-in">
                  ✓ {storageCleanMessage}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= BETA FEATURES TAB ================= */}
        {activeTab === 'beta' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">Beta Features & Blob Mode</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  EXPERIMENTAL
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Test unreleased ArcOS experimental flags, switch custom dock themes, and run the operating system in an isolated Chrome Blob environment.
              </p>
            </div>

            {/* Blob Mode Section */}
            <div className="bg-gradient-to-br from-amber-950/20 via-zinc-900/80 to-zinc-900/80 border border-amber-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Box size={18} className="text-amber-400" />
                    <span className="text-sm font-semibold text-white">
                      Chrome Blob Mode (Offline Execution)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 max-w-lg leading-relaxed">
                    Blob Mode bundles the entire OS runtime into an in-memory Chromium HTML Blob object URL (<code className="text-cyan-300 bg-black/40 px-1 py-0.5 rounded text-[11px]">blob:http...</code>). It runs client-side in an isolated sandbox and functions offline without network dependency.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-white/10 shrink-0">
                  v2.5_BLOB
                </span>
              </div>

              {blobStatus && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium animate-in fade-in flex items-center space-x-2">
                  <Sparkles size={14} className="text-amber-400 shrink-0" />
                  <span>{blobStatus}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={handleLaunchBlobMode}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold text-xs shadow-lg shadow-amber-900/30 active:scale-95 transition-all flex items-center space-x-2"
                >
                  <Box size={15} />
                  <span>Launch OS in Blob Mode</span>
                </button>

                <button
                  onClick={handleDownloadBlobSnapshot}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-semibold text-xs active:scale-95 transition-all flex items-center space-x-2"
                >
                  <Download size={15} />
                  <span>Download Standalone Blob (.html)</span>
                </button>
              </div>
            </div>

            {/* Custom Dock Styles (Beta) */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-200 block">
                    Experimental Dock Styles
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Switch between distinct architectural styles for your desktop dock.
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                  Active: {systemState.dockStyle || 'macos-glass'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* 1. macOS Modern Glass */}
                <div
                  onClick={() => updateSystemState('dockStyle', 'macos-glass')}
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col space-y-2 transition-all ${
                    systemState.dockStyle === 'macos-glass'
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                      : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800'
                  }`}
                >
                  <div className="h-10 rounded-lg bg-zinc-900/80 border border-white/20 backdrop-blur-md flex items-center justify-center space-x-1 px-2">
                    <div className="w-3 h-3 rounded-md bg-blue-500" />
                    <div className="w-3 h-3 rounded-md bg-purple-500" />
                    <div className="w-3 h-3 rounded-md bg-pink-500" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">macOS Modern Glass</span>
                    <span className="text-[10px] text-zinc-400">Translucent frosted glass</span>
                  </div>
                </div>

                {/* 2. macOS Big Sur Frost */}
                <div
                  onClick={() => updateSystemState('dockStyle', 'macos-bigsur')}
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col space-y-2 transition-all ${
                    systemState.dockStyle === 'macos-bigsur'
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                      : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800'
                  }`}
                >
                  <div className="h-10 rounded-xl bg-white/20 border border-white/40 shadow-inner flex items-center justify-center space-x-1 px-2">
                    <div className="w-3 h-3 rounded-md bg-blue-400" />
                    <div className="w-3 h-3 rounded-md bg-indigo-400" />
                    <div className="w-3 h-3 rounded-md bg-rose-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">Big Sur Frost</span>
                    <span className="text-[10px] text-zinc-400">High-opacity ice blur</span>
                  </div>
                </div>

                {/* 3. Neumorphic Matte */}
                <div
                  onClick={() => updateSystemState('dockStyle', 'neumorphic')}
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col space-y-2 transition-all ${
                    systemState.dockStyle === 'neumorphic'
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                      : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800'
                  }`}
                >
                  <div className="h-10 rounded-lg bg-zinc-900 border border-zinc-700/50 shadow-[4px_4px_8px_rgba(0,0,0,0.8),-2px_-2px_6px_rgba(255,255,255,0.05)] flex items-center justify-center space-x-1 px-2">
                    <div className="w-3 h-3 rounded-md bg-zinc-600" />
                    <div className="w-3 h-3 rounded-md bg-zinc-500" />
                    <div className="w-3 h-3 rounded-md bg-zinc-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">Neumorphic Matte</span>
                    <span className="text-[10px] text-zinc-400">Tactile bevel depth</span>
                  </div>
                </div>

                {/* 4. Cyberpunk Neon */}
                <div
                  onClick={() => updateSystemState('dockStyle', 'cyberpunk')}
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col space-y-2 transition-all ${
                    systemState.dockStyle === 'cyberpunk'
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800'
                  }`}
                >
                  <div className="h-10 rounded-md bg-black border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.7)] flex items-center justify-center space-x-1 px-2">
                    <div className="w-3 h-3 rounded-sm bg-cyan-400" />
                    <div className="w-3 h-3 rounded-sm bg-pink-500" />
                    <div className="w-3 h-3 rounded-sm bg-yellow-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-cyan-300 block">Cyberpunk Neon</span>
                    <span className="text-[10px] text-zinc-400">Cyan laser perimeter</span>
                  </div>
                </div>

                {/* 5. Pill Compact */}
                <div
                  onClick={() => updateSystemState('dockStyle', 'pill-compact')}
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col space-y-2 transition-all ${
                    systemState.dockStyle === 'pill-compact'
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                      : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800'
                  }`}
                >
                  <div className="h-10 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center space-x-1 px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">Compact Pill</span>
                    <span className="text-[10px] text-zinc-400">Ultra-streamlined</span>
                  </div>
                </div>

                {/* 6. Windows Centered */}
                <div
                  onClick={() => updateSystemState('dockStyle', 'windows-center')}
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col space-y-2 transition-all ${
                    systemState.dockStyle === 'windows-center'
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                      : 'border-white/10 bg-zinc-800/40 hover:bg-zinc-800'
                  }`}
                >
                  <div className="h-10 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-center space-x-1.5 px-2">
                    <div className="w-3 h-3 rounded-sm bg-blue-600" />
                    <div className="w-3 h-3 rounded-sm bg-blue-500" />
                    <div className="w-3 h-3 rounded-sm bg-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">Windows Fluent</span>
                    <span className="text-[10px] text-zinc-400">Centered taskbar style</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Beta Flags */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-semibold text-zinc-200 block">
                Additional Experimental Flags
              </span>

              {/* Developer Mode */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <span className="text-xs text-zinc-200 block font-medium">Developer Kernel Mode</span>
                  <span className="text-[11px] text-zinc-400">Exposes debugging consoles and system dispatchers.</span>
                </div>
                <button
                  onClick={() => updateSystemState('developerMode', !systemState.developerMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    systemState.developerMode ? 'bg-blue-600' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      systemState.developerMode ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Rammerhead Unrestricted Web Frame Proxy */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <span className="text-xs text-zinc-200 block font-medium">Rammerhead Web Proxy Caching</span>
                  <span className="text-[11px] text-zinc-400">Enables high-speed session resumption for Browser tabs.</span>
                </div>
                <button
                  onClick={() => updateSystemState('autoUpdate', !systemState.autoUpdate)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    systemState.autoUpdate ? 'bg-blue-600' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      systemState.autoUpdate ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Fluid Animation Engine */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs text-zinc-200 block font-medium">60 FPS Motion Physics</span>
                  <span className="text-[11px] text-zinc-400">GPU-accelerated window dragging and launchpad transitions.</span>
                </div>
                <button
                  onClick={() => updateSystemState('animationsEnabled', !systemState.animationsEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    systemState.animationsEnabled ? 'bg-blue-600' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      systemState.animationsEnabled ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 12. Google Integration Page */}
        {activeTab === 'google' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Google Services & Workspace Integration</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                  Active Connection
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Manage cloud authentication, Google Drive quota, Gmail sync, Google Meet, Keep, and Gemini AI.
              </p>
            </div>

            {googleSyncMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>{googleSyncMsg}</span>
                </div>
              </div>
            )}

            {/* Primary Google Account Card */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 via-red-500 to-amber-500 p-0.5 shadow-xl">
                    <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center font-bold text-lg text-white">
                      G
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">Google Workspace Account</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                        OAuth 2.0
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono block mt-0.5">
                      {systemState.userAccount.email || 'workspace-user@arcos.cloud'}
                    </span>
                    <div className="flex items-center space-x-2 mt-1.5 text-[11px] text-emerald-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Synchronized with Google Cloud Infrastructure</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setIsSyncingGoogle(true);
                      setTimeout(() => {
                        setIsSyncingGoogle(false);
                        setGoogleSyncMsg('All Google Services (Drive, Gmail, Meet, Keep) synced successfully!');
                        setTimeout(() => setGoogleSyncMsg(null), 4000);
                      }, 1200);
                    }}
                    disabled={isSyncingGoogle}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-medium border border-white/10 transition-colors"
                  >
                    <RefreshCcw size={13} className={isSyncingGoogle ? 'animate-spin' : ''} />
                    <span>{isSyncingGoogle ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setGoogleSyncMsg('Account credentials refreshed.');
                      setTimeout(() => setGoogleSyncMsg(null), 3000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md transition-colors"
                  >
                    Manage Account
                  </button>
                </div>
              </div>
            </div>

            {/* Google Services Matrix */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Integrated Google Workspace Applications
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Google Drive */}
                <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                        <HardDrive size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Google Drive</span>
                        <span className="text-[11px] text-zinc-400">Cloud Storage & Docs</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-medium">
                      Connected
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Cloud Storage Used</span>
                      <span className="text-zinc-200 font-mono font-medium">4.8 GB of 15 GB</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="w-[32%] h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-zinc-400">Auto-sync files</span>
                      <button
                        onClick={() => openApp('drive', 'Google Drive')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Open Drive →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gmail */}
                <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-700 flex items-center justify-center text-white shadow-md">
                        <Bell size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Gmail</span>
                        <span className="text-[11px] text-zinc-400">Email & Communications</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20 font-medium">
                      3 Unread
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Background Sync</span>
                      <span className="text-emerald-400 font-medium">Instant Push</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Desktop Notifications</span>
                      <span className="text-zinc-200">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-zinc-400">Inbox & Compose</span>
                      <button
                        onClick={() => openApp('gmail', 'Gmail')}
                        className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                      >
                        Open Gmail →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Google Meet */}
                <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-700 flex items-center justify-center text-white shadow-md">
                        <Radio size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Google Meet</span>
                        <span className="text-[11px] text-zinc-400">HD Video Calls & Meetings</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/20 font-medium">
                      Ready
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Camera & Microphone</span>
                      <span className="text-emerald-400 font-medium">Authorized</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Noise Cancellation</span>
                      <span className="text-zinc-200">AI Powered</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-zinc-400">Instant calls</span>
                      <button
                        onClick={() => openApp('meet', 'Google Meet')}
                        className="text-xs text-teal-400 hover:text-teal-300 font-medium"
                      >
                        Launch Meet →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Google Keep */}
                <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-md">
                        <Bookmark size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Google Keep</span>
                        <span className="text-[11px] text-zinc-400">Notes, Lists & Reminders</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">
                      Connected
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Cloud Note Sync</span>
                      <span className="text-emerald-400 font-medium">Automatic</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Pinned Notes</span>
                      <span className="text-zinc-200">Spotlight Searchable</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-zinc-400">Quick scratchpad</span>
                      <button
                        onClick={() => openApp('keep', 'Google Keep')}
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                      >
                        Open Keep →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Gemini AI Cloud Service */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Google Gemini Intelligence</span>
                    <span className="text-[11px] text-zinc-400">Gemini 2.5 Flash Cloud Model connected to Spotlight and Arc AI</span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  Online
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-zinc-400 block text-[10px] uppercase font-mono">Spotlight Search</span>
                  <span className="text-white font-medium mt-0.5 block">AI Smart Answers & Images</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-zinc-400 block text-[10px] uppercase font-mono">Arc AI Assistant</span>
                  <span className="text-white font-medium mt-0.5 block">Code & System Automation</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-zinc-400 block text-[10px] uppercase font-mono">Math Solver</span>
                  <span className="text-white font-medium mt-0.5 block">Step-by-step Explanations</span>
                </div>
              </div>
            </div>

            {/* Security & Permissions */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-semibold text-zinc-200 block">
                Cloud Security & Local Storage
              </span>

              <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                <div className="flex items-center space-x-2.5">
                  <Shield size={16} className="text-emerald-400" />
                  <div>
                    <span className="text-zinc-200 block font-medium">OAuth 2.0 Security Token</span>
                    <span className="text-[11px] text-zinc-400">Tokens stored securely in sandboxed session memory</span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">ENCRYPTED</span>
              </div>

              <div className="flex items-center justify-between py-2 text-xs">
                <div>
                  <span className="text-zinc-200 block font-medium">Clear Google Service Cache</span>
                  <span className="text-[11px] text-zinc-400">Deletes locally cached mail previews and note snapshots</span>
                </div>
                <button
                  onClick={() => {
                    setGoogleSyncMsg('Local Google cache cleared.');
                    setTimeout(() => setGoogleSyncMsg(null), 3000);
                  }}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-medium border border-white/10 transition-colors"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
