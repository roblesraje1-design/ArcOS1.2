'use client';

import { useState } from 'react';
import { useOSStore } from '@/store/useOSStore';
import {
  Calculator as CalcIcon,
  X,
  Maximize2,
  Sparkles,
  Delete
} from 'lucide-react';

export default function CalculatorPopup() {
  const {
    isCalculatorPopupOpen,
    closeCalculatorPopup,
    openApp
  } = useOSStore();

  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  if (!isCalculatorPopupOpen) return null;

  const handleNum = (n: string) => {
    if (hasCalculated) {
      setDisplay(n);
      setHasCalculated(false);
    } else {
      setDisplay(display === '0' ? n : display + n);
    }
  };

  const handleOp = (op: string) => {
    setEquation(`${display} ${op} `);
    setDisplay('0');
    setHasCalculated(false);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleEqual = () => {
    try {
      const full = `${equation}${display}`;
      const sanitized = full.replace(/×/g, '*').replace(/÷/g, '/');
      if (!/^[\d\s+\-*/.()]+$/.test(sanitized)) {
        setDisplay('Error');
        return;
      }
      const res = Function(`'use strict'; return (${sanitized})`)();
      setDisplay(String(res));
      setEquation('');
      setHasCalculated(true);
    } catch {
      setDisplay('Error');
    }
  };

  const handleOpenFull = () => {
    closeCalculatorPopup();
    openApp('calculator', 'Calculator & AI Math');
  };

  return (
    <div
      id="control-center-calculator-popup"
      className="fixed top-9 right-88 sm:right-92 w-72 z-[140] bg-zinc-900/90 backdrop-blur-3xl border border-white/15 rounded-3xl p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-white select-none animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center space-x-1.5">
          <div className="w-5 h-5 rounded-md bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <CalcIcon size={12} />
          </div>
          <span className="text-xs font-semibold text-zinc-200">Quick Calculator</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleOpenFull}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Open Full AI Math App"
          >
            <Maximize2 size={12} />
          </button>
          <button
            onClick={closeCalculatorPopup}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Screen */}
      <div className="bg-black/60 rounded-xl p-2.5 mb-2.5 text-right border border-white/5">
        <div className="h-4 text-[10px] font-mono text-zinc-400">{equation}</div>
        <div className="text-2xl font-mono font-bold text-white tracking-tight truncate">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-1.5 text-xs font-medium mb-2.5">
        <button
          onClick={handleClear}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
        >
          AC
        </button>
        <button
          onClick={() => setDisplay(String(-parseFloat(display)))}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
        >
          +/-
        </button>
        <button
          onClick={() => setDisplay(String(parseFloat(display) / 100))}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
        >
          %
        </button>
        <button
          onClick={() => handleOp('÷')}
          className="p-2 rounded-lg bg-orange-500/90 hover:bg-orange-500 text-white font-bold transition-colors"
        >
          ÷
        </button>

        {['7', '8', '9'].map((n) => (
          <button
            key={n}
            onClick={() => handleNum(n)}
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOp('×')}
          className="p-2 rounded-lg bg-orange-500/90 hover:bg-orange-500 text-white font-bold transition-colors"
        >
          ×
        </button>

        {['4', '5', '6'].map((n) => (
          <button
            key={n}
            onClick={() => handleNum(n)}
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOp('-')}
          className="p-2 rounded-lg bg-orange-500/90 hover:bg-orange-500 text-white font-bold transition-colors"
        >
          -
        </button>

        {['1', '2', '3'].map((n) => (
          <button
            key={n}
            onClick={() => handleNum(n)}
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOp('+')}
          className="p-2 rounded-lg bg-orange-500/90 hover:bg-orange-500 text-white font-bold transition-colors"
        >
          +
        </button>

        <button
          onClick={() => handleNum('0')}
          className="col-span-2 p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white text-left pl-4 transition-colors"
        >
          0
        </button>
        <button
          onClick={() => {
            if (!display.includes('.')) setDisplay(display + '.');
          }}
          className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
        >
          .
        </button>
        <button
          onClick={handleEqual}
          className="p-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-bold transition-colors shadow-sm"
        >
          =
        </button>
      </div>

      {/* Button to open Real App with AI Equation, Midpoint & Distance solver */}
      <button
        onClick={handleOpenFull}
        className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/30 text-purple-200 text-xs font-medium transition-all"
      >
        <Sparkles size={13} className="text-purple-300" />
        <span>Open AI Equations, Midpoint & Distance</span>
      </button>
    </div>
  );
}
