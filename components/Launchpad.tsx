'use client';

import { useState, useEffect, useRef } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { Search, X } from 'lucide-react';
import AppIcon, { APP_METADATA } from '@/components/AppIcon';
import { getAppContextMenuOptions } from '@/lib/appContextMenu';

const DEFAULT_LAUNCHPAD_APPS = [
  { id: 'browser', title: 'Rammerhead', category: 'Internet' },
  { id: 'settings', title: 'Settings', category: 'System' },
  { id: 'files', title: 'File Explorer', category: 'Productivity' },
  { id: 'iframe', title: 'iFrame Studio', category: 'Utilities' },
  { id: 'neuralcore', title: 'Arc AI', category: 'AI Tools' },
  { id: 'terminal', title: 'Terminal', category: 'Developer' },
  { id: 'calculator', title: 'Calculator', category: 'Utilities' },
  { id: 'drive', title: 'Google Drive', category: 'Cloud' },
  { id: 'gmail', title: 'Gmail', category: 'Communication' },
  { id: 'meet', title: 'Google Meet', category: 'Communication' },
  { id: 'keep', title: 'Google Keep', category: 'Productivity' },
  { id: 'weather', title: 'Weather', category: 'Utilities' },
  { id: 'clock', title: 'Clock', category: 'Utilities' },
  { id: 'docs', title: 'Google Docs', category: 'Productivity' },
  { id: 'slides', title: 'Google Slides', category: 'Productivity' },
  { id: 'devstudio', title: 'Dev Studio', category: 'Developer' },
  { id: 'photoviewer', title: 'Photos', category: 'Media' },
  { id: 'mediaplayer', title: 'Media Player', category: 'Media' },
  { id: 'tips', title: 'ArcOS Tips', category: 'Help' },
];

export default function Launchpad() {
  const {
    isLaunchpadOpen,
    closeLaunchpad,
    openApp,
    dockAppIds,
    desktopItems,
    addToDock,
    removeFromDock,
    addToDesktop,
    removeFromDesktop,
    toggleCalculatorPopup,
    toggleAIAssistant,
    webApps,
    removeWebApp,
    openContextMenu,
  } = useOSStore();

  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLaunchpadOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
        setSearch('');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLaunchpadOpen]);

  // Handle Escape key to dismiss
  useEffect(() => {
    if (!isLaunchpadOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLaunchpad();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLaunchpadOpen, closeLaunchpad]);

  if (!isLaunchpadOpen) return null;

  // Combine default apps with user-created iframe web apps
  const allApps = [
    ...DEFAULT_LAUNCHPAD_APPS,
    ...webApps
      .filter((w) => w.inLaunchpad !== false)
      .map((w) => ({
        id: w.id,
        title: w.name,
        category: w.category || 'Web App',
        customBgGradient: w.bgGradient,
        url: w.url,
      })),
  ];

  const filteredApps = allApps.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAppContextMenu = (
    e: React.MouseEvent,
    appId: string,
    title: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const options = getAppContextMenuOptions(appId, title, {
      openApp,
      dockAppIds,
      desktopItems,
      addToDock,
      removeFromDock,
      addToDesktop,
      removeFromDesktop,
      toggleCalculatorPopup,
      toggleAIAssistant,
      webApps,
      removeWebApp,
    });

    openContextMenu(e.clientX, e.clientY, options);
  };

  return (
    <div
      id="macos-launchpad-overlay"
      className="fixed inset-0 z-[140] bg-black/75 backdrop-blur-3xl flex flex-col items-center justify-start pt-14 pb-10 px-6 select-none animate-in fade-in duration-200 overflow-y-auto"
      onClick={closeLaunchpad}
    >
      {/* Search Bar */}
      <div
        className="w-80 max-w-full flex items-center px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white shadow-2xl backdrop-blur-xl mb-12"
        onClick={(e) => e.stopPropagation()}
      >
        <Search size={16} className="text-zinc-400 mr-2 shrink-0" />
        <input
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Launchpad apps..."
          className="bg-transparent text-sm text-white placeholder-zinc-400 outline-none w-full"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-zinc-400 hover:text-white ml-2 text-xs"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Grid of Apps */}
      <div
        className="max-w-5xl w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-y-10 gap-x-6 justify-items-center mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {filteredApps.map((app) => {
          return (
            <div
              key={app.id}
              onClick={() => {
                const webApp = webApps.find((w) => w.id === app.id);
                if (webApp) {
                  openApp(app.id, app.title, { url: webApp.url });
                } else {
                  openApp(app.id, app.title);
                }
                closeLaunchpad();
              }}
              onContextMenu={(e) => handleAppContextMenu(e, app.id, app.title)}
              className="flex flex-col items-center group focus:outline-none cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-colors"
            >
              <div className="group-hover:scale-110 group-active:scale-95 transition-transform duration-200">
                <AppIcon
                  appId={app.id}
                  size="xl"
                  customBgGradient={(app as any).customBgGradient}
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-white/90 group-hover:text-white mt-3 text-center tracking-tight drop-shadow-md line-clamp-1 max-w-[90px]">
                {app.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto text-[11px] text-zinc-500 font-medium">
        Press <span className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">Esc</span> or click anywhere to exit Launchpad • Right-click apps for actions
      </div>
    </div>
  );
}
