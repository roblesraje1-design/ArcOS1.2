'use client';

import React from 'react';
import {
  Globe,
  Settings,
  Folder,
  Cloud,
  Mail,
  Video,
  Bookmark,
  Terminal,
  Calculator,
  Brain,
  CloudSun,
  Clock,
  Code2,
  HelpCircle,
  FileText,
  LayoutGrid,
  Image as ImageIcon,
  Play,
  Layers,
  Sparkles,
  ExternalLink,
  Shield,
  Compass,
  Gamepad2,
  Presentation,
} from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';

export interface AppIconProps {
  appId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  iconClassName?: string;
  customIcon?: string;
  customColor?: string;
  customBgGradient?: string;
}

export const APP_METADATA: Record<
  string,
  {
    title: string;
    category: string;
    icon: any;
    bgGradient: string;
    iconColor: string;
    accentColor: string;
    description: string;
  }
> = {
  browser: {
    title: 'Rammerhead',
    category: 'Internet',
    icon: Globe,
    bgGradient: 'from-cyan-500 via-blue-600 to-indigo-800',
    iconColor: 'text-white',
    accentColor: '#0ea5e9',
    description: 'Chromium unrestricted web browser & proxy engine',
  },
  settings: {
    title: 'Settings',
    category: 'System',
    icon: Settings,
    bgGradient: 'from-zinc-500 via-zinc-700 to-zinc-900',
    iconColor: 'text-zinc-100',
    accentColor: '#71717a',
    description: 'System preferences, customization, and accounts',
  },
  files: {
    title: 'File Explorer',
    category: 'Productivity',
    icon: Folder,
    bgGradient: 'from-sky-400 via-blue-500 to-blue-700',
    iconColor: 'text-white',
    accentColor: '#38bdf8',
    description: 'Local and cloud file management',
  },
  drive: {
    title: 'Google Drive',
    category: 'Cloud',
    icon: Cloud,
    bgGradient: 'from-emerald-500 via-teal-600 to-blue-600',
    iconColor: 'text-white',
    accentColor: '#10b981',
    description: 'Cloud storage and document synchronization',
  },
  gmail: {
    title: 'Gmail',
    category: 'Communication',
    icon: Mail,
    bgGradient: 'from-rose-500 via-red-600 to-red-800',
    iconColor: 'text-white',
    accentColor: '#ef4444',
    description: 'Google Mail inbox and compose',
  },
  meet: {
    title: 'Google Meet',
    category: 'Communication',
    icon: Video,
    bgGradient: 'from-teal-400 via-emerald-600 to-teal-800',
    iconColor: 'text-white',
    accentColor: '#14b8a6',
    description: 'Instant HD video meetings and screen sharing',
  },
  keep: {
    title: 'Google Keep',
    category: 'Productivity',
    icon: Bookmark,
    bgGradient: 'from-amber-400 via-amber-500 to-orange-600',
    iconColor: 'text-white',
    accentColor: '#f59e0b',
    description: 'Quick notes, lists, and pinned thoughts',
  },
  terminal: {
    title: 'Terminal',
    category: 'Developer',
    icon: Terminal,
    bgGradient: 'from-black via-zinc-950 to-zinc-900',
    iconColor: 'text-emerald-400',
    accentColor: '#10b981',
    description: 'UNIX kernel shell and diagnostics console',
  },
  calculator: {
    title: 'Calculator',
    category: 'Utilities',
    icon: Calculator,
    bgGradient: 'from-zinc-700 via-zinc-800 to-orange-600',
    iconColor: 'text-white',
    accentColor: '#f97316',
    description: 'Scientific and quick arithmetic calculation',
  },
  neuralcore: {
    title: 'Arc AI',
    category: 'AI Tools',
    icon: Brain,
    bgGradient: 'from-purple-600 via-fuchsia-600 to-indigo-700',
    iconColor: 'text-white',
    accentColor: '#a855f7',
    description: 'Gemini-powered neural intelligence assistant',
  },
  weather: {
    title: 'Weather',
    category: 'Utilities',
    icon: CloudSun,
    bgGradient: 'from-sky-400 via-blue-500 to-amber-400',
    iconColor: 'text-white',
    accentColor: '#0284c7',
    description: 'Live meteorological radar and temperature',
  },
  clock: {
    title: 'Clock',
    category: 'Utilities',
    icon: Clock,
    bgGradient: 'from-zinc-900 via-zinc-800 to-zinc-950',
    iconColor: 'text-orange-400',
    accentColor: '#fb923c',
    description: 'World clock, timer, and stopwatch',
  },
  iframe: {
    title: 'iFrame Studio',
    category: 'Utilities',
    icon: Compass,
    bgGradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
    iconColor: 'text-white',
    accentColor: '#c084fc',
    description: 'Create standalone windowed apps from any website URL',
  },
  devstudio: {
    title: 'Dev Studio',
    category: 'Developer',
    icon: Code2,
    bgGradient: 'from-cyan-600 via-blue-700 to-purple-800',
    iconColor: 'text-white',
    accentColor: '#06b6d4',
    description: 'Full-stack code editor and dev environment',
  },
  tips: {
    title: 'ArcOS Tips',
    category: 'Help',
    icon: HelpCircle,
    bgGradient: 'from-teal-500 via-teal-600 to-emerald-700',
    iconColor: 'text-white',
    accentColor: '#14b8a6',
    description: 'Operating system shortcuts and user manual',
  },
  docs: {
    title: 'Google Docs',
    category: 'Productivity',
    icon: FileText,
    bgGradient: 'from-blue-500 via-blue-600 to-indigo-700',
    iconColor: 'text-white',
    accentColor: '#3b82f6',
    description: 'Cloud document editor',
  },
  slides: {
    title: 'Google Slides',
    category: 'Productivity',
    icon: Presentation,
    bgGradient: 'from-amber-500 via-orange-500 to-amber-600',
    iconColor: 'text-white',
    accentColor: '#f59e0b',
    description: 'Cloud presentation designer',
  },
  photoviewer: {
    title: 'Photos',
    category: 'Media',
    icon: ImageIcon,
    bgGradient: 'from-violet-500 via-purple-600 to-pink-600',
    iconColor: 'text-white',
    accentColor: '#8b5cf6',
    description: 'Image and wallpaper gallery',
  },
  mediaplayer: {
    title: 'Media Player',
    category: 'Media',
    icon: Play,
    bgGradient: 'from-red-600 via-pink-600 to-rose-700',
    iconColor: 'text-white',
    accentColor: '#f43f5e',
    description: 'Audio and video player',
  },
  games: {
    title: 'Arc Arcade',
    category: 'Games',
    icon: Gamepad2,
    bgGradient: 'from-rose-500 via-amber-500 to-purple-700',
    iconColor: 'text-white',
    accentColor: '#f43f5e',
    description: 'Retro arcade games and installed titles',
  },
};

export default function AppIcon({
  appId,
  size = 'md',
  className = '',
  iconClassName = '',
  customColor,
  customBgGradient,
}: AppIconProps) {
  const systemState = useOSStore((s) => s.systemState);
  const iconStyle = systemState.iconStyle || 'macos';

  const meta = APP_METADATA[appId] || {
    title: 'Web App',
    category: 'Web',
    icon: Globe,
    bgGradient: customBgGradient || 'from-indigo-600 via-purple-600 to-pink-600',
    iconColor: customColor || 'text-white',
    accentColor: '#6366f1',
  };

  const IconComponent = meta.icon;

  // Shape and theme classes based on iconStyle setting
  let shapeClass = '';
  switch (iconStyle) {
    case 'chromeos':
      shapeClass = 'rounded-full border border-white/20 shadow-md';
      break;
    case 'windows':
      shapeClass = 'rounded-lg border border-white/15 shadow-sm';
      break;
    case 'android':
      shapeClass = 'rounded-[20px] border border-white/20 shadow-md';
      break;
    case 'macos':
    default:
      shapeClass = {
        sm: 'rounded-xl',
        md: 'rounded-2xl',
        lg: 'rounded-2xl',
        xl: 'rounded-3xl',
      }[size];
      break;
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 28,
    xl: 38,
  }[size];

  return (
    <div
      className={`relative select-none flex items-center justify-center overflow-hidden transition-all duration-200 bg-gradient-to-tr ${
        customBgGradient || meta.bgGradient
      } ${sizeClasses} ${shapeClass} ${className} shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_8px_18px_rgba(0,0,0,0.35)]`}
    >
      {/* Gloss Sheen (macOS style only) */}
      {iconStyle === 'macos' && (
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />
      )}

      {/* Center Icon */}
      <IconComponent
        size={iconSizes}
        className={`${customColor || meta.iconColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${iconClassName} z-10`}
      />
    </div>
  );
}
