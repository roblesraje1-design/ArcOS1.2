'use client';

import { useState, useRef } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { 
  ShieldCheck, 
  Download, 
  Upload, 
  RefreshCcw, 
  AlertTriangle, 
  FileCheck, 
  HardDrive, 
  Database, 
  CheckCircle2, 
  Laptop,
  Flame,
  FileDown
} from 'lucide-react';

export default function VanguardRestore() {
  const { 
    systemState, 
    customApps, 
    widgets, 
    desktopItems, 
    wallpaper, 
    accentColor 
  } = useOSStore();

  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (text: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  // Compile full OS details and trigger manual download
  const handleCreateBackup = () => {
    try {
      setIsProcessing(true);
      setSuccessMsg(null);
      setLogs([]);
      addLog('Initiating Vanguard OS Compilation Core...');
      
      // Collect standard storage configuration strings if present
      let storageFiles = [];
      if (typeof window !== 'undefined') {
        try {
          storageFiles = JSON.parse(localStorage.getItem('arcos_files_v3') || '[]');
        } catch (e) {
          addLog('Warning: Failed to parse user file registry.');
        }
      }

      addLog('Reading active workspace registries...');
      addLog(`Selected wallpaper: ${wallpaper.slice(0, 40)}...`);
      addLog(`Active theme variables loaded.`);
      addLog(`Discovered ${customApps.length} dynamic HTML Sandboxed Applet files.`);
      addLog(`Indexed ${widgets.length} desktop dashboard widgets.`);
      addLog(`Mapped ${desktopItems.length} launcher shortcuts.`);
      addLog(`Serialized ${storageFiles.length} deep virtual file sectors.`);

      const backupManifest = {
        meta: {
          identifier: 'arcos_vanguard_backup_manifest',
          version: '1.2.0',
          timestamp: Date.now(),
          generatedBy: systemState.userAccount.name,
          hostPCName: systemState.pcName,
        },
        wallpaper,
        accentColor,
        systemState: {
          ...systemState,
          developerMode: systemState.developerMode
        },
        customApps,
        widgets,
        desktopItems,
        files: storageFiles
      };

      const manifestString = JSON.stringify(backupManifest, null, 2);
      const blob = new Blob([manifestString], { type: 'application/json' });
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `arcos_vanguard_${systemState.pcName.toLowerCase()}_backup.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      addLog('Vanguard Bundle exported and downloaded to local filesystem.');
      setIsProcessing(false);
      setSuccessMsg('Active state snapshot compiled and downloaded successfully!');
    } catch (err: any) {
      addLog(`ERR: Compilation crashed: ${err.message || err}`);
      setIsProcessing(false);
    }
  };

  // Import uploaded Vanguard backup JSON and trigger state restoration
  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    setLogs([]);
    setSuccessMsg(null);
    setIsProcessing(true);
    addLog(`Reading incoming file: ${file.name}`);

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (!data || data.meta?.identifier !== 'arcos_vanguard_backup_manifest') {
          throw new Error('Invalid signature. Missing Vanguard Core headers.');
        }

        addLog('Vanguard header signatures VERIFIED.');
        addLog(`Archive generated on: ${new Date(data.meta.timestamp).toLocaleString()}`);
        addLog(`Injecting wallpaper configuration: ${data.wallpaper}`);
        addLog(`Updating layout structures: accentColor ${data.accentColor}`);
        
        let fileCount = 0;
        if (data.files && Array.isArray(data.files)) {
          localStorage.setItem('arcos_files_v3', JSON.stringify(data.files));
          fileCount = data.files.length;
          addLog(`Restored ${fileCount} files into Local Storage.`);
        }

        if (data.customApps && Array.isArray(data.customApps)) {
          localStorage.setItem('arcos_custom_apps', JSON.stringify(data.customApps));
          addLog(`Restored ${data.customApps.length} custom sandbox applets.`);
        }

        // Lock values
        if (data.systemState?.username) {
          localStorage.setItem('arcos_username', data.systemState.username);
        }
        if (data.systemState?.uemail) {
          localStorage.setItem('arcos_uemail', data.systemState.uemail);
        }
        if (data.systemState?.password) {
          localStorage.setItem('arcos_password', data.systemState.password);
        }

        // Hot flash Zustand store state
        useOSStore.setState({
          wallpaper: data.wallpaper || wallpaper,
          accentColor: data.accentColor || accentColor,
          customApps: data.customApps || [],
          widgets: data.widgets || [],
          desktopItems: data.desktopItems || [],
          systemState: {
            ...systemState,
            ...(data.systemState || {}),
          }
        });

        addLog('Master Store hot-flashed... Syncing UI layouts...');
        addLog('System restoring complete! Rebuilding explorer modules.');
        
        setIsProcessing(false);
        setSuccessMsg('Your ArcOS state was successfully flashed to perfect health!');
      } catch (err: any) {
        addLog(`ERR: Restoring failed: ${err.message || err}`);
        setIsProcessing(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 p-6 overflow-y-auto font-sans">
      {/* Brand Header */}
      <div className="flex items-center space-x-4 mb-8 bg-zinc-900/60 p-5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl relative overflow-hidden group">
          <ShieldCheck size={32} className="animate-pulse" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white opacity-40" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Vanguard Restore</span>
            <span className="text-[9px] bg-purple-600 px-2 py-0.5 rounded text-white tracking-widest font-mono font-bold uppercase">Kernel-A</span>
          </h1>
          <p className="text-xs text-zinc-400">Master State Preservation, Recovery Compilation and State Hot-Flashing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Step 1: Export Bundle */}
        <div className="bg-zinc-900/35 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              <Database size={18} className="text-indigo-400" />
              <span>Compile & Save Snapshot</span>
            </div>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Consolidates all system data, active settings modifications, storage directories, 
              home shortcuts, custom apps, and UI widgets into an offline ArcOS Blueprint metadata manifest. 
              The manifest will download immediately to your local hardware.
            </p>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={isProcessing}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all active:scale-95 shadow-md disabled:bg-zinc-800 disabled:text-zinc-600 block"
          >
            <Download size={14} />
            <span>DOWNLOAD MASTER SNAPSHOT</span>
          </button>
        </div>

        {/* Step 2: Import / Flash Bundle */}
        <div className="bg-zinc-900/35 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              <RefreshCcw size={18} className="text-purple-400" />
              <span>Import & Hot-Flash State</span>
            </div>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Select or drop a previously downloaded Vanguard `.json` backup file. Doing so instantly rewrites 
              underlying registry options, reloads files, re-associates custom applications, and synchronizes 
              the system without a full browser reboot.
            </p>
          </div>
          <div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleUploadBackup}
              accept=".json"
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all active:scale-95 shadow-lg disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 block"
            >
              <Upload size={14} />
              <span>UPLOAD & FLASH METADATA</span>
            </button>
          </div>
        </div>
      </div>

      {/* State Diagnostics & Live Log Buffer */}
      <div className="bg-zinc-950 border border-white/5 rounded-2xl p-5 mb-4 flex-1 flex flex-col min-h-[220px]">
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Laptop size={14} className="text-zinc-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest font-mono">Kernel Output Buffer & Logs</span>
          </div>
          {successMsg && (
            <span className="text-xs text-green-400 font-bold flex items-center space-x-1.5 font-mono">
              <CheckCircle2 size={12} />
              <span>READY</span>
            </span>
          )}
        </div>

        {successMsg && (
          <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-green-300">Operation Succeeded!</p>
              <p className="text-[11px] text-green-400/80 mt-1">{successMsg}</p>
            </div>
          </div>
        )}

        {logs.length > 0 ? (
          <div className="flex-1 bg-black/60 font-mono text-[10px] text-zinc-400 p-4 rounded-xl border border-white/5 overflow-y-auto max-h-[160px] space-y-1 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className={log.includes('ERR') ? 'text-red-400' : log.includes('Warning') ? 'text-amber-400' : 'text-zinc-300'}>
                {log}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-600 border border-dashed border-white/5 rounded-xl py-8">
            <FileCheck size={28} className="mb-2 opacity-30" />
            <p className="text-xs font-semibold">Active Standby Mode</p>
            <p className="text-[10px] text-zinc-500 max-w-xs mt-1">Compile backups or upload blueprints to initiate operations.</p>
          </div>
        )}
      </div>

      {/* Cloud-Recovery and Safety Notice */}
      <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start space-x-3">
        <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-zinc-300 uppercase tracking-wide">VANGUARD EMERGENCY BIOS INTERFACE</p>
          <p className="text-[10px] text-zinc-500 leading-normal mt-1">
            If you enable Developer &ldquo;God Mode&rdquo; and tweak the system assets directly, you can easily crash the OS system boot structures. 
            Should the system fail to load, reboot the tab and strike the <span className="text-white font-mono bg-zinc-800 px-1 py-0.5 rounded font-bold">A</span> key <span className="text-white font-bold">4 or more times rapidly</span> during the splash boot window to trigger the GUI BIOS.
          </p>
        </div>
      </div>
    </div>
  );
}
