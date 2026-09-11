'use client';

import { useState, useRef } from 'react';
import {
  RotateCw,
  ExternalLink,
  Shield,
  Copy,
  Check,
  AlertCircle,
  Globe,
} from 'lucide-react';

interface IFrameViewerProps {
  url: string;
  title: string;
}

export default function IFrameViewer({ url, title }: IFrameViewerProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };

  const handleOpenExternal = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const domain = (() => {
    try {
      return new URL(currentUrl).hostname;
    } catch {
      return currentUrl;
    }
  })();

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-white select-none">
      {/* Sleek Top Navigation & Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/95 px-3 py-1.5 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          {/* SSL & Domain Badge */}
          <div className="flex items-center space-x-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300 border border-white/10">
            <Shield size={12} className="text-emerald-400" />
            <span className="font-mono text-[11px] max-w-[240px] truncate">{domain}</span>
          </div>

          <button
            onClick={handleReload}
            title="Reload App"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <RotateCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleCopy}
            title="Copy URL"
            className="flex items-center space-x-1 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleOpenExternal}
            title="Open in external browser window"
            className="flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 text-zinc-200 transition-colors border border-white/10"
          >
            <ExternalLink size={13} />
            <span className="text-[11px]">External</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="relative flex-1 w-full h-full bg-zinc-900">
        <iframe
          ref={iframeRef}
          src={currentUrl}
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-none bg-zinc-900"
          title={title}
          allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; camera; web-share"
          sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-downloads"
        />

        {/* Floating subtle notice if page does not load or is restricted */}
        <div className="absolute bottom-2 right-2 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-zinc-400 bg-black/70 px-2 py-0.5 rounded backdrop-blur">
            ArcOS Secure iFrame Sandbox
          </span>
        </div>
      </div>
    </div>
  );
}
