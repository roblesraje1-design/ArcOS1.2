'use client';

import { useState } from 'react';
import { useOSStore } from '@/store/useOSStore';
import {
  Wifi,
  WifiOff,
  Bluetooth,
  Radio,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sliders,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Music,
  Share2,
  Battery,
  BatteryCharging,
  Zap,
  Cast,
  Camera,
  Calculator,
  Flame,
  Lightbulb,
  X,
  Lock,
  Maximize2
} from 'lucide-react';

export default function ControlCenter() {
  const {
    isControlCenterOpen,
    closeControlCenter,
    systemState,
    updateSystemState,
    openApp,
    toggleCalculatorPopup,
    isCalculatorPopupOpen,
    isScreenLocked,
    setScreenLocked,
  } = useOSStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState(38);

  if (!isControlCenterOpen) return null;

  return (
    <div
      id="macos-control-center-popup"
      className="fixed top-9 right-3 w-80 sm:w-84 z-[130] bg-zinc-900/85 backdrop-blur-3xl border border-white/15 rounded-3xl p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white select-none animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center space-x-1.5">
          <Sliders size={14} className="text-zinc-300" />
          <span className="text-xs font-semibold text-zinc-200">Control Center</span>
        </div>
        <button
          onClick={closeControlCenter}
          className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* Top Grid: Connectivity & Toggles (macOS + iPhone + One UI hybrid) */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        {/* Connectivity 2x2 Box (macOS / iOS style) */}
        <div className="bg-zinc-800/60 border border-white/10 rounded-2xl p-2.5 flex flex-col justify-between space-y-2">
          {/* Wi-Fi */}
          <div
            onClick={() => updateSystemState('wifi', !systemState.wifi)}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                systemState.wifi
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                  : 'bg-zinc-700/80 text-zinc-400'
              }`}
            >
              {systemState.wifi ? <Wifi size={14} /> : <WifiOff size={14} />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-medium leading-none">Wi-Fi</span>
              <span className="text-[10px] text-zinc-400 truncate mt-0.5">
                {systemState.wifi ? 'ArcOS_5G' : 'Off'}
              </span>
            </div>
          </div>

          {/* Bluetooth */}
          <div
            onClick={() => updateSystemState('bluetooth', !systemState.bluetooth)}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                systemState.bluetooth
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                  : 'bg-zinc-700/80 text-zinc-400'
              }`}
            >
              <Bluetooth size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-medium leading-none">Bluetooth</span>
              <span className="text-[10px] text-zinc-400 truncate mt-0.5">
                {systemState.bluetooth ? 'AirPods Pro' : 'Off'}
              </span>
            </div>
          </div>

          {/* AirDrop / Quick Share (One UI & iPhone) */}
          <div
            onClick={() => updateSystemState('airdrop', !systemState.airdrop)}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                systemState.airdrop
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                  : 'bg-zinc-700/80 text-zinc-400'
              }`}
            >
              <Share2 size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-medium leading-none">AirDrop</span>
              <span className="text-[10px] text-zinc-400 truncate mt-0.5">
                {systemState.airdrop ? 'Contacts Only' : 'Off'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Stack: Focus (DND) & Screen Mirroring */}
        <div className="flex flex-col space-y-2.5">
          {/* Focus / Do Not Disturb */}
          <div
            onClick={() => updateSystemState('dnd', !systemState.dnd)}
            className={`flex items-center space-x-2.5 p-2.5 rounded-2xl border cursor-pointer transition-all ${
              systemState.dnd
                ? 'bg-purple-600/30 border-purple-500/50 text-purple-200'
                : 'bg-zinc-800/60 border-white/10 hover:bg-zinc-800/90 text-zinc-200'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                systemState.dnd ? 'bg-purple-600 text-white' : 'bg-zinc-700/80 text-zinc-400'
              }`}
            >
              <Moon size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-medium leading-none">Focus</span>
              <span className="text-[10px] text-zinc-400 mt-0.5">
                {systemState.dnd ? 'Do Not Disturb' : 'Off'}
              </span>
            </div>
          </div>

          {/* Screen Mirroring / Smart View (One UI style) */}
          <div
            onClick={() => updateSystemState('screenLight', !systemState.screenLight)}
            className={`flex items-center space-x-2.5 p-2.5 rounded-2xl border cursor-pointer transition-all ${
              systemState.screenLight
                ? 'bg-amber-600/30 border-amber-500/50 text-amber-200'
                : 'bg-zinc-800/60 border-white/10 hover:bg-zinc-800/90 text-zinc-200'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                systemState.screenLight ? 'bg-amber-500 text-white' : 'bg-zinc-700/80 text-zinc-400'
              }`}
            >
              <Cast size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-medium leading-none">Screen Mirror</span>
              <span className="text-[10px] text-zinc-400 mt-0.5">
                {systemState.screenLight ? 'Living Room TV' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders: Display Brightness (macOS style thick pill) */}
      <div className="bg-zinc-800/60 border border-white/10 rounded-2xl p-2.5 mb-2">
        <div className="flex items-center justify-between text-[11px] font-medium text-zinc-300 mb-1.5 px-0.5">
          <div className="flex items-center space-x-1.5">
            <Sun size={13} className="text-amber-400" />
            <span>Display</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400">{systemState.brightness}%</span>
        </div>
        <div className="relative flex items-center">
          <input
            type="range"
            min="10"
            max="100"
            value={systemState.brightness}
            onChange={(e) => updateSystemState('brightness', Number(e.target.value))}
            className="w-full h-7 rounded-xl appearance-none bg-zinc-700/60 accent-white cursor-pointer overflow-hidden"
          />
        </div>
      </div>

      {/* Sliders: Sound Volume (macOS style thick pill) */}
      <div className="bg-zinc-800/60 border border-white/10 rounded-2xl p-2.5 mb-2.5">
        <div className="flex items-center justify-between text-[11px] font-medium text-zinc-300 mb-1.5 px-0.5">
          <div className="flex items-center space-x-1.5">
            {systemState.volume === 0 ? (
              <VolumeX size={13} className="text-red-400" />
            ) : (
              <Volume2 size={13} className="text-blue-400" />
            )}
            <span>Sound</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400">{systemState.volume}%</span>
        </div>
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={systemState.volume}
            onChange={(e) => updateSystemState('volume', Number(e.target.value))}
            className="w-full h-7 rounded-xl appearance-none bg-zinc-700/60 accent-white cursor-pointer overflow-hidden"
          />
        </div>
      </div>

      {/* Now Playing Widget (One UI & macOS style) */}
      <div className="bg-zinc-800/60 border border-white/10 rounded-2xl p-2.5 mb-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow shrink-0">
            <Music size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">Daylight</span>
            <span className="text-[10px] text-zinc-400 truncate">David Kushner - ArcOS Music</span>
          </div>
        </div>

        {/* Media Controls */}
        <div className="flex items-center space-x-1 shrink-0 ml-2">
          <button
            onClick={() => setSongProgress(Math.max(0, songProgress - 15))}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-full bg-white text-zinc-900 hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
          </button>
          <button
            onClick={() => setSongProgress(Math.min(100, songProgress + 15))}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <SkipForward size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Quick Action Tiles (One UI / iOS Quick Settings) */}
      <div className="grid grid-cols-5 gap-1.5">
        {/* Screen Lock */}
        <button
          onClick={() => setScreenLocked(!isScreenLocked)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
            isScreenLocked
              ? 'bg-rose-600/40 border-rose-500/50 text-rose-200'
              : 'bg-zinc-800/60 border-white/10 text-zinc-300 hover:bg-zinc-800'
          }`}
          title="Screen Lock / Fullscreen Kiosk Mode"
        >
          <Lock size={15} className={`mb-1 ${isScreenLocked ? 'text-rose-400 animate-pulse' : 'text-zinc-300'}`} />
          <span className="text-[9px] font-medium leading-tight">Screen Lock</span>
        </button>

        {/* Dark Mode */}
        <button
          onClick={() =>
            updateSystemState('theme', systemState.theme === 'dark' ? 'light' : 'dark')
          }
          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
            systemState.theme === 'dark'
              ? 'bg-blue-600/30 border-blue-500/40 text-blue-200'
              : 'bg-zinc-800/60 border-white/10 text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          <Moon size={15} className="mb-1" />
          <span className="text-[9px] font-medium leading-tight">Dark</span>
        </button>

        {/* Night Shift */}
        <button
          onClick={() => updateSystemState('nightLight', !systemState.nightLight)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
            systemState.nightLight
              ? 'bg-amber-600/30 border-amber-500/40 text-amber-200'
              : 'bg-zinc-800/60 border-white/10 text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          <Sun size={15} className="mb-1 text-amber-400" />
          <span className="text-[9px] font-medium leading-tight">Night Shift</span>
        </button>

        {/* Battery Saver */}
        <button
          onClick={() => updateSystemState('batterySaver', !systemState.batterySaver)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
            systemState.batterySaver
              ? 'bg-emerald-600/30 border-emerald-500/40 text-emerald-200'
              : 'bg-zinc-800/60 border-white/10 text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          <Zap size={15} className="mb-1 text-emerald-400" />
          <span className="text-[9px] font-medium leading-tight">Eco Saver</span>
        </button>

        {/* Calculator Quick Open Popup */}
        <button
          onClick={() => toggleCalculatorPopup()}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
            isCalculatorPopupOpen
              ? 'bg-orange-600/30 border-orange-500/40 text-orange-200'
              : 'bg-zinc-800/60 border-white/10 text-zinc-300 hover:bg-zinc-800'
          }`}
          title="Toggle Quick Calculator Popup"
        >
          <Calculator size={15} className="mb-1 text-orange-400" />
          <span className="text-[9px] font-medium leading-tight">Calculator</span>
        </button>
      </div>
    </div>
  );
}
