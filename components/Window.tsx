'use client';

import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useOSStore, WindowState } from '@/store/useOSStore';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function TrafficLights({
  id,
  isFullscreen,
  isHovering,
  onHoverChange,
  onClose,
  onMinimize,
  onToggleFullscreen,
}: {
  id: string;
  isFullscreen?: boolean;
  isHovering: boolean;
  onHoverChange: (hover: boolean) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onToggleFullscreen: (id: string) => void;
}) {
  return (
    <div
      className="flex items-center space-x-2 mr-4"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* Close (Red) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose(id);
        }}
        title="Close"
        className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center transition-transform active:scale-90"
      >
        {isHovering && <X size={8} className="text-[#4c0002] stroke-[2.5]" />}
      </button>

      {/* Minimize (Yellow) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMinimize(id);
        }}
        title="Minimize"
        className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24] flex items-center justify-center transition-transform active:scale-90"
      >
        {isHovering && <Minus size={8} className="text-[#5f3f00] stroke-[3]" />}
      </button>

      {/* Fullscreen / Maximize (Green) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFullscreen(id);
        }}
        title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] flex items-center justify-center transition-transform active:scale-90"
      >
        {isHovering && <Maximize2 size={7} className="text-[#004f0c] stroke-[2.5]" />}
      </button>
    </div>
  );
}

export default function Window({ windowState, children }: { windowState: WindowState; children: React.ReactNode }) {
  const { id, title, isMaximized, isFullscreen, zIndex, position, size, snapState } = windowState;
  const {
    focusApp,
    closeApp,
    minimizeApp,
    maximizeApp,
    toggleFullscreen,
    updateWindowPosition,
    updateWindowSize,
    updateWindowSnap,
    activeWindowId,
    openContextMenu,
  } = useOSStore();

  const [isSnapping, setIsSnapping] = useState<WindowState['snapState']>('none');
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  const isActive = activeWindowId === id;
  const acrylicHeader = isActive ? 'bg-zinc-800/90 text-zinc-100' : 'bg-zinc-900/75 text-zinc-400';
  const borderStyle = isFullscreen
    ? 'border-none rounded-none'
    : isMaximized
    ? 'border-b border-white/10 rounded-none'
    : isActive
    ? 'border border-white/20 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.65)]'
    : 'border border-white/10 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.45)]';

  const handleDrag = (e: any, d: any) => {
    if (isFullscreen || isMaximized) return;
    const x = d.x;
    const y = d.y;
    const threshold = 15;
    const width = window.innerWidth;
    const height = window.innerHeight;

    let snap: WindowState['snapState'] = 'none';

    if (y < threshold + 28) {
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
    if (isFullscreen || isMaximized) return;
    if (isSnapping !== 'none') {
      updateWindowSnap(id, isSnapping);
    } else {
      updateWindowPosition(id, { x: d.x, y: Math.max(28, d.y) });
    }
    setIsSnapping('none');
  };

  const getSnapDimensions = (state: WindowState['snapState']) => {
    switch (state) {
      case 'left':
        return { x: 0, y: 28, width: '50vw', height: 'calc(100vh - 28px)' };
      case 'right':
        return { x: window.innerWidth / 2, y: 28, width: '50vw', height: 'calc(100vh - 28px)' };
      case 'top':
        return { x: 0, y: 28, width: '100vw', height: 'calc(100vh - 28px)' };
      case 'topLeft':
        return { x: 0, y: 28, width: '50vw', height: 'calc(50vh - 14px)' };
      case 'topRight':
        return { x: window.innerWidth / 2, y: 28, width: '50vw', height: 'calc(50vh - 14px)' };
      case 'bottomLeft':
        return { x: 0, y: window.innerHeight / 2, width: '50vw', height: '50vh' };
      case 'bottomRight':
        return { x: window.innerWidth / 2, y: window.innerHeight / 2, width: '50vw', height: '50vh' };
      default:
        return null;
    }
  };

  const isSnapped = Boolean(snapState && snapState !== 'none');
  const snappedDim = isSnapped ? getSnapDimensions(snapState) : null;

  // Compute active size and position while keeping Rnd continuously mounted
  const activeSize = isFullscreen
    ? { width: '100vw', height: '100vh' }
    : isMaximized
    ? { width: '100vw', height: 'calc(100vh - 28px)' }
    : snappedDim
    ? { width: snappedDim.width, height: snappedDim.height }
    : { width: size.width, height: size.height };

  const activePosition = isFullscreen
    ? { x: 0, y: 0 }
    : isMaximized
    ? { x: 0, y: 28 }
    : snappedDim
    ? { x: snappedDim.x, y: snappedDim.y }
    : { x: position.x, y: Math.max(28, position.y) };

  const isLockedLayout = isFullscreen || isMaximized || isSnapped;

  return (
    <>
      <AnimatePresence>
        {isSnapping !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            className="fixed z-[100] bg-blue-400 border-2 border-blue-300 rounded-xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Persistent Rnd element keeps child components and iframes from ever reloading */}
      <Rnd
        size={activeSize}
        position={activePosition}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStop={(e, direction, ref, delta, pos) => {
          if (!isLockedLayout) {
            updateWindowSize(id, {
              width: parseInt(ref.style.width, 10),
              height: parseInt(ref.style.height, 10),
            });
            updateWindowPosition(id, { x: pos.x, y: Math.max(28, pos.y) });
          }
        }}
        minWidth={360}
        minHeight={260}
        bounds="parent"
        dragHandleClassName="macos-window-handle"
        disableDragging={isLockedLayout}
        enableResizing={!isLockedLayout}
        style={{
          zIndex: isFullscreen ? 140 : zIndex,
          position: isFullscreen ? 'fixed' : 'absolute',
          top: isFullscreen ? 0 : undefined,
          left: isFullscreen ? 0 : undefined,
          width: isFullscreen ? '100vw' : undefined,
          height: isFullscreen ? '100vh' : undefined,
        }}
        onClick={() => focusApp(id)}
        className={`flex flex-col overflow-hidden bg-zinc-900/95 backdrop-blur-3xl transition-[border-radius,box-shadow] duration-200 ${borderStyle}`}
      >
        {/* macOS Window Header Bar */}
        <div
          className={`macos-window-handle flex h-9.5 cursor-move select-none items-center justify-between px-3.5 border-b border-white/10 transition-colors ${acrylicHeader}`}
          onDoubleClick={() => toggleFullscreen(id)}
          onContextMenu={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            openContextMenu(e.clientX, e.clientY, [
              { label: isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen', action: () => toggleFullscreen(id) },
              { label: isMaximized ? 'Restore Window' : 'Maximize', action: () => maximizeApp(id) },
              { label: 'Snap Left', action: () => updateWindowSnap(id, 'left') },
              { label: 'Snap Right', action: () => updateWindowSnap(id, 'right') },
              { label: 'Minimize', action: () => minimizeApp(id) },
              { label: 'Close', action: () => closeApp(id), danger: true },
            ]);
          }}
        >
          {/* Traffic Lights */}
          <div className="flex items-center">
            <TrafficLights
              id={id}
              isFullscreen={isFullscreen}
              isHovering={isHoveringControls}
              onHoverChange={setIsHoveringControls}
              onClose={closeApp}
              onMinimize={minimizeApp}
              onToggleFullscreen={toggleFullscreen}
            />
            <span className="text-xs font-semibold text-zinc-100 tracking-tight">{title}</span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-1">
            {isFullscreen ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen(id);
                }}
                title="Exit Full Screen"
                className="flex items-center space-x-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-zinc-200 transition-colors"
              >
                <Minimize2 size={12} />
                <span className="text-[10px]">Exit</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen(id);
                }}
                title="Full Screen"
                className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <Maximize2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Stable Child Viewport - NEVER unmounts */}
        <div className="flex-1 w-full h-full overflow-auto bg-zinc-950 text-zinc-100 relative">
          {children}
        </div>
      </Rnd>
    </>
  );
}
