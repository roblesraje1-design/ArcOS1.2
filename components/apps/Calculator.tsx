'use client';

import { useState } from 'react';
import {
  Calculator as CalcIcon,
  Sparkles,
  Equal,
  Compass,
  Ruler,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export default function Calculator() {
  const [activeTab, setActiveTab] = useState<'standard' | 'equations' | 'midpoint' | 'distance' | 'ai'>('standard');

  // Standard Calculator State
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  // AI Equation Solver State
  const [eqInput, setEqInput] = useState('2x^2 - 4x - 6 = 0');
  const [eqSolution, setEqSolution] = useState<string | null>(null);
  const [isEqLoading, setIsEqLoading] = useState(false);

  // Midpoint State
  const [p1, setP1] = useState({ x: 2, y: 4 });
  const [p2, setP2] = useState({ x: 8, y: 12 });
  const [midpointExplanation, setMidpointExplanation] = useState<string | null>(null);
  const [isMidpointLoading, setIsMidpointLoading] = useState(false);

  // Distance State
  const [dp1, setDp1] = useState({ x: 1, y: 2 });
  const [dp2, setDp2] = useState({ x: 4, y: 6 });
  const [distExplanation, setDistExplanation] = useState<string | null>(null);
  const [isDistLoading, setIsDistLoading] = useState(false);

  // Freeform AI prompt
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Copy helper
  const [copied, setCopied] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Standard Calculator logic
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
      // Safe math evaluation
      const sanitized = full
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');
      if (!/^[\d\s+\-*/.()e**]+$/.test(sanitized)) {
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

  // AI Equation Solver
  const handleSolveEquation = async () => {
    if (!eqInput.trim()) return;
    setIsEqLoading(true);
    setEqSolution(null);
    try {
      const res = await fetch('/api/gemini/math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'equation', equation: eqInput }),
      });
      const data = await res.json();
      setEqSolution(data.result || data.solution || 'Could not solve equation.');
    } catch (err: any) {
      setEqSolution(`Error: ${err.message}`);
    } finally {
      setIsEqLoading(false);
    }
  };

  // Midpoint Calculation
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;

  const handleExplainMidpoint = async () => {
    setIsMidpointLoading(true);
    try {
      const res = await fetch('/api/gemini/math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'midpoint', p1, p2 }),
      });
      const data = await res.json();
      setMidpointExplanation(data.result);
    } catch (err: any) {
      setMidpointExplanation(`Error: ${err.message}`);
    } finally {
      setIsMidpointLoading(false);
    }
  };

  // Distance Calculation
  const deltaX = dp2.x - dp1.x;
  const deltaY = dp2.y - dp1.y;
  const distSquared = deltaX * deltaX + deltaY * deltaY;
  const distDecimal = Math.sqrt(distSquared);

  const handleExplainDistance = async () => {
    setIsDistLoading(true);
    try {
      const res = await fetch('/api/gemini/math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'distance', p1: dp1, p2: dp2 }),
      });
      const data = await res.json();
      setDistExplanation(data.result);
    } catch (err: any) {
      setDistExplanation(`Error: ${err.message}`);
    } finally {
      setIsDistLoading(false);
    }
  };

  // Freeform AI Math
  const handleSolveAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/gemini/math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'freeform', query: aiPrompt }),
      });
      const data = await res.json();
      setAiResult(data.result);
    } catch (err: any) {
      setAiResult(`Error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100 select-none">
      {/* Top Tab Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-4 py-2 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <CalcIcon size={16} />
          </div>
          <span className="text-xs font-semibold text-white tracking-tight">
            ArcOS Math & AI
          </span>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center space-x-1 bg-zinc-800/80 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('standard')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'standard' ? 'bg-orange-500 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab('equations')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'equations' ? 'bg-purple-600 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles size={12} />
            <span>Equations</span>
          </button>
          <button
            onClick={() => setActiveTab('midpoint')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'midpoint' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Compass size={12} />
            <span>Midpoint</span>
          </button>
          <button
            onClick={() => setActiveTab('distance')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'distance' ? 'bg-emerald-600 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Ruler size={12} />
            <span>Distance</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'ai' ? 'bg-pink-600 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <HelpCircle size={12} />
            <span>AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {/* Tab 1: Standard Calculator */}
        {activeTab === 'standard' && (
          <div className="max-w-xs mx-auto bg-zinc-900/90 border border-white/10 rounded-3xl p-4 shadow-2xl">
            {/* Screen */}
            <div className="bg-black/50 rounded-2xl p-4 mb-4 text-right border border-white/5">
              <div className="h-5 text-xs font-mono text-zinc-500">{equation}</div>
              <div className="text-3xl font-mono font-bold text-white tracking-tight truncate">
                {display}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-2 text-sm font-medium">
              <button
                onClick={handleClear}
                className="p-3.5 rounded-xl bg-zinc-700/60 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                AC
              </button>
              <button
                onClick={() => setDisplay(String(-parseFloat(display)))}
                className="p-3.5 rounded-xl bg-zinc-700/60 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                +/-
              </button>
              <button
                onClick={() => setDisplay(String(parseFloat(display) / 100))}
                className="p-3.5 rounded-xl bg-zinc-700/60 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                %
              </button>
              <button
                onClick={() => handleOp('÷')}
                className="p-3.5 rounded-xl bg-orange-500/80 hover:bg-orange-500 text-white font-bold transition-colors"
              >
                ÷
              </button>

              {['7', '8', '9'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNum(n)}
                  className="p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-white transition-colors"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleOp('×')}
                className="p-3.5 rounded-xl bg-orange-500/80 hover:bg-orange-500 text-white font-bold transition-colors"
              >
                ×
              </button>

              {['4', '5', '6'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNum(n)}
                  className="p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-white transition-colors"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleOp('-')}
                className="p-3.5 rounded-xl bg-orange-500/80 hover:bg-orange-500 text-white font-bold transition-colors"
              >
                -
              </button>

              {['1', '2', '3'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNum(n)}
                  className="p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-white transition-colors"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleOp('+')}
                className="p-3.5 rounded-xl bg-orange-500/80 hover:bg-orange-500 text-white font-bold transition-colors"
              >
                +
              </button>

              <button
                onClick={() => handleNum('0')}
                className="col-span-2 p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-white text-left pl-6 transition-colors"
              >
                0
              </button>
              <button
                onClick={() => {
                  if (!display.includes('.')) setDisplay(display + '.');
                }}
                className="p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-white transition-colors"
              >
                .
              </button>
              <button
                onClick={handleEqual}
                className="p-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold transition-colors shadow-md"
              >
                =
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Solve Equations with AI */}
        {activeTab === 'equations' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
                <Sparkles size={16} className="text-purple-400" />
                <span>AI Equation & System Solver</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Enter any linear, quadratic, polynomial equation, or system of equations to solve with step-by-step mathematical reasoning.
              </p>

              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={eqInput}
                  onChange={(e) => setEqInput(e.target.value)}
                  placeholder="e.g. 2x^2 - 4x - 6 = 0 or 3x + y = 12"
                  className="flex-1 rounded-xl bg-zinc-800 border border-white/10 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleSolveEquation}
                  disabled={isEqLoading}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Sparkles size={14} className={isEqLoading ? 'animate-spin' : ''} />
                  <span>{isEqLoading ? 'Solving...' : 'Solve'}</span>
                </button>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
                <span>Presets:</span>
                {[
                  '3x + 15 = 45',
                  'x^2 - 5x + 6 = 0',
                  '2x + 3y = 12, x - y = 1',
                  'log2(x) + 3 = 7',
                ].map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => setEqInput(sample)}
                    className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-purple-300 font-mono"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Solution Display */}
            {eqSolution && (
              <div className="bg-zinc-900/90 border border-purple-500/30 rounded-2xl p-5 shadow-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-semibold text-purple-300">Step-by-Step Solution</span>
                  <button
                    onClick={() => handleCopy(eqSolution)}
                    className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-white"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xs text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {eqSolution}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Midpoint Formula */}
        {activeTab === 'midpoint' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
                <Compass size={16} className="text-blue-400" />
                <span>Midpoint Formula Calculator</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Calculate the exact midpoint coordinate between two points in Cartesian space.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Point 1 */}
                <div className="bg-zinc-800/60 p-3 rounded-xl border border-white/5">
                  <div className="text-xs font-semibold text-blue-300 mb-2">Point A (x₁, y₁)</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-400">x₁</label>
                      <input
                        type="number"
                        value={p1.x}
                        onChange={(e) => setP1({ ...p1, x: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400">y₁</label>
                      <input
                        type="number"
                        value={p1.y}
                        onChange={(e) => setP1({ ...p1, y: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="bg-zinc-800/60 p-3 rounded-xl border border-white/5">
                  <div className="text-xs font-semibold text-blue-300 mb-2">Point B (x₂, y₂)</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-400">x₂</label>
                      <input
                        type="number"
                        value={p2.x}
                        onChange={(e) => setP2({ ...p2, x: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400">y₂</label>
                      <input
                        type="number"
                        value={p2.y}
                        onChange={(e) => setP2({ ...p2, y: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Midpoint Result Box */}
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] text-blue-300 uppercase tracking-wider font-semibold">
                    Midpoint Formula: M = ((x₁ + x₂)/2, (y₁ + y₂)/2)
                  </div>
                  <div className="text-xl font-bold text-white mt-1 font-mono">
                    M = ({midX}, {midY})
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    = ({`(${p1.x} + ${p2.x})/2`}, {`(${p1.y} + ${p2.y})/2`})
                  </div>
                </div>

                <button
                  onClick={handleExplainMidpoint}
                  disabled={isMidpointLoading}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white shadow transition-all cursor-pointer"
                >
                  <Sparkles size={13} className={isMidpointLoading ? 'animate-spin' : ''} />
                  <span>{isMidpointLoading ? 'Analyzing...' : 'AI Explanation'}</span>
                </button>
              </div>

              {midpointExplanation && (
                <div className="bg-zinc-950/80 border border-blue-500/20 rounded-xl p-4 text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {midpointExplanation}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Distance Formula */}
        {activeTab === 'distance' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
                <Ruler size={16} className="text-emerald-400" />
                <span>Euclidean Distance Calculator</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Calculate the distance between two 2D coordinates using the Pythagorean distance theorem.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-zinc-800/60 p-3 rounded-xl border border-white/5">
                  <div className="text-xs font-semibold text-emerald-300 mb-2">Point A (x₁, y₁)</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-400">x₁</label>
                      <input
                        type="number"
                        value={dp1.x}
                        onChange={(e) => setDp1({ ...dp1, x: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400">y₁</label>
                      <input
                        type="number"
                        value={dp1.y}
                        onChange={(e) => setDp1({ ...dp1, y: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800/60 p-3 rounded-xl border border-white/5">
                  <div className="text-xs font-semibold text-emerald-300 mb-2">Point B (x₂, y₂)</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-400">x₂</label>
                      <input
                        type="number"
                        value={dp2.x}
                        onChange={(e) => setDp2({ ...dp2, x: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400">y₂</label>
                      <input
                        type="number"
                        value={dp2.y}
                        onChange={(e) => setDp2({ ...dp2, y: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Box */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
                    Distance Formula: d = √((x₂ - x₁)² + (y₂ - y₁)²)
                  </div>
                  <div className="text-xl font-bold text-white mt-1 font-mono">
                    d = √{distSquared} ≈ {distDecimal.toFixed(4)}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Δx = {deltaX}, Δy = {deltaY} | Δx² + Δy² = {distSquared}
                  </div>
                </div>

                <button
                  onClick={handleExplainDistance}
                  disabled={isDistLoading}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white shadow transition-all cursor-pointer"
                >
                  <Sparkles size={13} className={isDistLoading ? 'animate-spin' : ''} />
                  <span>{isDistLoading ? 'Analyzing...' : 'AI Explanation'}</span>
                </button>
              </div>

              {distExplanation && (
                <div className="bg-zinc-950/80 border border-emerald-500/20 rounded-xl p-4 text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {distExplanation}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: AI Freeform Math Tutor */}
        {activeTab === 'ai' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
                <Sparkles size={16} className="text-pink-400" />
                <span>AI Mathematics Tutor</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Ask any mathematics question (algebra, calculus, trigonometry, statistics, geometry, or proofs).
              </p>

              <form onSubmit={handleSolveAiPrompt} className="space-y-3">
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Find the derivative of f(x) = 3x^3 - 5x^2 + 2x, or explain how the quadratic formula was derived."
                  className="w-full rounded-xl bg-zinc-800 border border-white/10 p-3 text-xs text-white outline-none focus:border-pink-500 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isAiLoading || !aiPrompt.trim()}
                    className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-semibold text-white shadow-md active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Sparkles size={14} className={isAiLoading ? 'animate-spin' : ''} />
                    <span>{isAiLoading ? 'Solving Problem...' : 'Solve with AI'}</span>
                  </button>
                </div>
              </form>
            </div>

            {aiResult && (
              <div className="bg-zinc-900/90 border border-pink-500/30 rounded-2xl p-5 shadow-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-semibold text-pink-300">AI Solution Breakdown</span>
                  <button
                    onClick={() => handleCopy(aiResult)}
                    className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-white"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xs text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {aiResult}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
