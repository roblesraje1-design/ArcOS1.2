'use client';

import { useState, useEffect, useRef } from 'react';
import { useOSStore } from '@/store/useOSStore';
import {
  Search,
  Sliders,
  Wifi,
  WifiOff,
  BatteryMedium,
  BatteryCharging,
  Sparkles,
  Cloud,
  Check,
  Power,
  RotateCcw,
  Moon,
  Lock,
  Settings as SettingsIcon,
  HelpCircle,
  ExternalLink,
  Maximize,
  Minimize2,
  FolderPlus,
  AppWindow,
  Layers,
  LayoutGrid,
  X
} from 'lucide-react';
import AppIcon from '@/components/AppIcon';

export default function MenuBar() {
  const {
    systemState,
    updateSystemState,
    windows,
    activeWindowId,
    openApp,
    closeApp,
    maximizeApp,
    minimizeApp,
    focusApp,
    openTaskView,
    toggleFullscreen,
    isSpotlightOpen,
    toggleSpotlight,
    isAIAssistantOpen,
    toggleAIAssistant,
    isControlCenterOpen,
    toggleControlCenter,
    activeMenuDropdown,
    setActiveMenuDropdown,
    setLockScreenVisible,
  } = useOSStore();

  const [timeStr, setTimeStr] = useState('');
  const [hoveredWindowTabId, setHoveredWindowTabId] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Active window title
  const activeWin = windows.find((w) => w.id === activeWindowId && !w.isMinimized);
  const appTitle = activeWin ? activeWin.title : 'ArcOS';

  // Live macOS Clock (e.g. "Fri Sep 11 3:21 PM")
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      // Format: "Fri Sep 11 3:21 PM"
      const formatted = now.toLocaleDateString('en-US', options).replace(/,/g, '');
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenuDropdown(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [setActiveMenuDropdown]);

  const handleMenuClick = (menu: string) => {
    if (activeMenuDropdown === menu) {
      setActiveMenuDropdown(null);
    } else {
      setActiveMenuDropdown(menu);
    }
  };

  const handleMenuHover = (menu: string) => {
    if (activeMenuDropdown !== null && activeMenuDropdown !== menu) {
      setActiveMenuDropdown(menu);
    }
  };

  const handleAction = (callback: () => void) => {
    callback();
    setActiveMenuDropdown(null);
  };

  return (
    <div
      ref={menuBarRef}
      id="macos-menubar"
      className="fixed top-0 left-0 right-0 h-7 z-[120] flex items-center justify-between px-3 text-[13px] font-normal select-none bg-zinc-900/60 backdrop-blur-2xl border-b border-white/10 text-white/90 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Left Menu Items */}
      <div className="flex items-center space-x-1">
        {/* ArcOS Logo Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('apple')}
            onMouseEnter={() => handleMenuHover('apple')}
            className={`px-2 py-0.5 rounded flex items-center space-x-1.5 transition-colors ${
              activeMenuDropdown === 'apple' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            title="ArcOS System Menu"
          >
            {/* Official ArcOS Vector Emblem */}
            <svg
              className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 14L82 78H67L50 43L33 78H18L50 14Z"
                fill="currentColor"
              />
              <circle cx="50" cy="56" r="6.5" fill="#38bdf8" />
              <path
                d="M18 72C34 60 66 60 82 72"
                stroke="#67e8f9"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-semibold text-xs text-white tracking-wide">ArcOS</span>
          </button>

          {activeMenuDropdown === 'apple' && (
            <div className="absolute left-0 top-7 w-56 py-1.5 bg-zinc-900/90 backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl z-50 text-xs text-zinc-200">
              <button
                onClick={() => handleAction(() => openApp('settings', 'Settings'))}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>About ArcOS</span>
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => handleAction(() => openApp('settings', 'Settings'))}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>System Settings...</span>
              </button>
              <button
                onClick={() => handleAction(() => openApp('browser', 'App Store'))}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white"
              >
                App Store...
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => handleAction(() => openApp('neuralcore', 'Arc AI'))}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>Arc AI Neural Core</span>
                <span className="text-[10px] text-zinc-400 font-mono">⌘K</span>
              </button>
              <button
                onClick={() => handleAction(() => openApp('settings', 'Settings'))}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white"
              >
                Force Quit Applications...
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => handleAction(() => setLockScreenVisible(true))}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white"
              >
                Sleep
              </button>
              <button
                onClick={() => handleAction(() => window.location.reload())}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white"
              >
                Restart...
              </button>
              <button
                onClick={() =>
                  handleAction(() => {
                    document.body.innerHTML =
                      '<div style="display:flex; height:100vh; background:black; color:white; align-items:center; justify-content:center; font-family:sans-serif; font-size:18px;">System shut down. Refresh page to reboot.</div>';
                  })
                }
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white"
              >
                Shut Down...
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => handleAction(() => setLockScreenVisible(true))}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>Lock Screen</span>
                <span className="text-[10px] text-zinc-400 font-mono">⌃⌘Q</span>
              </button>
            </div>
          )}
        </div>

        {/* Current Active App Name */}
        <span className="font-semibold text-white px-2 py-0.5 tracking-tight">
          {appTitle}
        </span>

        {/* Standard macOS Menus */}
        {['File', 'Edit', 'View', 'Window', 'Help'].map((menu) => (
          <div key={menu} className="relative">
            <button
              onClick={() => handleMenuClick(menu)}
              onMouseEnter={() => handleMenuHover(menu)}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeMenuDropdown === menu ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              {menu}
            </button>

            {activeMenuDropdown === menu && (
              <div className="absolute left-0 top-7 w-52 py-1.5 bg-zinc-900/90 backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl z-50 text-xs text-zinc-200">
                {menu === 'File' && (
                  <>
                    <button
                      onClick={() => handleAction(() => openApp('files', 'File Explorer'))}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>New Window</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⌘N</span>
                    </button>
                    <button
                      onClick={() => handleAction(() => openApp('browser', 'Browser'))}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>New Tab</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⌘T</span>
                    </button>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      onClick={() => {
                        if (activeWin) handleAction(() => closeApp(activeWin.id));
                        else setActiveMenuDropdown(null);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Close Window</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⌘W</span>
                    </button>
                  </>
                )}

                {menu === 'Edit' && (
                  <>
                    <button
                      onClick={() => setActiveMenuDropdown(null)}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Undo</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⌘Z</span>
                    </button>
                    <button
                      onClick={() => setActiveMenuDropdown(null)}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Redo</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⇧⌘Z</span>
                    </button>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      onClick={() => setActiveMenuDropdown(null)}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Cut</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⌘X</span>
                    </button>
                    <button
                      onClick={() => setActiveMenuDropdown(null)}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Copy</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⌘C</span>
                    </button>
                    <button
                      onClick={() => setActiveMenuDropdown(null)}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Paste</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⌘V</span>
                    </button>
                  </>
                )}

                {menu === 'View' && (
                  <>
                    <button
                      onClick={() => handleAction(() => window.location.reload())}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Reload</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⌘R</span>
                    </button>
                    <button
                      onClick={() => {
                        if (activeWin) handleAction(() => toggleFullscreen(activeWin.id));
                        else setActiveMenuDropdown(null);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Enter Full Screen</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⌃⌘F</span>
                    </button>
                  </>
                )}

                {menu === 'Window' && (
                  <>
                    <button
                      onClick={() => handleAction(() => openTaskView())}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between font-semibold"
                    >
                      <span>Mission Control (Window Manager)</span>
                      <span className="text-[10px] text-zinc-400 font-mono">F3</span>
                    </button>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      onClick={() => {
                        if (activeWin) handleAction(() => minimizeApp(activeWin.id));
                        else setActiveMenuDropdown(null);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Minimize</span>
                      <span className="text-[10px] text-zinc-400 font-mono">⌘M</span>
                    </button>
                    <button
                      onClick={() => {
                        if (activeWin) handleAction(() => maximizeApp(activeWin.id));
                        else setActiveMenuDropdown(null);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                    >
                      <span>Zoom / Maximize</span>
                    </button>
                    <div className="my-1 border-t border-white/10" />
                    <div className="px-4 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      WM Gesture Sensitivity
                    </div>
                    {[
                      { id: 'off', label: 'Off (Disabled)' },
                      { id: 'low', label: 'Low (High Force)' },
                      { id: 'medium', label: 'Medium' },
                      { id: 'high', label: 'High' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleAction(() => updateSystemState('windowManagerSensitivity', s.id))}
                        className={`w-full text-left px-4 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between text-xs ${
                          (systemState.windowManagerSensitivity || 'low') === s.id ? 'text-blue-400 font-bold' : ''
                        }`}
                      >
                        <span>{s.label}</span>
                        {(systemState.windowManagerSensitivity || 'low') === s.id && <Check size={12} className="text-blue-400" />}
                      </button>
                    ))}
                  </>
                )}

                {menu === 'Help' && (
                  <>
                    <button
                      onClick={() => handleAction(() => openApp('tips', 'ArcOS Tips'))}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white"
                    >
                      ArcOS Tips & Help
                    </button>
                    <button
                      onClick={() => handleAction(() => openApp('neuralcore', 'Arc AI Assistant'))}
                      className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white"
                    >
                      Ask Arc AI...
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Menu Items */}
      <div className="flex items-center space-x-2.5">
        {/* Window Manager Button on Menu Bar */}
        <div className="relative">
          <button
            id="menubar-windows-manager-button"
            onClick={() => handleMenuClick('windowManager')}
            onMouseEnter={() => handleMenuHover('windowManager')}
            title="Window Manager / Open Tabs"
            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition-all cursor-pointer ${
              activeMenuDropdown === 'windowManager'
                ? 'bg-blue-600 text-white shadow'
                : 'hover:bg-white/10 text-white/80 hover:text-white'
            }`}
          >
            <AppWindow size={14} className="text-cyan-400" />
            {windows.length > 0 && (
              <span className="text-[10px] font-mono font-bold bg-white/20 px-1 py-0.2 rounded-full text-white">
                {windows.length}
              </span>
            )}
          </button>

          {/* Window Manager Dropdown */}
          {activeMenuDropdown === 'windowManager' && (
            <div className="absolute right-0 top-7 w-64 py-2 bg-zinc-900/95 backdrop-blur-3xl border border-white/15 rounded-2xl shadow-2xl z-50 text-xs text-zinc-200 animate-in fade-in duration-100 flex flex-col">
              <div className="px-3 py-1 font-semibold text-[11px] text-zinc-400 uppercase tracking-wider flex items-center justify-between border-b border-white/10 pb-1.5 mb-1">
                <span>Window Manager ({windows.length})</span>
                <span className="text-[10px] text-zinc-500 font-normal">Hover tab for preview</span>
              </div>

              {windows.length === 0 ? (
                <div className="px-3 py-4 text-center text-zinc-500 text-xs">
                  No active windows open
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-0.5 px-1">
                  {windows.map((win) => {
                    const isActive = activeWindowId === win.id && !win.isMinimized;
                    const isHovered = hoveredWindowTabId === win.id;

                    return (
                      <div key={win.id} className="relative group">
                        <button
                          onMouseEnter={() => setHoveredWindowTabId(win.id)}
                          onMouseLeave={() => setHoveredWindowTabId(null)}
                          onClick={() => {
                            if (win.isMinimized) {
                              minimizeApp(win.id);
                            }
                            focusApp(win.id);
                            setActiveMenuDropdown(null);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-blue-600/30 text-white font-medium border border-blue-500/40'
                              : 'hover:bg-white/10 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2 min-w-0 pr-2">
                            <AppIcon appId={win.appId} size="sm" />
                            <span className="truncate text-xs">{win.title}</span>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            {win.isMinimized && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                                Min
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                closeApp(win.id);
                              }}
                              className="p-1 hover:bg-red-500/80 hover:text-white rounded text-zinc-400 transition-colors"
                              title="Close Window"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </button>

                        {/* Hover Window Preview Card for Menu Bar Tab */}
                        {isHovered && (
                          <div className="absolute right-full mr-2 top-0 z-[100] w-60 p-2.5 rounded-2xl bg-zinc-950/95 backdrop-blur-3xl border border-white/20 shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                              <div className="flex items-center space-x-1.5 min-w-0">
                                <AppIcon appId={win.appId} size="sm" />
                                <span className="text-xs font-semibold text-white truncate">{win.title}</span>
                              </div>
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                                  win.isMinimized
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-emerald-500/20 text-emerald-300'
                                }`}
                              >
                                {win.isMinimized ? 'Minimized' : 'Active'}
                              </span>
                            </div>

                            <div className="aspect-video bg-gradient-to-br from-zinc-900 to-black rounded-xl p-3 border border-white/10 flex flex-col items-center justify-center text-center">
                              <AppIcon appId={win.appId} size="md" />
                              <span className="text-xs font-medium text-zinc-200 mt-1.5 truncate max-w-full">
                                {win.title}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500 mt-0.5">
                                {win.size.width} × {win.size.height}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-white/10 mt-1.5 pt-1.5 px-1">
                <button
                  onClick={() => {
                    openTaskView();
                    setActiveMenuDropdown(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-cyan-400 hover:text-cyan-300 flex items-center space-x-2 font-medium cursor-pointer"
                >
                  <Layers size={14} />
                  <span>Show All Windows (Mission Control)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Google Drive Status */}
        <button
          onClick={() => openApp('drive', 'Google Drive')}
          title="Google Drive Cloud Sync Active"
          className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <Cloud size={14} className="text-emerald-400" />
        </button>

        {/* AI Assistant Button ("instead of siri like on Mac os on the menu make a button called Ai and make it a popup") */}
        <button
          id="menubar-ai-button"
          onClick={toggleAIAssistant}
          title="Arc AI Assistant"
          className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border transition-all active:scale-95 ${
            isAIAssistantOpen
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-400/30 text-purple-200'
          }`}
        >
          <Sparkles size={12} className="text-purple-300 animate-pulse" />
          <span className="text-[11px] font-semibold tracking-wide">AI</span>
        </button>

        {/* Spotlight Search Icon */}
        <button
          id="menubar-spotlight-button"
          onClick={toggleSpotlight}
          title="Spotlight Search (⌘Space)"
          className={`p-1 rounded transition-colors ${
            isSpotlightOpen ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80'
          }`}
        >
          <Search size={14} />
        </button>

        {/* Control Center Toggle */}
        <button
          id="menubar-controlcenter-button"
          onClick={toggleControlCenter}
          title="Control Center"
          className={`p-1 rounded transition-colors ${
            isControlCenterOpen ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80'
          }`}
        >
          <Sliders size={14} />
        </button>

        {/* Wi-Fi Icon */}
        <button
          onClick={() => updateSystemState('wifi', !systemState.wifi)}
          title={`Wi-Fi: ${systemState.wifi ? 'Connected' : 'Off'}`}
          className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          {systemState.wifi ? <Wifi size={14} /> : <WifiOff size={14} className="text-zinc-500" />}
        </button>

        {/* Battery with % */}
        <div
          title={`Battery: ${systemState.battery}%`}
          className="flex items-center space-x-1 px-1 py-0.5 rounded hover:bg-white/10 cursor-pointer text-white/90"
          onClick={toggleControlCenter}
        >
          <span className="text-xs font-mono">{systemState.battery}%</span>
          <BatteryMedium size={15} className={systemState.battery < 20 ? 'text-red-400' : 'text-zinc-200'} />
        </div>

        {/* Date & Time formatted e.g. "Fri Sep 11 3:21 PM" */}
        <button
          onClick={toggleControlCenter}
          className="px-1.5 py-0.5 rounded hover:bg-white/10 text-xs font-medium text-white/95 transition-colors"
        >
          {timeStr || 'Fri Sep 11 3:21 PM'}
        </button>
      </div>
    </div>
  );
}
