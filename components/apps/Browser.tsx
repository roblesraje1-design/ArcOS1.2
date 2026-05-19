'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCw, Globe } from 'lucide-react';

// Simple XOR encoding for UV proxy (standard UV encoding)
const xor = {
  encode(str: string) {
    if (!str) return str;
    return encodeURIComponent(
      str
        .toString()
        .split('')
        .map((char, ind) => (ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char))
        .join('')
    );
  },
  decode(str: string) {
    if (!str) return str;
    let [input, ...search] = str.split('?');
    return (
      decodeURIComponent(input)
        .split('')
        .map((char, ind) => (ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char))
        .join('') + (search.length ? '?' + search.join('?') : '')
    );
  },
};

export default function Browser() {
  const [urlInput, setUrlInput] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isSwRegistered, setIsSwRegistered] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Register UV Service Worker
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/uv/sw.js', {
            scope: '/uv/service/',
          });
          console.log('UV Service Worker registered successfully');
          setIsSwRegistered(true);
        } catch (error) {
          console.error('Failed to register UV Service Worker:', error);
        }
      }
    };
    registerSW();
  }, []);

  const handleNavigate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let targetUrl = urlInput.trim();
    if (!targetUrl) return;

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
        targetUrl = 'https://' + targetUrl;
      } else {
        targetUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(targetUrl);
      }
    }

    setUrlInput(targetUrl);
    
    // Encode URL using UV logic
    const encodedUrl = `/uv/service/${xor.encode(targetUrl)}`;
    setCurrentUrl(encodedUrl);
  };

  return (
    <div className="flex h-full flex-col bg-zinc-900">
      <div className="flex items-center space-x-2 border-b border-zinc-800 bg-zinc-950 p-2">
        <button className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white">
          <ArrowLeft size={18} />
        </button>
        <button className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white">
          <ArrowRight size={18} />
        </button>
        <button className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white" onClick={() => handleNavigate()}>
          <RotateCw size={18} />
        </button>
        <form onSubmit={handleNavigate} className="flex flex-1 items-center rounded-full bg-zinc-800 px-3 py-1">
          <Search size={16} className="text-zinc-400" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Search or enter web address"
            className="ml-2 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />
        </form>
      </div>
      <div className="flex-1 bg-white">
        {!isSwRegistered ? (
          <div className="flex h-full flex-col items-center justify-center text-zinc-800 bg-zinc-100">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-800 mb-4"></div>
            <p>Initializing Ultraviolet Proxy...</p>
            <p className="text-sm text-zinc-500 mt-2">Note: A Bare server backend is required for full functionality.</p>
          </div>
        ) : currentUrl ? (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="h-full w-full border-none"
            title="UV Browser Frame"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-zinc-800 bg-zinc-100">
            <Globe size={64} className="text-zinc-300 mb-4" />
            <h2 className="text-2xl font-bold text-zinc-700">UV Browser</h2>
            <p className="text-zinc-500 mt-2">Enter a URL to browse unblocked.</p>
          </div>
        )}
      </div>
    </div>
  );
}
