'use client';

import { useState } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { ShieldCheck, HardDrive, RefreshCw, Cpu, Power } from 'lucide-react';

export default function BIOS() {
  const { setBiosActive } = useOSStore();
  const [activeTab, setActiveTab] = useState('status');

  const biosTabs = [
    { id: 'status', icon: Cpu, label: 'System Status' },
    { id: 'storage', icon: HardDrive, label: 'Storage & Recovery' },
    { id: 'flash', icon: RefreshCw, label: 'Cloud Flash' },
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-zinc-950 flex flex-col font-sans select-none text-zinc-100">
      {/* BIOS Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="text-blue-500" size={32} />
          <h1 className="text-2xl font-bold tracking-tighter">ArcOS UEFI/BIOS Utility Setup</h1>
        </div>
        <div className="text-xs font-mono text-zinc-500">v1.2.0-BIOS</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* BIOS Sidebar */}
        <div className="w-64 border-r border-white/10 p-4 space-y-2">
          {biosTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* BIOS Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-4">System Status & Diagnostics</h2>
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 font-mono text-xs text-zinc-300">
                <p>CPU: AMD Ryzen 9 5950X - <span className="text-green-500">HEALTHY</span></p>
                <p>RAM: 64GB - <span className="text-green-500">HEALTHY</span></p>
                <p>GPU: NVIDIA RTX 4090 - <span className="text-green-500">HEALTHY</span></p>
                <p className="mt-4">OS Filesystem Integrity: <span className="text-green-500">VERIFIED</span></p>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-4">Storage Management</h2>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 p-4 rounded-xl w-full text-left"
              >
                <HardDrive size={20} />
                <div>
                  <div className="font-bold">Wipe Local Storage / Factory Reset</div>
                  <div className="text-xs opacity-70">Clears all data and restores default system settings.</div>
                </div>
              </button>
            </div>
          )}

          {activeTab === 'flash' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-4">Cloud Flash Operations</h2>
              <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 p-4 rounded-xl w-full text-left">
                <RefreshCw size={20} />
                <div>
                  <div className="font-bold">Vanguard Cloud Flash</div>
                  <div className="text-xs opacity-70">Pulls a fresh ArcOS image from remote server.</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BIOS Footer */}
      <div className="p-6 border-t border-white/10 flex justify-end">
        <button
          onClick={() => setBiosActive(false)}
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg text-sm font-bold"
        >
          <Power size={18} />
          <span>Exit & Boot ArcOS</span>
        </button>
      </div>
    </div>
  );
}
