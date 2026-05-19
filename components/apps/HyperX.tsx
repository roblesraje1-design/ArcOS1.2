'use client';

import { useState, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { Activity, Cpu, HardDrive, Trash2, Zap, LayoutGrid } from 'lucide-react';

export default function HyperX() {
  const { windows, closeApp } = useOSStore();
  const [metrics, setMetrics] = useState({ cpu: 15, ram: 42, disk: 28 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 30) + 10,
        ram: Math.floor(Math.random() * 20) + 35,
        disk: 28,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 p-6 font-sans">
      <div className="flex items-center space-x-3 mb-6">
        <Zap className="text-yellow-400" size={24} />
        <h1 className="text-xl font-bold">HyperX Performance</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-white/10 p-4 rounded-xl flex items-center space-x-3">
          <Cpu className="text-blue-400" />
          <div>
            <div className="text-xs text-zinc-500 uppercase font-bold">CPU Usage</div>
            <div className="text-lg font-mono">{metrics.cpu}%</div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-white/10 p-4 rounded-xl flex items-center space-x-3">
          <Activity className="text-green-400" />
          <div>
            <div className="text-xs text-zinc-500 uppercase font-bold">RAM Usage</div>
            <div className="text-lg font-mono">{metrics.ram}%</div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-white/10 p-4 rounded-xl flex items-center space-x-3">
          <HardDrive className="text-purple-400" />
          <div>
            <div className="text-xs text-zinc-500 uppercase font-bold">Disk I/O</div>
            <div className="text-lg font-mono">{metrics.disk}%</div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 rounded-xl p-4 overflow-y-auto">
        <div className="text-xs font-bold text-zinc-500 uppercase mb-4 sticky top-0 bg-zinc-900 py-2">Active Processes ({windows.length})</div>
        <div className="space-y-2">
          {windows.map((win) => (
            <div key={win.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center space-x-3">
                 <LayoutGrid size={16} className="text-zinc-500" />
                 <span className="text-sm font-medium">{win.title}</span>
              </div>
              <button 
                onClick={() => closeApp(win.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
                title="End Task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
