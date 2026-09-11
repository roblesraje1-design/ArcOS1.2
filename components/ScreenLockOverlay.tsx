'use client';

import { useState, useEffect, useRef } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { Lock, Unlock, ShieldAlert, KeyRound, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScreenLockOverlay() {
  const { isScreenLocked, setScreenLocked, systemState } = useOSStore();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Block outside keystrokes and browser navigation when screen is locked
  useEffect(() => {
    if (!isScreenLocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If unlock modal is open, allow typing PIN / Enter / Escape
      if (showUnlockModal) {
        if (e.key === 'Escape') {
          setShowUnlockModal(false);
          setEnteredPin('');
        }
        return;
      }

      // Block common browser-level navigation / tab closing keys
      if (
        (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) ||
        (e.ctrlKey && ['w', 't', 'r', 'n', 'q'].includes(e.key.toLowerCase())) ||
        e.key === 'F11' ||
        e.key === 'F3'
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      // If user presses any key, suggest unlocking
      if (e.key === 'Enter' || e.key === ' ') {
        setShowUnlockModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isScreenLocked, showUnlockModal]);

  useEffect(() => {
    if (showUnlockModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showUnlockModal]);

  // 2-finger high force flick gesture handler when Screen Locked
  useEffect(() => {
    if (!isScreenLocked) return;

    let touchStartY = 0;
    let touchStartTime = 0;
    let isTwoFingerTouch = false;
    let lastWheelTime = 0;
    let accumulatedDeltaY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      isTwoFingerTouch = e.touches.length === 2;
      if (e.touches.length >= 1) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTwoFingerTouch || e.changedTouches.length >= 2) {
        const touchEndY = e.changedTouches[0]?.clientY || 0;
        const deltaY = touchStartY - touchEndY;
        const duration = Date.now() - touchStartTime;

        // Requires fast & forceful upward 2-finger flick (< 300ms, > 140px distance)
        if (duration < 350 && deltaY > 140) {
          setShowUnlockModal(true);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime > 200) {
        accumulatedDeltaY = 0;
      }
      lastWheelTime = now;
      accumulatedDeltaY += e.deltaY;

      // Fast, high-force trackpad scroll upward while locked (delta < -400)
      if (accumulatedDeltaY < -400 && Math.abs(e.deltaY) > 120) {
        accumulatedDeltaY = 0;
        setShowUnlockModal(true);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isScreenLocked]);

  if (!isScreenLocked) return null;

  const handleUnlock = (exitBrowserFullscreen = false) => {
    if (systemState.password && enteredPin !== systemState.password) {
      setErrorMessage('Incorrect password. Please try again.');
      setEnteredPin('');
      return;
    }

    setScreenLocked(false);
    setShowUnlockModal(false);
    setEnteredPin('');
    setErrorMessage(null);

    if (exitBrowserFullscreen && typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div
      id="arcos-screen-lock-barrier"
      className="fixed inset-0 pointer-events-none z-[9999] select-none flex flex-col justify-between p-4"
    >
      {/* Floating Kiosk Status Pill at Top Right */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 backdrop-blur-2xl border border-amber-500/30 text-amber-300 text-xs shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-semibold tracking-wide">Screen Locked to ArcOS</span>
          <span className="text-zinc-500 text-[10px]">•</span>
          <span className="text-zinc-400 text-[11px] hidden sm:inline">Browser inputs restricted</span>
        </div>

        <button
          onClick={() => setShowUnlockModal(true)}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-[0_4px_20px_rgba(37,99,235,0.4)] border border-blue-400/40 transition-all cursor-pointer"
        >
          <Lock size={13} />
          <span>Unlock Screen</span>
        </button>
      </div>

      {/* Unlock Dialog / Modal */}
      <AnimatePresence>
        {showUnlockModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[10000] pointer-events-auto"
            onClick={() => setShowUnlockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-zinc-900/95 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white flex flex-col items-center text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl ring-4 ring-blue-500/20">
                <Lock size={26} />
              </div>

              <div>
                <h3 className="text-lg font-bold tracking-tight">Unlock ArcOS</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {systemState.password
                    ? 'Enter your system password to unlock screen controls.'
                    : 'Screen is currently in full-screen locked kiosk mode.'}
                </p>
              </div>

              {systemState.password && (
                <div className="w-full space-y-2">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="password"
                      placeholder="Password"
                      value={enteredPin}
                      onChange={(e) => {
                        setEnteredPin(e.target.value);
                        setErrorMessage(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUnlock();
                      }}
                      className="w-full bg-zinc-800/90 border border-white/15 rounded-xl px-4 py-2.5 text-center text-white text-sm outline-none focus:border-blue-500 transition-all font-mono"
                    />
                    <KeyRound size={15} className="absolute left-3 top-3 text-zinc-500" />
                  </div>

                  {errorMessage && (
                    <div className="text-[11px] text-rose-400 flex items-center justify-center space-x-1">
                      <ShieldAlert size={12} />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col w-full space-y-2 pt-2">
                <button
                  onClick={() => handleUnlock(false)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Unlock size={14} />
                  <span>Unlock ArcOS</span>
                </button>

                <button
                  onClick={() => handleUnlock(true)}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 text-zinc-300 hover:text-white text-xs font-medium border border-white/10 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Minimize2 size={13} />
                  <span>Unlock & Exit Fullscreen</span>
                </button>

                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-200 py-1 transition-colors"
                >
                  Keep Locked
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
