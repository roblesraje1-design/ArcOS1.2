'use client';

import { useEffect, useState } from 'react';
import { useOSStore } from '@/store/useOSStore';
import WindowManager from './WindowManager';
import MenuBar from './MenuBar';
import Dock from './Dock';
import ControlCenter from './ControlCenter';
import AIAssistantPopup from './AIAssistantPopup';
import SpotlightSearch from './SpotlightSearch';
import Launchpad from './Launchpad';
import CalculatorPopup from './CalculatorPopup';
import TaskView from './TaskView';
import { BootScreen, ContextMenu, SplashScreen } from './BootScreen';
import AppInstaller from './AppInstaller';
import LockScreen from './LockScreen';
import ScreenLockOverlay from './ScreenLockOverlay';
import PersonalizationCenter from './PersonalizationCenter';
import AppIcon from './AppIcon';
import { getAppContextMenuOptions } from '@/lib/appContextMenu';
import { RefreshCcw, Layers, Terminal, Sparkles, Settings } from 'lucide-react';

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
    openApp,
    openContextMenu,
    detectSystemSpecs,
    desktopItems,
    removeDesktopItem,
    addToDesktop,
    removeFromDesktop,
    dockAppIds,
    addToDock,
    removeFromDock,
    webApps,
    removeWebApp,
    setIsPersonalizationMenuOpen,
    closeSpotlight,
    closeAIAssistant,
    closeControlCenter,
    closeLaunchpad,
    closeCalculatorPopup,
    setActiveMenuDropdown,
    toggleCalculatorPopup,
    toggleAIAssistant,
    isTaskViewOpen,
    openTaskView,
    closeTaskView,
  } = useOSStore();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Detect system specs once on mount
  useEffect(() => {
    detectSystemSpecs();
  }, [detectSystemSpecs]);

  // Global UI dispatcher
  useEffect(() => {
    window.ArcOS_Dispatch = (actionType: string, payload: any) => {
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
          document.body.innerHTML =
            '<div style="display:flex; height:100vh; background:black; color:white; align-items:center; justify-content:center; font-family:sans-serif;">System shut down. Refresh to boot.</div>';
          break;
      }
    };
  }, [updateSystemState, openApp]);

  // Trackpad "Flick Up" Gesture to trigger TaskView / Mission Control
  useEffect(() => {
    let lastWheelTime = 0;
    let accumulatedDeltaY = 0;
    let maxDeltaYVelocity = 0;

    const handleWheel = (e: WheelEvent) => {
      const store = useOSStore.getState();
      if (store.isScreenLocked) return;

      const sensitivity = store.systemState.windowManagerSensitivity || 'low';
      if (sensitivity === 'off') return;

      const target = e.target as HTMLElement | null;
      // Strictly ignore scrolling inside any window, app, iframe, or scroll container
      const isInsideAppOrScrollable = 
        target?.closest('.macos-window') || 
        target?.closest('#macos-launchpad-overlay') ||
        target?.closest('iframe') ||
        target?.closest('.overflow-y-auto') ||
        target?.closest('.overflow-auto') ||
        target?.closest('.overflow-scroll') ||
        target?.closest('select') ||
        target?.closest('textarea');

      if (isInsideAppOrScrollable) {
        accumulatedDeltaY = 0;
        maxDeltaYVelocity = 0;
        return;
      }

      const now = Date.now();
      // Shorter burst window (180ms) so slow scrolling cannot accumulate
      if (now - lastWheelTime > 180) {
        accumulatedDeltaY = 0;
        maxDeltaYVelocity = 0;
      }
      lastWheelTime = now;
      accumulatedDeltaY += e.deltaY;
      if (Math.abs(e.deltaY) > maxDeltaYVelocity) {
        maxDeltaYVelocity = Math.abs(e.deltaY);
      }

      // Configure thresholds based on user setting
      let minVelocity = 140; // High speed required
      let minAccumulated = -480; // High force required

      if (sensitivity === 'medium') {
        minVelocity = 90;
        minAccumulated = -320;
      } else if (sensitivity === 'high') {
        minVelocity = 50;
        minAccumulated = -180;
      }

      // Must exceed BOTH single-event velocity AND accumulated force
      if (accumulatedDeltaY < minAccumulated && maxDeltaYVelocity >= minVelocity) {
        accumulatedDeltaY = 0;
        maxDeltaYVelocity = 0;
        if (!store.isTaskViewOpen) {
          store.openTaskView();
        }
      } else if (store.isTaskViewOpen && accumulatedDeltaY > Math.abs(minAccumulated) && maxDeltaYVelocity >= minVelocity) {
        accumulatedDeltaY = 0;
        maxDeltaYVelocity = 0;
        store.closeTaskView();
      }
    };

    // Touch swipe support (2-finger swipe with higher distance & velocity requirement)
    let touchStartY = 0;
    let touchStartTime = 0;
    let isTwoFingerTouch = false;

    const handleTouchStart = (e: TouchEvent) => {
      const store = useOSStore.getState();
      if (store.isScreenLocked) return;

      const sensitivity = store.systemState.windowManagerSensitivity || 'low';
      if (sensitivity === 'off') return;

      isTwoFingerTouch = e.touches.length === 2;
      if (e.touches.length >= 1) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const store = useOSStore.getState();
      if (store.isScreenLocked) return;

      const sensitivity = store.systemState.windowManagerSensitivity || 'low';
      if (sensitivity === 'off') return;

      if (!isTwoFingerTouch && e.changedTouches.length < 2) return;

      const touchEndY = e.changedTouches[0]?.clientY || 0;
      const deltaY = touchStartY - touchEndY;
      const duration = Date.now() - touchStartTime;

      let minDistance = 160;
      if (sensitivity === 'medium') minDistance = 110;
      if (sensitivity === 'high') minDistance = 70;

      // Fast, forceful 2-finger swipe (< 300ms)
      if (duration < 350) {
        if (deltaY > minDistance && !store.isTaskViewOpen) {
          store.openTaskView();
        } else if (deltaY < -minDistance && store.isTaskViewOpen) {
          store.closeTaskView();
        }
      }
    };

    // Keyboard shortcut (F3 or Ctrl+Up or Option+Tab) for Mission Control / TaskView
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useOSStore.getState();
      if (store.isScreenLocked) return;

      if (e.key === 'F3' || (e.ctrlKey && e.key === 'ArrowUp') || (e.altKey && e.key === 'Tab')) {
        e.preventDefault();
        if (store.isTaskViewOpen) store.closeTaskView();
        else store.openTaskView();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Brightness and Night Shift display filter
  const filterStyle = [
    `brightness(${systemState.brightness}%)`,
    systemState.nightLight ? 'sepia(35%) hue-rotate(-15deg)' : '',
  ].filter(Boolean).join(' ');

  const handleDesktopClick = () => {
    setSelectedItemId(null);
    closeSpotlight();
    closeAIAssistant();
    closeControlCenter();
    closeLaunchpad();
    closeCalculatorPopup();
    setActiveMenuDropdown(null);
  };

  const handleDesktopRightClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      { label: 'System Settings...', icon: Settings, action: () => openApp('settings', 'Settings') },
      { label: 'Google Integration...', action: () => openApp('settings', 'Settings', { defaultTab: 'google' }) },
      { label: 'iFrame App Maker...', icon: Layers, action: () => openApp('iframe', 'iFrame Studio') },
      { label: 'Mission Control (Task View)', action: () => openTaskView() },
      { label: 'Open Terminal', icon: Terminal, action: () => openApp('terminal', 'Terminal') },
      { label: 'Ask Arc AI', icon: Sparkles, action: () => toggleAIAssistant() },
      { label: 'Reload ArcOS System', icon: RefreshCcw, action: () => window.location.reload() },
    ]);
  };

  return (
    <div
      id="macos-desktop-root"
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-300 select-none"
      style={{ backgroundImage: `url(${wallpaper})`, filter: filterStyle }}
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopRightClick}
    >
      {/* Top macOS Menu Bar */}
      <MenuBar />

      {/* Desktop App Icons */}
      <div className="absolute inset-0 pt-9 px-4 pointer-events-none z-0">
        {desktopItems.map((item) => {
          const isSelected = selectedItemId === item.id;
          const webApp = webApps.find((w) => w.id === item.appId);

          return (
            <div
              key={item.id}
              className={`absolute p-1.5 flex flex-col items-center justify-center space-y-1.5 rounded-2xl cursor-pointer pointer-events-auto w-24 transition-all group ${
                isSelected ? 'bg-white/20 ring-1 ring-white/30 backdrop-blur-sm' : 'hover:bg-white/10'
              }`}
              style={{ left: item.position.x, top: item.position.y }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItemId(item.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (item.appId) {
                  if (webApp) {
                    openApp(item.appId, item.name, { url: webApp.url });
                  } else {
                    openApp(item.appId, item.name);
                  }
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (item.appId) {
                  const options = getAppContextMenuOptions(item.appId, item.name, {
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
                }
              }}
            >
              <div className="group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                <AppIcon
                  appId={item.appId || 'folder'}
                  size="lg"
                  customBgGradient={webApp?.bgGradient}
                />
              </div>
              <span className="text-[11px] text-white text-center font-medium drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.9)] line-clamp-1 px-1 rounded max-w-full">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Floating macOS Windows */}
      <WindowManager />

      {/* System Overlays */}
      <ControlCenter />
      <CalculatorPopup />
      <AIAssistantPopup />
      <SpotlightSearch />
      <Launchpad />
      <TaskView />

      {/* Bottom macOS Dock */}
      <Dock />

      {/* OS System Screens */}
      <BootScreen />
      <AppInstaller />
      <SplashScreen />
      <ContextMenu />
      <LockScreen />
      <ScreenLockOverlay />
      <PersonalizationCenter />
    </div>
  );
}
