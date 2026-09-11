'use client';

import { useState } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { LayoutGrid, Trash2, Layers, X, Monitor, AppWindow, Search } from 'lucide-react';
import AppIcon, { APP_METADATA } from '@/components/AppIcon';
import { getAppContextMenuOptions } from '@/lib/appContextMenu';

export default function Dock() {
  const {
    windows,
    openApp,
    closeApp,
    minimizeApp,
    focusApp,
    activeWindowId,
    systemState,
    toggleLaunchpad,
    isLaunchpadOpen,
    openTaskView,
    toggleSpotlight,
    dockAppIds,
    desktopItems,
    addToDock,
    removeFromDock,
    addToDesktop,
    removeFromDesktop,
    webApps,
    removeWebApp,
    openContextMenu,
    toggleCalculatorPopup,
    toggleAIAssistant,
  } = useOSStore();

  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [isBottomHovered, setIsBottomHovered] = useState(false);

  // Check if any windows are currently open & visible on desktop
  const hasOpenWindows = windows.some((w) => w.isOpen && !w.isMinimized);

  // Auto-hide behavior: If autoHideDock is enabled OR if there are open windows on the screen,
  // hide the dock until mouse hovers bottom area.
  const shouldHideDock = systemState.autoHideDock && hasOpenWindows && !isBottomHovered;

  // Compute unpinned running apps so every running app is visible on the dock
  const unpinnedRunningAppIds = Array.from(
    new Set(windows.map((w) => w.appId).filter((id) => !dockAppIds.includes(id)))
  );

  const getDockStyleClasses = () => {
    switch (systemState.dockStyle) {
      case 'macos-bigsur':
        return 'rounded-3xl bg-white/15 backdrop-blur-3xl border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.65)] ring-1 ring-white/20';
      case 'neumorphic':
        return 'rounded-2xl bg-zinc-900 border border-zinc-700/50 shadow-[6px_6px_14px_rgba(0,0,0,0.8),-4px_-4px_10px_rgba(255,255,255,0.05)]';
      case 'cyberpunk':
        return 'rounded-xl bg-black/90 backdrop-blur-xl border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)]';
      case 'pill-compact':
        return 'rounded-full bg-zinc-900/90 backdrop-blur-2xl border border-white/15 px-4 shadow-2xl';
      case 'windows-center':
        return 'rounded-xl bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 shadow-2xl';
      case 'macos-glass':
      default:
        return 'rounded-2xl bg-zinc-900/70 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)]';
    }
  };

  const handleAppClick = (appId: string, title: string, webAppUrl?: string) => {
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      if (existing.id === activeWindowId && !existing.isMinimized) {
        minimizeApp(existing.id);
      } else {
        focusApp(existing.id);
      }
    } else {
      openApp(appId, title, webAppUrl ? { url: webAppUrl } : undefined);
    }
  };

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

  const renderDockItem = (appId: string) => {
    const meta = APP_METADATA[appId];
    const webApp = webApps.find((w) => w.id === appId);
    const title = meta?.title || webApp?.name || appId;

    const appWindows = windows.filter((w) => w.appId === appId);
    const isRunning = appWindows.length > 0;
    const isActive =
      activeWindowId && windows.find((w) => w.id === activeWindowId)?.appId === appId;
    const isHovered = hoveredApp === appId;

    return (
      <div
        key={appId}
        className="relative flex flex-col items-center group"
        onMouseEnter={() => setHoveredApp(appId)}
        onMouseLeave={() => setHoveredApp(null)}
      >
        {/* Dock Live Window Preview on Hover */}
        {isHovered && isRunning && (
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[200] pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="w-56 rounded-2xl bg-zinc-900/95 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-2.5 flex flex-col space-y-2">
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 px-0.5">
                <div className="flex items-center space-x-1.5 min-w-0">
                  <div className="flex space-x-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-200 truncate ml-1">{title}</span>
                </div>
                {appWindows[0] && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeApp(appWindows[0].id);
                    }}
                    className="p-1 hover:bg-red-500/80 hover:text-white rounded-md text-zinc-400 transition-colors"
                    title="Close Window"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Preview Content Body */}
              <div
                onClick={() => {
                  if (appWindows[0]) {
                    focusApp(appWindows[0].id);
                  }
                }}
                className="group/card relative bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-xl p-3 border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all aspect-video overflow-hidden"
              >
                <div className="flex flex-col items-center justify-center space-y-1 group-hover/card:scale-105 transition-transform">
                  <AppIcon appId={appId} size="md" customBgGradient={webApp?.bgGradient} />
                  <span className="text-[10px] text-zinc-300 font-medium truncate max-w-[150px]">
                    {appWindows[0]?.title || title}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-1.5 right-1.5 flex items-center space-x-1 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/10">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      appWindows[0]?.isMinimized ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                    }`}
                  />
                  <span className="text-[9px] text-zinc-300 capitalize font-mono">
                    {appWindows[0]?.isMinimized ? 'Minimized' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="text-[9px] text-zinc-400 text-center font-medium">
                Click preview to bring to front
              </div>
            </div>
          </div>
        )}

        {/* Standard Title Tooltip (when NOT running) */}
        {isHovered && !isRunning && (
          <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-zinc-800/90 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium shadow-md whitespace-nowrap animate-in fade-in duration-100 z-50 pointer-events-none">
            {title}
          </div>
        )}

        {/* App Icon Button */}
        <button
          onClick={() => handleAppClick(appId, title, webApp?.url)}
          onContextMenu={(e) => handleAppContextMenu(e, appId, title)}
          className="transition-all duration-200 hover:-translate-y-2 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <AppIcon appId={appId} size="md" customBgGradient={webApp?.bgGradient} />
        </button>

        {/* macOS Running Dot Indicator */}
        <div className="h-1.5 flex items-center justify-center mt-1">
          {isRunning && (
            <div
              className={`rounded-full transition-all duration-200 ${
                isActive
                  ? 'w-2 h-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] ring-2 ring-white/30'
                  : 'w-1.5 h-1.5 bg-white/70 shadow-sm'
              }`}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Bottom edge hover sensor for auto-hide */}
      <div
        className="fixed bottom-0 left-0 right-0 h-4 z-[95]"
        onMouseEnter={() => setIsBottomHovered(true)}
      />

      {/* macOS Floating Dock */}
      <div
        id="macos-dock-container"
        onMouseEnter={() => setIsBottomHovered(true)}
        onMouseLeave={() => setIsBottomHovered(false)}
        onClick={(e) => e.stopPropagation()}
        className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ease-out select-none ${
          shouldHideDock
            ? 'translate-y-24 opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}
      >
        <div
          className={`flex items-end space-x-1.5 px-3 py-2 transition-all duration-300 ${getDockStyleClasses()}`}
        >
          {/* App Launcher / Launchpad Button */}
          <div className="relative flex flex-col items-center group">
            {hoveredApp === 'launcher' && (
              <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-zinc-800/90 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium shadow-md whitespace-nowrap animate-in fade-in duration-100 z-50 pointer-events-none">
                Launchpad / Apps
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLaunchpad();
              }}
              onMouseEnter={() => setHoveredApp('launcher')}
              onMouseLeave={() => setHoveredApp(null)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 hover:-translate-y-2 hover:scale-110 active:scale-95 shadow-md cursor-pointer ${
                isLaunchpadOpen
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white ring-2 ring-purple-400'
                  : 'bg-gradient-to-tr from-zinc-700 to-zinc-800 text-zinc-100 hover:brightness-110 border border-white/20'
              }`}
            >
              <LayoutGrid size={22} className="text-white drop-shadow" />
            </button>
            <div className="h-1.5 flex items-center justify-center mt-1">
              {isLaunchpadOpen && <div className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-sm" />}
            </div>
          </div>

          {/* Mission Control / Windows Manager Button */}
          <div className="relative flex flex-col items-center group">
            {hoveredApp === 'mission-control' && (
              <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-zinc-800/90 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium shadow-md whitespace-nowrap animate-in fade-in duration-100 z-50 pointer-events-none">
                Mission Control (All Windows)
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openTaskView();
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openContextMenu(e.clientX, e.clientY, [
                  { label: 'Open Window Manager', action: () => openTaskView() },
                  { label: 'Sensitivity: Off (Disable Scroll Gesture)', action: () => useOSStore.getState().updateSystemState('windowManagerSensitivity', 'off') },
                  { label: 'Sensitivity: Low (Requires Fast Flick)', action: () => useOSStore.getState().updateSystemState('windowManagerSensitivity', 'low') },
                  { label: 'Sensitivity: Medium', action: () => useOSStore.getState().updateSystemState('windowManagerSensitivity', 'medium') },
                  { label: 'Sensitivity: High (Sensitive)', action: () => useOSStore.getState().updateSystemState('windowManagerSensitivity', 'high') },
                  { label: 'Open Settings...', action: () => openApp('settings', 'Settings') },
                ]);
              }}
              onMouseEnter={() => setHoveredApp('mission-control')}
              onMouseLeave={() => setHoveredApp(null)}
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 hover:-translate-y-2 hover:scale-110 active:scale-95 shadow-md bg-gradient-to-tr from-cyan-600 to-blue-700 text-white border border-white/20 cursor-pointer"
              title="Mission Control (Right Click for Gesture Sensitivity Settings)"
            >
              <Layers size={21} className="text-white drop-shadow" />
            </button>
            <div className="h-1.5 flex items-center justify-center mt-1" />
          </div>

          {/* Windows 11 Search Bar (when in Windows Dock Style) */}
          {(systemState.dockStyle === 'windows-center' || systemState.dockStyle === 'windows-11') && (
            <div className="relative flex items-center mb-2.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSpotlight();
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-300 hover:text-white transition-all text-xs font-medium cursor-pointer shadow-inner"
                title="Search system apps & web (Spotlight)"
              >
                <Search size={15} className="text-cyan-400" />
                <span className="hidden sm:inline font-sans text-xs opacity-90">Search ArcOS...</span>
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="w-px h-8 bg-white/15 my-auto mx-1" />

          {/* Dynamic Pinned Dock Apps */}
          {dockAppIds.map(renderDockItem)}

          {/* Unpinned Running Apps Divider & Items */}
          {unpinnedRunningAppIds.length > 0 && (
            <>
              <div className="w-px h-8 bg-white/15 my-auto mx-1" />
              {unpinnedRunningAppIds.map(renderDockItem)}
            </>
          )}

          {/* Divider */}
          <div className="w-px h-8 bg-white/15 my-auto mx-1" />

          {/* Trash / Bin */}
          <div className="relative flex flex-col items-center group">
            {hoveredApp === 'trash' && (
              <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-zinc-800/90 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium shadow-md whitespace-nowrap animate-in fade-in duration-100 z-50 pointer-events-none">
                Bin / Trash
              </div>
            )}
            <button
              onClick={() => openApp('files', 'File Explorer')}
              onMouseEnter={() => setHoveredApp('trash')}
              onMouseLeave={() => setHoveredApp(null)}
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 hover:-translate-y-2 hover:scale-110 active:scale-95 shadow-md bg-zinc-800/80 border border-white/10 text-zinc-300 hover:text-white cursor-pointer"
            >
              <Trash2 size={20} />
            </button>
            <div className="h-1.5 flex items-center justify-center mt-1" />
          </div>
        </div>
      </div>
    </>
  );
}
