'use client';

import { useState } from 'react';
import {
  Presentation,
  Plus,
  Play,
  Trash2,
  Share2,
  CheckCircle2,
  LayoutGrid,
  Type,
  Image as ImageIcon,
  Palette,
  Maximize2,
} from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
}

export default function GoogleSlides({ appProps }: { appProps?: any }) {
  const [deckTitle, setDeckTitle] = useState(appProps?.title || 'Untitled Presentation');
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      title: 'ArcOS Presentation',
      subtitle: 'Modern Web Operating System Architecture',
      bgColor: 'bg-gradient-to-tr from-indigo-900 to-purple-900',
    },
    {
      id: '2',
      title: 'Key Capabilities',
      subtitle: '• Multi-windowing\n• Google Integration\n• Custom iFrame Apps',
      bgColor: 'bg-gradient-to-tr from-slate-900 to-blue-900',
    },
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);

  const activeSlide = slides[activeSlideIndex] || slides[0];

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: String(Date.now()),
      title: `Slide ${slides.length + 1}`,
      subtitle: 'Click to add slide notes or content',
      bgColor: 'bg-gradient-to-tr from-zinc-900 to-zinc-800',
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleDeleteSlide = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== idx);
    setSlides(updated);
    setActiveSlideIndex(Math.max(0, idx - 1));
  };

  const updateActiveSlide = (key: 'title' | 'subtitle', val: string) => {
    const updated = [...slides];
    updated[activeSlideIndex] = { ...updated[activeSlideIndex], [key]: val };
    setSlides(updated);
  };

  return (
    <div className="h-full w-full bg-zinc-950 text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Top Bar */}
      <div className="bg-zinc-900 border-b border-white/10 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-md">
            <Presentation size={20} />
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              className="text-sm font-semibold bg-transparent border-none outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 -ml-1 text-white"
            />
            <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400">
              <CheckCircle2 size={11} className="text-amber-400" />
              <span>Saved to Google Drive</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPresenting(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-colors"
          >
            <Play size={13} className="fill-current" />
            <span>Slideshow</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors">
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Slide Deck Sidebar */}
        <div className="w-48 bg-zinc-900/70 border-r border-white/10 p-3 flex flex-col space-y-3 shrink-0 overflow-y-auto custom-scrollbar">
          <button
            onClick={handleAddSlide}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Plus size={14} />
            <span>New Slide</span>
          </button>

          <div className="space-y-2">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => setActiveSlideIndex(idx)}
                className={`group relative p-2 rounded-xl border transition-all cursor-pointer aspect-video flex flex-col justify-between overflow-hidden ${
                  activeSlideIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/30 bg-white/10 shadow-lg'
                    : 'border-white/10 hover:border-white/25 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded text-zinc-300">
                    {idx + 1}
                  </span>
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteSlide(idx, e)}
                      className="p-1 hover:bg-red-500/80 rounded text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>

                <div className="z-10 text-left">
                  <div className="text-[10px] font-bold text-white truncate">{slide.title}</div>
                  <div className="text-[8px] text-zinc-400 truncate">{slide.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Stage Slide Editor */}
        <div className="flex-1 bg-zinc-950 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div
            className={`w-full max-w-2xl aspect-video rounded-2xl ${activeSlide.bgColor} border border-white/20 p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 relative`}
          >
            <input
              type="text"
              value={activeSlide.title}
              onChange={(e) => updateActiveSlide('title', e.target.value)}
              className="w-full text-3xl font-black text-center bg-transparent border-b border-transparent hover:border-white/30 focus:border-amber-400 text-white outline-none transition-all px-2 py-1"
            />
            <textarea
              value={activeSlide.subtitle}
              onChange={(e) => updateActiveSlide('subtitle', e.target.value)}
              className="w-full text-sm font-medium text-center bg-transparent border-b border-transparent hover:border-white/30 focus:border-amber-400 text-zinc-200 outline-none resize-none transition-all px-2 py-1"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Slideshow Overlay */}
      {isPresenting && (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col justify-between p-8 text-white select-none">
          <div className="flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-xs font-mono">{deckTitle} • Slide {activeSlideIndex + 1} of {slides.length}</span>
            <button
              onClick={() => setIsPresenting(false)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-semibold"
            >
              Exit Slideshow (Esc)
            </button>
          </div>

          <div
            className={`flex-1 flex flex-col items-center justify-center text-center p-12 ${activeSlide.bgColor} rounded-3xl border border-white/10 my-4 shadow-2xl`}
          >
            <h1 className="text-5xl font-black text-white mb-4 drop-shadow-lg">{activeSlide.title}</h1>
            <p className="text-xl text-zinc-200 max-w-xl leading-relaxed font-medium whitespace-pre-line">
              {activeSlide.subtitle}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
              disabled={activeSlideIndex === 0}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl text-xs font-bold"
            >
              ← Previous
            </button>
            <button
              onClick={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
              disabled={activeSlideIndex === slides.length - 1}
              className="px-4 py-2 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-30 rounded-xl text-xs font-bold"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
