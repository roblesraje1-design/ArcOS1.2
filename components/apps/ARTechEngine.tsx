'use client';

import { useState, useRef, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { Upload, X, Box, Zap, Play, Info } from 'lucide-react';

export default function ARTechEngine() {
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [appName, setAppName] = useState('My New App');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLIFrameElement>(null);
  
  const { addCustomApp } = useOSStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const code = event.target?.result as string;
      setHtmlCode(code);
      setIsLoaded(true);
      setAppName(file.name.replace('.html', ''));
    };
    reader.readAsText(file);
  };

  const closeApp = () => {
    setIsLoaded(false);
    setHtmlCode('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const installApp = () => {
    if (!htmlCode) return;
    
    addCustomApp({
      id: `app-${Date.now()}`,
      title: appName,
      html: htmlCode,
      css: '',
      js: ''
    });
    
    alert(`'${appName}' has been installed to your Start Menu!`);
  };

  return (
    <div className="relative h-full w-full bg-[#0f0f11] text-white overflow-hidden font-sans">
      {/* Dashboard / Launchpad */}
      <div 
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-[#141419] to-[#08080a] p-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoaded ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-center space-x-3 text-2xl font-extrabold uppercase tracking-[0.2em]">
             <span>A.R. Tech</span>
             <span className="text-[#00f0ff]">Engine</span>
          </div>
          <div className="mb-8 text-xs tracking-widest text-zinc-500 uppercase font-medium">Local HTML Runspace Pipeline</div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/5 py-12 px-6 transition-all hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 cursor-pointer"
          >
            <Upload size={48} className="mb-4 text-zinc-400 transition-colors group-hover:text-[#00f0ff]" />
            <span className="text-sm font-semibold text-zinc-300 group-hover:text-white">DROP OR UPLOAD HTML ENGINE FILE</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".html" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </div>

          <div className="mt-8 flex items-center justify-center space-x-4 text-zinc-600">
             <div className="flex items-center space-x-1">
                <Zap size={14} />
                <span className="text-[10px] font-bold uppercase">Ultra Fast</span>
             </div>
             <div className="flex items-center space-x-1">
                <Box size={14} />
                <span className="text-[10px] font-bold uppercase">Isolated</span>
             </div>
          </div>
        </div>
      </div>

      {/* Viewport */}
      {isLoaded && (
        <iframe 
          ref={viewportRef}
          srcDoc={htmlCode}
          className="h-full w-full border-none bg-black"
          sandbox="allow-scripts allow-same-origin allow-downloads allow-forms allow-popups"
        />
      )}

      {/* Floating Controls */}
      {isLoaded && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-3 opacity-30 transition-opacity hover:opacity-100">
          <div className="flex items-center bg-zinc-900/90 rounded-full border border-white/10 px-4 py-1.5 backdrop-blur-md shadow-xl">
             <div className="flex items-center space-x-2 mr-4 border-r border-white/10 pr-4">
                <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{appName}</span>
             </div>
             <div className="flex items-center space-x-2">
                <button 
                  onClick={installApp}
                  className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00f0ff] hover:text-white transition-colors"
                >
                  Install to OS
                </button>
                <button 
                  onClick={closeApp}
                  className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-white transition-colors"
                >
                  Exit Engine
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
