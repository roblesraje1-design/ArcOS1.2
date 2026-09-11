'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOSStore } from '@/store/useOSStore';
import { Palette, Image as ImageIcon, Layout, X, Check, Clock, Cloud, Zap, Battery, Cpu, Activity, Search, Calendar, Music } from 'lucide-react';

const wallpapers = [
  { name: 'Aurora Borealis', url: 'https://images.unsplash.com/photo-1531366930491-81bc590e1940?q=80&w=2670&auto=format&fit=crop', color: '#10b981' },
  { name: 'Deep Nebula', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2622&auto=format&fit=crop', color: '#8b5cf6' },
  { name: 'Cyberpunk City', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2670&auto=format&fit=crop', color: '#f43f5e' },
  { name: 'Misty Mountains', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop', color: '#0ea5e9' },
  { name: 'Golden Hour', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2670&auto=format&fit=crop', color: '#f59e0b' },
  { name: 'Abstract Flow', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', color: '#3b82f6' },
  { name: 'Emerald Flow', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2548&auto=format&fit=crop', color: '#10b981' },
  { name: 'Ocean Mist', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop', color: '#0ea5e9' },
  { name: 'Dark Aurora', url: 'https://images.unsplash.com/photo-1541450805268-4822a3a774ce?q=80&w=2670&auto=format&fit=crop', color: '#4f46e5' },
  { name: 'Deep Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop', color: '#312e81' },
  { name: 'Sunset Gradient', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop', color: '#f59e0b' },
  { name: 'Neon Dreams', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop', color: '#d946ef' },
  { name: 'Minimalist Peak', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop', color: '#64748b' },
  { name: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2673&auto=format&fit=crop', color: '#06b6d4' },
  { name: 'Frozen Lake', url: 'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=2673&auto=format&fit=crop', color: '#a5f3fc' },
  { name: 'Lush Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop', color: '#22c55e' },
  { name: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2670&auto=format&fit=crop', color: '#b45309' },
  { name: 'Starry Night', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2670&auto=format&fit=crop', color: '#1e3a8a' },
  { name: 'Modern Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop', color: '#1e293b' },
  { name: 'Cosmic Dust', url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2672&auto=format&fit=crop', color: '#ec4899' },
];

export default function PersonalizationCenter() {
  const { isPersonalizationMenuOpen, setIsPersonalizationMenuOpen, setWallpaper, setAccentColor, systemState, wallpaper } = useOSStore();
  const [activeCategory, setActiveCategory] = useState<'wallpapers' | 'widgets'>('wallpapers');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isPersonalizationMenuOpen) return null;

  const filteredWallpapers = wallpapers.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/40 backdrop-blur-md p-8"
        onClick={(e) => {
           if (e.target === e.currentTarget) setIsPersonalizationMenuOpen(false);
        }}
      >
        <div className="w-full max-w-6xl h-[80vh] bg-zinc-900/90 border border-white/10 rounded-[32px] flex flex-col overflow-hidden shadow-2xl relative">
          {/* Header */}
          <div className="px-8 py-8 flex items-center justify-between border-b border-white/5 bg-zinc-900/50">
             <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                   <Palette size={28} className="text-white" />
                </div>
                <div>
                   <h1 className="text-3xl font-bold text-white tracking-tight">Personalization Center</h1>
                   <p className="text-zinc-500 text-sm">Customize your experience with wallpapers and widgets</p>
                </div>
             </div>
             
             <div className="flex items-center space-x-4">
                <div className="relative">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                   <input 
                    type="text" 
                    placeholder="Search themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-6 text-sm text-white outline-none focus:border-blue-500/50 transition-all w-64 shadow-inner"
                   />
                </div>
                <button 
                  onClick={() => setIsPersonalizationMenuOpen(false)}
                  className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-all"
                >
                   <X size={24} />
                </button>
             </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
             {/* Sidebar Nav */}
             <div className="w-64 border-r border-white/5 p-4 flex flex-col space-y-2">
                <button 
                  onClick={() => setActiveCategory('wallpapers')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeCategory === 'wallpapers' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-400 hover:bg-white/5'}`}
                >
                   <ImageIcon size={20} />
                   <span className="font-bold text-sm tracking-wide">Wallpapers</span>
                   <span className="ml-auto text-[10px] font-bold opacity-50">{wallpapers.length}</span>
                </button>
                <button 
                  onClick={() => setActiveCategory('widgets')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeCategory === 'widgets' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-400 hover:bg-white/5'}`}
                >
                   <Layout size={20} />
                   <span className="font-bold text-sm tracking-wide">Dynamic Widgets</span>
                   <span className="ml-auto text-[10px] font-bold opacity-50">6</span>
                </button>

                <div className="mt-auto p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                   <div className="flex items-center space-x-2 text-blue-400 mb-2">
                      <Zap size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">System Theme</span>
                   </div>
                   <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-zinc-950" />
                      <div className="w-8 h-8 rounded-full border border-white/10 bg-white" />
                   </div>
                </div>
             </div>

             {/* Content Area */}
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeCategory === 'wallpapers' && (
                  <div className="grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {filteredWallpapers.map((w) => (
                      <motion.button 
                        key={w.url}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setWallpaper(w.url);
                          setAccentColor(w.color);
                        }}
                        className="group flex flex-col space-y-3"
                      >
                         <div className="aspect-video bg-zinc-800 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-blue-500 transition-all shadow-xl relative">
                            <img src={w.url} alt={w.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            {wallpaper === w.url && (
                              <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-[2px] flex items-center justify-center">
                                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-2xl">
                                    <Check size={24}/>
                                 </div>
                              </div>
                            )}
                         </div>
                         <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors ml-1">{w.name}</span>
                      </motion.button>
                    ))}
                  </div>
                )}

                 {activeCategory === 'widgets' && (
                  <div className="grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <WidgetCard icon={Clock} title="World Clock" desc="Interactive time zones" color="bg-blue-500/20 text-blue-400" type="clock" />
                     <WidgetCard icon={Cloud} title="Dynamic Weather" desc="Meteorological monitoring" color="bg-cyan-500/20 text-cyan-400" type="weather" />
                     <WidgetCard icon={Calendar} title="Calendar" desc="Upcoming events & dates" color="bg-red-500/20 text-red-400" type="calendar" />
                     <WidgetCard icon={Battery} title="Nano Power" desc="Energy management" color="bg-green-500/20 text-green-400" type="battery" />
                     <WidgetCard icon={Activity} title="Neural Signal" desc="Cortex activity monitor" color="bg-rose-500/20 text-rose-400" type="system" />
                     <WidgetCard icon={Music} title="Music" desc="Playback control" color="bg-orange-500/20 text-orange-400" type="music" />
                     <WidgetCard icon={ImageIcon} title="Photo" desc="Display a custom image" color="bg-purple-500/20 text-purple-400" type="photo" />
                  </div>
                )}
             </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function WidgetCard({ icon: Icon, title, desc, color, type }: any) {
  const addWidget = useOSStore(state => state.addWidget);
  return (
    <div className="bg-zinc-900 border border-white/5 p-6 rounded-[24px] hover:border-blue-500/30 transition-all group overflow-hidden relative">
       <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg ${color}`}>
          <Icon size={24} />
       </div>
       <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{title}</h3>
       <p className="text-zinc-500 text-xs font-medium">{desc}</p>
       <button 
        onClick={() => addWidget(type, { x: 400 + Math.random() * 100, y: 100 + Math.random() * 100 })}
        className="mt-6 w-full py-2 bg-white/5 hover:bg-blue-600 text-zinc-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
       >Add to Desktop</button>
       
       <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] rounded-full -translate-y-12 translate-x-12 blur-3xl pointer-events-none" />
    </div>
  );
}
