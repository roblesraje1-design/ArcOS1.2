import {
  ExternalLink,
  Trash2,
  Plus,
  Play,
  RotateCw,
  Info,
  Maximize2,
  Bookmark,
  Mail,
  Video,
  Cloud,
  Layers,
  Settings,
  Terminal,
  FolderPlus,
  FilePlus,
  Cpu,
  MonitorDown,
  Pin,
  PinOff,
} from 'lucide-react';
import { APP_METADATA } from '@/components/AppIcon';

export function getAppContextMenuOptions(
  appId: string,
  appName: string,
  store: {
    openApp: (appId: string, title: string, props?: any) => void;
    dockAppIds: string[];
    desktopItems: { id: string; appId?: string; name: string }[];
    addToDock: (appId: string) => void;
    removeFromDock: (appId: string) => void;
    addToDesktop: (appId: string, name: string) => void;
    removeFromDesktop: (appId: string) => void;
    toggleCalculatorPopup?: () => void;
    toggleAIAssistant?: () => void;
    webApps?: { id: string; name: string; url: string }[];
    removeWebApp?: (id: string) => void;
  }
) {
  const isInDock = store.dockAppIds.includes(appId);
  const isInDesktop = store.desktopItems.some((i) => i.appId === appId);
  const webApp = store.webApps?.find((w) => w.id === appId);
  const meta = APP_METADATA[appId];

  const options: Array<{
    label: string;
    icon?: any;
    action: () => void;
    danger?: boolean;
  }> = [];

  // 1. Primary Open Action
  options.push({
    label: `Open ${appName}`,
    icon: Play,
    action: () => {
      if (webApp) {
        store.openApp(webApp.id, webApp.name, { url: webApp.url });
      } else {
        store.openApp(appId, appName);
      }
    },
  });

  // 2. App-Specific Functional Actions
  switch (appId) {
    case 'browser':
      options.push({
        label: 'Open External Window',
        icon: ExternalLink,
        action: () => window.open('https://browser.rammerhead.org', '_blank', 'noopener,noreferrer'),
      });
      options.push({
        label: 'Rammerhead Proxy Status',
        icon: Info,
        action: () => store.openApp('terminal', 'Terminal', { command: 'curl -I https://browser.rammerhead.org' }),
      });
      break;

    case 'settings':
      options.push({
        label: 'Google Integration',
        icon: Cloud,
        action: () => store.openApp('settings', 'Settings', { defaultTab: 'google' }),
      });
      options.push({
        label: 'Beta Features & Blob Mode',
        icon: Cpu,
        action: () => store.openApp('settings', 'Settings', { defaultTab: 'beta' }),
      });
      options.push({
        label: 'Wallpaper & Appearance',
        icon: Settings,
        action: () => store.openApp('settings', 'Settings', { defaultTab: 'appearance' }),
      });
      break;

    case 'files':
      options.push({
        label: 'New Text File',
        icon: FilePlus,
        action: () => store.openApp('files', 'File Explorer'),
      });
      options.push({
        label: 'Browse Google Drive Storage',
        icon: Cloud,
        action: () => store.openApp('drive', 'Google Drive'),
      });
      break;

    case 'drive':
      options.push({
        label: 'Upload New File',
        icon: FilePlus,
        action: () => store.openApp('drive', 'Google Drive'),
      });
      options.push({
        label: 'Check Storage Quota',
        icon: Info,
        action: () => store.openApp('settings', 'Settings', { defaultTab: 'google' }),
      });
      break;

    case 'gmail':
      options.push({
        label: 'Compose New Email',
        icon: Mail,
        action: () => store.openApp('gmail', 'Gmail', { compose: true }),
      });
      options.push({
        label: 'Check Inbox',
        icon: RotateCw,
        action: () => store.openApp('gmail', 'Gmail'),
      });
      break;

    case 'meet':
      options.push({
        label: 'Start Instant Meeting',
        icon: Video,
        action: () => store.openApp('meet', 'Google Meet'),
      });
      options.push({
        label: 'Join with Code',
        icon: ExternalLink,
        action: () => store.openApp('meet', 'Google Meet'),
      });
      break;

    case 'keep':
      options.push({
        label: 'New Note',
        icon: Bookmark,
        action: () => store.openApp('keep', 'Google Keep', { newNote: true }),
      });
      break;

    case 'calculator':
      if (store.toggleCalculatorPopup) {
        options.push({
          label: 'Quick Popup Calculator',
          icon: Layers,
          action: () => store.toggleCalculatorPopup?.(),
        });
      }
      break;

    case 'terminal':
      options.push({
        label: 'Run System Diagnostics',
        icon: Terminal,
        action: () => store.openApp('terminal', 'Terminal', { command: 'neofetch' }),
      });
      break;

    case 'neuralcore':
      if (store.toggleAIAssistant) {
        options.push({
          label: 'Quick AI Assistant Bar',
          icon: Cpu,
          action: () => store.toggleAIAssistant?.(),
        });
      }
      break;

    case 'iframe':
      options.push({
        label: 'Create New Web App',
        icon: Plus,
        action: () => store.openApp('iframe', 'iFrame Studio'),
      });
      break;

    default:
      if (webApp) {
        options.push({
          label: 'Open in External Browser',
          icon: ExternalLink,
          action: () => window.open(webApp.url, '_blank', 'noopener,noreferrer'),
        });
        options.push({
          label: 'Uninstall Web App',
          icon: Trash2,
          danger: true,
          action: () => store.removeWebApp?.(webApp.id),
        });
      }
      break;
  }

  // 3. Desktop Dock & Placement Actions (Explicit User Request: Add to Desktop or Dock!)
  if (isInDock) {
    options.push({
      label: 'Remove from Dock',
      icon: PinOff,
      action: () => store.removeFromDock(appId),
    });
  } else {
    options.push({
      label: 'Add to Dock',
      icon: Pin,
      action: () => store.addToDock(appId),
    });
  }

  if (isInDesktop) {
    options.push({
      label: 'Remove from Desktop',
      icon: Trash2,
      action: () => store.removeFromDesktop(appId),
      danger: false,
    });
  } else {
    options.push({
      label: 'Add to Desktop',
      icon: MonitorDown,
      action: () => store.addToDesktop(appId, appName),
    });
  }

  // 4. App Info
  if (meta?.description) {
    options.push({
      label: `About: ${meta.category}`,
      icon: Info,
      action: () => {
        store.openApp('settings', 'Settings', { defaultTab: 'about' });
      },
    });
  }

  return options;
}
