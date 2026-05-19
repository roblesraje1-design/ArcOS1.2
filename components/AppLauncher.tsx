'use client';

import { useOSStore } from '@/store/useOSStore';
import { Globe, Settings, TerminalSquare, Folder, Languages } from 'lucide-react';

const APPS = [
  { id: 'browser', title: 'UV Browser', icon: Globe },
  { id: 'terminal', title: 'Terminal', icon: TerminalSquare },
  { id: 'files', title: 'Files', icon: Folder },
  { id: 'eosl', title: 'EOSL Translator', icon: Languages },
  { id: 'settings', title: 'Settings', icon: Settings },
] as const;

export default function AppLauncher() {
  const openApp = useOSStore((state) => state.openApp);

  return (
    <div className="absolute left-4 top-4 z-0 grid grid-cols-1 gap-4">
      {APPS.map((app) => (
        <button
          key={app.id}
          className="flex flex-col items-center justify-center space-y-1 rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
          onDoubleClick={() => openApp(app.id, app.title)}
          onClick={(e) => {
            // Mobile support for single click
            if (window.innerWidth < 768) {
              openApp(app.id, app.title);
            }
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/80 shadow-lg backdrop-blur-sm border border-zinc-700">
            <app.icon size={24} />
          </div>
          <span className="text-xs font-medium drop-shadow-md">{app.title}</span>
        </button>
      ))}
    </div>
  );
}
