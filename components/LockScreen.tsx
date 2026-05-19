'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOSStore } from '@/store/useOSStore';
import { Lock, Unlock, ArrowRight } from 'lucide-react';

export default function LockScreen() {
  const { isLockScreenVisible, setLockScreenVisible, wallpaper, systemState } = useOSStore();
  const [isPullingUp, setIsPullingUp] = useState(false);
  const [time, setTime] = useState(new Date());
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    if (!systemState.password || pin === systemState.password) {
      setLockScreenVisible(false);
      setIsPullingUp(false);
      setError(false);
      setPin('');
    } else {
      setError(true);
      setPin('');
    }
  };

  if (!isLockScreenVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: isPullingUp ? '-100%' : '0%' }}
        exit={{ y: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[10000] bg-cover bg-center flex flex-col items-center justify-between py-24 select-none"
        style={{ backgroundImage: `url(${wallpaper})` }}
        onClick={() => setIsPullingUp(true)}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

        <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
               <h1 className="text-8xl font-black text-white/90 tracking-tighter drop-shadow-2xl">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
               </h1>
               <p className="text-xl font-medium text-white/80 mt-2">
                  {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
               </p>
            </motion.div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
           {isPullingUp ? (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-80 flex flex-col items-center shadow-2xl"
             >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-xl mb-4">
                  {systemState.userAccount.avatar}
                </div>
                <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">{systemState.userAccount.name}</h2>
                <div className="w-full relative">
                   <input 
                    type="password" 
                    placeholder={systemState.password ? "Enter Password" : "Click arrow to enter"}
                    autoFocus
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 px-4 text-center text-white text-sm outline-none focus:border-blue-500/50 transition-all mb-4`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnlock();
                      }
                    }}
                   />
                </div>
                <button 
                  onClick={handleUnlock}
                  className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                >
                   <ArrowRight size={20} />
                </button>
             </motion.div>
           ) : (
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="flex flex-col items-center text-white/60"
             >
                <Lock size={32} className="mb-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Click or Swipe up to unlock</span>
             </motion.div>
           )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
