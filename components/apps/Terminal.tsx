'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ChevronRight, X, Command } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';

interface HistoryItem {
  command: string;
  output: string;
  type: 'success' | 'error' | 'info';
  dir: string;
}

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { command: '', output: 'ArcOS Unified Command Line Interface\nVersion 1.0.22621 (Kernel build ARCOS_X64)\nType "help" for a list of available commands.', type: 'info', dir: 'C:\\Users\\Jack>' }
  ]);
  const [currentDir, setCurrentDir] = useState('C:\\Users\\Jack');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { windows, customApps, removeCustomApp, updateSystemState, accentColor } = useOSStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const parts = cmd.split(' ');
    const baseCmd = parts[0];
    
    let output = '';
    let type: 'success' | 'error' | 'info' = 'success';

    switch (baseCmd) {
      case 'help':
        output = `Available commands:
  help      - Display this help message
  clear     - Clear terminal history
  ls        - List files and directories
  cd        - Change directory (mock)
  echo      - Output text to console
  date      - Show current system date
  whoami    - Display current user
  uname     - Display system information
  ps        - List active processes (apps)
  kill      - Terminate a process (app)
  uninstall - Uninstall a custom app (usage: uninstall [appId])
  system    - Modify system state (usage: system [key] [value])
  neofetch  - Display system info in a cool way`;
        type = 'info';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'ls':
        output = 'Desktop\nDocuments\nDownloads\nMusic\nPictures\nVideos\nSystem32\nUsers';
        break;
      case 'cd':
        const newDir = parts[1] || '~';
        setCurrentDir(`C:\\Users\\Jack\\${newDir.replace('/', '\\')}`);
        output = `Directory changed to ${newDir}`;
        break;
      case 'whoami':
        output = 'jack_purton';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'uname':
        output = 'ArcOS kernel 10.0.22621.1702_x64-generic #1 SMP PREEMPT_DYNAMIC';
        break;
      case 'ps':
        output = `PID    NAME             STATUS\n---------------------------------\n` + 
          windows.map(w => `${w.id.substring(0,6)}    ${w.title.padEnd(16)} RUNNING`).join('\n');
        break;
      case 'kill':
        output = parts[1] ? `Process ${parts[1]} sent SIGTERM signal.` : 'Error: missing PID';
        type = parts[1] ? 'success' : 'error';
        break;
      case 'uninstall':
        const id = parts[1];
        if (id) {
          const app = customApps.find(a => a.id === id);
          if (app) {
             removeCustomApp(id);
             output = `App '${app.title}' (${id}) successfully removed from system.`;
          } else {
             output = `Error: App with ID '${id}' not found.`;
             type = 'error';
          }
        } else {
           output = 'Usage: uninstall [appId]';
           type = 'error';
        }
        break;
      case 'system':
        const key = parts[1];
        const val = parts[2];
        if (key && val) {
           updateSystemState(key, val === 'true' ? true : val === 'false' ? false : val);
           output = `System state '${key}' updated to '${val}'.`;
        } else {
           output = 'Usage: system [key] [value]';
           type = 'error';
        }
        break;
      case 'echo':
        output = parts.slice(1).join(' ');
        break;
      case 'neofetch':
        output = `
         .-/+oossssoo+/-.               jack@arcos-pc
     .:+ssssssssssssssssss+:.           -------------
   -+ssssssssssssssssssssss+-           OS: ArcOS 1.0.22621
  :ssssssssssssssssssssssssss:          Kernel: 10.0.22621.1702
 .ssssssssssssssssssssssssssss.         Uptime: 4 hours, 12 mins
 sssssssssss      sssssssssssss         Packages: 834 (npm)
 sssssssssss      sssssssssssss         Shell: arcos-sh 1.0
 sssssssssss      sssssssssssss         Resolution: 1920x1080
 sssssssssss      sssssssssssss         DE: ArcDesign Glass
 sssssssssss      sssssssssssss         WM: ArcManager
 sssssssssss      sssssssssssss         Theme: Dark Arc [GTK2/3]
 .ssssssssssssssssssssssssssss.         Icons: Lucide
  :ssssssssssssssssssssssssss:          Terminal: ArcTerminal
   -+ssssssssssssssssssssss+-           CPU: AMD Ryzen 9 5950X (32) @ 3.4GHz
     .:+ssssssssssssssssss+:.           GPU: NVIDIA GeForce RTX 4090
         .-/+oossssoo+/-.               Memory: 12GB / 64GB
`;
        break;
      default:
        output = `'${baseCmd}' is not recognized as an internal or external command, operable program or batch file.`;
        type = 'error';
    }

    setHistory([...history, { command: input, output, type, dir: `${currentDir}>` }]);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950 font-mono text-[13px] leading-relaxed text-zinc-300 shadow-2xl p-1">
      {/* Header bar within Terminal content */}
      <div className="flex items-center space-x-3 px-3 py-1.5 border-b border-white/5 bg-white/5">
         <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
         </div>
         <div className="flex items-center space-x-2 text-[11px] text-zinc-500 font-bold uppercase tracking-widest pl-2">
            <Command size={12} />
            <span>Administrator: PowerShell</span>
         </div>
      </div>

      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {history.map((item, idx) => (
          <div key={idx} className="mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
            {item.command && (
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">{item.dir}</span>
                <span className="text-zinc-100">{item.command}</span>
              </div>
            )}
            <div className={`mt-1 whitespace-pre-wrap ${item.type === 'error' ? 'text-red-400' : item.type === 'info' ? 'text-yellow-400 opacity-80' : 'text-zinc-400'}`}>
              {item.output}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="flex items-center bg-zinc-900/50 p-4 border-t border-white/5">
        <span className="mr-2 font-bold text-blue-400 uppercase tracking-tighter" style={{ color: accentColor }}>{currentDir}&gt;</span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent text-zinc-100 outline-none pr-4"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck="false"
        />
      </form>
    </div>
  );
}
