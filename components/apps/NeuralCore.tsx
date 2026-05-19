'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOSStore } from '@/store/useOSStore';
import { 
  Brain, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Zap, 
  Fingerprint, 
  History,
  Code,
  Cpu,
  Tv,
  Play,
  Download,
  Terminal as TermIcon,
  HelpCircle,
  Activity,
  Trash2,
  HardDrive,
  ShieldAlert,
  Moon,
  Volume2
} from 'lucide-react';

export default function NeuralCore() {
  const { systemState, updateSystemState, addCustomApp, addDesktopItem, customApps } = useOSStore();
  const [activeTab, setActiveTab] = useState<'kai' | 'maker' | 'diagnostics'>('kai');

  // --- TAB 1: KAI CHAT BOT ---
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', text: "Salutations! I am Kai, your virtual intelligence companion of ArcOS. I am synchronized with your system parameters and standing by. Ask me some tech questions, request system help, or let's create custom applications!", id: '1' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input, id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const systemContext = `
        You are Kai, an advanced, highly visual, friendly, and slightly witty AI assistant of ArcOS (v${systemState.buildNumber}).
        Current System Parameters:
        - User Account Name: ${systemState.userAccount.name}
        - Theme Style: ${systemState.theme}
        - Physical Hardware: CPU Level ${systemState.cpuLevel}%, RAM ${systemState.ramUsage}%
        - Storage Buffers: ${systemState.storageUsed}GB / ${systemState.storageTotal}GB
        - Lock State: Passwords active = ${!!systemState.password}
        
        Personality Guidelines:
        1. Be incredibly conversational, energetic, and helpful. Feel free to use computer-oriented humor (e.g., "my neural pathways", "buffer overflows", "compiling answers").
        2. Give robust, highly interesting explanations.
        3. Keep replies readable and well spaced. Use lists or brief headers if appropriate.
      `;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input,
          context: systemContext
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.text, id: Date.now().toString() }]);
      } else {
        throw new Error("Empty text");
      }
    } catch (error) {
      // Local intelligent response fallbacks if endpoint has connection gaps
      const lower = input.toLowerCase();
      let fallbackText = "I'm checking my offline synapse files. It seems I am briefly disconnected from the premium cloud gateway, but I can still assist you with local details!";
      if (lower.includes('hello') || lower.includes('hi')) {
        fallbackText = `Greetings, ${systemState.userAccount.name}! I am Kai, your offline system core assistant. I am fully active locally! Let me know how I can optimize, boost, or navigate settings for you.`;
      } else if (lower.includes('settings') || lower.includes('optimize')) {
        fallbackText = "Pro Tip: Open the Diagnostics side tab here! You can purge memory cache, toggle Focus modes, and release hardware buffers with a single button click!";
      } else if (lower.includes('app') || lower.includes('install')) {
        fallbackText = "To create customized, fully sandbox-rendered software shortcuts, navigate right over to the 'App Maker' tab at the top! You can compile apps such as Painters or Game engines and run them inside ArcOS Pro!";
      } else if (lower.includes('weather')) {
        fallbackText = "The weather widget on the right click screen indicates crisp operational temps! System temperature is stabilized at 36°C.";
      }
      setMessages(prev => [...prev, { role: 'assistant', text: fallbackText, id: Date.now().toString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- TAB 2: HTML APPLICATION CREATOR ---
  const [makerPrompt, setMakerPrompt] = useState('create a painting easel canvas');
  const [makingProgress, setMakingProgress] = useState(false);
  const [compiledHtml, setCompiledHtml] = useState('');
  const [appTitle, setAppTitle] = useState('Painter Tool');
  const [installSuccessMessage, setInstallSuccessMessage] = useState('');

  const handleCreateApp = async () => {
    if (!makerPrompt.trim()) return;
    setMakingProgress(true);
    setInstallSuccessMessage('');
    try {
      const promptContext = `
        You are the ArcOS HTML Dev-Studio intelligence companion.
        Generate a fully working, self-contained, single-file HTML web application based on: "${makerPrompt}".
        Guidelines:
        1. Include all visual HTML, CSS (feel free to embed Tailwind CSS via CDN <script src="https://cdn.tailwindcss.com"></script> and inject beautiful colors/gradients on backgrounds), and Javascript inside a single HTML string.
        2. Make sure it is fully functional (e.g., if a painting canvas is requested, support drawing on mouse events, color picker, brush sizes. If a calculator is requested, support responsive keys, history displays, memory registers).
        3. Do NOT wrap output in markdown, code-block backticks, or write explanations. Start output immediately with the raw string: "<html>" and terminate with "</html>".
      `;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Create a fully functional HTML dynamic app containing inline styles/tailwind and scripts for: ${makerPrompt}`,
          context: promptContext
        })
      });

      const data = await response.json();
      if (data.text) {
        // Clear any surrounding markdown code fences
        let cleaned = data.text.trim();
        if (cleaned.startsWith('```html')) {
          cleaned = cleaned.replace(/^```html/, '').replace(/```$/, '');
        } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
        }
        setCompiledHtml(cleaned);
        
        // Auto extract a name title
        const match = makerPrompt.match(/(?:create a|make a|a)\s+([a-zA-Z0-9\s]+)/i);
        const name = match ? match[1].trim() : "Custom App";
        setAppTitle(name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      } else {
        throw new Error("Compilation gap");
      }
    } catch (e) {
      // Offline robust code generator templates
      let template = `
        <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-zinc-950 text-white flex flex-col items-center justify-center h-screen p-4 font-sans select-none">
          <div class="p-8 bg-zinc-900 border border-white/5 rounded-2xl max-w-md text-center space-y-4">
             <div class="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto text-2xl font-bold animate-pulse">✓</div>
             <h2 class="text-xl font-bold">Local App Compiled</h2>
             <p class="text-xs text-zinc-500">I compiled a localized, high-speed drawing canvas for you. Test your pointer lines below!</p>
             <canvas id="paintCanvas" class="w-full h-48 bg-black rounded-lg border border-white/10 mt-3"></canvas>
             <div class="flex gap-2 justify-center mt-3">
               <button id="clearBtn" class="bg-red-600 text-white rounded px-3 py-1.5 text-xs font-bold">Reset Space</button>
             </div>
          </div>
          <script>
            const canvas = document.getElementById('paintCanvas');
            const ctx = canvas.getContext('2d');
            let drawing = false;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            canvas.addEventListener('mousedown', () => drawing = true);
            canvas.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
            canvas.addEventListener('mousemove', (e) => {
              if(!drawing) return;
              const rect = canvas.getBoundingClientRect();
              ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            });
            document.getElementById('clearBtn').onclick = () => ctx.clearRect(0,0, canvas.width, canvas.height);
          </script>
        </body>
        </html>
      `;
      if (makerPrompt.toLowerCase().includes('calculator')) {
        template = `
          <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-zinc-950 text-white flex flex-col items-center justify-center h-screen p-4 font-sans">
            <div class="p-6 bg-zinc-900 border border-white/5 rounded-2xl w-72 text-center shadow-2xl">
              <h2 class="text-sm font-bold text-zinc-400 mb-4 tracking-widest uppercase">Calc Engine v1.0</h2>
              <input id="display" type="text" readonly class="w-full bg-black/60 border border-white/5 text-right p-4 text-2xl rounded-xl mb-4 font-mono select-none text-green-400 outline-none" value="0" />
              <div class="grid grid-cols-4 gap-2">
                <button onclick="press('7')" class="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold">7</button>
                <button onclick="press('8')" class="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold">8</button>
                <button onclick="press('9')" class="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold">9</button>
                <button onclick="op('/')" class="bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold">÷</button>
                <button onclick="press('4')" class="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold">4</button>
                <button onclick="press('5')" class="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold">5</button>
                <button onclick="press('6')" class="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold">6</button>
                <button onclick="op('*')" class="bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold">×</button>
                <button onclick="press('1')" class="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold">1</button>
                <button onclick="press('2')" class="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold">2</button>
                <button onclick="press('3')" class="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold">3</button>
                <button onclick="op('-')" class="bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold">-</button>
                <button onclick="cls()" class="bg-red-600 hover:bg-red-500 py-3 rounded-lg font-bold">C</button>
                <button onclick="press('0')" class="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold">0</button>
                <button onclick="eq()" class="bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold">=</button>
                <button onclick="op('+')" class="bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold">+</button>
              </div>
            </div>
            <script>
              const display = document.getElementById('display');
              let expr = '';
              window.press = (v) => { expr += v; display.value = expr; };
              window.op = (o) => { expr += ' ' + o + ' '; display.value = expr; };
              window.cls = () => { expr = ''; display.value = '0'; };
              window.eq = () => {
                try {
                  display.value = eval(expr);
                  expr = display.value;
                } catch(err) { display.value = 'Error'; expr = ''; }
              }
            </script>
          </body>
          </html>
        `;
      }
      setCompiledHtml(template);
      // Auto formatting name
      setAppTitle(makerPrompt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    } finally {
      setMakingProgress(false);
    }
  };

  const handleInstallApp = () => {
    if (!compiledHtml) return;

    const appId = `compiled-${Date.now()}`;
    const newApp = {
      id: appId,
      title: appTitle,
      html: compiledHtml,
      css: '',
      js: ''
    };

    // 1. Add app schema definition in Zustand
    addCustomApp(newApp);

    // 2. Add icon launcher shortcut physically on the desktop
    addDesktopItem({
      id: `shortcut-${Date.now()}`,
      name: appTitle,
      type: 'app',
      appId: appId,
      position: { x: 300, y: 300 } // centered coordinates
    });

    setInstallSuccessMessage(`Success! "${appTitle}" is installed properly. Check your Desktop workspace to run your custom application!`);
  };

  // --- TAB 3: SYSTEM UTILITY & DIAGNOSTIC PANEL ---
  const [ramValue, setRamValue] = useState(34);
  const [cpuValue, setCpuValue] = useState(12);
  const [storageVal, setStorageVal] = useState(45);
  const [clearingMessage, setClearingMessage] = useState('');

  const optimizeMemory = () => {
    setClearingMessage('Triggering flush cache channels...');
    setTimeout(() => {
      setRamValue(14);
      setCpuValue(3);
      setClearingMessage('Memory leak cleared successfully! Ram usages reduced to 14%.');
    }, 1500);
  };

  const purgeStorage = () => {
    setClearingMessage('Scanning directories for temporary cache logs...');
    setTimeout(() => {
      setStorageVal(32);
      setClearingMessage('Temporary directory storage purged. 13GB of files freed.');
    }, 1500);
  };

  if (!systemState.aiCoreEnabled) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full p-8 bg-zinc-950 text-white select-none font-sans">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 border border-purple-500/20 shadow-lg shadow-purple-500/5 animate-pulse">
          <Brain size={32} />
        </div>
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Neural AI Core is Deactivated</h2>
        <p className="text-xs text-zinc-500 max-w-sm leading-relaxed mb-6">
          The AI Core features (including chatbot Kai, Files searching assistants, and HTML app builders) are disabled under your current system profile. Enable it in Settings to activate the neural synapse pathways.
        </p>
        <button 
          onClick={() => updateSystemState('aiCoreEnabled', true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
        >
          Activate AI Core Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-zinc-950 text-white font-sans overflow-hidden select-none">
      
      {/* Sidebar Controls */}
      <div className="w-64 border-r border-white/5 bg-zinc-900/40 flex flex-col p-4 shrink-0 justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
               <Brain size={22} className="text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-100 uppercase tracking-widest leading-none">AI Core</span>
              <div className="flex items-center space-x-1.5 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <button 
              onClick={() => { setActiveTab('kai'); setInstallSuccessMessage(''); }}
              className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                activeTab === 'kai' 
                  ? 'bg-purple-600/10 border-purple-500/30 text-purple-400 shadow-lg' 
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Bot size={16} />
              <span>Helper Kai</span>
            </button>

            <button 
              onClick={() => { setActiveTab('maker'); setInstallSuccessMessage(''); }}
              className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                activeTab === 'maker' 
                  ? 'bg-purple-600/10 border-purple-500/30 text-purple-400 shadow-lg' 
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Code size={16} />
              <span>App Dev Studio</span>
            </button>

            <button 
              onClick={() => { setActiveTab('diagnostics'); setInstallSuccessMessage(''); }}
              className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                activeTab === 'diagnostics' 
                  ? 'bg-purple-600/10 border-purple-500/30 text-purple-400 shadow-lg' 
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Activity size={16} />
              <span>System Diagnostician</span>
            </button>
          </div>
        </div>

        {/* Identity lock */}
        <div className="p-3.5 bg-purple-600/5 border border-purple-500/10 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-mono text-xs font-bold border border-purple-500/10">IE</div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-300 font-medium leading-tight">Neural Link</span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Online</span>
            </div>
          </div>
          <Zap size={14} className="text-purple-400 animate-pulse" />
        </div>
      </div>

      {/* Main Container Area */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0 bg-gradient-to-b from-transparent to-purple-900/10">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CONVERSATIONAL KAI CHAT */}
          {activeTab === 'kai' && (
            <motion.div 
              key="kai-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                 {messages.map((m) => (
                   <div 
                     key={m.id}
                     className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                   >
                     <div className={`flex space-x-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg border ${
                         m.role === 'user' ? 'bg-zinc-800 border-white/5 text-blue-400' : 'bg-purple-600 border-purple-500 text-white'
                       }`}>
                         {m.role === 'user' ? <User size={15}/> : <Bot size={15}/>}
                       </div>
                       <div className={`p-4 rounded-xl text-xs leading-relaxed font-medium break-words border ${
                         m.role === 'user' ? 'bg-purple-600/10 border-purple-500/20 text-white' : 'bg-white/5 border-white/10 text-zinc-200'
                       }`}>
                         {m.text}
                       </div>
                     </div>
                   </div>
                 ))}
                 {isTyping && (
                   <div className="flex justify-start">
                     <div className="flex space-x-3">
                       <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center border border-purple-500 text-white shrink-0 animate-pulse">
                         <Bot size={15}/>
                       </div>
                       <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex space-x-1 items-center">
                         <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                         <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                         <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                       </div>
                     </div>
                   </div>
                 )}
              </div>

              {/* Chat Send */}
              <div className="p-4 border-t border-white/5 bg-zinc-950/50 backdrop-blur-3xl shrink-0">
                <div className="max-w-3xl mx-auto relative">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Inquire Kai on systems optimization or general topics..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 pl-5 pr-12 text-xs outline-none focus:border-purple-500/50 transition-all font-medium"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-20 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: HTML APPLICATION CREATOR */}
          {activeTab === 'maker' && (
            <motion.div 
              key="maker-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col p-6 overflow-hidden h-full"
            >
              <div className="space-y-1.5 mb-6 shrink-0">
                 <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                   <Code size={20} className="text-purple-400" />
                   <span>App Dev-Studio Sandbox</span>
                 </h2>
                 <p className="text-[11px] text-zinc-400 leading-normal">
                   Design responsive, beautiful tool applets with direct sandbox generation. Our compiling intelligence will create the full HTML structure and scripts, allowing you to run and install them!
                 </p>
              </div>

              {/* Prompt creator row */}
              <div className="flex gap-2 mb-4 shrink-0">
                <input 
                  type="text"
                  value={makerPrompt}
                  onChange={(e) => setMakerPrompt(e.target.value)}
                  placeholder="e.g. create a music piano keyboard or digital timer dashboard"
                  className="flex-1 bg-zinc-900/60 border border-white/5 rounded-xl py-2.5 px-4 text-xs font-mono outline-none focus:border-purple-500/50 transition-all text-white placeholder-zinc-600"
                />
                <button 
                  onClick={handleCreateApp}
                  disabled={makingProgress || !makerPrompt.trim()}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md shrink-0 disabled:opacity-20"
                >
                  <Sparkles size={14} />
                  <span>{makingProgress ? 'Compiling...' : 'Compile App'}</span>
                </button>
              </div>

              {/* Real App Viewer Sandbox Panel */}
              <div className="flex-1 min-h-0 bg-black/40 border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between">
                
                {compiledHtml ? (
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5 shrink-0">
                       <div className="flex items-center space-x-2">
                         <div className="w-2 h-2 rounded-full bg-red-500" />
                         <div className="w-2 h-2 rounded-full bg-yellow-500" />
                         <div className="w-2 h-2 rounded-full bg-green-500" />
                         <span className="text-[10px] font-mono text-zinc-500 font-bold ml-2">App Sandbox Interface:</span>
                         <input 
                           type="text"
                           value={appTitle}
                           onChange={(e) => setAppTitle(e.target.value)}
                           className="bg-zinc-900 border border-white/15 px-2 py-0.5 rounded text-[10px] font-bold text-white outline-none font-sans focus:border-blue-500/50"
                           placeholder="App Label Title"
                         />
                       </div>
                       
                       <button 
                         onClick={handleInstallApp}
                         className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center space-x-1.5 transition-all shadow-md uppercase tracking-wider"
                       >
                         <Download size={12} />
                         <span>Install on Desktop</span>
                       </button>
                    </div>

                    {installSuccessMessage && (
                      <p className="text-[11px] text-green-400 font-bold bg-green-500/5 border border-green-500/10 rounded-lg p-2.5 mb-3.5">{installSuccessMessage}</p>
                    )}

                    {/* App live preview Frame */}
                    <div className="flex-1 w-full bg-white rounded-xl overflow-hidden min-h-0 shadow-lg border border-black/20">
                      <iframe 
                        key={compiledHtml.slice(0, 30)} // force refresh iframe
                        srcDoc={compiledHtml}
                        className="w-full h-full border-none"
                        sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                     <TermIcon className="text-zinc-600 mb-4 animate-pulse" size={48} />
                     <p className="text-xs font-bold font-mono">APP_SANDBOX_STAGED</p>
                     <p className="text-[10px] text-zinc-500 max-w-xs leading-normal mt-1">Initiating compilers. Submit an architectural blueprint prompt to generate a preview output sandbox frame.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: SYSTEM DIAGNOSTIC PANEL */}
          {activeTab === 'diagnostics' && (
            <motion.div 
              key="diagnostics-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 p-6 flex flex-col justify-between h-full overflow-y-auto custom-scrollbar"
            >
              <div>
                <div className="space-y-1 mb-8">
                   <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                     <Cpu size={20} className="text-purple-400 animate-pulse" />
                     <span>System Metrics Analyzer</span>
                   </h2>
                   <p className="text-[11px] text-zinc-400">Control thermal throttle metrics, clear memory leak streams, and manage active system operations.</p>
                </div>

                {/* Dashboard layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {/* Cpu meter */}
                  <div className="p-4 bg-zinc-900/60 border border-white/5 rounded-2xl relative overflow-hidden">
                     <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">Process Node Usage</span>
                     <div className="text-2xl font-black text-white font-mono">{cpuValue}%</div>
                     <span className="text-[9px] text-zinc-500 font-bold uppercase block mt-1">Processor stabilized</span>
                     <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800">
                       <div className="h-full bg-indigo-500 duration-1000 transition-[width]" style={{ width: `${cpuValue}%` }} />
                     </div>
                  </div>

                  {/* RAM meter */}
                  <div className="p-4 bg-zinc-900/60 border border-white/5 rounded-2xl relative overflow-hidden">
                     <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-2">Memory Capacity</span>
                     <div className="text-2xl font-black text-white font-mono">{ramValue}%</div>
                     <span className="text-[9px] text-zinc-500 font-bold uppercase block mt-1">Active memory leakage</span>
                     <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800">
                       <div className="h-full bg-purple-500 duration-1000 transition-[width]" style={{ width: `${ramValue}%` }} />
                     </div>
                  </div>

                  {/* Storage limits */}
                  <div className="p-4 bg-zinc-900/60 border border-white/5 rounded-2xl relative overflow-hidden">
                     <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-2">System Drive (C:)</span>
                     <div className="text-2xl font-black text-white font-mono">{storageVal}GB / 256GB</div>
                     <span className="text-[9px] text-zinc-500 font-bold uppercase block mt-1">Storage buffers occupied</span>
                     <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800">
                       <div className="h-full bg-blue-500 duration-1000 transition-[width]" style={{ width: `${(storageVal / 256) * 100}%` }} />
                     </div>
                  </div>
                </div>

                {clearingMessage && (
                  <p className="text-xs text-[#a78bfa] font-bold bg-purple-500/5 border border-purple-500/10 rounded-xl p-3 mb-6 font-mono leading-relaxed">{clearingMessage}</p>
                )}

                {/* Operations Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2.5">Diagnostic Corrections</h4>
                  
                  {/* Purge Memory logs */}
                  <div className="flex items-center justify-between p-3 bg-black/20 border border-white/5 rounded-xl">
                    <div className="flex items-center space-x-3 pr-4">
                       <Zap size={15} className="text-purple-400" />
                       <div className="text-xs">
                          <span className="font-bold text-white block">Optimize & Flush Memory Logs</span>
                          <span className="text-[10px] text-zinc-500 block">Frees leaking operational buffers in active tabs.</span>
                       </div>
                    </div>
                    <button 
                      onClick={optimizeMemory}
                      className="bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-[10px] py-1.5 px-3 rounded border border-white/5 transition-all"
                    >Optimize</button>
                  </div>

                  {/* Clean up Drive */}
                  <div className="flex items-center justify-between p-3 bg-black/20 border border-white/5 rounded-xl">
                    <div className="flex items-center space-x-3 pr-4">
                       <HardDrive size={15} className="text-blue-400" />
                       <div className="text-xs">
                          <span className="font-bold text-white block">Release Temporary Drive Space</span>
                          <span className="text-[10px] text-zinc-500 block">Purges non-essential cache files in folder systems.</span>
                       </div>
                    </div>
                    <button 
                      onClick={purgeStorage}
                      className="bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-[10px] py-1.5 px-3 rounded border border-white/5 transition-all"
                    >Clean Drive</button>
                  </div>

                  {/* Toggle Night Light */}
                  <div className="flex items-center justify-between p-3 bg-black/20 border border-white/5 rounded-xl">
                    <div className="flex items-center space-x-3 pr-4">
                       <Moon size={15} className="text-amber-400" />
                       <div className="text-xs">
                          <span className="font-bold text-white block">Calibrate Blue Light Filter</span>
                          <span className="text-[10px] text-zinc-500 block">Activates warm operational aesthetics for comfort.</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => updateSystemState('nightLight', !systemState.nightLight)}
                      className={`font-bold text-[10px] py-1.5 px-3 rounded transition-all ${
                        systemState.nightLight 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
                      }`}
                    >
                      {systemState.nightLight ? 'Night ON' : 'Night OFF'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#8b5cf6]/5 border border-purple-500/10 rounded-2xl flex items-start space-x-3 mt-6">
                 <ShieldAlert className="text-purple-400 shrink-0 mt-0.5" size={15} />
                 <p className="text-[10px] text-zinc-500 leading-relaxed">
                   Neural Intelligence optimizes this operating registry continuously. Metrics correspond to sandbox compilation operations dynamically.
                 </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
