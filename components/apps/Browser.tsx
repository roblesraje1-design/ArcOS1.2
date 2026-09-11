'use client';

import { useState, useRef } from 'react';
import { RotateCw, ExternalLink, Shield, Globe } from 'lucide-react';

export default function Browser() {
  const [iframeSrc] = useState('https://browser.rammerhead.org');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeSrc;
    }
  };

  const handleOpenExternal = () => {
    window.open(iframeSrc, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-white select-none">
      {/* Sleek Minimal Header Strip (URL bar and Home button removed as requested) */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-3 py-1.5 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300 border border-white/10">
            <Shield size={12} className="text-cyan-400" />
            <span className="font-mono text-[11px]">browser.rammerhead.org</span>
            <span className="text-[10px] text-zinc-400">• Proxy Engine Active</span>
          </div>

          <button
            onClick={handleReload}
            title="Reload Rammerhead"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <RotateCw size={14} />
          </button>
        </div>

        <button
          onClick={handleOpenExternal}
          title="Open Rammerhead in External Window"
          className="flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors border border-white/10"
        >
          <ExternalLink size={13} />
          <span className="text-[11px]">External Tab</span>
        </button>
      </div>

      {/* Persistent Iframe Container */}
      <div className="flex-1 w-full h-full relative bg-zinc-950 overflow-hidden">
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          className="w-full h-full border-none bg-zinc-900"
          title="Rammerhead Browser"
          allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; camera; web-share"
        />
      </div>
    </div>
  );
}
