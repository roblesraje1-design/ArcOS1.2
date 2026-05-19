'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOSStore } from '@/store/useOSStore';
import { 
  Download, 
  X, 
  SearchCode, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  Gamepad2,
  Globe,
  BarChart2,
  Video,
  FileText
} from 'lucide-react';

export default function AppInstaller() {
  const { installingApp, setInstallationProgress, finishInstallation, addDesktopItem, addCustomApp } = useOSStore();
  
  const [stage, setStage] = useState<'intro' | 'scanning' | 'discovery' | 'installing' | 'finished'>('intro');
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Custom suggestion variables
  const [appTitle, setAppTitle] = useState('My Custom App');
  const [selectedIconName, setSelectedIconName] = useState('Code2');
  const [heuristicReport, setHeuristicReport] = useState('Evaluating application logic...');

  // Available icon vectors to select in Discovery page
  const iconCollection = [
    { name: 'Code2', icon: Code2, label: 'Standard Code UI' },
    { name: 'Terminal', icon: Terminal, label: 'CLI Script System' },
    { name: 'Gamepad2', icon: Gamepad2, label: 'Gaming Graphics Canvas' },
    { name: 'Globe', icon: Globe, label: 'Cloud API Connector' },
    { name: 'BarChart2', icon: BarChart2, label: 'Data Dashboard Metrics' },
    { name: 'Video', icon: Video, label: 'Camera Video Output' },
  ];

  useEffect(() => {
    if (installingApp.isOpen) {
      const code = (installingApp.appData as any)?.html || (installingApp.appData as any)?.code || '';
      
      // Analyze code locally to determine high-speed heuristics
      let iconGuess = 'Code2';
      let docReport = 'Synthesizing standard application structures... No unique hardware scripts found.';
      
      if (code.includes('canvas') || code.includes('Game') || code.includes('score') || code.includes('mousedown')) {
        iconGuess = 'Gamepad2';
        docReport = 'Synapse Analysis: Detected canvas drawing registers and visual mouse position pointers. Recommended: Interactive Gaming and graphics suite.';
      } else if (code.includes('fetch') || code.includes('http') || code.includes('cdn') || code.includes('url')) {
        iconGuess = 'Globe';
        docReport = 'Synapse Analysis: Detected external HTTP queries, source scripts or linked CDN templates. Recommended: Cloud Network module.';
      } else if (code.includes('calculator') || code.includes('eval') || code.includes('math') || code.includes('Math')) {
        iconGuess = 'BarChart2';
        docReport = 'Synapse Analysis: Discovered mathematical equations eval registers and numeric grid nodes. Recommended: Analytics Calculator.';
      } else if (code.includes('camera') || code.includes('video') || code.includes('play') || code.includes('media')) {
        iconGuess = 'Video';
        docReport = 'Synapse Analysis: Custom camera feeds or audiovisual frame selectors active. Recommended: Multimedia Panel.';
      } else if (code.includes('input') || code.includes('terminal') || code.includes('logs')) {
        iconGuess = 'Terminal';
        docReport = 'Synapse Analysis: Interactive text configurations and scripting consoles active. Recommended: Terminal Command Utilities.';
      }
      
      // Defer state synchronization to separate tick to respect purity and avoid cascading render warnings
      const initTimer = setTimeout(() => {
        setStage('intro');
        setAppTitle(installingApp.appData?.title || 'My Custom App');
        setSelectedIconName(iconGuess);
        setHeuristicReport(docReport);
      }, 0);

      // Stage transition timers
      // 1. Intro (Preparing) lasts 2 seconds
      // 2. Code Scan (analyzing code) lasts exactly 5 seconds (the user-requested offline scanning delay!)
      // 3. Then, discovery report popup displays, waiting for user approval.
      const introTimer = setTimeout(() => {
        setStage('scanning');
        
        const scanTimer = setTimeout(() => {
          setStage('discovery');
        }, 5000); // 5-second mandatory code scanner
        
        return () => clearTimeout(scanTimer);
      }, 2000);

      return () => {
        clearTimeout(initTimer);
        clearTimeout(introTimer);
      };
    }
  }, [installingApp.isOpen, installingApp.appData]);

  // Run the unpacking installer step
  const handleApproveDiscovery = () => {
    setStage('installing');
    
    // Unpacking lasts 4 seconds
    const totalTime = 4000;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / totalTime) * 100, 100);
      
      setInstallationProgress(progress);
      setTimeRemaining(Math.ceil((totalTime - elapsed) / 1000));
      
      if (progress >= 100) {
        clearInterval(interval);
        setStage('finished');
      }
    }, 100);
  };

  const handleFinishAndShortcut = () => {
    if (!installingApp.appData) return;
    
    // Create an immutable copy with the user's customized name and icon
    const finalizedApp = {
      ...installingApp.appData,
      title: appTitle,
      icon: selectedIconName
    };
    
    // Register custom app definition into stored apps array
    addCustomApp(finalizedApp);
    
    // Physical launch shortcut added to desktop
    const customShortcutId = `shortcut-${Date.now()}`;
    addDesktopItem({
       id: customShortcutId,
       name: appTitle,
       type: 'app',
       appId: finalizedApp.id,
       position: { x: 120, y: 120 }
    });

    // Reset installer state cleanly using the store setter
    useOSStore.setState({
      installingApp: { isOpen: false, progress: 0, appData: null }
    });
  };

  if (!installingApp.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-[480px] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 shrink-0">
           <div className="flex items-center space-x-3">
              <Download size={18} className="text-purple-500" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Intelligence App Installer</span>
           </div>
           {(stage === 'finished' || stage === 'discovery') && (
             <button onClick={handleFinishAndShortcut} className="text-zinc-500 hover:text-white transition-colors">
                <X size={18} />
             </button>
           )}
        </div>

        {/* Dynamic State Panels */}
        <div className="p-8 flex flex-col items-center">
          <AnimatePresence mode="wait">
             
             {/* STAGE 1: INTRO SEQUENCE */}
             {stage === 'intro' && (
               <motion.div 
                 key="intro"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex flex-col items-center text-center"
               >
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                     <ShieldCheck size={32} />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2">Preparing Node Assembly</h2>
                  <p className="text-xs text-zinc-400">Verifying secure sandboxed buffers and code hashes...</p>
               </motion.div>
             )}

             {/* STAGE 2: MANDATORY 5-SECOND CODESCANNER */}
             {stage === 'scanning' && (
               <motion.div 
                 key="scanning"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex flex-col items-center w-full text-center animate-pulse"
               >
                  <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 relative overflow-hidden">
                     <SearchCode size={32} />
                     <motion.div 
                       initial={{ x: '-100%' }}
                       animate={{ x: '100%' }}
                       transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                       className="absolute inset-0 bg-white/10 skew-x-12"
                     />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-1 uppercase tracking-wider font-mono">Neural Code Scan</h2>
                  <p className="text-xs text-zinc-400 mb-6">Analyzing Javascript syntax patterns and DOM libraries locally...</p>
                  
                  {/* Local log sequence */}
                  <div className="w-full space-y-1.5 bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-[9px] text-left h-28 overflow-hidden">
                     <p className="text-blue-400">{`> SCANNING_DOM_STRUCTURES...`}</p>
                     <p className="text-purple-400">{`> EXTRACTING_SCRIPTS_HEURISTICS...`}</p>
                     <p className="text-green-400">{`> DETECTING_APP_ID_BUFFERS...`}</p>
                     <p className="text-zinc-600">{`> PARSING_INLINE_VARS_INDEX...`}</p>
                     <p className="text-zinc-500">{`> GENERATING_LAUNCHER_SUGGESTIONS_READY...`}</p>
                  </div>
               </motion.div>
             )}

             {/* STAGE 3: SUGGESTION & APP DESIGN REPORT */}
             {stage === 'discovery' && (
               <motion.div 
                 key="discovery"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="flex flex-col w-full text-left space-y-5"
               >
                  <div className="flex items-center space-x-3 border-b border-white/5 pb-3">
                     <Sparkles size={18} className="text-purple-400" />
                     <h2 className="text-base font-bold text-white">AI Diagnostics & App Configuration</h2>
                  </div>

                  <p className="text-xs text-zinc-400 bg-white/5 rounded-xl p-3 border border-white/5 leading-relaxed">
                     {heuristicReport}
                  </p>

                  {/* Editable input */}
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Application Name Launcher</label>
                     <input 
                       type="text"
                       value={appTitle}
                       onChange={(e) => setAppTitle(e.target.value)}
                       className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white uppercase font-bold outline-none focus:border-purple-500/50 transition-all font-mono"
                     />
                  </div>

                  {/* Icon selections */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Assign Icon Vector</label>
                     <div className="grid grid-cols-3 gap-2">
                        {iconCollection.map((ic) => {
                          const IconComp = ic.icon;
                          const selected = ic.name === selectedIconName;
                          return (
                            <button
                              key={ic.name}
                              onClick={() => setSelectedIconName(ic.name)}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                                selected 
                                  ? 'bg-purple-600/10 border-purple-500 text-purple-400 font-bold' 
                                  : 'bg-black/20 border-white/5 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                               <IconComp size={16} className="mb-1" />
                               <span className="text-[9px] font-bold truncate block w-full">{ic.label}</span>
                            </button>
                          );
                        })}
                     </div>
                  </div>

                  <button 
                    onClick={handleApproveDiscovery}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg active:scale-95 transition-all uppercase tracking-widest block"
                  >
                     <span>Approve Configuration & Install</span>
                     <ArrowRight size={14} />
                  </button>
               </motion.div>
             )}

             {/* STAGE 4: UNPACKING ASSEMBLER */}
             {stage === 'installing' && (
               <motion.div 
                 key="installing"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex flex-col items-center w-full text-center"
               >
                  <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin mb-6" />
                  <h2 className="text-lg font-bold text-white mb-2">Unpacking assets...</h2>
                  <p className="text-xs text-zinc-400 mb-6 font-medium">Registering desktop short-links and system references...</p>
                  
                  <div className="w-full bg-zinc-805 h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
                     <motion.div 
                       className="h-full bg-blue-500" 
                       initial={{ width: 0 }}
                       animate={{ width: `${installingApp.progress}%` }}
                     />
                  </div>
                  <div className="flex justify-between w-full text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-widest">
                     <span>{Math.round(installingApp.progress)}%</span>
                     <span>{timeRemaining}s remaining</span>
                  </div>
               </motion.div>
             )}

             {/* STAGE 5: INSTALLATION COMPLETED */}
             {stage === 'finished' && (
               <motion.div 
                 key="finished"
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center"
               >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-6">
                     <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-lg font-bold text-green-400 mb-2">Installation Accomplished</h2>
                  <p className="text-xs text-zinc-400 mb-8 max-w-sm leading-relaxed">
                     &quot;{appTitle}&quot; was analyzed and compiled successfully with custom icons. A launcher shortcut has been created on your ArcOS Workspace Desktop.
                  </p>
                  
                  <button 
                   onClick={handleFinishAndShortcut}
                   className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-12 py-3 rounded-xl text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                  >
                    Launch Custom App
                  </button>
               </motion.div>
             )}

          </AnimatePresence>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-4 bg-zinc-950/20 border-t border-white/5 text-[9px] text-center text-zinc-650 font-bold uppercase tracking-widest font-mono shrink-0">
           BUILD_STATION // PHYSICAL_METRICS_SANDBOX 
        </div>
      </motion.div>
    </div>
  );
}
