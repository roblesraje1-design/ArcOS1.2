'use client';

import { useState } from 'react';
import { useOSStore, WebApp } from '@/store/useOSStore';
import {
  Layers,
  Globe,
  Plus,
  ExternalLink,
  Trash2,
  Check,
  Sparkles,
  Play,
  MonitorDown,
  Pin,
  PinOff,
  BookOpen,
  Music,
  Code,
  Gamepad2,
  Zap,
} from 'lucide-react';
import AppIcon from '@/components/AppIcon';

const PRESETS = [
  {
    name: 'Wikipedia',
    url: 'https://en.m.wikipedia.org',
    category: 'Reference',
    gradient: 'from-blue-600 via-sky-600 to-cyan-500',
    iconName: 'book',
  },
  {
    name: 'Excalidraw',
    url: 'https://excalidraw.com',
    category: 'Productivity',
    gradient: 'from-violet-600 via-purple-600 to-indigo-700',
    iconName: 'layers',
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    category: 'News',
    gradient: 'from-orange-500 via-amber-600 to-red-600',
    iconName: 'zap',
  },
  {
    name: 'Retro Arcade',
    url: 'https://playemulator.com',
    category: 'Games',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    iconName: 'gamepad',
  },
  {
    name: 'Radio Garden',
    url: 'https://radio.garden',
    category: 'Music',
    gradient: 'from-rose-500 via-pink-600 to-purple-600',
    iconName: 'music',
  },
  {
    name: 'CodePen Editor',
    url: 'https://codepen.io/pen/',
    category: 'Developer',
    gradient: 'from-zinc-800 via-zinc-900 to-black',
    iconName: 'code',
  },
];

const GRADIENT_CHOICES = [
  { id: 'teal-indigo', label: 'Ocean Twilight', class: 'from-teal-500 via-indigo-600 to-purple-700' },
  { id: 'cyan-blue', label: 'Cyber Blue', class: 'from-cyan-500 via-blue-600 to-indigo-800' },
  { id: 'violet-pink', label: 'Neon Sunset', class: 'from-purple-600 via-fuchsia-600 to-pink-600' },
  { id: 'emerald-teal', label: 'Emerald Mint', class: 'from-emerald-500 via-teal-600 to-cyan-700' },
  { id: 'amber-orange', label: 'Amber Flame', class: 'from-amber-400 via-orange-500 to-red-600' },
  { id: 'obsidian-zinc', label: 'Dark Obsidian', class: 'from-zinc-800 via-zinc-900 to-black' },
];

export default function IFrameAppMaker() {
  const {
    webApps,
    addWebApp,
    removeWebApp,
    openApp,
    dockAppIds,
    addToDock,
    removeFromDock,
    desktopItems,
    addToDesktop,
    removeFromDesktop,
  } = useOSStore();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Internet');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_CHOICES[0].class);
  const [inLaunchpad, setInLaunchpad] = useState(true);
  const [inDesktop, setInDesktop] = useState(true);
  const [inDock, setInDock] = useState(false);
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim();
    let targetUrl = url.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter an app name.');
      return;
    }
    if (!targetUrl) {
      setErrorMessage('Please enter a website URL.');
      return;
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const appId = `webapp-${Date.now()}`;
    const newApp: WebApp = {
      id: appId,
      name: trimmedName,
      url: targetUrl,
      category,
      bgGradient: selectedGradient,
      inLaunchpad,
      inDesktop,
      inDock,
    };

    addWebApp(newApp);
    setJustCreated(trimmedName);
    setName('');
    setUrl('');

    setTimeout(() => setJustCreated(null), 4000);
  };

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    setName(preset.name);
    setUrl(preset.url);
    setCategory(preset.category);
    setSelectedGradient(preset.gradient);
  };

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-white select-none overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 via-indigo-600 to-purple-700 flex items-center justify-center shadow-lg border border-white/20">
            <Layers size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>iFrame Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                PWA & Web App Maker
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Turn any website URL into an isolated, windowed desktop app with Launchpad and Dock integration.
            </p>
          </div>
        </div>
      </div>

      {justCreated && (
        <div className="mb-6 flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-emerald-400" />
            <span>
              Successfully created <strong>{justCreated}</strong>! Added to your selected system locations.
            </span>
          </div>
          <button
            onClick={() => {
              const app = webApps[webApps.length - 1];
              if (app) openApp(app.id, app.name, { url: app.url });
            }}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Launch Now
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creator Form */}
        <div className="lg:col-span-7 bg-zinc-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center space-x-2">
            <Plus size={16} className="text-indigo-400" />
            <span>Create New iFrame Web App</span>
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">App Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wikipedia, Spotify, Excalidraw"
                className="w-full rounded-xl bg-zinc-800/80 border border-white/10 px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Website URL</label>
              <div className="relative flex items-center">
                <Globe size={15} className="absolute left-3.5 text-zinc-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl bg-zinc-800/80 border border-white/10 pl-9 pr-3.5 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-zinc-800/80 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Internet">Internet & Web</option>
                <option value="Productivity">Productivity</option>
                <option value="Developer">Developer</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Games">Games</option>
                <option value="Reference">Reference</option>
              </select>
            </div>

            {/* Icon Color Gradient Theme */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">Icon Visual Theme</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {GRADIENT_CHOICES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGradient(g.class)}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                      selectedGradient === g.class
                        ? 'border-indigo-400 bg-white/15 shadow-md'
                        : 'border-white/10 hover:border-white/20 bg-zinc-800/40'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${g.class} shadow-sm mb-1 flex items-center justify-center`}
                    >
                      <Globe size={14} className="text-white" />
                    </div>
                    <span className="text-[10px] text-zinc-400 truncate w-full text-center">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Placement Options (User Explicit Request!) */}
            <div className="pt-2 border-t border-white/10">
              <label className="block text-xs font-medium text-zinc-300 mb-2.5">
                Install Options (Where should this app appear?)
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inLaunchpad}
                    onChange={(e) => setInLaunchpad(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-indigo-500 focus:ring-0"
                  />
                  <span>Add to Launchpad</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inDesktop}
                    onChange={(e) => setInDesktop(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-indigo-500 focus:ring-0"
                  />
                  <span>Add to Desktop</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inDock}
                    onChange={(e) => setInDock(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-indigo-500 focus:ring-0"
                  />
                  <span>Pin to Dock</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <Plus size={16} />
              <span>Create & Install Web App</span>
            </button>
          </form>
        </div>

        {/* Quick Presets & Existing Web Apps */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Presets */}
          <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center space-x-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>Instant Web App Presets</span>
            </h2>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-white/5 hover:border-white/15 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${p.gradient} flex items-center justify-center text-white shadow-sm`}
                    >
                      <Globe size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-zinc-200 block">{p.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[150px] block">
                        {p.url}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApplyPreset(p)}
                    className="px-2.5 py-1 text-xs bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded-lg transition-colors"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Installed Web Apps */}
          <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center space-x-1.5">
              <Globe size={14} className="text-teal-400" />
              <span>Installed iFrame Apps ({webApps.length})</span>
            </h2>

            {webApps.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">
                No custom iFrame web apps installed yet. Create one on the left!
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {webApps.map((app) => {
                  const isInCurrentDock = dockAppIds.includes(app.id);
                  const isInCurrentDesktop = desktopItems.some((i) => i.appId === app.id);

                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/60 border border-white/5"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${
                            app.bgGradient || 'from-indigo-600 to-purple-700'
                          } flex items-center justify-center text-white shadow-sm shrink-0`}
                        >
                          <Globe size={14} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-white truncate block">{app.name}</span>
                          <span className="text-[10px] text-zinc-400 truncate block font-mono">{app.url}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          onClick={() => openApp(app.id, app.name, { url: app.url })}
                          title="Launch App"
                          className="p-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-white transition-colors"
                        >
                          <Play size={12} />
                        </button>

                        <button
                          onClick={() =>
                            isInCurrentDock ? removeFromDock(app.id) : addToDock(app.id)
                          }
                          title={isInCurrentDock ? 'Remove from Dock' : 'Add to Dock'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isInCurrentDock
                              ? 'bg-purple-600/40 text-purple-300'
                              : 'bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {isInCurrentDock ? <PinOff size={12} /> : <Pin size={12} />}
                        </button>

                        <button
                          onClick={() =>
                            isInCurrentDesktop ? removeFromDesktop(app.id) : addToDesktop(app.id, app.name)
                          }
                          title={isInCurrentDesktop ? 'Remove from Desktop' : 'Add to Desktop'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isInCurrentDesktop
                              ? 'bg-blue-600/40 text-blue-300'
                              : 'bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <MonitorDown size={12} />
                        </button>

                        <button
                          onClick={() => removeWebApp(app.id)}
                          title="Delete App"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
