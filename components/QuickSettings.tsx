'use client';

import { useOSStore } from '@/store/useOSStore';
import { Wifi, Bluetooth, Plane, BatteryMedium, Sun, Volume2, Settings, Lock, Moon } from 'lucide-react';

export default function QuickSettings() {
  const { systemState, updateSystemState, setLockScreenVisible } = useOSStore();

  return (
    <div 
      className="absolute bottom-16 right-4 z-[110] flex w-80 flex-col overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900/90 p-4 shadow-2xl backdrop-blur-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Toggles Grid */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <button
          onClick={() => updateSystemState('wifi', !systemState.wifi)}
          className={`flex flex-col items-center justify-center space-y-2 rounded-lg py-3 transition-colors ${
            systemState.wifi ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <Wifi size={20} />
          <span className="text-[11px] font-medium leading-none">Wi-Fi</span>
        </button>

        <button
          onClick={() => updateSystemState('bluetooth', !systemState.bluetooth)}
          className={`flex flex-col items-center justify-center space-y-2 rounded-lg py-3 transition-colors ${
            systemState.bluetooth ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <Bluetooth size={20} />
          <span className="text-[11px] font-medium leading-none">Bluetooth</span>
        </button>

        <button
          onClick={() => updateSystemState('airplane', !systemState.airplane)}
          className={`flex flex-col items-center justify-center space-y-2 rounded-lg py-3 transition-colors ${
            systemState.airplane ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <Plane size={20} />
          <span className="text-[11px] font-medium leading-none">Airplane</span>
        </button>
        
        <button
          onClick={() => updateSystemState('nightLight', !systemState.nightLight)}
          className={`flex flex-col items-center justify-center space-y-2 rounded-lg py-3 transition-colors ${
            systemState.nightLight ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <Moon size={20} />
          <span className="text-[11px] font-medium leading-none">Night light</span>
        </button>

        <button
          onClick={() => setLockScreenVisible(true)}
          className="flex flex-col items-center justify-center space-y-2 rounded-lg py-3 transition-colors bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
        >
          <Lock size={20} />
          <span className="text-[11px] font-medium leading-none">Lock</span>
        </button>

        <button
          onClick={() => updateSystemState('batterySaver', !systemState.batterySaver)}
          className={`flex flex-col items-center justify-center space-y-2 rounded-lg py-3 transition-colors ${
            systemState.batterySaver ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          <BatteryMedium size={20} />
          <span className="text-[11px] font-medium leading-none">Saver</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-4 rounded-lg bg-zinc-800/50 p-4 border border-zinc-700/50">
        <div className="flex items-center space-x-3">
          <Sun size={18} className="text-zinc-400" />
          <input
            type="range"
            min="10"
            max="100"
            value={systemState.brightness}
            onChange={(e) => updateSystemState('brightness', parseInt(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-600 accent-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <Volume2 size={18} className="text-zinc-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={systemState.volume}
            onChange={(e) => updateSystemState('volume', parseInt(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-600 accent-blue-500"
          />
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-700/50 pt-2 px-1">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs font-medium">
             <BatteryMedium size={14} className="text-zinc-300" />
             <span>{systemState.battery}%</span>
          </div>
          <button className="text-zinc-400 hover:text-white transition-colors" onClick={() => {
              if (window.ArcOS_Dispatch) window.ArcOS_Dispatch('OPEN_APP', { appId: 'settings', title: 'Settings' });
          }}>
              <Settings size={16} />
          </button>
      </div>
    </div>
  );
}
