'use client';

import { useOSStore } from '@/store/useOSStore';
import { Search, Settings, Folder, TerminalSquare, Globe, Wifi, WifiOff, Volume2, VolumeX, Battery, BatteryMedium, BatteryLow, Bluetooth, LayoutGrid, Maximize2, Layers, Code2, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';

const DOCK_APPS = [
  { id: 'devstudio', title: 'Arc Studio', icon: Code2, color: 'text-purple-400' },
  { id: 'neuralcore', title: 'Neural Core', icon: Brain, color: 'text-indigo-400' },
  { id: 'settings', title: 'Settings', icon: Settings, color: 'text-zinc-300' },
  { id: 'files', title: 'File Explorer', icon: Folder, color: 'text-yellow-400' },
  { id: 'browser', title: 'Web Browser', icon: Globe, color: 'text-blue-400' },
];

export default function Taskbar() {
  const { windows, openApp, minimizeApp, activeWindowId, toggleStartMenu, toggleTaskView, isTaskViewOpen, systemState, updateSystemState } = useOSStore();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    const timeout = setTimeout(updateTime, 0);
    const timer = setInterval(updateTime, 1000);
    
    // Battery Status API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          updateSystemState('battery', Math.round(battery.level * 100));
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        return () => battery.removeEventListener('levelchange', updateBattery);
      });
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [updateSystemState]);

  const timeString = currentTime ? currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';
  const dateString = currentTime ? currentTime.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[100] flex h-14 w-full items-center justify-between border-t border-zinc-800 bg-zinc-900/80 px-2 backdrop-blur-2xl">
      
      {/* Left Area - Empty for balance or could hold widgets */}
      <div className="flex-1 flex items-center">
         {/* Could add date/time here for literal Win11 or keep it on right */}
      </div>

      {/* Center Main Dock */}
      <div className="flex h-full items-center justify-center space-x-1">
        {/* Start Button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }}
          className="group flex h-10 w-10 items-center justify-center rounded-md transition-all hover:bg-zinc-700/50 active:scale-95"
        >
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-2 w-2 rounded-[2px] bg-blue-500 group-hover:bg-blue-400"></div>
            <div className="h-2 w-2 rounded-[2px] bg-blue-500 group-hover:bg-blue-400"></div>
            <div className="h-2 w-2 rounded-[2px] bg-blue-500 group-hover:bg-blue-400"></div>
            <div className="h-2 w-2 rounded-[2px] bg-blue-500 group-hover:bg-blue-400"></div>
          </div>
        </button>

        {/* Task View Button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleTaskView(); }}
          className={`flex h-10 w-10 items-center justify-center rounded-md transition-all hover:bg-zinc-700/50 active:scale-95 ${isTaskViewOpen ? 'bg-zinc-800 shadow-inner' : ''}`}
          title="Task View"
        >
          <Layers size={20} className={isTaskViewOpen ? 'text-blue-400' : 'text-zinc-300'} />
        </button>

        {/* Taskbar Search Box */}
        <div 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!useOSStore.getState().isStartMenuOpen) toggleStartMenu();
            // Start menu will focus input if it's open
          }}
          className="mx-2 flex h-9 cursor-text items-center space-x-2 rounded-full border border-zinc-700/50 bg-zinc-800/80 px-3 transition hover:bg-zinc-700/80"
          style={{ width: '200px' }}
        >
          <Search size={14} className="text-zinc-400" />
          <span className="text-xs text-zinc-400">Search</span>
        </div>

        <div className="mx-2 h-6 w-px bg-zinc-800"></div>

        {/* Dynamic Dock Apps */}
        {DOCK_APPS.map((app) => {
          const isOpen = windows.some(w => w.appId === app.id);
          const isActive = activeWindowId && windows.find(w => w.id === activeWindowId)?.appId === app.id;
          
          return (
            <button
              key={app.id}
              onClick={(e) => {
                e.stopPropagation();
                if (isOpen && isActive) {
                  // minimize
                  const win = windows.find(w => w.appId === app.id);
                  if (win) minimizeApp(win.id);
                } else {
                  openApp(app.id, app.title);
                }
              }}
              className={`relative flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-zinc-700/50 active:scale-95 ${isActive ? 'bg-zinc-800/80 shadow-inner' : ''}`}
            >
              <app.icon size={22} className={app.color} strokeWidth={1.5} />
              
              {/* Active Indicator line */}
              {isOpen && (
                <div className={`absolute bottom-0 h-1 rounded-full bg-zinc-400 transition-all ${isActive ? 'w-4 bg-blue-400' : 'w-1.5'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Taskbar Tray Panel */}
      <div className="flex-1 flex h-full items-center justify-end space-x-1 pr-2">
        <button 
          className="flex h-10 items-center space-x-2 rounded-md px-2 transition hover:bg-zinc-700/50"
          onClick={(e) => {
            e.stopPropagation();
            useOSStore.getState().toggleQuickSettings();
          }}
        >
          <div className="flex items-center space-x-1.5 text-zinc-300">
            {systemState.wifi ? <Wifi size={16} /> : <WifiOff size={16} className="text-zinc-500" />}
            {systemState.volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <div className="flex items-center">
              {systemState.battery > 50 ? <Battery size={16} /> : systemState.battery > 20 ? <BatteryMedium size={16} /> : <BatteryLow size={16} className="text-red-400" />}
              <span className="ml-0.5 mt-0.5 text-[10px] leading-none">{systemState.battery}%</span>
            </div>
          </div>
        </button>

        <button className="flex h-10 flex-col items-end justify-center rounded-md px-2 text-[11px] text-zinc-200 transition hover:bg-zinc-700/50 leading-tight">
          <span>{timeString}</span>
          <span>{dateString}</span>
        </button>
      </div>
    </div>
  );
}
