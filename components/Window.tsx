'use client';

import { Rnd } from 'react-rnd';
import { useOSStore, WindowState } from '@/store/useOSStore';
import { Minus, Square, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const ControlButton = ({ onClick, children, hoverClass = "hover:bg-white/10" }: { onClick: any, children: React.ReactNode, hoverClass?: string }) => (
  <button 
    onClick={onClick} 
    className={`flex h-8 w-10 items-center justify-center transition-colors ${hoverClass}`}
  >
    {children}
  </button>
);

export default function Window({ windowState, children }: { windowState: WindowState; children: React.ReactNode }) {
  const { id, title, isMaximized, zIndex, position, size, snapState } = windowState;
  const { 
    focusApp, 
    closeApp, 
    minimizeApp, 
    maximizeApp, 
    updateWindowPosition, 
    updateWindowSize, 
    updateWindowSnap,
    activeWindowId, 
    accentColor,
    openContextMenu
  } = useOSStore();

  const [isSnapping, setIsSnapping] = useState<WindowState['snapState']>('none');

  const isActive = activeWindowId === id;
  const acrylicHeader = isActive ? 'bg-zinc-800/80' : 'bg-zinc-900/60';
  const borderStyle = isActive ? 'border-zinc-500/50' : 'border-zinc-700/30';

  const handleDrag = (e: any, d: any) => {
    const x = d.x;
    const y = d.y;
    const threshold = 10;
    const width = window.innerWidth;
    const height = window.innerHeight;

    let snap: WindowState['snapState'] = 'none';

    if (y < threshold) {
      if (x < threshold) snap = 'topLeft';
      else if (x > width - threshold - 100) snap = 'topRight';
      else snap = 'top';
    } else if (x < threshold) {
      if (y > height - threshold - 100) snap = 'bottomLeft';
      else snap = 'left';
    } else if (x > width - threshold - 100) {
      if (y > height - threshold - 100) snap = 'bottomRight';
      else snap = 'right';
    }

    setIsSnapping(snap);
  };

  const handleDragStop = (e: any, d: any) => {
    if (isSnapping !== 'none') {
      updateWindowSnap(id, isSnapping);
    } else {
      updateWindowPosition(id, { x: d.x, y: d.y });
    }
    setIsSnapping('none');
  };

  const getSnapStyle = (state: WindowState['snapState']) => {
    switch (state) {
      case 'left': return { left: 0, top: 0, width: '50%', height: 'calc(100% - 56px)' };
      case 'right': return { left: '50%', top: 0, width: '50%', height: 'calc(100% - 56px)' };
      case 'top': return { left: 0, top: 0, width: '100%', height: 'calc(100% - 56px)' };
      case 'topLeft': return { left: 0, top: 0, width: '50%', height: '50%' };
      case 'topRight': return { left: '50%', top: 0, width: '50%', height: '50%' };
      case 'bottomLeft': return { left: 0, top: '50%', width: '50%', height: 'calc(50% - 56px)' };
      case 'bottomRight': return { left: '50%', top: '50%', width: '50%', height: 'calc(50% - 56px)' };
      default: return undefined;
    }
  };

  const snapStyle = snapState && snapState !== 'none' ? getSnapStyle(snapState) : undefined;
  const previewStyle = isSnapping !== 'none' ? getSnapStyle(isSnapping) : undefined;

  if (isMaximized || snapStyle) {
    const finalStyle = isMaximized 
      ? { zIndex, paddingBottom: '56px', left: 0, top: 0, width: '100%', height: '100%' } 
      : { zIndex, ...snapStyle };

    return (
      <div
        className="absolute z-40 flex flex-col overflow-hidden bg-zinc-900 shadow-2xl transition-all duration-300"
        style={finalStyle}
        onClick={() => focusApp(id)}
      >
        <div
          className={`flex h-[40px] select-none items-center justify-between px-3 text-zinc-200 border-b border-white/5 backdrop-blur-md ${acrylicHeader}`}
          onDoubleClick={() => maximizeApp(id)}
        >
          <div className="flex items-center space-x-3 ml-1">
             <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 rounded-full bg-white opacity-80" />
             </div>
            <span className="text-[12px] font-medium text-zinc-100 tracking-tight">{title}</span>
          </div>
          <div className="flex items-center">
            <ControlButton onClick={(e: any) => { e.stopPropagation(); minimizeApp(id); }}><Minus size={14} /></ControlButton>
            <ControlButton onClick={(e: any) => { e.stopPropagation(); maximizeApp(id); }}><Square size={10} /></ControlButton>
            <ControlButton onClick={(e: any) => { e.stopPropagation(); closeApp(id); }} hoverClass="hover:bg-red-500 hover:text-white text-zinc-400"><X size={16} /></ControlButton>
          </div>
        </div>
        <div className="flex-1 w-full h-full overflow-auto bg-zinc-950 text-zinc-100">{children}</div>
      </div>
    );
  }

  return (
    <>
      {/* Snap Preview */}
      <AnimatePresence>
        {isSnapping !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="fixed z-[100] bg-white border-2 border-white/30 rounded-lg pointer-events-none"
            style={previewStyle}
          />
        )}
      </AnimatePresence>

      <Rnd
        size={{ width: size.width, height: size.height }}
        position={{ x: position.x, y: position.y }}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStop={(e, direction, ref, delta, position) => {
          updateWindowSize(id, { width: parseInt(ref.style.width, 10), height: parseInt(ref.style.height, 10) });
          updateWindowPosition(id, position);
        }}
        minWidth={350}
        minHeight={250}
        bounds="parent"
        dragHandleClassName="window-handle"
        style={{ zIndex }}
        onClick={() => focusApp(id)}
        className={`flex flex-col overflow-hidden rounded-lg bg-zinc-900 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border shadow-xl backdrop-blur-3xl transition-[border] duration-200 ${borderStyle}`}
      >
        <div
          className={`window-handle flex h-[40px] cursor-move select-none items-center justify-between px-3 text-zinc-200 transition-colors ${acrylicHeader}`}
          onDoubleClick={() => maximizeApp(id)}
          onContextMenu={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            openContextMenu(e.clientX, e.clientY, [
               { label: 'Snap Left', action: () => updateWindowSnap(id, 'left') },
               { label: 'Snap Right', action: () => updateWindowSnap(id, 'right') },
               { label: 'Maximize', action: () => maximizeApp(id) },
               { label: 'Minimize', action: () => minimizeApp(id) },
               { label: 'Close', action: () => closeApp(id), danger: true },
            ]);
         }}
        >
          <div className="flex items-center space-x-3 ml-1">
             <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 rounded-full bg-white opacity-80" />
             </div>
            <span className="text-[12px] font-medium text-zinc-100 tracking-tight">{title}</span>
          </div>
          <div className="flex items-center">
            <ControlButton onClick={(e: any) => { e.stopPropagation(); minimizeApp(id); }}><Minus size={14} /></ControlButton>
            <ControlButton onClick={(e: any) => { e.stopPropagation(); maximizeApp(id); }}><Square size={10} /></ControlButton>
            <ControlButton onClick={(e: any) => { e.stopPropagation(); closeApp(id); }} hoverClass="hover:bg-red-500 hover:text-white text-zinc-400"><X size={16} /></ControlButton>
          </div>
        </div>
        <div className="flex-1 w-full h-full overflow-auto bg-zinc-950 text-zinc-100">{children}</div>
      </Rnd>
    </>
  );
}
