'use client';

import { useOSStore } from '@/store/useOSStore';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { Volume2, Sparkles } from 'lucide-react';

export function playArcOSBootSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    // Classic rich major chord with harmonic overtone depth (F#2, C#3, F#3, A#3, C#4, F#4)
    const freqs = [92.5, 138.59, 185.0, 233.08, 277.18, 369.99, 739.99];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sawtooth' : idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 3.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15 / (idx * 0.6 + 1), now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.6);
    });
  } catch (e) {
    console.log('AudioContext boot chime notice:', e);
  }
}

export function BootScreen() {
  const { isBooting, setBooting, setBiosActive } = useOSStore();
  const [progress, setProgress] = useState(0);
  const [bootPhase, setBootPhase] = useState('Initializing ArcOS Kernel...');
  const soundPlayedRef = useRef(false);
  const keyPressCountRef = useRef(0);

  useEffect(() => {
    if (!isBooting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') {
        keyPressCountRef.current += 1;
        if (keyPressCountRef.current >= 4) {
          setBooting(false);
          setBiosActive(true);
        }
      } else if (e.key === 'F2' || e.key === 'Delete') {
        setBooting(false);
        setBiosActive(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBooting, setBooting, setBiosActive]);

  useEffect(() => {
    if (!isBooting) return;

    // Trigger boot sound
    if (!soundPlayedRef.current) {
      soundPlayedRef.current = true;
      playArcOSBootSound();
    }

    const phases = [
      { at: 15, text: 'Mounting VFS & Google Services Bridge...' },
      { at: 40, text: 'Loading Window Compositor & Glass UI...' },
      { at: 70, text: 'Starting ArcOS AI Spotlight Engine...' },
      { at: 90, text: 'Launching Desktop Environment...' },
    ];

    // Smooth ~2.8s total boot duration
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setBooting(false), 500);
          return 100;
        }
        const next = prev + 2;
        const currentPhase = phases.find((p) => next >= p.at);
        if (currentPhase) setBootPhase(currentPhase.text);
        return next;
      });
    }, 55);

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
    <div
      onClick={() => playArcOSBootSound()}
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center select-none cursor-pointer"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-10 flex flex-col items-center"
      >
        {/* Animated ArcOS Logo with Orbital Neon Rings */}
        <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
          {/* Outer Pulsing Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-cyan-400/30 blur-xl animate-pulse" />

          {/* Rotating Orbital Arc */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
          />

          {/* Counter-Rotating Orbital Arc */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-transparent border-b-purple-500 border-l-indigo-400 opacity-80"
          />

          {/* ArcOS Center Emblem */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-2xl flex items-center justify-center">
            <svg
              className="w-9 h-9 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 15L82 78H68L50 42L32 78H18L50 15Z"
                fill="currentColor"
              />
              <circle cx="50" cy="55" r="7" fill="#38bdf8" />
              <path
                d="M20 72C35 62 65 62 80 72"
                stroke="#67e8f9"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white tracking-[0.25em] uppercase font-sans">
          Arc<span className="text-cyan-400 font-light">OS</span>
        </h1>
        <p className="text-zinc-400 text-xs mt-2 font-mono tracking-tight">{bootPhase}</p>
      </motion.div>

      {/* Sleek macOS-style Progress Bar */}
      <div className="w-56 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden border border-white/5 p-0.5">
        <motion.div
          style={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all duration-75"
        />
      </div>

      <div className="mt-5 flex items-center space-x-2 text-[10px] text-zinc-500 font-mono">
        <Sparkles size={11} className="text-cyan-400 animate-pulse" />
        <span>ARCOS_KERNEL v2.5.0 // SESSION {session}</span>
      </div>

      <div className="mt-2 text-[10px] text-zinc-600 font-sans">
        Click anywhere to replay startup chime
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
