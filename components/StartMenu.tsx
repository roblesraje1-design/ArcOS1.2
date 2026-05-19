'use client';

import { useOSStore } from '@/store/useOSStore';
import { Search, Power, Settings, FileText, Globe, TerminalSquare, Languages, Code2, Folder, LayoutGrid, LayoutIcon, Moon, RefreshCcw, Trash2, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

const PINNED_APPS = [
  { id: 'browser', title: 'Edge', icon: Globe, color: 'text-blue-500' },
  { id: 'neuralcore', title: 'Neural Core', icon: Brain, color: 'text-purple-500' },
  { id: 'devstudio', title: 'App Engine', icon: LayoutGrid, color: 'text-[#00f0ff]' },
  { id: 'settings', title: 'Settings', icon: Settings, color: 'text-zinc-300' },
  { id: 'files', title: 'Explorer', icon: Folder, color: 'text-yellow-500' },
  { id: 'terminal', title: 'Terminal', icon: TerminalSquare, color: 'text-green-500' },
];

export default function StartMenu() {
  const { closeStartMenu, openApp, customApps, openContextMenu, removeCustomApp, systemState } = useOSStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'pinned' | 'all'>('pinned');

  const handleOpenApp = (appId: any, title: string) => {
    openApp(appId, title);
    closeStartMenu();
  };

  const allPinned = [...PINNED_APPS, ...customApps.map(app => ({
    id: app.id,
    title: app.title,
    icon: LayoutIcon,
    color: 'text-blue-400'
  }))];

  const filteredApps = allPinned.filter(app => app.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // For "More" recommended items
  const recommendedItems = [
    { name: 'System Guidelines.pdf', time: 'Yesterday at 1:15 PM', icon: FileText, color: 'text-red-400' },
    { name: 'ArcOS Config', time: '17m ago', icon: FileText, color: 'text-blue-400' },
    { name: 'Project Proposal', time: '2h ago', icon: FileText, color: 'text-green-400' },
    { name: 'Welcome.txt', time: '12h ago', icon: FileText, color: 'text-zinc-300' },
    { name: 'Financials.xlsx', time: '3h ago', icon: FileText, color: 'text-green-600' },
    { name: 'Design Specs', time: '5h ago', icon: FileText, color: 'text-purple-400' },
  ];

  const handleRightClickApp = (e: React.MouseEvent, app: any) => {
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY, [
      { label: `Open ${app.title}`, action: () => handleOpenApp(app.id, app.title) },
      { label: 'Pin to Start', action: () => {} },
      { label: 'Uninstall', icon: Trash2, action: () => {
         if (confirm(`Uninstall ${app.title}?`)) removeCustomApp(app.id);
      }, danger: true },
    ]);
  };

  const handlePowerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY - 120, [
      { label: 'Sleep', icon: Moon, action: () => {} },
      { label: 'Restart', icon: RefreshCcw, action: () => window.location.reload() },
      { label: 'Shut down', icon: Power, action: () => {
         document.body.innerHTML = '<div style="display:flex; height:100vh; background:black; color:white; align-items:center; justify-content:center; font-family:sans-serif;">System shut down.</div>';
      } },
    ]);
  };

  return (
    <div 
      className="absolute bottom-16 left-1/2 z-50 flex h-[620px] w-[560px] -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900/80 shadow-2xl backdrop-blur-3xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search Bar section */}
      <div className="p-8 pb-4">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-zinc-400" size={18} />
          <input
            type="text"
            autoFocus
            className="w-full rounded-full border border-zinc-700 bg-zinc-800/60 py-3 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-all shadow-inner focus:bg-zinc-800"
            placeholder="Type here to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && filteredApps.length > 0) {
                 handleOpenApp(filteredApps[0].id, filteredApps[0].title);
               }
            }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
        {viewMode === 'pinned' && !searchQuery ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-200">Pinned</h3>
              <button 
                onClick={() => setViewMode('all')}
                className="rounded-md bg-white/5 px-3 py-1 text-[11px] font-medium text-zinc-300 transition hover:bg-white/10"
              >
                All apps {'>'}
              </button>
            </div>
            
            <div className="grid grid-cols-6 gap-y-4">
              {allPinned.slice(0, 18).map((app) => (
                <div key={app.id} className="flex flex-col items-center justify-start py-2 group">
                  <button
                    onClick={() => handleOpenApp(app.id, app.title)}
                    onContextMenu={(e) => handleRightClickApp(e, app)}
                    className="flex h-14 w-14 items-center justify-center rounded-xl transition-all group-hover:bg-white/5 active:scale-90"
                  >
                    <app.icon className={`${app.color} drop-shadow-lg`} size={32} strokeWidth={1.5} />
                  </button>
                  <span className="mt-1 text-center text-[11px] text-zinc-300 line-clamp-1 w-full px-1">{app.title}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 mb-4 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-200">Recommended</h3>
              <button 
                onClick={() => handleOpenApp('files', 'File Explorer')}
                className="rounded-md bg-white/5 px-3 py-1 text-[11px] font-medium text-zinc-300 transition hover:bg-white/10"
              >
                More {'>'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 pb-4">
              {recommendedItems.slice(0, 6).map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleOpenApp('files', 'File Explorer')}
                  className="flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition hover:bg-white/5 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10">
                    <item.icon className={item.color} size={20} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-xs font-medium text-zinc-200">{item.name}</span>
                    <span className="truncate text-[10px] text-zinc-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-200">
                {searchQuery ? 'Search Results' : 'All Apps'}
              </h3>
              <button 
                onClick={() => setViewMode('pinned')}
                className="rounded-md bg-white/5 px-3 py-1 text-[11px] font-medium text-zinc-300 transition hover:bg-white/10"
              >
                {'<'} Back
              </button>
            </div>
            
            <div className="flex flex-col space-y-1">
              {(searchQuery ? filteredApps : allPinned).map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleOpenApp(app.id, app.title)}
                  onContextMenu={(e) => handleRightClickApp(e, app)}
                  className="flex w-full items-center space-x-4 rounded-lg p-2 transition-all hover:bg-white/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50">
                    <app.icon className={app.color} size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{app.title}</span>
                </button>
              ))}
              {(searchQuery ? filteredApps : allPinned).length === 0 && (
                <div className="py-12 text-center text-zinc-500 text-sm">No apps found matching &quot;{searchQuery}&quot;</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Profile & Power */}
      <div className="flex items-center justify-between border-t border-white/5 bg-zinc-950/20 px-8 py-5">
        <div className="flex cursor-pointer items-center space-x-3 rounded-lg px-3 py-1.5 transition hover:bg-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-xl">
            {systemState.userAccount.avatar}
          </div>
          <span className="text-xs font-medium text-zinc-200">{systemState.userAccount.name}</span>
        </div>
        <div className="flex items-center space-x-2">
           <button 
             onClick={() => openApp('settings', 'Settings')}
             className="p-2 rounded-lg text-zinc-400 hover:bg-white/5 transition-colors"
           >
              <Settings size={18} />
           </button>
           <button 
            onClick={handlePowerClick}
            className="rounded-lg p-2 text-zinc-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <Power size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
