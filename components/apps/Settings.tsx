'use client';

import { useState } from 'react';
import { 
  useOSStore 
} from '@/store/useOSStore';
import { 
  Monitor, 
  Wifi, 
  Bluetooth, 
  User, 
  AppWindow, 
  Settings as SettingsIcon, 
  Lock, 
  Accessibility, 
  Search, 
  ChevronRight, 
  Sun, 
  Volume2, 
  Battery, 
  HardDrive, 
  Info, 
  Check, 
  RefreshCcw,
  Shield,
  Clock,
  Globe,
  Ghost,
  Camera,
  Mic,
  Palette,
  Layout,
  Zap,
  MousePointer2,
  Trash2,
  History
} from 'lucide-react';

const SidebarItem = ({ id, activeTab, setActiveTab, icon: Icon, label }: { id: string, activeTab: string, setActiveTab: (id: string) => void, icon: any, label: string }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-all ${
      activeTab === id ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
    }`}
  >
    <Icon size={18} className={activeTab === id ? 'text-blue-400' : ''} />
    <span>{label}</span>
    {activeTab === id && (
      <div className="ml-auto w-1 h-4 bg-blue-500 rounded-full" />
    )}
  </button>
);

const SettingRow = ({ icon: Icon, label, description, rightContent, onClick }: { icon: any, label: string, description?: string, rightContent?: React.ReactNode, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-xl transition-all ${onClick ? 'hover:bg-white/5 cursor-pointer bg-white/5 border border-white/5 mb-1' : 'bg-transparent'}`}
  >
    <div className="flex items-center space-x-4">
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
          <Icon size={20} />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-100">{label}</span>
        {description && <span className="text-[11px] text-zinc-500">{description}</span>}
      </div>
    </div>
    <div className="flex items-center space-x-3">
      {rightContent}
      {onClick && <ChevronRight size={14} className="text-zinc-600" />}
    </div>
  </div>
);

const Toggle = ({ value, onChange }: { value: boolean, onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!value)}
    className={`w-10 h-5 rounded-full p-1 transition-colors relative ${value ? 'bg-blue-500' : 'bg-zinc-700'}`}
  >
    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export default function Settings() {
  const { systemState, updateSystemState, accentColor, setAccentColor, customApps, removeCustomApp, setWallpaper, wallpaper } = useOSStore();
  const [activeTab, setActiveTab] = useState('system');
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempPCName, setTempPCName] = useState(systemState.pcName);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('Updates available');

  const handleCheckUpdates = () => {
    setIsUpdating(true);
    setUpdateStatus('Checking for updates...');
    setTimeout(() => {
      setIsUpdating(false);
      setUpdateStatus('Your system is up to date');
    }, 3000);
  };

  const wallpapers = [
    { name: 'Abstract Glow', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', color: '#8b5cf6' },
    { name: 'Emerald Flow', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2548&auto=format&fit=crop', color: '#10b981' },
    { name: 'Ocean Mist', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop', color: '#0ea5e9' },
    { name: 'Dark Aurora', url: 'https://images.unsplash.com/photo-1541450805268-4822a3a774ce?q=80&w=2670&auto=format&fit=crop', color: '#4f46e5' },
    { name: 'Deep Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop', color: '#312e81' },
    { name: 'Sunset Gradient', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop', color: '#f59e0b' },
  ];

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 h-full bg-zinc-900/50 flex flex-col p-4 border-r border-white/5">
        <div className="flex items-center space-x-3 mb-8 px-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-xl">
               JP
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-100">{systemState.userAccount.name}</span>
                <span className="text-[11px] text-zinc-500">{systemState.userAccount.email}</span>
            </div>
        </div>

        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Find a setting" 
              className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-xs text-zinc-200 outline-none focus:border-blue-500/50 transition-all shadow-inner"
            />
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem id="system" activeTab={activeTab} setActiveTab={setActiveTab} icon={Monitor} label="System" />
          <SidebarItem id="bt" activeTab={activeTab} setActiveTab={setActiveTab} icon={Bluetooth} label="Bluetooth & devices" />
          <SidebarItem id="network" activeTab={activeTab} setActiveTab={setActiveTab} icon={Wifi} label="Network & internet" />
          <SidebarItem id="personalization" activeTab={activeTab} setActiveTab={setActiveTab} icon={Palette} label="Personalization" />
          <SidebarItem id="apps" activeTab={activeTab} setActiveTab={setActiveTab} icon={AppWindow} label="Apps" />
          <SidebarItem id="accounts" activeTab={activeTab} setActiveTab={setActiveTab} icon={User} label="Accounts" />
          <SidebarItem id="time" activeTab={activeTab} setActiveTab={setActiveTab} icon={Clock} label="Time & language" />
          <SidebarItem id="gaming" activeTab={activeTab} setActiveTab={setActiveTab} icon={Zap} label="Gaming" />
          <SidebarItem id="accessibility" activeTab={activeTab} setActiveTab={setActiveTab} icon={Accessibility} label="Accessibility" />
          <SidebarItem id="privacy" activeTab={activeTab} setActiveTab={setActiveTab} icon={Shield} label="Privacy & security" />
          <SidebarItem id="update" activeTab={activeTab} setActiveTab={setActiveTab} icon={RefreshCcw} label="Windows Update" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-12 bg-zinc-950">
        {activeTab === 'system' && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-8">
               <h1 className="text-3xl font-bold text-zinc-100">System</h1>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 mb-8 flex items-center space-x-6 backdrop-blur-xl">
               <div className="w-56 h-32 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Monitor size={48} className="text-zinc-700" />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-zinc-800/80 rounded text-[9px] font-mono text-zinc-400">{systemState.pcName}</div>
               </div>
               <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">ArcOS Pro v{systemState.buildNumber}</h2>
                  {isRenaming ? (
                    <div className="flex items-center space-x-2 mb-4">
                      <input 
                        type="text" 
                        value={tempPCName} 
                        onChange={(e) => setTempPCName(e.target.value)}
                        className="bg-black/50 border border-blue-500/30 rounded px-2 py-1 text-xs text-white outline-none w-48"
                      />
                      <button 
                        onClick={() => { updateSystemState('pcName', tempPCName); setIsRenaming(false); }}
                        className="text-[11px] bg-blue-600 text-white px-2 py-1 rounded"
                      >Save</button>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400 mb-4 line-clamp-1">{systemState.specs.cpu}, {systemState.specs.ram} RAM, {systemState.specs.gpu}</p>
                  )}
                  <div className="flex space-x-2">
                     <button 
                      onClick={() => setIsRenaming(true)}
                      className="text-[11px] bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-all font-medium"
                     >Rename PC</button>
                     <button 
                      onClick={() => setActiveTab('about')}
                      className="text-[11px] bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1.5 rounded-lg transition-all border border-white/5"
                     >System info</button>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">ArcOS License</div>
                  <div className="text-[11px] text-zinc-500">Activated via Neural Core</div>
               </div>
            </div>

            <div className="space-y-1">
              <SettingRow icon={Monitor} label="Display" description="Brightness, night light, display profile" onClick={() => {}} />
              <SettingRow icon={Volume2} label="Sound" description="Volume levels, output devices, spatial sound" onClick={() => {}} />
              <SettingRow icon={Notifications} label="Notifications" description="Alerts from apps and system" rightContent={<Toggle value={systemState.notificationsEnabled} onChange={(v) => updateSystemState('notificationsEnabled', v)} />} onClick={() => {}} />
              <SettingRow icon={Clock} label="Focus" description="Minimize distractions with focus mode" rightContent={<Toggle value={systemState.focusMode} onChange={(v) => updateSystemState('focusMode', v)} />} onClick={() => {}} />
              <SettingRow icon={HardDrive} label="Storage" description="Storage space, drives, cleanup recommendations" onClick={() => {}} 
                rightContent={<div className="text-right pr-4"><div className="text-[10px] text-zinc-500 uppercase font-bold">SSD (C:)</div><div className="text-xs text-zinc-300">{systemState.storageUsed}GB / {systemState.storageTotal}GB</div></div>} 
              />
              <SettingRow icon={Battery} label="Power & battery" description="Sleep patterns, battery usage, save mode" rightContent={<div className="text-sm font-bold text-green-500">{systemState.battery}%</div>} onClick={() => {}} />
              <SettingRow icon={Monitor} label="Multitasking" description="Snap windows, desktops, task switching" onClick={() => {}} />
              <SettingRow icon={SettingsIcon} label="Developers" description="Terminal, SSH, bash environment" rightContent={<Toggle value={systemState.developerMode} onChange={(v) => updateSystemState('developerMode', v)} />} onClick={() => {}} />
              <SettingRow icon={Info} label="About" description="Device specifications, Windows version" onClick={() => {}} />
            </div>
          </div>
        )}

        {activeTab === 'personalization' && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-zinc-100 mb-8">Personalization</h1>
            
            <div className="mb-10">
               <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-widest">Select a wallpaper</h3>
               <div className="grid grid-cols-3 gap-4">
                 {wallpapers.map((t) => (
                   <button 
                     key={t.name}
                     onClick={() => {
                        setWallpaper(t.url);
                        setAccentColor(t.color);
                     }}
                     className="group flex flex-col space-y-2 text-left"
                   >
                     <div className="aspect-video bg-zinc-800 rounded-xl overflow-hidden border border-white/5 group-hover:border-blue-500 transition-all shadow-xl relative">
                        <img src={t.url} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {wallpaper === t.url && (
                          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-2xl">
                                <Check size={20} />
                             </div>
                          </div>
                        )}
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500 group-hover:text-zinc-100 ml-1">{t.name}</span>
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-1">
               <SettingRow icon={Monitor} label="Background" description="Desktop wallpaper settings" onClick={() => {}} />
               <SettingRow icon={Palette} label="Colors" description="Accent colors, transparency effects" onClick={() => {}} 
                  rightContent={<div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: accentColor }} />
                      <Toggle value={systemState.transparency} onChange={(v) => updateSystemState('transparency', v)} />
                  </div>}
               />
               <SettingRow icon={HardDrive} label="Lock screen" description="Images, widgets, calendar" onClick={() => {}} />
               <SettingRow icon={Layout} label="Taskbar" description="Alignment, search box, behaviors" onClick={() => {}} 
                  rightContent={<select 
                    value={systemState.taskbarAlignment}
                    onChange={(e) => updateSystemState('taskbarAlignment', e.target.value)}
                    className="bg-zinc-800 border-none rounded text-xs text-zinc-300 p-1 outline-none"
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                  </select>}
               />
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-zinc-100 mb-8">Installed Apps</h1>
            
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl">
               <div className="p-4 border-b border-white/5 bg-zinc-800/30 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{customApps.length + 8} Apps Installed</span>
                  <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="text" placeholder="Filter apps" className="bg-zinc-950 border border-white/5 rounded-md py-1 pl-8 pr-3 text-[10px] text-zinc-300 outline-none" />
                  </div>
               </div>
               <div className="divide-y divide-white/5">
                  {/* Built-in apps (static list) */}
                  {['Browser', 'Terminal', 'Files', 'Settings', 'Media Player', 'Photo Viewer'].map(name => (
                    <div key={name} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-blue-400">
                             <AppWindow size={24} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-medium text-zinc-200">{name}</span>
                             <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">System Integrated</span>
                          </div>
                       </div>
                       <button className="text-[10px] bg-white/5 text-zinc-500 px-3 py-1.5 rounded-lg border border-white/5 cursor-not-allowed">Uninstall Locked</button>
                    </div>
                  ))}

                  {/* Custom Apps */}
                  {customApps.map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                             <Ghost size={24} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-medium text-zinc-200">{app.title}</span>
                             <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Sandboxed Applet</span>
                          </div>
                       </div>
                       <button 
                         onClick={() => {
                           if (confirm(`Are you sure you want to uninstall ${app.title}?`)) {
                             removeCustomApp(app.id);
                           }
                         }}
                         className="flex items-center space-x-1 text-[10px] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded-lg border border-red-500/30 transition-all font-bold"
                       >
                         <Trash2 size={12} />
                         <span>Uninstall</span>
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-zinc-100 mb-8">Privacy & security</h1>
            
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 mb-8 backdrop-blur-xl">
               <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                     <Lock size={24} />
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-white">Sign-in options</h3>
                     <p className="text-[11px] text-zinc-500">Manage how you sign in to ArcOS</p>
                  </div>
               </div>

               <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                     <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block ml-1">Set New Password</label>
                        <input 
                           type="password" 
                           placeholder="Enter new PIN or Password" 
                           value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)}
                           className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                        />
                     </div>
                     <button 
                        onClick={() => { 
                           updateSystemState('password', newPassword); 
                           setNewPassword('');
                        }}
                        className="self-end bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 h-[42px]"
                     >
                        Update
                     </button>
                  </div>
                  
                  {systemState.password && (
                    <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                       <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Password Protection Active</span>
                       <button 
                        onClick={() => updateSystemState('password', null)}
                        className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest px-3 py-1 bg-white/5 rounded-md"
                       >Disable</button>
                    </div>
                  )}
               </div>
            </div>

            <div className="space-y-1 mb-8">
               <h3 className="text-sm font-semibold text-zinc-400 mb-4 px-4 uppercase tracking-widest">Security Features</h3>
               <SettingRow icon={Lock} label="Lock Screen" description="Secure OS when not in use" rightContent={<Toggle value={systemState.lockScreenEnabled} onChange={(v) => updateSystemState('lockScreenEnabled', v)} />} />
               <SettingRow icon={Shield} label="Neural Shield" description="Real-time monitoring and threat prevention" rightContent={<Toggle value={true} onChange={() => {}} />} />
            </div>

            <div className="space-y-1">
               <h3 className="text-sm font-semibold text-zinc-400 mb-4 px-4 uppercase tracking-widest">App Permissions</h3>
               <SettingRow icon={Camera} label="Camera" description="Allow apps to access your camera" rightContent={<Toggle value={systemState.cameraAccess} onChange={(v) => updateSystemState('cameraAccess', v)} />} />
               <SettingRow icon={Mic} label="Microphone" description="Allow apps to access your microphone" rightContent={<Toggle value={systemState.micAccess} onChange={(v) => updateSystemState('micAccess', v)} />} />
               <SettingRow icon={Globe} label="Location" description="Allow apps to access your location" rightContent={<Toggle value={systemState.location} onChange={(v) => updateSystemState('location', v)} />} />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">
             <h1 className="text-3xl font-bold text-zinc-100 mb-8">System Information</h1>
             <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div>
                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Device Name</label>
                         <span className="text-lg font-bold text-white">{systemState.pcName}</span>
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Processor</label>
                         <span className="text-sm text-zinc-300">{systemState.specs.cpu}</span>
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Installed RAM</label>
                         <span className="text-sm text-zinc-300">{systemState.specs.ram}</span>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div>
                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">System Graphics</label>
                         <span className="text-sm text-zinc-300">{systemState.specs.gpu}</span>
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Edition</label>
                         <span className="text-sm text-zinc-300">{systemState.specs.os}</span>
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Environment</label>
                         <span className="text-[11px] font-mono text-zinc-500">{systemState.specs.browser}</span>
                      </div>
                   </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                   <span className="text-xs text-zinc-500 font-mono">BUILD_VER: {systemState.buildNumber}.RTX_ENGINE</span>
                   <button onClick={() => window.location.reload()} className="text-[11px] text-blue-500 font-bold hover:underline">Check for Updates</button>
                </div>
             </div>
          </div>
        )}

        {systemState.developerMode && activeTab === 'godmode' && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">
             <h1 className="text-3xl font-bold text-zinc-100 mb-8">God Mode</h1>
             <div className="bg-black border border-red-500/20 p-6 rounded-xl font-mono text-xs text-red-400">
                <p>/* WARNING: SYSTEM INTEGRITY IN JEOPARDY */</p>
                <p>God Mode active. Modifying these assets will permanently alter ArcOS state.</p>
                <pre className="mt-4 overflow-auto">
                  {JSON.stringify(systemState, null, 2)}
                </pre>
             </div>
          </div>
        )}

        {activeTab === 'update' && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-start justify-between mb-8">
                <div>
                   <h1 className="text-3xl font-bold text-zinc-100 mb-2">Windows Update</h1>
                   <p className="text-sm text-zinc-500">Last checked: Today, {new Date().toLocaleTimeString()}</p>
                </div>
                <button 
                  onClick={handleCheckUpdates}
                  disabled={isUpdating}
                  className={`${isUpdating ? 'bg-zinc-700' : 'bg-blue-600 hover:bg-blue-500'} text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95 flex items-center space-x-2`}
                >
                   {isUpdating && <RefreshCcw size={14} className="animate-spin" />}
                   <span>{isUpdating ? 'Checking...' : 'Check for updates'}</span>
                </button>
             </div>

             <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 mb-6 backdrop-blur-xl flex items-center space-x-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                   <RefreshCcw size={32} className={isUpdating ? "animate-spin" : "animate-spin-slow"} />
                </div>
                <div className="flex-1">
                   <h3 className="text-lg font-bold text-white mb-2">{updateStatus}</h3>
                   {updateStatus === 'Updates available' && (
                     <>
                        <p className="text-sm text-zinc-400 mb-4">ArcOS Security Intelligence Update - Version {systemState.buildNumber}.12</p>
                        
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-2">
                           <div className="h-full bg-blue-500 w-[65%] animate-pulse" />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                           <span>Downloading - 65%</span>
                           <span>25.4 MB / 39.1 MB</span>
                        </div>
                     </>
                   )}
                   {updateStatus === 'Your system is up to date' && (
                      <p className="text-sm text-zinc-500 italic">No new updates found at this time.</p>
                   )}
                </div>
             </div>

             <div className="space-y-1">
                <SettingRow icon={Clock} label="Pause updates" description="Pause for 1 week" onClick={() => {}} />
                <SettingRow icon={History} label="Update history" description="See what was installed" onClick={() => {}} />
                <SettingRow icon={SettingsIcon} label="Advanced options" description="Delivery optimization, optional updates" onClick={() => {}} />
             </div>
          </div>
        )}

        {/* Placeholder tabs */}
        {(['bt', 'network', 'accounts', 'time', 'gaming', 'accessibility']).includes(activeTab) && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
             <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6">
                <SettingsIcon size={48} className="text-zinc-700 animate-spin-slow" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Section is under construction</h2>
             <p className="text-zinc-500 text-sm max-w-xs">Our engineers are working hard to bring this configuration panel to ArcOS.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Notifications(props: any) { return <Monitor {...props} /> } // Helper or icon fallback
