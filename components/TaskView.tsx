'use client';

import { useOSStore, WindowState } from '@/store/useOSStore';
import { X, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TaskView() {
  const { windows, closeTaskView, focusApp, closeApp } = useOSStore();

  const openWindows = windows.filter(w => !w.isMinimized);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-zinc-950/40 backdrop-blur-3xl flex flex-col items-center justify-center p-12 overflow-hidden"
        onClick={closeTaskView}
      >
        <div className="mb-12 flex items-center justify-between w-full max-w-6xl">
           <h2 className="text-3xl font-semibold text-white tracking-tight">Open Windows</h2>
           <button 
             onClick={closeTaskView}
             className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
           >
             <X size={24} />
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl overflow-y-auto max-h-[70vh] pb-8 content-start">
          {openWindows.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center pt-20 text-zinc-500">
               <Square size={64} className="mb-4 opacity-20" />
               <p className="text-xl">No active windows</p>
            </div>
          ) : (
            openWindows.map((win) => (
              <motion.div
                key={win.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer aspect-video flex flex-col"
                onClick={(e) => {
                  e.stopPropagation();
                  focusApp(win.id);
                }}
              >
                {/* Header Proxy */}
                <div className="h-10 bg-zinc-800 flex items-center justify-between px-4 border-b border-white/5">
                   <span className="text-xs font-medium text-zinc-300 truncate">{win.title}</span>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       closeApp(win.id);
                     }}
                     className="p-1 hover:bg-red-500 hover:text-white rounded text-zinc-500 transition-colors"
                   >
                     <X size={14} />
                   </button>
                </div>
                {/* Content Proxy - Just a placeholder or background related to the app */}
                <div className="flex-1 bg-zinc-950/50 flex items-center justify-center">
                   <div className="w-12 h-12 rounded-2xl bg-zinc-800 animate-pulse flex items-center justify-center text-zinc-700">
                      <Square size={24} />
                   </div>
                </div>
                
                {/* Information Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{win.appId}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Desktop Preview Strip at the bottom */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-4">
           <div className="w-32 h-20 rounded-lg border-2 border-blue-500 bg-zinc-800 flex items-center justify-center shadow-2xl">
              <span className="text-[10px] font-bold text-blue-400">DESKTOP 1</span>
           </div>
           <button className="w-32 h-20 rounded-lg border-2 border-white/5 bg-zinc-900/50 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <span className="text-[10px] font-bold text-zinc-500">+ NEW DESKTOP</span>
           </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
