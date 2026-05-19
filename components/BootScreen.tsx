'use client';

import { useOSStore } from '@/store/useOSStore';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export function BootScreen() {
  const { isBooting, setBooting, setBiosActive } = useOSStore();
  const [progress, setProgress] = useState(0);
  const [aCount, setACount] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') {
        setACount(prev => {
          const nextCount = prev + 1;
          if (nextCount >= 4) {
            setBiosActive(true);
            return 0; // reset
          }
          return nextCount;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setBiosActive]);

  useEffect(() => {
    if (!isBooting) return;
    
    // 100 increments * 150ms = 15000ms (15 seconds) + 1000ms delay = 16.0 seconds total boot sequence
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setBooting(false), 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isBooting, setBooting]);

  const [session, setSession] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSession(Math.random().toString(36).substring(7).toUpperCase());
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!isBooting) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12 flex flex-col items-center"
      >
        <div className="relative w-24 h-24 mb-8">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 rounded-full border-t-2 border-blue-500 border-r-2 border-transparent"
           />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                 <div className="w-4 h-4 bg-blue-600 rounded-sm shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                 <div className="w-4 h-4 bg-blue-500 rounded-sm shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                 <div className="w-4 h-4 bg-blue-400 rounded-sm shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                 <div className="w-4 h-4 bg-blue-300 rounded-sm shadow-[0_0_15px_rgba(147,197,253,0.5)]" />
              </div>
           </div>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-widest uppercase">ArcOS</h1>
        <p className="text-zinc-500 text-xs mt-2 font-mono tracking-tighter">Initializing Unified Runtime Environment...</p>
      </motion.div>

      <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
        />
      </div>
      
      <div className="mt-4 text-[10px] text-zinc-600 font-mono">
         SYSTEM_BUILD: 10.0.22621 / SESSION: {session}
      </div>
    </div>
  );
}

export function ContextMenu() {
  const { contextMenu, closeContextMenu } = useOSStore();

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [closeContextMenu]);

  if (!contextMenu.isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed z-[999] w-56 rounded-xl border border-white/10 bg-zinc-900/90 py-1.5 shadow-2xl backdrop-blur-2xl"
      style={{ top: contextMenu.y, left: contextMenu.x }}
      onClick={(e) => e.stopPropagation()}
    >
      {contextMenu.options.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => {
            opt.action();
            closeContextMenu();
          }}
          className={`flex w-full items-center space-x-3 px-3 py-1.5 text-sm transition-colors hover:bg-white/5 active:bg-white/10 ${opt.danger ? 'text-red-400 hover:text-red-300' : 'text-zinc-200'}`}
        >
          {opt.icon && <opt.icon size={16} />}
          <span>{opt.label}</span>
        </button>
      ))}
    </motion.div>
  );
}

export function SplashScreen() {
  const { activeSplashScreen, closeSplashScreen, customApps } = useOSStore();
  
  if (!activeSplashScreen) return null;

  const app = customApps.find(a => a.id === activeSplashScreen);
  const appName = app ? app.title : "Application";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
           <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <h2 className="text-4xl font-bold text-white tracking-tighter">{appName}</h2>
           </div>
           <div className="p-8">
              <h3 className="text-xl font-semibold text-zinc-100 mb-4">What&apos;s New in This Version</h3>
              <ul className="space-y-4 text-zinc-400 text-sm">
                 <li className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <span>Deep integration with ArcOS Window Management and Snap layouts.</span>
                 </li>
                 <li className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <span>Improved performance with sandboxed execution runtime.</span>
                 </li>
                 <li className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <span>Native support for system-wide transparency and animations.</span>
                 </li>
                 <li className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <span>Real-time communication with the system kernel (WindowManager).</span>
                 </li>
              </ul>
              <button 
                onClick={closeSplashScreen}
                className="mt-10 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Let&apos;s Go
              </button>
           </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
