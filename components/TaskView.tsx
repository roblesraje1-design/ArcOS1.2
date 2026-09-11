'use client';

import { useOSStore } from '@/store/useOSStore';
import { X, LayoutGrid, Monitor, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AppIcon from '@/components/AppIcon';

export default function TaskView() {
  const { isTaskViewOpen, closeTaskView, windows, focusApp, closeApp } = useOSStore();

  if (!isTaskViewOpen) return null;

  const openWindows = windows.filter((w) => !w.isMinimized);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[120] bg-black/65 flex flex-col items-center justify-start pt-12 pb-16 px-8 select-none overflow-y-auto"
        onClick={closeTaskView}
      >
        {/* Top Header */}
        <div
          className="mb-8 flex items-center justify-between w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/15">
              <LayoutGrid size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Mission Control / Open Windows</h2>
              <p className="text-xs text-zinc-400">
                {openWindows.length} active {openWindows.length === 1 ? 'window' : 'windows'} • Flick down or press Esc to return
              </p>
            </div>
          </div>

          <button
            onClick={closeTaskView}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/20 transition-colors border border-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Windows Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl content-start mb-12"
          onClick={(e) => e.stopPropagation()}
        >
          {openWindows.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
              <Monitor size={52} className="mb-3 opacity-30 text-zinc-400" />
              <p className="text-sm font-medium text-zinc-400">No active windows open on this space</p>
              <p className="text-xs text-zinc-600 mt-1">Open an app from the Dock or Launchpad to see it here</p>
            </div>
          ) : (
            openWindows.map((win) => (
              <motion.div
                key={win.id}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-zinc-900/90 rounded-2xl overflow-hidden border border-white/15 shadow-2xl cursor-pointer aspect-video flex flex-col transition-all hover:border-indigo-400/80 hover:shadow-indigo-500/20"
                onClick={() => {
                  focusApp(win.id);
                  closeTaskView();
                }}
              >
                {/* Header Proxy */}
                <div className="h-9 bg-zinc-800/90 flex items-center justify-between px-3.5 border-b border-white/10">
                  <div className="flex items-center space-x-2 min-w-0">
                    <AppIcon appId={win.appId} size="sm" />
                    <span className="text-xs font-medium text-zinc-200 truncate">{win.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeApp(win.id);
                    }}
                    className="p-1 hover:bg-red-500/80 hover:text-white rounded-md text-zinc-400 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>

                {/* Window Body Canvas Preview */}
                <div className="flex-1 bg-gradient-to-br from-zinc-950/80 to-zinc-900/80 flex flex-col items-center justify-center p-4">
                  <div className="scale-125 mb-2 group-hover:scale-135 transition-transform duration-200">
                    <AppIcon appId={win.appId} size="lg" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 group-hover:text-white mt-1">
                    {win.title}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {win.size.width} × {win.size.height}
                  </span>
                </div>

                {/* Bottom hover bar */}
                <div className="py-1 px-3 bg-zinc-950/90 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-medium">Click to switch to window</span>
                  <span className="text-[10px] text-indigo-400 font-mono">⌘-Space</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Space Preview Bar at Bottom */}
        <div
          className="flex items-center space-x-3 bg-zinc-900/80 p-2 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-white text-xs font-semibold">
            <Monitor size={14} className="text-indigo-400" />
            <span>Space 1 (Main Desktop)</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs cursor-pointer transition-colors">
            <Layers size={14} />
            <span>+ Add Space</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
