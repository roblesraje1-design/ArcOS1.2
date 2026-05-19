'use client';

import { motion } from 'motion/react';
import { useOSStore, Widget } from '@/store/useOSStore';
import { Clock, Cloud, Calendar, Music, Battery, Cpu, Volume2, X, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function WidgetRenderer({ widget }: { widget: Widget }) {
  const { removeWidget, updateWidgetPosition, openContextMenu } = useOSStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDragEnd = (e: any, info: any) => {
    updateWidgetPosition(widget.id, widget.position.x + info.offset.x, widget.position.y + info.offset.y);
  };

  const renderContent = () => {
    switch (widget.type) {
      case 'photo':
        return (
          <div className="w-full h-full relative overflow-hidden group">
             <img 
               src={widget.props?.url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop'} 
               alt="Widget" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
             />
             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon size={20} className="text-white/70" />
             </div>
          </div>
        );
      case 'clock':
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-1">
             <div className="text-4xl font-black text-white/90 tracking-tighter">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
             </div>
             <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                {time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
             </div>
          </div>
        );
      case 'weather':
        return (
          <div className="flex flex-col h-full p-4 justify-between">
             <div className="flex justify-between items-start">
                <Cloud size={24} className="text-blue-400" />
                <span className="text-2xl font-bold">24°</span>
             </div>
             <div className="mt-auto">
                <div className="text-xs font-bold text-white uppercase tracking-tighter">London</div>
                <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Partly Cloudy</div>
             </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="flex flex-col h-full">
             <div className="bg-red-500 px-3 py-1 flex justify-between items-center">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{time.toLocaleDateString(undefined, { month: 'short' })}</span>
                <Calendar size={10} className="text-white/80" />
             </div>
             <div className="flex-1 flex items-center justify-center bg-zinc-900">
                <span className="text-5xl font-black text-white/90">{time.getDate()}</span>
             </div>
          </div>
        );
      case 'music':
        return (
          <div className="flex items-center space-x-4 p-4 h-full">
             <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                <Music size={24} className="text-zinc-600" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate">Neural Symphony</p>
                <p className="text-[9px] text-zinc-500 truncate">Core Oscillator</p>
                <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-blue-500 w-[45%]" />
                </div>
             </div>
          </div>
        );
      case 'battery':
        return (
          <div className="flex flex-col h-full p-4 justify-center items-center">
             <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                   <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
                   <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-green-500" strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - 0.88)} strokeLinecap="round" />
                </svg>
                <Battery size={20} className="absolute inset-0 m-auto text-white" />
             </div>
             <span className="text-[10px] font-bold text-zinc-400 mt-2">88% POWER</span>
          </div>
        );
      case 'system':
        return (
          <div className="flex flex-col h-full p-4 space-y-3">
             <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <span>CPU Load</span>
                <span className="text-blue-500">12%</span>
             </div>
             <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[12%]" />
             </div>
             <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <span>Memory</span>
                <span className="text-purple-500">34%</span>
             </div>
             <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[34%]" />
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute group cursor-grab active:cursor-grabbing z-[100]"
      style={{ left: widget.position.x, top: widget.position.y }}
      onContextMenu={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openContextMenu(e.clientX, e.clientY, [
          { label: 'Remove Widget', icon: X, action: () => removeWidget(widget.id), danger: true },
        ]);
      }}
    >
      <div className="w-40 h-40 bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[28px] overflow-hidden shadow-2xl transition-all group-hover:border-white/20 group-hover:scale-105 pointer-events-auto">
         {renderContent()}
      </div>
    </motion.div>
  );
}
