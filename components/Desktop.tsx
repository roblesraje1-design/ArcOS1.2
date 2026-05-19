'use client';

import { useOSStore } from '@/store/useOSStore';
import { useEffect } from 'react';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';
// import AppLauncher from './AppLauncher'; // Hidden for clean workspace
import StartMenu from './StartMenu';
import QuickSettings from './QuickSettings';
import TaskView from './TaskView';
import { BootScreen, ContextMenu, SplashScreen } from './BootScreen';
import { RefreshCcw, Image as ImageIcon, Settings as SettingsIcon, LayoutGrid, Plus, Folder, AppWindow, FileText, Trash2 } from 'lucide-react';
import AppInstaller from './AppInstaller';
import LockScreen from './LockScreen';
import PersonalizationCenter from './PersonalizationCenter';
import WidgetRenderer from './WidgetRenderer';

declare global {
  interface Window {
    ArcOS_Dispatch?: (actionType: string, payload: any) => void;
  }
}

export default function Desktop() {
  const { 
    wallpaper, 
    systemState, 
    updateSystemState, 
    closeStartMenu, 
    closeQuickSettings, 
    openApp, 
    isStartMenuOpen, 
    isQuickSettingsOpen, 
    isTaskViewOpen,
    openContextMenu,
    closeTaskView,
    detectSystemSpecs,
    desktopItems,
    addDesktopItem,
    removeDesktopItem,
    setIsPersonalizationMenuOpen,
    widgets
  } = useOSStore();

  // Detect system specs once on mount
  useEffect(() => {
    detectSystemSpecs();
  }, [detectSystemSpecs]);

  // Unified global UI re-rendering dispatcher function
  useEffect(() => {
    window.ArcOS_Dispatch = (actionType: string, payload: any) => {
      console.log(`[ArcOS_Dispatch] ${actionType}`, payload);
      const state = useOSStore.getState();
      switch (actionType) {
        case 'TOGGLE_WIFI':
          updateSystemState('wifi', typeof payload === 'boolean' ? payload : !state.systemState.wifi);
          break;
        case 'TOGGLE_BLUETOOTH':
          updateSystemState('bluetooth', typeof payload === 'boolean' ? payload : !state.systemState.bluetooth);
          break;
        case 'SET_VOLUME':
          updateSystemState('volume', payload);
          break;
        case 'SET_BRIGHTNESS':
          updateSystemState('brightness', payload);
          break;
        case 'OPEN_APP':
          openApp(payload.appId, payload.title, payload.appProps);
          break;
        case 'SHUTDOWN':
          document.body.innerHTML = '<div style="display:flex; height:100vh; background:black; color:white; align-items:center; justify-content:center; font-family:sans-serif;">System shut down.</div>';
          break;
      }
    };

    // Mock Laptop Battery Simulation: lower by 1% every 30 seconds
    const batteryInterval = setInterval(() => {
      const current = useOSStore.getState().systemState.battery;
      updateSystemState('battery', Math.max(0, current - 1));
    }, 30000);

    return () => clearInterval(batteryInterval);
  }, [updateSystemState, openApp]);

  // CSS Backdrop Filter multiplier applies instantly for UI Sync
  const filterStyle = [
    `brightness(${systemState.brightness}%)`,
    systemState.nightLight ? 'sepia(40%) hue-rotate(-20deg)' : '',
  ].filter(Boolean).join(' ');

  const handleDesktopClick = () => {
    closeStartMenu();
    closeQuickSettings();
    closeTaskView();
  };

  const getIcon = (type: string, appId?: string) => {
    switch (type) {
      case 'folder': return <Folder size={32} className="text-yellow-400 group-hover:scale-110 transition-transform" strokeWidth={1.5} />;
      case 'app':
        if (appId === 'files') return <Folder size={32} className="text-blue-400 group-hover:scale-110 transition-transform" strokeWidth={1.5} />;
        if (appId === 'settings') return <SettingsIcon size={32} className="text-zinc-300 group-hover:scale-110 transition-transform" strokeWidth={1.5} />;
        return <AppWindow size={32} className="text-indigo-400 group-hover:scale-110 transition-transform" strokeWidth={1.5} />;
      default: return <FileText size={32} className="text-zinc-400 group-hover:scale-110 transition-transform" strokeWidth={1.5} />;
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return; // Only if clicking background
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      { label: 'View', icon: LayoutGrid, action: () => {} },
      { label: 'Refresh', icon: RefreshCcw, action: () => window.location.reload() },
      { label: 'New', icon: Plus, action: () => {
          const id = `folder-${Date.now()}`;
          addDesktopItem({
            id,
            name: 'New Folder',
            type: 'folder',
            position: { x: e.clientX, y: e.clientY }
          });
      } },
      { label: 'Personalize', icon: ImageIcon, action: () => setIsPersonalizationMenuOpen(true) },
      { label: 'Settings', icon: SettingsIcon, action: () => openApp('settings', 'Settings') },
    ]);
  };

  useEffect(() => {
    const handleGlobalContextMenu = (e: MouseEvent) => {
      // Allow context menu only on specific areas if handled
      const target = e.target as HTMLElement;
      if (!target.closest('.custom-context-menu-active')) {
        // e.preventDefault(); // This is sometimes too aggressive, but user wants to fix browser right click menu
      }
    };
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    return () => window.removeEventListener('contextmenu', (e) => e.preventDefault());
  }, []);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-300 select-none"
      style={{ backgroundImage: `url(${wallpaper})`, filter: filterStyle }}
      onClick={handleDesktopClick}
      onContextMenu={handleRightClick}
    >
      {/* Desktop Items */}
      <div className="absolute inset-0 p-4 pointer-events-none">
        {desktopItems.map((item) => (
          <div
            key={item.id}
            className="absolute p-2 flex flex-col items-center justify-center space-y-1 rounded-lg hover:bg-white/10 group cursor-pointer pointer-events-auto w-20 transition-colors"
            style={{ left: item.position.x, top: item.position.y }}
            onDoubleClick={() => item.appId ? openApp(item.appId, item.name) : {}}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openContextMenu(e.clientX, e.clientY, [
                { label: `Open ${item.name}`, action: () => item.appId ? openApp(item.appId, item.name) : {} },
                { label: 'Rename', action: () => {} },
                { label: 'Delete', icon: Trash2, action: () => removeDesktopItem(item.id), danger: true },
              ]);
            }}
          >
            {getIcon(item.type, item.appId)}
            <span className="text-[10px] text-white text-center font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Widgets Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {widgets.map((widget) => (
          <WidgetRenderer key={widget.id} widget={widget} />
        ))}
      </div>

      <WindowManager />
      <BootScreen />
      <AppInstaller />
      <SplashScreen />
      <ContextMenu />
      {isTaskViewOpen && <TaskView />}
      {isStartMenuOpen && <StartMenu />}
      {isQuickSettingsOpen && <QuickSettings />}
      <Taskbar />
      <LockScreen />
      <PersonalizationCenter />
    </div>
  );
}
