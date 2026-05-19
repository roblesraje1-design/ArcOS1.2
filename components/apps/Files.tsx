'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Folder, 
  Plus, 
  Trash2, 
  X, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Upload, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  LayoutGrid,
  List,
  Star,
  Clock,
  HardDrive,
  MoreVertical,
  Download,
  Info,
  Type,
  Maximize2,
  Monitor,
  RefreshCcw,
  Sparkles,
  Send,
  Bot
} from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  mimeType?: string;
  content?: string; 
  dataUrl?: string;
  parentId: string;
  isFavorite?: boolean;
  size?: number;
  updatedAt: number;
}

export default function Files() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPathId, setCurrentPathId] = useState<string>('root');
  const [pathHistory, setPathHistory] = useState<string[]>(['root']);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  // AI Finder state variables
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('Greetings! I am the automated Explorer Assistant. Tell me what type of files you are searching for (e.g., "find images", "list favorites", or "go to videos") and I will filter and search them immediately!');
  const [aiFilterQuery, setAiFilterQuery] = useState<string | null>(null); // "images" | "videos" | "music" | "favorites" | "text" | null
  const [aiStatus, setAiStatus] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openApp, openContextMenu, startInstallation } = useOSStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const saved = localStorage.getItem('arcos_files_v3');
      if (saved) {
        setFiles(JSON.parse(saved));
      } else {
        const initialFiles: FileItem[] = [
          { id: 'img_dir', name: 'Images', type: 'folder', parentId: 'root', updatedAt: Date.now() },
          { id: 'music_dir', name: 'Music', type: 'folder', parentId: 'root', updatedAt: Date.now() },
          { id: 'video_dir', name: 'Videos', type: 'folder', parentId: 'root', updatedAt: Date.now() },
          { id: 'doc_dir', name: 'Documents', type: 'folder', parentId: 'root', updatedAt: Date.now(), isFavorite: true },
          { id: 'welcome', name: 'welcome_v3.txt', type: 'file', mimeType: 'text/plain', content: 'ArcOS File Explorer Revamped.', parentId: 'root', size: 24, updatedAt: Date.now(), isFavorite: true },
        ];
        setFiles(initialFiles);
        localStorage.setItem('arcos_files_v3', JSON.stringify(initialFiles));
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const saveFiles = (newFiles: FileItem[]) => {
    setFiles(newFiles);
    try {
      localStorage.setItem('arcos_files_v3', JSON.stringify(newFiles));
    } catch (e) {
      console.warn("Storage quota exceeded.");
    }
  };

  const runAiSearchCommand = (rawQuery: string) => {
    if (!rawQuery.trim()) return;

    setAiTyping(true);
    setAiStatus('Parsing natural command...');
    setAiInput('');

    setTimeout(() => {
      const lower = rawQuery.toLowerCase();
      let responseText = '';
      let activeFilter: string | null = null;
      let visualStatus = '';

      if (lower.includes('image') || lower.includes('photo') || lower.includes('pic')) {
        activeFilter = 'images';
        responseText = 'Acknowledged. I have indexed the storage and filtered matches system-wide to show only image assets and image directories.';
        visualStatus = 'AI FILTER: Active (Images)';
      } else if (lower.includes('video') || lower.includes('movie')) {
        activeFilter = 'videos';
        responseText = 'Acknowledged. I filtered the results system-wide to show video items and directories.';
        visualStatus = 'AI FILTER: Active (Videos)';
      } else if (lower.includes('music') || lower.includes('audio') || lower.includes('song')) {
        activeFilter = 'music';
        responseText = 'Acknowledged. Operating registries filtered to view audio files and music folders.';
        visualStatus = 'AI FILTER: Active (Audio)';
      } else if (lower.includes('favorite') || lower.includes('star')) {
        activeFilter = 'favorites';
        responseText = 'Sub-node query executed! Displaying files or folders marked with favorite bookmarks is active.';
        visualStatus = 'AI FILTER: Active (Favorites)';
      } else if (lower.includes('text') || lower.includes('doc') || lower.includes('txt') || lower.includes('welcome')) {
        activeFilter = 'text';
        responseText = 'I structured files to filter text documents (.txt) and verified document system folders.';
        visualStatus = 'AI FILTER: Active (Documents)';
      } else if (lower.includes('reset') || lower.includes('clear')) {
        activeFilter = null;
        responseText = 'All AI search overrides cleared. Standard list structure recovered.';
        visualStatus = '';
      } else {
        activeFilter = rawQuery;
        responseText = `Matched file elements containing keyword sequence: "${rawQuery}".`;
        visualStatus = `AI FILTER: "${rawQuery}"`;
      }

      setAiFilterQuery(activeFilter);
      setAiResponse(responseText);
      setAiStatus(visualStatus);
      setAiTyping(false);
    }, 700);
  };

  const currentFolder = files.find(f => f.id === currentPathId) || { name: 'Home' };
  
  const getAiFilteredFiles = () => {
    if (!aiFilterQuery) {
      return files
        .filter(f => f.parentId === currentPathId)
        .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    switch (aiFilterQuery) {
      case 'images':
        return files.filter(f => f.mimeType?.startsWith('image/') || f.id === 'img_dir');
      case 'videos':
        return files.filter(f => f.mimeType?.startsWith('video/') || f.id === 'video_dir');
      case 'music':
        return files.filter(f => f.mimeType?.startsWith('audio/') || f.id === 'music_dir');
      case 'favorites':
        return files.filter(f => !!f.isFavorite);
      case 'text':
        return files.filter(f => f.mimeType === 'text/plain' || f.name.endsWith('.txt') || f.id === 'doc_dir');
      default:
        return files.filter(f => f.name.toLowerCase().includes(aiFilterQuery.toLowerCase()));
    }
  };

  const filteredFiles = getAiFilteredFiles();

  const navigateTo = (id: string) => {
    setCurrentPathId(id);
    const newHistory = pathHistory.slice(0, historyIndex + 1);
    newHistory.push(id);
    setPathHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPathId(pathHistory[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < pathHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPathId(pathHistory[historyIndex + 1]);
    }
  };

  const handleFileOpen = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateTo(file.id);
    } else {
      if (file.name.endsWith('.html')) {
        // App Engine Trigger
        const appData = {
          id: `custom-${file.id}`,
          title: file.name.replace('.html', ''),
          html: file.content || '',
          css: '',
          js: ''
        };
        startInstallation(appData);
        return;
      }

      if (file.mimeType?.startsWith('image/')) {
        openApp('photoviewer', 'Photo Viewer', { url: file.dataUrl, name: file.name });
      } else if (file.mimeType?.startsWith('video/') || file.mimeType?.startsWith('audio/')) {
        openApp('mediaplayer', 'Media Player', { url: file.dataUrl, name: file.name, type: file.mimeType });
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newFile: FileItem = {
          id: Math.random().toString(36).substring(7),
          name: file.name,
          type: 'file',
          mimeType: file.type || 'text/plain',
          content: typeof content === 'string' ? content : undefined,
          dataUrl: typeof content === 'string' && (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) ? content : undefined,
          parentId: currentPathId,
          size: Math.round(file.size / 1024),
          updatedAt: Date.now()
        };
        saveFiles([...files, newFile]);
      };

      if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const toggleFavorite = (id: string) => {
    saveFiles(files.map(f => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  const renameFile = (id: string, newName: string) => {
    saveFiles(files.map(f => f.id === id ? { ...f, name: newName } : f));
    setEditingFileId(null);
  };

  const handleFileRightClick = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY, [
      { label: 'Open', action: () => handleFileOpen(file) },
      { label: file.isFavorite ? 'Remove Favorite' : 'Add Favorite', icon: Star, action: () => toggleFavorite(file.id) },
      { label: 'Rename', icon: Type, action: () => { setEditingFileId(file.id); setTempName(file.name); } },
      { label: 'Copy Path', action: () => navigator.clipboard.writeText(`C:/${file.name}`) },
      { label: 'Delete', icon: Trash2, action: () => saveFiles(files.filter(f => f.id !== file.id)), danger: true },
    ]);
  };

  const handleNewFolder = () => {
    const name = "New Folder";
    const newFile: FileItem = {
      id: Date.now().toString(),
      name,
      type: 'folder',
      parentId: currentPathId,
      updatedAt: Date.now()
    };
    saveFiles([...files, newFile]);
    setEditingFileId(newFile.id);
    setTempName(name);
  };

  const getIcon = (file: FileItem) => {
    if (file.type === 'folder') return <Folder size={viewMode === 'grid' ? 48 : 18} className="text-yellow-400" />;
    if (file.mimeType?.startsWith('image/')) return <ImageIcon size={viewMode === 'grid' ? 48 : 18} className="text-blue-400" />;
    return <FileText size={viewMode === 'grid' ? 48 : 18} className="text-zinc-400" />;
  };

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-zinc-900/50 flex flex-col p-3 space-y-1">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-2">Navigation</div>
        <button className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/5 text-zinc-200">
          <HardDrive size={18} className="text-blue-500" />
          <span className="text-sm">Main PC (C:)</span>
        </button>
        <button onClick={() => navigateTo('root')} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-200">
          <Folder size={18} className="text-zinc-500" />
          <span className="text-sm">Root</span>
        </button>

        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-4">Favorites</div>
        {files.filter(f => f.isFavorite).map(f => (
          <button key={f.id} onClick={() => navigateTo(f.id === 'root' ? 'root' : f.parentId)} className="flex items-center justify-between group px-3 py-1.5 rounded-lg hover:bg-white/5 text-sm text-zinc-300">
            <div className="flex items-center space-x-3">
               <Star size={14} className="text-yellow-500 fill-yellow-500" />
               <span>{f.name}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}

        <div className="mt-auto p-4 bg-blue-600/5 border border-blue-500/10 rounded-xl">
           <h4 className="text-xs font-bold text-blue-400 mb-1">Safe Storage</h4>
           <p className="text-[10px] text-zinc-500">240GB available of 256GB</p>
           <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500 w-[15%]" />
           </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-14 border-b border-white/5 bg-zinc-900/30 flex items-center px-4 justify-between backdrop-blur-3xl">
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-1">
                <button onClick={goBack} disabled={historyIndex === 0} className="p-1.5 rounded hover:bg-white/5 disabled:opacity-20"><ChevronLeft size={20} /></button>
                <button onClick={goForward} disabled={historyIndex === pathHistory.length - 1} className="p-1.5 rounded hover:bg-white/5 disabled:opacity-20"><ChevronRight size={20} /></button>
                <button onClick={() => navigateTo('root')} className="p-1.5 rounded hover:bg-white/5"><Plus size={20} className="rotate-45" /></button>
             </div>
             <div className="flex items-center bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-1.5 min-w-[300px]">
                <span className="text-xs text-zinc-500 mr-2">C: /</span>
                <span className="text-xs text-zinc-200 truncate pr-2">{currentFolder.name}</span>
                <RefreshCcw size={14} className="ml-auto text-zinc-600 hover:text-zinc-200 cursor-pointer" />
             </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search current folder" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-800/80 border border-white/5 rounded-md py-1.5 pl-9 pr-3 text-xs text-zinc-200 outline-none w-48 focus:w-64 transition-all"
                />
             </div>
             <div className="flex items-center bg-zinc-800/30 rounded-lg p-0.5 border border-white/5">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500'}`}><LayoutGrid size={16} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500'}`}><List size={16} /></button>
             </div>
             <button 
                onClick={() => { setIsAiDrawerOpen(!isAiDrawerOpen); setSelectedFile(null); }}
                className={`flex items-center space-x-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  isAiDrawerOpen 
                    ? "bg-purple-600/20 text-purple-400 border-purple-500/30" 
                    : "bg-zinc-800 text-zinc-350 border-white/10 hover:bg-zinc-700 hover:text-white"
                }`}
             >
                <Sparkles size={14} className={isAiDrawerOpen ? "animate-pulse" : ""} />
                <span>AI Finder</span>
             </button>
          </div>
        </div>

        {/* Action Header */}
        <div className="bg-zinc-900/10 px-6 py-3 flex items-center justify-between border-b border-white/5">
           <div className="flex items-center space-x-4">
              <button 
                onClick={handleNewFolder}
                className="flex items-center space-x-2 text-xs font-semibold text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors border border-white/5"
              >
                <Plus size={14} /> <span>New</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 text-xs font-semibold text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors border border-white/5"
              >
                <Upload size={14} /> <span>Upload</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleUpload} 
                multiple 
              />
           </div>
           <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{filteredFiles.length} items</div>
        </div>

        {/* Content Area */}
        <div 
          className={`flex-1 overflow-auto p-6 ${viewMode === 'grid' ? 'flex flex-wrap gap-4 content-start' : 'flex flex-col'}`}
          onContextMenu={(e) => {
             e.preventDefault();
             openContextMenu(e.clientX, e.clientY, [
                { label: 'New Folder', icon: Folder, action: handleNewFolder },
                { label: 'New Text Document', icon: FileText, action: () => {} },
                { label: 'Paste', action: () => {} },
                { label: 'Refresh', icon: RefreshCcw, action: () => window.location.reload() },
                { label: 'Properties', action: () => {} },
             ]);
          }}
        >
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              onDoubleClick={() => handleFileOpen(file)}
              onContextMenu={(e) => handleFileRightClick(e, file)}
              className={`group relative flex items-center rounded-xl transition-all border duration-100 ${
                viewMode === 'grid' 
                  ? 'flex-col justify-center space-y-2 w-28 h-32 p-3 hover:bg-blue-500/10' 
                  : 'w-full px-4 py-2 space-x-4 hover:bg-white/5 mb-1'
              } ${selectedFile?.id === file.id ? 'bg-blue-500/20 border-blue-500/30' : 'border-transparent'}`}
            >
              {getIcon(file)}
              
              <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1' : 'items-center w-full'}`}>
                 {editingFileId === file.id ? (
                   <input 
                     autoFocus
                     value={tempName}
                     onChange={(e) => setTempName(e.target.value)}
                     onBlur={() => renameFile(file.id, tempName)}
                     onKeyDown={(e) => e.key === 'Enter' && renameFile(file.id, tempName)}
                     className="bg-zinc-800 text-white rounded px-1 outline-none w-full text-xs"
                   />
                 ) : (
                   <span className={`text-[11px] text-zinc-200 truncate ${viewMode === 'grid' ? 'text-center w-full px-1' : 'text-sm font-medium'}`}>
                      {file.name}
                   </span>
                 )}
                 {viewMode === 'list' && <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Updated {new Date(file.updatedAt).toLocaleDateString()}</span>}
              </div>

              {viewMode === 'list' && (
                 <div className="flex space-x-8 items-center pr-4">
                    <span className="text-[11px] text-zinc-600 font-mono w-20 text-right">{file.size ? `${file.size} KB` : '--'}</span>
                    <button className="text-zinc-600 hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={14}/></button>
                 </div>
              )}
              
              {viewMode === 'grid' && file.isFavorite && (
                <div className="absolute top-1 left-1">
                   <Star size={10} className="text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>
          ))}

          {filteredFiles.length === 0 && (
            <div className="w-full flex-1 flex flex-col items-center justify-center opacity-30 mt-20">
               <Monitor size={80} strokeWidth={1} />
               <p className="mt-4 text-sm font-medium">This folder is empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Property Drawer */}
      {selectedFile && (
        <div className="w-80 border-l border-white/5 bg-zinc-900/80 backdrop-blur-3xl flex flex-col animate-in slide-in-from-right duration-300">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Properties</h3>
              <button onClick={() => setSelectedFile(null)} className="text-zinc-500 hover:text-white"><X size={18}/></button>
           </div>
           
           <div className="p-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-zinc-800 flex items-center justify-center shadow-2xl mb-6 relative">
                 {getIcon(selectedFile)}
                 <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-4 border-zinc-900 shadow-xl">
                    <Info size={14} className="text-white" />
                 </div>
              </div>
              <h2 className="text-lg font-bold text-white mb-1">{selectedFile.name}</h2>
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest py-1 px-3 bg-blue-500/10 rounded-full">{selectedFile.type === 'folder' ? 'System Folder' : 'Generic File'}</div>
           </div>

           <div className="flex-1 p-6 space-y-6">
              <div>
                 <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Location</label>
                 <div className="bg-white/5 rounded-lg p-3 text-xs text-zinc-400 font-mono break-all">C: / User / Desktop / {selectedFile.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Size</label>
                    <span className="text-sm text-zinc-300">{selectedFile.size || '342'} KB</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Type</label>
                    <span className="text-sm text-zinc-300">{selectedFile.mimeType || 'Directory'}</span>
                  </div>
              </div>

              <div>
                 <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Date Modified</label>
                 <span className="text-xs text-zinc-300">{new Date(selectedFile.updatedAt).toLocaleString()}</span>
              </div>
           </div>

           <div className="p-6 border-t border-white/5 grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleFileOpen(selectedFile)}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95"
              >
                <Maximize2 size={14}/> <span>Open</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-zinc-300 py-2 rounded-lg text-xs font-bold border border-white/5">
                <Download size={14}/> <span>Export</span>
              </button>
           </div>
        </div>
      )}

      {/* AI Finder Drawer Sidebar */}
      {isAiDrawerOpen && (
        <div className="w-80 border-l border-white/5 bg-zinc-900/80 backdrop-blur-3xl flex flex-col justify-between animate-in slide-in-from-right duration-300 shrink-0">
           <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                 <Sparkles size={16} className="text-purple-400 animate-pulse" />
                 <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">AI File Finder</h3>
              </div>
              <button onClick={() => { setIsAiDrawerOpen(false); setAiFilterQuery(null); }} className="text-zinc-500 hover:text-white"><X size={18}/></button>
           </div>
           
           <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="flex space-x-2">
                 <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0"><Bot size={13} /></div>
                 <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-xs text-zinc-300 leading-relaxed font-semibold">
                    {aiResponse}
                 </div>
              </div>
              {aiTyping && (
                <div className="flex space-x-2 animate-pulse">
                   <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0"><Bot size={13} /></div>
                   <div className="bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-[10px] text-zinc-500 font-mono">Scanning file indexes...</div>
                </div>
              )}
              {aiStatus && (
                 <div onClick={() => runAiSearchCommand('clear')} className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono rounded-lg flex items-center justify-between cursor-pointer hover:bg-purple-500/20 transition-all">
                    <span>{aiStatus}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-300">Reset</span>
                 </div>
              )}
           </div>

           <div className="p-4 border-t border-white/5 bg-black/40 space-y-2 shrink-0">
              <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Suggested Filters</div>
              <div className="grid grid-cols-2 gap-1.5">
                 <button 
                   onClick={() => runAiSearchCommand('find images')}
                   className="text-[10px] text-zinc-400 bg-white/5 hover:bg-white/10 hover:text-white py-1.5 px-2 rounded-md font-medium text-left truncate flex items-center space-x-1"
                 ><span>Images (PNG, JPG)</span></button>
                 <button 
                   onClick={() => runAiSearchCommand('find music')}
                   className="text-[10px] text-zinc-400 bg-white/5 hover:bg-white/10 hover:text-white py-1.5 px-2 rounded-md font-medium text-left truncate"
                 ><span>Audio (MP3)</span></button>
                 <button 
                   onClick={() => runAiSearchCommand('list favorites')}
                   className="text-[10px] text-zinc-400 bg-white/5 hover:bg-white/10 hover:text-white py-1.5 px-1.5 rounded-md font-medium text-left truncate"
                 ><span>⭐ Starred folders</span></button>
                 <button 
                   onClick={() => runAiSearchCommand('text documents')}
                   className="text-[10px] text-zinc-400 bg-white/5 hover:bg-white/10 hover:text-white py-1.5 px-2 rounded-md font-medium text-left truncate"
                 ><span>Text files (.txt)</span></button>
              </div>
           </div>

           <div className="p-4 border-t border-white/5 bg-zinc-950 flex items-center shrink-0 relative">
              <input 
                type="text"
                placeholder="Ask Explorer Searcher..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runAiSearchCommand(aiInput)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-xs text-white outline-none focus:border-purple-500/50"
              />
              <button 
                onClick={() => runAiSearchCommand(aiInput)}
                className="absolute right-6 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Send size={14} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
