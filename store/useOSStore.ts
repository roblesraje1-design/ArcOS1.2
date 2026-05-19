import { create } from 'zustand';

export type AppId = 'browser' | 'settings' | 'terminal' | 'files' | 'eosl' | 'devstudio' | 'photoviewer' | 'mediaplayer' | string;

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  appProps?: any;
  snapState?: 'none' | 'left' | 'right' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

export interface DesktopItem {
  id: string;
  name: string;
  type: 'app' | 'folder' | 'file';
  appId?: string;
  icon?: any;
  position: { x: number; y: number };
}

export interface Widget {
  id: string;
  type: 'clock' | 'weather' | 'calendar' | 'music' | 'battery' | 'system' | 'photo';
  position: { x: number; y: number };
  props?: any;
}

interface ContextMenuOption {
  label: string;
  icon?: any;
  action: () => void;
  danger?: boolean;
}

interface OSState {
  isBooting: boolean;
  setBooting: (booting: boolean) => void;
  windows: WindowState[];
  activeWindowId: string | null;
  wallpaper: string;
  accentColor: string;
  setWallpaper: (url: string) => void;
  setAccentColor: (color: string) => void;
  openApp: (appId: AppId, title: string, appProps?: any) => void;
  closeApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  maximizeApp: (id: string) => void;
  focusApp: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  updateWindowSnap: (id: string, snapState: WindowState['snapState']) => void;

  // Desktop Items
  desktopItems: DesktopItem[];
  addDesktopItem: (item: DesktopItem) => void;
  removeDesktopItem: (id: string) => void;
  updateDesktopItemPosition: (id: string, x: number, y: number) => void;

  // Widgets
  widgets: Widget[];
  addWidget: (type: Widget['type'], position: { x: number; y: number }, props?: any) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, x: number, y: number) => void;

  // Global Context Menu
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    options: ContextMenuOption[];
  };
  openContextMenu: (x: number, y: number, options: ContextMenuOption[]) => void;
  closeContextMenu: () => void;

  // Installation Engine
  installingApp: {
    isOpen: boolean;
    progress: number;
    appData: any;
  };
  startInstallation: (appData: any) => void;
  setInstallationProgress: (progress: number) => void;
  finishInstallation: () => void;

  // New Module 10 Interactive State
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  
  isQuickSettingsOpen: boolean;
  toggleQuickSettings: () => void;
  closeQuickSettings: () => void;

  isTaskViewOpen: boolean;
  toggleTaskView: () => void;
  closeTaskView: () => void;

  isPersonalizationMenuOpen: boolean;
  setIsPersonalizationMenuOpen: (open: boolean) => void;

  isLockScreenVisible: boolean;
  setLockScreenVisible: (visible: boolean) => void;

  systemState: {
    wifi: boolean;
    bluetooth: boolean;
    airplane: boolean;
    batterySaver: boolean;
    nightLight: boolean;
    volume: number;
    brightness: number;
    battery: number;
    // Expanded for 50+ settings target
    theme: 'light' | 'dark' | 'glass';
    transparency: boolean;
    taskbarAlignment: 'left' | 'center';
    searchVisible: boolean;
    widgetsVisible: boolean;
    notificationsEnabled: boolean;
    focusMode: boolean;
    location: boolean;
    cameraAccess: boolean;
    micAccess: boolean;
    autoUpdate: boolean;
    developerMode: boolean;
    animationsEnabled: boolean;
    lockScreenEnabled: boolean;
    password: string | null;
    pcName: string;
    isOOBECompleted: boolean;
    aiCoreEnabled: boolean;
    osPurpose: string[];
    userAccount: {
      name: string;
      email: string;
      avatar?: string;
    };
    buildNumber: string;
    ramUsage: number;
    cpuLevel: number;
    storageUsed: number;
    storageTotal: number;
    specs: {
      ram: string;
      cpu: string;
      gpu: string;
      os: string;
      browser: string;
    };
  };
  updateSystemState: (key: string, value: any) => void;
  detectSystemSpecs: () => void;
  
  customApps: { id: string, title: string, html: string, css: string, js: string }[];
  addCustomApp: (app: any) => void;
  removeCustomApp: (id: string) => void;

  // Splash/Update State
  activeSplashScreen: string | null; // appId
  closeSplashScreen: () => void;

  // BIOS and Recovery Core
  isBiosActive: boolean;
  setBiosActive: (active: boolean) => void;
  isSystemCorrupted: boolean;
  setSystemCorrupted: (corrupted: boolean) => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  isBooting: true, // Start booting now
  setBooting: (booting) => set({ isBooting: booting }),
  windows: [],
  activeWindowId: null,
  wallpaper: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  accentColor: '#3b82f6',
  
  desktopItems: [
    { id: 'dt-files', name: 'File Explorer', type: 'app', appId: 'files', position: { x: 20, y: 20 } },
    { id: 'dt-settings', name: 'Settings', type: 'app', appId: 'settings', position: { x: 20, y: 120 } },
    { id: 'dt-browser', name: 'Edge', type: 'app', appId: 'browser', position: { x: 20, y: 220 } },
  ],
  addDesktopItem: (item) => set((state) => ({ desktopItems: [...state.desktopItems, item] })),
  removeDesktopItem: (id) => set((state) => ({ desktopItems: state.desktopItems.filter(i => i.id !== id) })),
  updateDesktopItemPosition: (id, x, y) => set((state) => ({
    desktopItems: state.desktopItems.map(i => i.id === id ? { ...i, position: { x, y } } : i)
  })),

  widgets: [],
  addWidget: (type, position, props) => set((state) => ({
    widgets: [...state.widgets, { id: `widget-${Date.now()}`, type, position, props }]
  })),
  removeWidget: (id) => set((state) => ({
    widgets: state.widgets.filter(w => w.id !== id)
  })),
  updateWidgetPosition: (id, x, y) => set((state) => ({
    widgets: state.widgets.map(w => w.id === id ? { ...w, position: { x, y } } : w)
  })),

  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    options: [],
  },
  openContextMenu: (x, y, options) => set({ contextMenu: { isOpen: true, x, y, options } }),
  closeContextMenu: () => set({ contextMenu: { ...get().contextMenu, isOpen: false } }),

  installingApp: {
    isOpen: false,
    progress: 0,
    appData: null,
  },
  startInstallation: (appData) => set({ installingApp: { isOpen: true, progress: 0, appData } }),
  setInstallationProgress: (progress) => set((state) => ({ installingApp: { ...state.installingApp, progress } })),
  finishInstallation: () => {
    const { appData } = get().installingApp;
    if (appData) {
      get().addCustomApp(appData);
    }
    set({ installingApp: { isOpen: false, progress: 0, appData: null } });
  },

  isStartMenuOpen: false,
  toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen, isQuickSettingsOpen: false })),
  closeStartMenu: () => set({ isStartMenuOpen: false }),

  isQuickSettingsOpen: false,
  toggleQuickSettings: () => set((state) => ({ isQuickSettingsOpen: !state.isQuickSettingsOpen, isStartMenuOpen: false, isTaskViewOpen: false })),
  closeQuickSettings: () => set({ isQuickSettingsOpen: false }),

  isTaskViewOpen: false,
  toggleTaskView: () => set((state) => ({ isTaskViewOpen: !state.isTaskViewOpen, isStartMenuOpen: false, isQuickSettingsOpen: false })),
  closeTaskView: () => set({ isTaskViewOpen: false }),

  isPersonalizationMenuOpen: false,
  setIsPersonalizationMenuOpen: (open: boolean) => set({ isPersonalizationMenuOpen: open }),

  isLockScreenVisible: false,
  setLockScreenVisible: (visible) => set({ isLockScreenVisible: visible }),

  systemState: {
    wifi: true,
    bluetooth: false,
    airplane: false,
    batterySaver: false,
    nightLight: false,
    volume: 50,
    brightness: 100,
    battery: 88,
    theme: 'dark',
    transparency: true,
    taskbarAlignment: 'center',
    searchVisible: true,
    widgetsVisible: false,
    notificationsEnabled: true,
    focusMode: false,
    location: true,
    cameraAccess: true,
    micAccess: true,
    autoUpdate: true,
    developerMode: false,
    animationsEnabled: true,
    lockScreenEnabled: true,
    password: typeof window !== 'undefined' ? localStorage.getItem('arcos_password') : null,
    pcName: 'DESKTOP-ARCOS',
    isOOBECompleted: typeof window !== 'undefined' ? localStorage.getItem('arcos_oobe_complete') === 'true' : false,
    aiCoreEnabled: typeof window !== 'undefined' ? localStorage.getItem('arcos_aicore_enabled') !== 'false' : true,
    osPurpose: [],
    userAccount: {
      name: typeof window !== 'undefined' ? localStorage.getItem('arcos_username') || 'Jack Purton' : 'Jack Purton',
      email: typeof window !== 'undefined' ? localStorage.getItem('arcos_uemail') || 'jack.purton@arcos.io' : 'jack.purton@arcos.io',
      avatar: typeof window !== 'undefined' ? (localStorage.getItem('arcos_username') || 'Jack Purton').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JP',
    },
    buildNumber: '22621.1702',
    ramUsage: 34,
    cpuLevel: 12,
    storageUsed: 45,
    storageTotal: 256,
    specs: {
      ram: 'Unknown',
      cpu: 'Unknown',
      gpu: 'Unknown',
      os: 'ArcOS 1.0 (Web Based)',
      browser: 'Unknown'
    }
  },
  updateSystemState: (key, value) => {
    if (typeof window !== 'undefined') {
      if (key === 'isOOBECompleted') localStorage.setItem('arcos_oobe_complete', String(value));
      if (key === 'aiCoreEnabled') localStorage.setItem('arcos_aicore_enabled', String(value));
      if (key === 'username') localStorage.setItem('arcos_username', String(value));
      if (key === 'uemail') localStorage.setItem('arcos_uemail', String(value));
      if (key === 'password') {
        if (value) localStorage.setItem('arcos_password', String(value));
        else localStorage.removeItem('arcos_password');
      }
    }
    set((state) => {
      let newState;
      if (key === 'username') {
        newState = { 
          ...state.systemState, 
          userAccount: { 
            ...state.systemState.userAccount, 
            name: value,
            avatar: value.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() 
          } 
        };
      } else if (key === 'uemail') {
        newState = { 
          ...state.systemState, 
          userAccount: { 
            ...state.systemState.userAccount, 
            email: value 
          } 
        };
      } else {
        newState = { ...state.systemState, [key]: value };
      }
      return { systemState: newState };
    });
  },
  detectSystemSpecs: () => {
    const specs = {
      ram: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : '8 GB+',
      cpu: (navigator as any).hardwareConcurrency ? `${(navigator as any).hardwareConcurrency} Cores` : 'Unknown CPU',
      gpu: 'Web Content Renderer',
      os: 'ArcOS 1.0 (X64)',
      browser: navigator.userAgent.split(' ').pop() || 'Modern Browser'
    };
    
    // Attempt to get GPU
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          specs.gpu = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch (e) {}

    set((state) => ({ 
      systemState: { 
        ...state.systemState, 
        specs 
      } 
    }));
  },

  customApps: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('arcos_custom_apps') || '[]') : [],
  addCustomApp: (app) => set((state) => {
    const updated = [...state.customApps, app];
    if (typeof window !== 'undefined') {
      localStorage.setItem('arcos_custom_apps', JSON.stringify(updated));
    }
    return { 
      customApps: updated,
      activeSplashScreen: null // Remove splash screen for newly installed apps
    };
  }),
  removeCustomApp: (id) => set((state) => {
    const updated = state.customApps.filter(a => a.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('arcos_custom_apps', JSON.stringify(updated));
    }
    return {
      customApps: updated,
      windows: state.windows.filter(w => w.appId !== id),
      desktopItems: state.desktopItems.filter(i => i.appId !== id)
    };
  }),

  activeSplashScreen: null,
  closeSplashScreen: () => set({ activeSplashScreen: null }),

  // BIOS and Recovery State Core
  isBiosActive: false,
  setBiosActive: (active) => set({ isBiosActive: active }),
  isSystemCorrupted: typeof window !== 'undefined' ? localStorage.getItem('arcos_system_corrupted') === 'true' : false,
  setSystemCorrupted: (corrupted) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('arcos_system_corrupted', String(corrupted));
    }
    set({ isSystemCorrupted: corrupted });
  },

  setWallpaper: (url) => set({ wallpaper: url }),
  setAccentColor: (color) => set({ accentColor: color }),
  
  openApp: (appId, title, appProps) => {
    const existing = get().windows.find((w) => w.appId === appId);
    if (existing && appId !== 'photoviewer' && appId !== 'mediaplayer') {
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === existing.id ? { ...w, isMinimized: false, zIndex: Math.max(...state.windows.map((w) => w.zIndex), 0) + 1, title, appProps: appProps || w.appProps } : w
        ),
        activeWindowId: existing.id,
      }));
      return;
    }
    const newId = `${appId}-${Date.now()}`;
    const newWindow: WindowState = {
      id: newId,
      appId,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: Math.max(...get().windows.map((w) => w.zIndex), 0) + 1,
      position: { x: 100 + get().windows.length * 20, y: 100 + get().windows.length * 20 },
      size: { width: 850, height: 600 },
      appProps,
      snapState: 'none'
    };
    set((state) => ({
      windows: [...state.windows, newWindow],
      activeWindowId: newId,
    }));
  },
  closeApp: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    })),
  minimizeApp: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    })),
  maximizeApp: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized, snapState: 'none' } : w)),
    })),
  focusApp: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: Math.max(...state.windows.map((w) => w.zIndex), 0) + 1, isMinimized: false } : w
      ),
      activeWindowId: id,
      isStartMenuOpen: false,
      isQuickSettingsOpen: false,
      isTaskViewOpen: false,
    })),
  updateWindowPosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
    })),
  updateWindowSize: (id, size) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
    })),
  updateWindowSnap: (id, snapState) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, snapState, isMaximized: false } : w)),
    })),
}));
